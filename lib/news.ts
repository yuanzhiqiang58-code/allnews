import { RSSItem, parseRSS, formatTime } from './rss-parser';       // 改 @/ 为 ./
import { getCache, setCache } from './storage';                     // 改 @/ 为 ./

export interface NewsCategory {
  id: string;
  name: string;
  route: string;
  icon: string;
}

export const categories: NewsCategory[] = [
  { id: 'zhihu', name: '知乎热榜', route: '/zhihu/hot', icon: '🔥' },
  { id: 'weibo', name: '微博热搜', route: '/weibo/search/hot', icon: '📱' },
  { id: '36kr', name: '36氪', route: '/36kr/news/latest', icon: '💼' },
  { id: 'huxiu', name: '虎嗅', route: '/huxiu/article', icon: '🐯' },
  { id: 'sspai', name: '少数派', route: '/sspai/index', icon: '⌨️' },
  { id: 'juejin', name: '掘金', route: '/juejin/category/frontend', icon: '💎' },
  { id: 'ruanyf', name: '科技周刊', route: '/ruanyf/weeklies', icon: '📰' },
  { id: 'bbc', name: 'BBC中文', route: '/bbc/chinese', icon: '🌍' },
];

export async function fetchNews(route: string, forceRefresh = false): Promise<RSSItem[]> {
  const cacheKey = `news_${route}`;
  
  if (!forceRefresh) {
    const cached = getCache<RSSItem[]>(cacheKey);
    if (cached) return cached;
  }

  try {
    const res = await fetch(`/api/news?route=${encodeURIComponent(route)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    const items = parseRSS(xml).slice(0, 20);
    
    if (items.length > 0) setCache(cacheKey, items);
    return items;
  } catch (error) {
    const cached = getCache<RSSItem[]>(cacheKey);
    if (cached) return cached;
    throw error;
  }
}

export { formatTime };
