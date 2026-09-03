const fs = require('fs');
const path = require('path');

const chapters = JSON.parse(fs.readFileSync(path.join(__dirname, 'chapters.json'), 'utf8'));

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

const metaDescriptions = [
  "What is Matsya-Vedh? The Sanskrit trial from the Mahabharata where an archer must pierce a fish's eye by aiming only at its reflection — and why it inspired this free online archery game.",
  "Draupadi's swayamvara explained: how a public archery contest set by King Drupada became the hinge the rest of the Mahabharata turns on.",
  "Who was Arjuna? The disguised Pandava prince and legendary archer whose focus and discipline won the fish-eye trial at Draupadi's swayamvara.",
  "The three stacked rules of the Matsya-Vedh trial — the bow, the moving target, and the reflection-only rule — and how they became this game's core mechanics.",
  "Why must the archer look only at the reflection, never the fish itself? A look at ekagrata, single-minded focus, and what this Mahabharata trial really tests.",
  "Dronacharya and the guru-shishya tradition: the teacher behind Arjuna's archery skill, and the rivalry with King Drupada that shaped the whole swayamvara contest.",
  "From the Ramayana's bow of Shiva to Homer's Odyssey, trials of skill recur across world mythology — where Matsya-Vedh fits in that ancient storytelling pattern.",
  "What sports psychology calls 'flow state' looks a lot like what the Matsya-Vedh legend described thousands of years earlier — focus, discipline, and the single point of attention.",
  "A short history of archery in ancient India — Dhanurveda, Dussehra, and the long throughline connecting the Mahabharata's fish-eye trial to modern competitive archery.",
  "From myth to mechanic: the specific design choices — the water reflection, the hold-to-draw bow, the difficulty curve — built to bring the Matsya-Vedh legend into a browser game.",
];

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const outDir = path.join(__dirname, '..');

chapters.forEach((ch, i) => {
  const slug = slugs[i];
  const prev = i > 0 ? { slug: slugs[i - 1], title: chapters[i - 1].title } : null;
  const next = i < chapters.length - 1 ? { slug: slugs[i + 1], title: chapters[i + 1].title } : null;
  const bodyHtml = ch.paras.map(p => `          <p>${p}</p>`).join('\n');
  const description = metaDescriptions[i];
  const plainTitle = ch.title.replace(/&/g, 'and');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(ch.title)} — Matsya-Vedh Story, ${esc(ch.eyebrow)}</title>
<meta name="description" content="${esc(description)}">
<meta name="keywords" content="matsya vedh, mahabharata, ${esc(plainTitle.toLowerCase())}, arjuna, draupadi swayamvara, fish eye trial, indian mythology">
<meta name="robots" content="index, follow">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(ch.title)} — Matsya-Vedh Story">
<meta property="og:description" content="${esc(description)}">
<meta property="og:site_name" content="Matsya-Vedh">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(ch.title)} — Matsya-Vedh Story">
<meta name="twitter:description" content="${esc(description)}">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "${esc(ch.title)}",
  "description": "${esc(description)}",
  "articleSection": "Mahabharata, Matsya Vedh",
  "about": "Matsya Vedh, Mahabharata, Arjuna, Draupadi Swayamvara",
  "inLanguage": "en",
  "isPartOf": {
    "@type": "CreativeWorkSeries",
    "name": "The Piercing of the Fish's Eye",
    "url": "index.html#tabStory"
  }
}
</script>

