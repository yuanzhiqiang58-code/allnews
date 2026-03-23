import { NextResponse } from 'next/server';

const RSSHUB_URL = process.env.RSSHUB_URL || 'https://rsshub.app';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const route = searchParams.get('route');

  if (!route) {
    return NextResponse.json({ error: '缺少 route' }, { status: 400 });
  }

  const allowed = ['/zhihu/', '/weibo/', '/36kr/', '/huxiu/', '/sspai/', 
                   '/juejin/', '/ruanyf/', '/bbc/', '/bilibili/', '/github/'];
  if (!allowed.some(p => route.startsWith(p))) {
    return NextResponse.json({ error: '路由不在白名单' }, { status: 403 });
  }

  try {
    const target = `${RSSHUB_URL}${route}`;
    const res = await fetch(target, {
      headers: {
        'User-Agent': 'NewsHub/1.0',
        'Accept': 'application/rss+xml, text/xml'
      },
      signal: AbortSignal.timeout(10000)
    });

    if (!res.ok) throw new Error(`RSSHub ${res.status}`);
    
    const xml = await res.text();
    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300'
      }
    });
  } catch (error) {
    const errorXml = `<?xml version="1.0"?>
      <rss version="2.0"><channel>
        <title>获取失败</title>
        <item><title>请稍后重试</title><link>#</link><pubDate>${new Date().toUTCString()}</pubDate></item>
      </channel></rss>`;
    return new NextResponse(errorXml, { status: 200, headers: { 'Content-Type': 'application/rss+xml' } });
  }
}
