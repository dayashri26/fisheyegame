const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const GA_ID = 'G-DV8G1EMJ7S';

const GA_SNIPPET = `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '${GA_ID}');
</script>
`;

const pages = [
  'index.html', 'game.html',
  'about-us.html', 'contact-us.html', 'privacy-policy.html', 'terms.html', 'disclaimer.html',
  'what-is-matsya-vedh.html', 'draupadis-swayamvara-explained.html', 'who-was-arjuna.html',
  'rules-of-the-impossible-test.html', 'why-only-the-reflection.html',
  'dronacharya-guru-shishya-tradition.html', 'trials-of-skill-in-indian-mythology.html',
  'focus-flow-psychology-of-the-single-point.html', 'archery-in-ancient-india-history.html',
  'from-myth-to-mechanic-designing-this-game.html',
];

let updated = 0, skipped = 0;

for (const file of pages) {
  const filePath = path.join(ROOT, file);
  if (!fs.existsSync(filePath)) {
    console.log(`MISSING: ${file}`);
    continue;
  }
  let html = fs.readFileSync(filePath, 'utf8');

  if (html.includes('googletagmanager.com/gtag/js')) {
    console.log(`SKIP (already has GA): ${file}`);
    skipped++;
    continue;
  }

  if (!html.includes('<meta charset="UTF-8">')) {
    console.log(`WARN: no charset meta anchor found in ${file}`);
    continue;
  }

  html = html.replace(
    '<meta charset="UTF-8">',
    `<meta charset="UTF-8">\n${GA_SNIPPET}`
  );

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`OK: ${file}`);
  updated++;
}

console.log(`\nDone. Updated: ${updated}, Skipped: ${skipped}, Total: ${pages.length}`);
