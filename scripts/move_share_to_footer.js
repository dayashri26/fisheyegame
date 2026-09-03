const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const files = ['index.html', 'game.html'];

const SHARE_URL = 'https://aimfisheye.com/';
const SHARE_TEXT = "Aim only at the reflection, never the target — play Matsya-Vedh, a free archery game inspired by the Mahabharata's legendary fish-eye trial!";

const FOOTER_SHARE_CSS = `
  .footer-share {
    margin-top: 22px; padding-top: 18px; border-top: 1px solid rgba(233,195,73,0.15);
    text-align: center;
  }
  .footer-share-title {
    font-family: var(--font-label); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--gold-dim); margin-bottom: 12px;
  }
  .footer-share-row { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
  .share-link {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 8px 14px; border-radius: 20px; text-decoration: none;
    color: var(--text); font-size: 13px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: rgba(31,33,17,0.6); border: 1px solid rgba(233,195,73,0.22); cursor: pointer;
    transition: background 0.18s ease, border-color 0.18s ease, transform 0.18s ease;
  }
  .share-link:hover { background: rgba(233,195,73,0.14); border-color: rgba(233,195,73,0.5); transform: translateY(-1px); }
  .share-link .share-ic {
    width: 19px; height: 19px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; color: #fff;
  }
  .share-link.wa .share-ic { background: #25D366; }
  .share-link.fb .share-ic { background: #1877F2; }
  .share-link.tw .share-ic { background: #000; }
  .share-link.tg .share-ic { background: #229ED9; }
  .share-link.copy .share-ic { background: var(--gold-dim); color: #12130a; font-size: 10px; }
`;

const FOOTER_SHARE_HTML = `  <div class="footer-share">
    <div class="footer-share-title">Share Matsya-Vedh</div>
    <div class="footer-share-row">
      <a class="share-link wa" id="shareWA" href="#" target="_blank" rel="noopener noreferrer"><span class="share-ic">W</span>WhatsApp</a>
      <a class="share-link fb" id="shareFB" href="#" target="_blank" rel="noopener noreferrer"><span class="share-ic">f</span>Facebook</a>
      <a class="share-link tw" id="shareTW" href="#" target="_blank" rel="noopener noreferrer"><span class="share-ic">X</span>X / Twitter</a>
      <a class="share-link tg" id="shareTG" href="#" target="_blank" rel="noopener noreferrer"><span class="share-ic">T</span>Telegram</a>
      <button class="share-link copy" id="shareCopy" type="button"><span class="share-ic">&#10697;</span>Copy Link</button>
    </div>
  </div>
`;

const FOOTER_SHARE_JS = `
<script>
(function () {
  var SHARE_URL = ${JSON.stringify(SHARE_URL)};
  var SHARE_TEXT = ${JSON.stringify(SHARE_TEXT)};

  var waLink = document.getElementById('shareWA');
  var fbLink = document.getElementById('shareFB');
  var twLink = document.getElementById('shareTW');
  var tgLink = document.getElementById('shareTG');

  if (waLink) waLink.href = 'https://wa.me/?text=' + encodeURIComponent(SHARE_TEXT + ' ' + SHARE_URL);
  if (fbLink) fbLink.href = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(SHARE_URL);
  if (twLink) twLink.href = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(SHARE_URL) + '&text=' + encodeURIComponent(SHARE_TEXT);
  if (tgLink) tgLink.href = 'https://t.me/share/url?url=' + encodeURIComponent(SHARE_URL) + '&text=' + encodeURIComponent(SHARE_TEXT);

  var copyBtn = document.getElementById('shareCopy');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var original = copyBtn.innerHTML;
      function done() {
        copyBtn.innerHTML = '<span class="share-ic">&#10003;</span>Copied!';
        setTimeout(function () { copyBtn.innerHTML = original; }, 1600);
      }
      function fallbackCopy() {
        var ta = document.createElement('textarea');
        ta.value = SHARE_URL;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (err) {}
        document.body.removeChild(ta);
        done();
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(SHARE_URL).then(done).catch(fallbackCopy);
      } else {
        fallbackCopy();
      }
    });
  }
})();
</script>
`;

for (const file of files) {
  const filePath = path.join(ROOT, file);
  let html = fs.readFileSync(filePath, 'utf8');

  if (!html.includes('id="shareBtn"')) {
    console.log(`SKIP (no old top share button found, maybe already migrated): ${file}`);
    continue;
  }

  // 1. Remove the share button from audio-controls
  html = html.replace(
    /\s*<button class="sound-btn" id="shareBtn"[\s\S]*?<\/button>\n/,
    '\n'
  );

  // 2. Remove the share popover block entirely
  html = html.replace(
    /\s*<div class="share-popover" id="sharePopover">[\s\S]*?<\/div>\n/,
    '\n'
  );

  // 3. Remove the old share-popover CSS block
  html = html.replace(
    /\n  \.share-popover \{[\s\S]*?\.share-link\.copy \.share-ic \{ background: var\(--gold-dim\); color: #12130a; font-size: 11px; \}\n/,
    '\n'
  );

  // 4. Remove the old JS block (popover-toggle version) appended before </body>
  html = html.replace(
    /\n<script>\n\(function \(\) \{\n  var shareBtn = document\.getElementById\('shareBtn'\);[\s\S]*?<\/script>\n<\/body>/,
    '\n</body>'
  );

  // 5. Insert new footer share CSS after the sound-btn focus-visible rule (if not already present)
  const cssAnchor = `.sound-btn:focus-visible, button:focus-visible { outline: 2px solid var(--vermilion); outline-offset: 2px; }\n`;
  if (html.includes(cssAnchor) && !html.includes('.footer-share {')) {
    html = html.replace(cssAnchor, cssAnchor + FOOTER_SHARE_CSS);
  }

  // 6. Insert the footer share HTML after the legend-note div (present in both files' footer), before </div> closing .footer
  const legendAnchor = /<div class="legend-note">[^<]*<\/div>\n/;
  if (legendAnchor.test(html)) {
    html = html.replace(legendAnchor, (m) => m + FOOTER_SHARE_HTML);
  } else {
    console.log(`WARN: legend-note anchor not found in ${file}`);
  }

  // 7. Insert new JS before </body>
  html = html.replace('</body>', FOOTER_SHARE_JS + '</body>');

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`OK: ${file}`);
}
