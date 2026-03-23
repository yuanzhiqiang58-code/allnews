'use client';

import { useState } from 'react';
import { categories, NewsCategory } from '../lib/news';
import CategoryNav from '../components/CategoryNav';
import NewsList from '../components/NewsList';

export default function Home() {
  const [active, setActive] = useState<NewsCategory>(categories[0]);

  return (
    <main className="min-h-screen bg-[#f5f5f7]">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">N</div>
            <h1 className="text-lg font-bold text-gray-900">NewsHub</h1>
          </div>
          <a href="https://github.com/DIYgod/RSSHub" target="_blank" className="text-xs text-gray-400 hover:text-gray-600">RSSHub</a>
        </div>
      </header>

      <CategoryNav activeId={active.id} onSelect={setActive} />

      <div className="max-w-3xl mx-auto px-4 py-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
            <span className="text-lg">{active.icon}</span>
            <h2 className="text-sm font-semibold text-gray-700">{active.name}</h2>
          </div>
          <NewsList category={active} />
        </div>
      </div>

      <footer className="max-w-3xl mx-auto px-4 py-8 text-center text-xs text-gray-400">
        <p>© 2026 NewsHub · 每 5 分钟自动刷新</p>
      </footer>
    </main>
  );
}
