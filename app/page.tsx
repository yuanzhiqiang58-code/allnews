'use client';

import { useState } from 'react';
import { categories, NewsCategory } from '../lib/news';           // 改 @/ 为 ./
import CategoryNav from '../components/CategoryNav';              // 改 @/ 为 ./
import NewsList from '../components/NewsList';                    // 改 @/ 为 ./

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
components/NewsList.tsx
TypeScript
复制
'use client';

import { useEffect, useState, useCallback } from 'react';
import { RSSItem } from '../lib/rss-parser';                        // 改 @/ 为 ./
import { fetchNews, NewsCategory } from '../lib/news';              // 改 @/ 为 ./
import { useAutoRefresh } from '../hooks/useAutoRefresh';           // 改 @/ 为 ./
import NewsCard from './NewsCard';                                  // 同级目录用 ./

export default function NewsList({ category }: { category: NewsCategory }) {
  const [news, setNews] = useState<RSSItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState(300);

  const load = useCallback(async (force = false) => {
    setLoading(true);
    setError('');
    try {
      const items = await fetchNews(category.route, force);
      setNews(items);
      setLastUpdate(new Date());
    } catch (err) {
      setError('获取失败');
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => { load(); }, [load]);

  useAutoRefresh({
    enabled: true,
    interval: 5 * 60 * 1000,
    onRefresh: () => load(true)
  });

  useEffect(() => {
    if (!lastUpdate) return;
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - lastUpdate.getTime()) / 1000);
      setCountdown(Math.max(0, 300 - elapsed));
    }, 1000);
    return () => clearInterval(timer);
  }, [lastUpdate]);

  if (loading && news.length === 0) {
    return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full"></div></div>;
  }

  if (error && news.length === 0) {
    return <div className="text-center py-20 text-gray-500"><p>{error}</p><button onClick={() => load(true)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">重试</button></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-100 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          {lastUpdate && (
            <>
              <span>更新于 {lastUpdate.toLocaleTimeString('zh-CN', {hour: '2-digit', minute:'2-digit'})}</span>
              <span>·</span>
              <span>{Math.floor(countdown/60)}:{String(countdown%60).padStart(2,'0')} 后刷新</span>
            </>
          )}
        </div>
        <button onClick={() => load(true)} disabled={loading} className="hover:text-blue-600 disabled:opacity-50">
          {loading ? '刷新中...' : '刷新'}
        </button>
      </div>
      
      <div className="divide-y divide-gray-100">
        {news.map((item, i) => <NewsCard key={i} item={item} index={i} />)}
      </div>
    </div>
  );
}
components/NewsCard.tsx
TypeScript
复制
'use client';

import { useState } from 'react';
import { RSSItem } from '../lib/rss-parser';                        // 改 @/ 为 ./
import { formatTime } from '../lib/news';                           // 改 @/ 为 ./

export default function NewsCard({ item, index }: { item: RSSItem; index: number }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const getImage = () => {
    if (item.enclosure?.url) return item.enclosure.url;
    const match = (item.content || item.description || '').match(/<img[^>]+src=["']([^"']+)["']/i);
    return match ? match[1] : '';
  };

  const image = getImage();
  const showImage = image && !error;

  return (
    <article className="group">
      <a href={item.link} target="_blank" rel="noopener noreferrer" className="block p-4 hover:bg-gray-50 transition-colors">
        <div className="flex gap-3">
          <div className={`flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold
            ${index < 3 ? 'bg-gradient-to-br from-orange-400 to-red-500 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600'}`}>
            {index + 1}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-[15px] font-medium text-gray-900 leading-snug mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
              {item.title}
            </h3>
            <p className="text-[13px] text-gray-500 line-clamp-2 mb-2">{item.description}</p>
            <div className="flex items-center gap-2 text-[11px] text-gray-400">
              <span className="truncate max-w-[80px]">{item.author}</span>
              <span>·</span>
              <span>{formatTime(item.pubDate)}</span>
            </div>
          </div>
          
          {showImage && (
            <div className="flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden bg-gray-100 relative">
              {!loaded && <div className="absolute inset-0 bg-gray-200 animate-pulse" />}
              <img src={image} alt="" className={`w-full h-full object-cover ${loaded ? 'opacity-100' : 'opacity-0'}`}
                loading="lazy" onLoad={() => setLoaded(true)} onError={() => setError(true)} />
            </div>
          )}
        </div>
      </a>
    </article>
  );
}