<style>
  :root { --bg-2:#0e0f03; --surface-1:#1f2111; --surface-2:#2a2b1b; --gold:#e9c349; --gold-light:#f6dd8a; --gold-dim:#af8d11; --vermilion:#e74b38; --text:#e4e4cc; --text-dim:#c4c6ce; }
  * { margin:0; padding:0; box-sizing:border-box; }
  html, body { height: 100%; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background:
      radial-gradient(circle at 50% 0%, rgba(233,195,73,0.10), transparent 55%),
      radial-gradient(circle at 15% 85%, rgba(231,75,56,0.07), transparent 50%),
      var(--bg-2);
    color: var(--text); line-height: 1.7; padding: 40px 20px 80px;
  }
  .wrap { max-width: 760px; margin: 0 auto; }
  a { color: var(--gold); text-decoration: none; }
  a:hover { text-decoration: underline; }
  .back { display: inline-block; margin-bottom: 24px; font-size: 13px; color: var(--gold-dim); }
  .kicker { font-size: 11px; letter-spacing: 0.28em; text-transform: uppercase; color: var(--vermilion); margin-bottom: 14px; }
  h1 {
    font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, 'Times New Roman', serif;
    font-size: clamp(26px, 4.6vw, 36px); color: var(--gold-light); margin-bottom: 10px; line-height: 1.3;
    text-shadow: 0 0 26px rgba(233,195,73,0.2);
  }
  .teaser { font-size: 16px; color: var(--text-dim); margin-bottom: 34px; }
  .blog-columns p { font-size: 16.5px; color: var(--text-dim); line-height: 1.85; margin-bottom: 16px; }
  .blog-columns p:first-of-type::first-letter {
    font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, 'Times New Roman', serif;
    font-size: 52px; float: left; line-height: 0.8; padding: 6px 8px 0 0;
    color: var(--gold); text-shadow: 0 0 18px rgba(233,195,73,0.4);
  }
  .chapter-nav {
    display: flex; justify-content: space-between; gap: 16px; margin-top: 50px;
    padding-top: 26px; border-top: 1px solid rgba(233,195,73,0.2);
  }
  .chapter-nav a {
    flex: 1; padding: 16px 18px; background: var(--surface-1); border: 1px solid rgba(233,195,73,0.22);
    border-radius: 10px; font-size: 13.5px; color: var(--text-dim); text-decoration: none;
  }
  .chapter-nav a:hover { border-color: rgba(233,195,73,0.5); }
  .chapter-nav .dir { display: block; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--gold-dim); margin-bottom: 4px; }
  .chapter-nav .ttl { color: var(--gold-light); font-weight: 600; }
  .chapter-nav .next { text-align: right; }
  .cta {
    margin-top: 40px; text-align: center; padding: 26px 22px;
    background: linear-gradient(160deg, var(--surface-2), var(--bg-2) 70%);
    border: 1px solid rgba(233,195,73,0.25); border-radius: 14px;
  }
  .cta a.play { display: inline-block; margin-top: 10px; padding: 12px 26px; background: var(--gold); color: #1a1503; font-weight: 700; border-radius: 8px; }
  .cta a.play:hover { text-decoration: none; opacity: 0.92; }
</style>
</head>
<body>
<div class="wrap">
  <a class="back" href="index.html#tabStory">← All chapters</a>
  <div class="kicker">${esc(ch.eyebrow)} · The Piercing of the Fish's Eye</div>
  <h1>${esc(ch.title)}</h1>
  <p class="teaser">${esc(ch.teaser)}</p>

  <div class="blog-columns">
${bodyHtml}
  </div>

  <div class="chapter-nav">
    ${prev ? `<a href="${prev.slug}.html"><span class="dir">← Previous</span><span class="ttl">${esc(prev.title)}</span></a>` : `<span></span>`}
    ${next ? `<a class="next" href="${next.slug}.html"><span class="dir">Next →</span><span class="ttl">${esc(next.title)}</span></a>` : `<span></span>`}
  </div>

  <div class="cta">
    <div>Ready to try the trial yourself?</div>
    <a class="play" href="index.html#tabPlay">Play Matsya-Vedh Free →</a>
  </div>
</div>
</body>
</html>
`;

  fs.writeFileSync(path.join(outDir, slug + '.html'), html);
  console.log('Wrote', slug + '.html');
});
