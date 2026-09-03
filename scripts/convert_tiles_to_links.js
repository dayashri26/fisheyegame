const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const slugs = [
  'what-is-matsya-vedh',
  'draupadis-swayamvara-explained',
  'who-was-arjuna',
  'rules-of-the-impossible-test',
  'why-only-the-reflection',
  'dronacharya-guru-shishya-tradition',
  'trials-of-skill-in-indian-mythology',
  'focus-flow-psychology-of-the-single-point',
  'archery-in-ancient-india-history',
  'from-myth-to-mechanic-designing-this-game',
];

const detailsRe = /<details class="story-tile" id="(blog(\d+))">([\s\S]*?)<\/details>/g;

let count = 0;
html = html.replace(detailsRe, (whole, id, numStr, block) => {
  const idx = parseInt(numStr, 10) - 1;
  const slug = slugs[idx];
  const num = block.match(/<span class="tile-num">(\d+)<\/span>/)[1];
  const eyebrow = block.match(/<span class="tile-eyebrow">([^<]*)<\/span>/)[1];
  const title = block.match(/<h3 class="tile-title">([^<]*)<\/h3>/)[1];
  const teaser = block.match(/<span class="tile-teaser">([^<]*)<\/span>/)[1];
  count++;
  return `<a class="story-tile" href="${slug}.html">
      <span class="tile-summary">
        <span class="tile-num">${num}</span>
        <span class="tile-eyebrow">${eyebrow}</span>
        <h3 class="tile-title">${title}</h3>
        <span class="tile-teaser">${teaser}</span>
        <span class="tile-chevron" aria-hidden="true">→</span>
      </span>
    </a>`;
});

fs.writeFileSync(indexPath, html);
console.log('Converted', count, 'tiles');
