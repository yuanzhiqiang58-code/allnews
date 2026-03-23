'use client';

import { categories, NewsCategory } from '../lib/news';             // 改 @/ 为 ./

export default function CategoryNav({ activeId, onSelect }: { 
  activeId: string; 
  onSelect: (c: NewsCategory) => void 
}) {
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex gap-2 py-3 overflow-x-auto scrollbar-hide">
          {categories.map(cat => (
            <button key={cat.id} onClick={() => onSelect(cat)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
                ${activeId === cat.id ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
