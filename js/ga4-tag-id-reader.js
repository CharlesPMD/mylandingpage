// Tiny GA-4 tag-ID reader (poll-only, no overrides).
// Place this <script> after the GTM container snippet.
//
// Page markup must contain:
//
//   <b>GA4 ID:</b> <span id="console-ga4-tag-id">waiting …</span>

// Wait for DOMContentLoaded so #console-ga4-tag-id exists even if this
// script is loaded in <head> without the "defer" attribute.
(function () {
  const init = () => {
    const OUTPUT_EL = document.getElementById('console-ga4-tag-id');
    if (!OUTPUT_EL) {
      console.warn('[ga4-tag-id-reader] Element #console-ga4-tag-id not found');
      return;
    }

  const dl = window.dataLayer = window.dataLayer || [];

  // Extracts the ID if item looks like ['config', 'G-XXXX', {...}]
  const grabId = item =>
    Array.isArray(item) && item[0] === 'config' && typeof item[1] === 'string'
      ? item[1]
      : null;

  /* 1️⃣  Immediate scan – catches IDs already in dataLayer */
  let id = dl.map(grabId).find(Boolean);
  if (id) {
    OUTPUT_EL.textContent = id;
    return; // done
  }

  /* 2️⃣  Poll – but examine ONLY the new items added since last pass */
  let lastIndex = dl.length;
  const poll = setInterval(() => {
    for (let i = lastIndex; i < dl.length; i++) {
      const found = grabId(dl[i]);
      if (found) {
        OUTPUT_EL.textContent = found;
        clearInterval(poll);
        return;
      }
    }
    lastIndex = dl.length;
  }, 100);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
