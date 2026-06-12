// app/sitemap.js
export default function sitemap() {
  return [
    {
      url: 'https://les-deux-blondes.vercel.app',
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: 'https://les-deux-blondes.vercel.app/contact',
      lastModified: new Date(),
      priority: 0.8,
    },
  ];
}