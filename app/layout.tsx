export const metadata = {
  title: 'NewsHub - 新闻聚合',
  description: '基于 RSSHub 的新闻聚合应用',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
