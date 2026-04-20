import React, { useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

export default function Editor() {
  const [isThinking, setIsThinking] = useState(false);

  // 保護範本標題不被 AI 覆蓋或誤刪
  const templateCheckpoints = [
    '(一) 摘要',
    '(二) 研究動機與研究問題',
    '(三) 文獻回顧與探討',
    '(四) 研究方法及步驟',
    '(五) 預期結果'
  ];

  const editor = useEditor({
    extensions: [StarterKit],
    content: `
      <h1>論文標題：在此輸入你的研究題目</h1>
      <h2>(一) 摘要</h2>
      <p><em>[提示：全部寫完再寫。]</em></p>
      <h2>(二) 研究動機與研究問題</h2>
      <h3>1. 從現象到問題</h3>
      <p>在此描述觀察到的現象或痛點...</p>
      <h3>2. 現狀分析</h3>
      <p>點出常用工具或方法的缺陷...</p>
      <h3>3. 解惑</h3>
      <p>說明新提出的技術或做法為什麼是目前最好的解決方案...</p>
      <h2>(三) 文獻回顧與探討</h2>
      <h3>1. 定義評估指標</h3>
      <p>定義學界或業界評估系統好壞的指標...</p>
      <h3>2. 技術可行性</h3>
      <p>證明軟硬體技術或演算法的可行性...</p>
      <h2>(四) 研究方法及步驟</h2>
      <h3>1. 系統架構圖</h3>
      <p>描述整個資料流或運作邏輯...</p>
      <h2>(五) 預期結果</h2>
      <p>預期的客觀數據與實務貢獻...</p>
    `,
    onUpdate({ editor }) {
      const content = editor.getText();
      const isTemplateIntact = templateCheckpoints.every(cp => content.includes(cp));
      if (!isTemplateIntact) {
        editor.commands.undo();
      }
    },
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none focus:outline-none p-16 bg-white min-h-screen',
      },
    },
  })

  const handleAIExpand = async () => {
    if (!editor) return;

    // 取得選取的範圍與文字
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, ' ');
    
    // 【修復關鍵】：確保 textToProcess 在所有路徑下都有定義
    const textToProcess = selectedText || editor.getText();

    if (!textToProcess || textToProcess.trim().length < 5) {
      alert("請先輸入或選取一段內容（至少 5 個字）！");
      return;
    }

    setIsThinking(true);
    
    // 對接我們建立的 Vercel API Proxy
    const PROXY_URL = '/api/expand'; 

    try {
      const response = await fetch(PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `你是一位資深計算機科學專家。請將以下內容，根據學術論文格式進行重寫或擴寫。
              要求：使用繁體中文、台灣學術用語、語氣嚴謹客觀，直接輸出結果。
              待處理內容：\n\n${textToProcess}`
            }]
          }]
        })
      });

      const data = await response.json();
      
      if (data.error) throw new Error(data.error.message || "Proxy 呼叫失敗");

      const aiText = data.candidates[0].content.parts[0].text;
      const formattedContent = `<p>${aiText.trim().replace(/\n/g, '</p><p>')}</p>`;

      if (selectedText) {
        // 如果有選取文字，替換該區域
        editor.commands.insertContentAt({ from, to }, formattedContent);
      } else {
        // 如果沒選取，在末尾插入
        editor.commands.insertContent(formattedContent);
      }
      
    } catch (error) {
      console.error("AI Error:", error);
      alert(`重寫失敗：${error.message}`);
    } finally {
      setIsThinking(false);
    }
  }

  return (
    <div className="w-full min-h-screen bg-slate-900 flex flex-col items-center overflow-x-hidden">
      <div className="w-full max-w-5xl flex flex-col shadow-[0_0_80px_rgba(0,0,0,0.8)] border-x border-slate-800">
        
        {/* Header */}
        <div className="sticky top-0 z-50 w-full bg-slate-800 border-b border-slate-700 h-20 flex items-center px-10">
          <div className="w-full flex justify-between items-center">
            <div>
              <h1 className="text-xl font-black text-white tracking-tight leading-none">Paper Writer</h1>
              <p className="text-[9px] text-indigo-400 uppercase tracking-widest mt-1">Research Framework Mode</p>
            </div>
            <button 
              onClick={handleAIExpand}
              disabled={isThinking}
              className="px-6 py-2.5 bg-indigo-500 text-white font-bold rounded-full shadow-lg hover:bg-indigo-400 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {isThinking ? (
                <span className="animate-pulse">🚀 思考中...</span>
              ) : (
                <><span>✨</span><span>學術擴寫並替換</span></>
              )}
            </button>
          </div>
        </div>

        {/* 論文白板區 */}
        <div className="w-full bg-white">
          <EditorContent editor={editor} />
        </div>

      </div>

      {/* Footer */}
      <div className="py-12 text-slate-500 text-[10px] text-center">
        Gemini 3 Flash API Proxy | HCI Lab Student Project
      </div>
    </div>
  )
}
