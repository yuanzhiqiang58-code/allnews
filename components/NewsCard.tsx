
'use client';

import { useState } from 'react';
import { RSSItem } from '@/lib/rss-parser';
import { formatTime } from '@/lib/news';

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
