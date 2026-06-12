// app/robots.js
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://les-deux-blondes.vercel.app/sitemap.xml',
  };
}