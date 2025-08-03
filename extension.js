
(function() {
  const HIDE_CLASS  = 'hide-chess-opponent';
  const MY_USERNAME = 'Car-Geek';

  const CSS = `
    /* hide opponent username/title */
    html.${HIDE_CLASS} [data-test-element^="user-tagline-"]:not([data-exempt]) {
      display: none !important;
    }

    /* hide opponent title */
    html.${HIDE_CLASS} .cc-user-title-component:not([data-exempt]) {
      display: none !important;
    }

    /* hide opponent rating */
    html.${HIDE_CLASS} [class*="cc-user-rating"]:not([data-exempt]) {
      display: none !important;
    }

    /* hide opponent avatars */
    html.${HIDE_CLASS} img[src*="images.chesscomfiles.com/uploads/v1/user"]:not([data-exempt]) {
      display: none !important;
    }

    /* hide stray popovers */
    html.${HIDE_CLASS} [class*="popover"] {
      display: none !important;
      visibility: hidden !important;
    }

    /* hide “New Game” chat banner */
    html.${HIDE_CLASS} .game-start-message-component {
      display: none !important;
      visibility: hidden !important;
    }

    /* hide opponent flair icon */
    html.${HIDE_CLASS} .flair-rpc-component:not([data-exempt]) {
      display: none !important;
    }

    /* hide opponent country flag */
    html.${HIDE_CLASS} .country-flags-component:not([data-exempt]) {
      display: none !important;
    }

    /* hide the badge link wrapper + inner badge */
    html.${HIDE_CLASS} .cc-user-badge-component:not([data-exempt]) {
      display: none !important;
      visibility: hidden !important;
    }

    /* expose anything we’ve explicitly marked exempt*/ 
    html.${HIDE_CLASS} [data-exempt] {
      display: block !important;
      visibility: visible !important;
    }
    html.${HIDE_CLASS} img[data-exempt] {
      display: inline-block !important;
    }
  `;

  if (!document.getElementById('hide-opponent-style')) {
    const style = document.createElement('style');
    style.id = 'hide-opponent-style';
    style.textContent = CSS;
    document.head.append(style);
  }

  function markMyOwn() {
    document
      .querySelectorAll('[data-test-element="user-tagline-username"]')
      .forEach(el => {
        if (el.textContent.trim() === MY_USERNAME) {
          el.setAttribute('data-exempt', 'true');
        }
      });

    document
      .querySelectorAll('img[src*="images.chesscomfiles.com/uploads/v1/user"]')
      .forEach(img => {
        if (img.alt === MY_USERNAME) {
          img.setAttribute('data-exempt', 'true');
        }
      });
  }

  function setHide(on) {
    document.documentElement.classList.toggle(HIDE_CLASS, on);
    markMyOwn();
  }

  let hideEnabled = false;

  chrome.storage.local.get({ hideOpponent: true }, ({ hideOpponent }) => {
    hideEnabled = !!hideOpponent;
    setHide(hideEnabled);
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.hideOpponent) {
      hideEnabled = !!changes.hideOpponent.newValue;
      setHide(hideEnabled);
    }
  });
  document.addEventListener(
    'click',
    e => {
      if (!hideEnabled) return;

      if (
        e.target.closest(
          '[data-test-element^="user-tagline-"]:not([data-exempt]), ' +
          '[class*="cc-user-rating"]:not([data-exempt]), ' +
          'img[src*="images.chesscomfiles.com/uploads/v1/user"]:not([data-exempt])'
        )
      ) {
        e.stopImmediatePropagation();
        e.preventDefault();
      }
    },
    true
  );

  new MutationObserver(() => {
    chrome.storage.local.get({ hideOpponent: true }, ({ hideOpponent }) => {
      setHide(!!hideOpponent);
    });
  }).observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();