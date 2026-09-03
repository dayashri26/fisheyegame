const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const files = ['index.html', 'game.html'];

const SHARE_URL = 'https://aimfisheye.com/';
const SHARE_TEXT = "Aim only at the reflection, never the target — play Matsya-Vedh, a free archery game inspired by the Mahabharata's legendary fish-eye trial!";

const ICON_SYMBOL = `    <symbol id="ic-share" viewBox="0 0 24 24"><circle cx="18" cy="5" r="2.4" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="6" cy="12" r="2.4" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="18" cy="19" r="2.4" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8.1 10.8 15.9 6.2M8.1 13.2 15.9 17.8" stroke="currentColor" stroke-width="1.6"/></symbol>
`;

const SHARE_BUTTON = `        <button class="sound-btn" id="shareBtn" aria-label="Share this game" title="Share">
          <svg class="icon-svg"><use href="#ic-share"/></svg>
        </button>
`;

const SHARE_POPOVER = `      <div class="share-popover" id="sharePopover">
        <div class="share-title">Share Matsya-Vedh</div>
        <a class="share-link wa" id="shareWA" href="#" target="_blank" rel="noopener noreferrer"><span class="share-ic">W</span>WhatsApp</a>
        <a class="share-link fb" id="shareFB" href="#" target="_blank" rel="noopener noreferrer"><span class="share-ic">f</span>Facebook</a>
        <a class="share-link tw" id="shareTW" href="#" target="_blank" rel="noopener noreferrer"><span class="share-ic">X</span>X / Twitter</a>
        <a class="share-link tg" id="shareTG" href="#" target="_blank" rel="noopener noreferrer"><span class="share-ic">T</span>Telegram</a>
        <button class="share-link copy" id="shareCopy" type="button"><span class="share-ic">&#10697;</span>Copy Link</button>
      </div>
`;

const SHARE_CSS = `
  .share-popover {
    position: absolute; top: 68px; right: 14px; z-index: 20;
    background: linear-gradient(155deg, rgba(31,33,17,0.98), rgba(14,15,3,0.98));
    border: 1px solid rgba(233,195,73,0.35); border-radius: 14px;
    padding: 12px; width: 188px;
    box-shadow: var(--shadow-card), 0 8px 28px rgba(0,0,0,0.5);
    display: none; flex-direction: column; gap: 4px;
  }
  .share-popover.open { display: flex; }
  .share-popover .share-title {
    font-family: var(--font-label); font-size: 10.5px; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--gold-dim); margin-bottom: 4px; padding: 0 4px;
  }
  .share-link {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 10px; border-radius: 8px; text-decoration: none;
    color: var(--text); font-size: 13.5px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: transparent; border: none; cursor: pointer; width: 100%; text-align: left;
    transition: background 0.18s ease, transform 0.18s ease;
  }
  .share-link:hover { background: rgba(233,195,73,0.12); transform: translateX(2px); }
  .share-link .share-ic {
    width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: #fff;
  }
  .share-link.wa .share-ic { background: #25D366; }
  .share-link.fb .share-ic { background: #1877F2; }
  .share-link.tw .share-ic { background: #000; }
  .share-link.tg .share-ic { background: #229ED9; }
  .share-link.copy .share-ic { background: var(--gold-dim); color: #12130a; font-size: 11px; }
`;

const SHARE_JS = `
<script>
(function () {
  var shareBtn = document.getElementById('shareBtn');
  var sharePopover = document.getElementById('sharePopover');
  if (!shareBtn || !sharePopover) return;

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

  function closePopover() { sharePopover.classList.remove('open'); }

  shareBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({ title: 'Matsya-Vedh', text: SHARE_TEXT, url: SHARE_URL }).catch(function () {});
    } else {
      sharePopover.classList.toggle('open');
    }
  });

  document.addEventListener('click', function (e) {
    if (sharePopover.classList.contains('open') && !sharePopover.contains(e.target) && e.target !== shareBtn) {
      closePopover();
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closePopover();
  });

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

  if (html.includes('id="shareBtn"')) {
    console.log(`SKIP (already has share option): ${file}`);
    continue;
  }

  // 1. Add ic-share symbol before </defs>
  if (html.includes('</defs>')) {
    html = html.replace('  </defs>', ICON_SYMBOL + '  </defs>');
  } else {
    console.log(`WARN: no </defs> found in ${file}`);
  }

  // 2. Add share button inside .audio-controls, after the music button
  const musicBtnCloseAnchor = `        </button>\n      </div>\n`;
  const audioControlsBlock = html.match(/<div class="audio-controls">[\s\S]*?<\/div>\n/);
  if (audioControlsBlock) {
    const original = audioControlsBlock[0];
    // insert SHARE_BUTTON right before the final closing </div> of .audio-controls
    const updated = original.replace(/<\/div>\n$/, SHARE_BUTTON + '      </div>\n');
    html = html.replace(original, updated + SHARE_POPOVER);
  } else {
    console.log(`WARN: .audio-controls block not found in ${file}`);
  }

  // 3. Add CSS after the sound-btn focus-visible rule
  const cssAnchor = `.sound-btn:focus-visible, button:focus-visible { outline: 2px solid var(--vermilion); outline-offset: 2px; }\n`;
  if (html.includes(cssAnchor)) {
    html = html.replace(cssAnchor, cssAnchor + SHARE_CSS);
  } else {
    console.log(`WARN: css anchor not found in ${file}`);
  }

  // 4. Add JS before </body>
  html = html.replace('</body>', SHARE_JS + '</body>');

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`OK: ${file}`);
}
