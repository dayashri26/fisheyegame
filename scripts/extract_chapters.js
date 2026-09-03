const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
const html = fs.readFileSync(indexPath, 'utf8');

// Match each <details class="story-tile" id="blogN"> ... </details> block
const detailsRe = /<details class="story-tile" id="(blog\d+)">([\s\S]*?)<\/details>/g;
let m;
const chapters = [];
while ((m = detailsRe.exec(html))) {
  const id = m[1];
  const block = m[2];
  const num = block.match(/<span class="tile-num">(\d+)<\/span>/)[1];
  const eyebrow = block.match(/<span class="tile-eyebrow">([^<]*)<\/span>/)[1];
  const title = block.match(/<h3 class="tile-title">([^<]*)<\/h3>/)[1];
  const teaser = block.match(/<span class="tile-teaser">([^<]*)<\/span>/)[1];
  const bodyMatch = block.match(/<div class="blog-columns">([\s\S]*?)<\/div>\s*<\/div>\s*<\/details>|<div class="blog-columns">([\s\S]*?)<\/div>/);
  // Extract all <p>...</p> within blog-columns
  const colStart = block.indexOf('<div class="blog-columns">');
  const colContent = block.slice(colStart);
  const paras = [...colContent.matchAll(/<p>([\s\S]*?)<\/p>/g)].map(x => x[1].trim());
  chapters.push({ id, num, eyebrow, title, teaser, paras });
}

fs.writeFileSync(path.join(__dirname, 'chapters.json'), JSON.stringify(chapters, null, 2));
console.log('Extracted', chapters.length, 'chapters');
chapters.forEach(c => console.log(c.num, c.title, '-', c.paras.length, 'paragraphs'));
