const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const FONT_LINK_BLOCK = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap" rel="stylesheet">
`;

const files = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));

for (const file of files) {
  const filePath = path.join(ROOT, file);
  let html = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Add font link block before </head> if not already present
  if (!html.includes('fonts.googleapis.com/css2?family=Cinzel')) {
    if (html.includes('</head>')) {
      html = html.replace('</head>', FONT_LINK_BLOCK + '</head>');
      changed = true;
    } else if (html.includes('<style>')) {
      // fallback: insert right before first <style> tag
      html = html.replace('<style>', FONT_LINK_BLOCK + '<style>');
      changed = true;
    }
  }

  // 2. CSS-variable-based files (index.html, game.html): swap the two font vars
  const varRegex = /--font-display:\s*'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, 'Times New Roman', serif;\n(\s*)--font-display-bold:\s*'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, 'Times New Roman', serif;/;
  if (varRegex.test(html)) {
    html = html.replace(varRegex, (m, indent) =>
      `--font-display: 'Cormorant Garamond', 'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif;\n${indent}--font-display-bold: 'Cinzel', 'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif;`
    );
    changed = true;
  }

  // 3. Direct h1/h2 declarations (legal + chapter pages): h1 -> Cinzel, h2 -> Cormorant Garamond
  // Match "h1 { font-family:'Palatino Linotype', ...serif; " and similar for h2
  const h1Regex = /(h1\s*\{\s*font-family:)'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, 'Times New Roman', serif;/;
  if (h1Regex.test(html)) {
    html = html.replace(h1Regex, `$1 'Cinzel', 'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif;`);
    changed = true;
  }
  const h2Regex = /(h2\s*\{\s*font-family:)'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, 'Times New Roman', serif;/;
  if (h2Regex.test(html)) {
    html = html.replace(h2Regex, `$1 'Cormorant Garamond', 'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif;`);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`OK: ${file}`);
  } else {
    console.log(`SKIP (no matching pattern / already done): ${file}`);
  }
}
