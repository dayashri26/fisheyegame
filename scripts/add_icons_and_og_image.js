const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OG_IMAGE_URL = 'https://aimfisheye.com/og-image.jpg';

const FAVICON_BLOCK = `<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png">
`;

const pages = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));

let updated = 0;

for (const file of pages) {
  const filePath = path.join(ROOT, file);
  let html = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Insert favicon block after the canonical link, if not already present
  if (!html.includes('rel="icon"')) {
    const canonicalMatch = html.match(/<link rel="canonical" href="[^"]*">\n/);
    if (canonicalMatch) {
      html = html.replace(canonicalMatch[0], canonicalMatch[0] + FAVICON_BLOCK);
      changed = true;
    } else {
      console.log(`WARN: no canonical tag found in ${file}, favicon not inserted`);
    }
  }

  // 2. Insert og:image after og:site_name, if not already present
  if (!html.includes('property="og:image"')) {
    const ogSiteMatch = html.match(/<meta property="og:site_name" content="[^"]*">\n/);
    if (ogSiteMatch) {
      html = html.replace(
        ogSiteMatch[0],
        ogSiteMatch[0] + `<meta property="og:image" content="${OG_IMAGE_URL}">\n<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">\n`
      );
      changed = true;
    } else {
      console.log(`WARN: no og:site_name tag found in ${file}, og:image not inserted`);
    }
  }

  // 3. Insert twitter:image after twitter:description, if twitter tags exist and not already present
  if (html.includes('name="twitter:card"') && !html.includes('name="twitter:image"')) {
    const twDescMatch = html.match(/<meta name="twitter:description" content="[^"]*">\n/);
    if (twDescMatch) {
      html = html.replace(
        twDescMatch[0],
        twDescMatch[0] + `<meta name="twitter:image" content="${OG_IMAGE_URL}">\n`
      );
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`OK: ${file}`);
    updated++;
  } else {
    console.log(`SKIP (already has icons/og:image): ${file}`);
  }
}

console.log(`\nDone. Updated: ${updated} / ${pages.length}`);
