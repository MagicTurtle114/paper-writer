import React from 'react';
import Editor from './Editor'; // 把我們剛剛做好的真編輯器引進來

function App() {
  return (
    <div className="flex h-screen w-full bg-gray-50 text-slate-800 font-sans">
      
      {/* 左側：論文大綱區 */}
      <aside className="w-64 lg:w-72 bg-white border-r border-gray-200 flex flex-col shadow-sm z-10">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-indigo-600">論文大綱</h2>
          <button className="text-gray-400 hover:text-indigo-500 transition-colors text-xl font-medium">+</button>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="px-3 py-2 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 rounded-md cursor-pointer transition-colors">
            1. Introduction
          </div>
          <div className="px-3 py-2 text-sm font-medium bg-indigo-50 text-indigo-700 rounded-md cursor-pointer border-l-4 border-indigo-500">
            2. Methodology
          </div>
          <div className="pl-6 pr-3 py-1.5 text-xs text-gray-500 hover:text-indigo-600 cursor-pointer">
            2.1 System Architecture
          </div>
        </nav>
      </aside>

      {/* 右側：寫作與編輯區 */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 shrink-0">
          <h3 className="text-slate-700 font-medium tracking-wide">
            正在編輯：<span className="text-indigo-600">2. Methodology</span>
          </h3>
          {/* 原本右上角的「假按鈕」已經被移除了 */}
        </header>

        {/* 稿紙區 */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-100 flex justify-center">
          <div className="w-full max-w-3xl bg-white min-h-full rounded-xl shadow-sm border border-gray-200 p-8 md:p-12">
            
            {/* 這裡！真正的 AI 編輯器上場！ */}
            <Editor />

          </div>
        </div>
        
      </main>
    </div>
  );
}

export default App;