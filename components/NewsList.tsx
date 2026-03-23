'use client';

import { useEffect, useState, useCallback } from 'react';
import { RSSItem } from '@/lib/rss-parser';
import { fetchNews, NewsCategory } from '@/lib/news';
import { useAutoRefresh } from '@/hooks/useAutoRefresh';
import NewsCard from './NewsCard';

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
