const fs = require('fs');
const path = require('path');

const ROOT = 'https://aimfisheye.com';
const dir = path.join(__dirname, '..');

// filename -> url path (index.html maps to the bare domain root)
const pages = [
  'index.html',
  'game.html',
  'about-us.html',
  'contact-us.html',
  'privacy-policy.html',
  'terms.html',
  'disclaimer.html',
  'what-is-matsya-vedh.html',
  'draupadis-swayamvara-explained.html',
  'who-was-arjuna.html',
  'rules-of-the-impossible-test.html',
  'why-only-the-reflection.html',
  'dronacharya-guru-shishya-tradition.html',
  'trials-of-skill-in-indian-mythology.html',
  'focus-flow-psychology-of-the-single-point.html',
  'archery-in-ancient-india-history.html',
  'from-myth-to-mechanic-designing-this-game.html',
];

function urlFor(file) {
  return file === 'index.html' ? `${ROOT}/` : `${ROOT}/${file}`;
}

let updated = 0;
pages.forEach(file => {
  const fp = path.join(dir, file);
  let html = fs.readFileSync(fp, 'utf8');
  const url = urlFor(file);

  if (html.includes('rel="canonical"')) {
    console.log(file, '-- already has canonical, skipping insert (check manually)');
    return;
  }

  // Insert canonical link right after the <title> line
  html = html.replace(
    /(<title>[^<]*<\/title>\n)/,
    `$1<link rel="canonical" href="${url}">\n`
  );

  // Insert og:url right after the og:type meta line
  html = html.replace(
    /(<meta property="og:type"[^>]*>\n)/,
    `$1<meta property="og:url" content="${url}">\n`
  );

  fs.writeFileSync(fp, html);
  updated++;
  console.log('Updated', file, '->', url);
});

console.log(`\n${updated} files updated with canonical + og:url.`);

// ---------- sitemap.xml ----------
const today = new Date().toISOString().slice(0, 10);
const priorities = {
  'index.html': '1.0',
  'game.html': '0.9',
};
const urls = pages.map(file => {
  const priority = priorities[file] || '0.7';
  return `  <url>\n    <loc>${urlFor(file)}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${priority}</priority>\n  </url>`;
}).join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
fs.writeFileSync(path.join(dir, 'sitemap.xml'), sitemap);
console.log('Wrote sitemap.xml with', pages.length, 'URLs');

// ---------- robots.txt ----------
const robots = `User-agent: *
Allow: /

Sitemap: ${ROOT}/sitemap.xml
`;
fs.writeFileSync(path.join(dir, 'robots.txt'), robots);
console.log('Wrote robots.txt');
