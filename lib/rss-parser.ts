export interface RSSItem {
  title: string;
  link: string;
  description: string;
  content?: string;
  pubDate: string;
  author?: string;
  category?: string;
  enclosure?: { url: string; type: string };
}

export function parseRSS(xmlText: string): RSSItem[] {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
  const parseError = xmlDoc.querySelector('parsererror');
  if (parseError) return [];
  
  const items = xmlDoc.querySelectorAll('item');
  
  return Array.from(items).map(item => {
    const contentEncoded = item.getElementsByTagName('content:encoded')[0]?.textContent;
    const description = item.querySelector('description')?.textContent || '';
    const content = contentEncoded || description;
    
    let imageUrl = '';
    const enclosure = item.querySelector('enclosure');
    if (enclosure?.getAttribute('type')?.startsWith('image/')) {
      imageUrl = enclosure.getAttribute('url') || '';
    }
    if (!imageUrl && content) {
      const match = content.match(/<img[^>]+src=["']([^"']+)["']/i);
      imageUrl = match ? match[1] : '';
    }

    return {
      title: item.querySelector('title')?.textContent?.trim() || '无标题',
      link: item.querySelector('link')?.textContent?.trim() || '',
      description: cleanHtml(description).slice(0, 200) + '...',
      content,
      pubDate: item.querySelector('pubDate')?.textContent || '',
      author: item.querySelector('author')?.textContent || 
              item.getElementsByTagName('dc:creator')[0]?.textContent || '未知',
      category: item.querySelector('category')?.textContent || '',
      enclosure: imageUrl ? { url: imageUrl, type: 'image/jpeg' } : undefined
    };
  }).filter(i => i.title !== '无标题');
}

function cleanHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').trim();
}

export function formatTime(pubDate: string): string {
  const date = new Date(pubDate);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
}
