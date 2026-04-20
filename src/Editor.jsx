import React, { useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

export default function Editor() {
  const [isThinking, setIsThinking] = useState(false);

  // 初始化 Tiptap 編輯器，使用 PDF 提供的計畫書完整架構範本 [cite: 1]
  const editor = useEditor({
    extensions: [StarterKit],
    content: `
      <h1>論文標題：在此輸入你的研究題目</h1>
      
      <h2>(一) 摘要</h2>
      <p><em>[提示：全部寫完再寫。]</em> </p>

      <h2>(二) 研究動機與研究問題</h2>
      <h3>1. 從現象到問題</h3>
      <p>在此描述觀察到的現象或痛點...</p>
      <h3>2. 現狀分析</h3>
      <p>點出常用工具或方法的缺陷...</p>
      <h3>3. 解惑</h3>
      <p>說明新提出的技術或做法為什麼是目前最好的解決方案... </p>

      <h2>(三) 文獻回顧與探討</h2>
      <h3>1. 定義評估指標</h3>
      <p>定義學界或業界評估系統好壞的指標... </p>
      <h3>2. 技術可行性</h3>
      <p>證明軟硬體技術或演算法的可行性... </p>
      <h3>3. 理論支持</h3>
      <p>證明新設計的學理或技術優勢... </p>

      <h2>(四) 研究方法及步驟</h2>
      <h3>1. 系統架構圖</h3>
      <p>描述整個資料流或運作邏輯...</p>
      <h3>2. 軟硬體配置</h3>
      <p>說明選用的設備規格與原因...</p>
      <h3>3. 核心技術與流程</h3>
      <p>資料收整、處理與產出結果的過程...</p>
      <h3>4. 實驗與驗證設計</h3>
      <p>說明測試對象、對照組與效能評估標準...</p>

      <h2>(五) 預期結果</h2>
      <h3>1. 技術指標與成效</h3>
      <p>預期的客觀數據數據（如延遲、準確率）與系統進步... </p>
      <h3>2. 實務或學術貢獻</h3>
      <p>預計解決的問題、開源計畫或參與的競賽... </p>
    `,
    editorProps: {
      attributes: {
        // 設定編輯區內容樣式，內距與邊界精確對齊
        class: 'prose prose-slate max-w-none focus:outline-none p-16 bg-white min-h-screen',
      },
    },
  })

  // 找到 Editor.jsx 裡的 handleAIExpand 函數
const handleAIExpand = async () => {
  // ... 前面檢查 editor 的邏輯不變 ...

  setIsThinking(true);
  
  // 修改這裡！不再需要 API_KEY，直接呼叫你自己的 API 路由
  const PROXY_URL = '/api/expand'; 

  try {
    const response = await fetch(PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `你是一位資深計算機科學專家...（略）\n\n${textToProcess}`
          }]
        }]
      })
    });
    
    // ... 後面處理 data 的邏輯不變 ...

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);

      const aiText = data.candidates[0].content.parts[0].text;
      
      if (selectedText) {
        editor.commands.insertContentAt({ from, to }, `<p>${aiText.replace(/\n/g, '</p><p>')}</p>`);
      } else {
        editor.commands.setContent(`<p>${aiText.replace(/\n/g, '</p><p>')}</p>`);
      }
      
    } catch (error) {
      console.error("AI Error:", error);
      alert(`重寫失敗：${error.message}`);
    } finally {
      setIsThinking(false);
    }
  }

  return (
    // 最外層：全螢幕深藍色背景，隱藏橫向捲軸
    <div className="w-full min-h-screen bg-slate-900 flex flex-col items-center overflow-x-hidden">
      
      {/* 核心工作台：這是唯一的寬度控制層，Header 和白色區域都在這裡面 */}
      <div className="w-full max-w-5xl flex flex-col shadow-[0_0_80px_rgba(0,0,0,0.8)] border-x border-slate-800">
        
        {/* 頂部導覽列：移除所有額外邊距，h-20 確保物理高度穩定 */}
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
                <span className="animate-pulse">🚀 重寫中...</span>
              ) : (
                <><span>✨</span><span>學術擴寫並替換</span></>
              )}
            </button>
          </div>
        </div>

        {/* 論文主體：與 Header 完全無縫接軌，寬度繼承父容器的 100% */}
        <div className="w-full bg-white">
          <EditorContent editor={editor} />
        </div>

      </div>

      {/* 頁尾 */}
      <div className="py-12 text-slate-500 text-[10px] text-center">
        Gemini 3 Flash Preview Interface | Methodology Reference: 計畫書完整架構 (1).pdf [cite: 1]
      </div>
    </div>
  )
}