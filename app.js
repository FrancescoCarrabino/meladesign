/* Manuela Papa - portfolio
   The book is a sequence of photographs. Everything interactive is a rectangle
   placed on top of one of those photographs, in percentages of the photo itself,
   so the targets stay put while the book scales.

   Rectangles are [x, y, width, height], all in percent. */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------------- pages */

  // Manuela's own numbering, gaps included. Order on screen is order here.
  const PAGES = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 44, 45, 46, 47, 48, 49, 50, 51, 52,
    53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70,
    71, 72, 73, 74, 75, 76, 88, 89
  ];

  const at = (n) => PAGES.indexOf(n); // page number -> index in the flip order

  /* ------------------------------------------------------------ interaction */

  // Where each summary line jumps to, top to bottom.
  const SUMMARY = [
    { label: 'Curriculum Vitae',      page: 5,  rect: [54.6, 51.8, 13.5, 3.0] },
    { label: 'Internauta del Futuro', page: 6,  rect: [54.6, 59.3, 19.3, 2.9] },
    { label: 'Jie Sheng',             page: 26, rect: [54.6, 61.9, 10.5, 2.6] },
    { label: 'Servizi Iuav',          page: 54, rect: [54.6, 64.7, 12.6, 2.6] },
    { label: "'Ndemo",                page: 59, rect: [54.6, 66.9,  8.3, 2.6] },
    { label: 'A voce alta',           page: 64, rect: [54.6, 74.3, 11.8, 2.6] },
    { label: 'X1',                    page: 67, rect: [54.6, 81.7,  5.1, 2.6] },
    { label: 'Personal Project',      page: 72, rect: [54.6, 86.5, 13.2, 3.0] }
  ];

  /* `pin` sticks Manuela's apple on the page at that point, in percent. The
     words are printed across the apple, so they read without hovering, and
     where the apple stands on the thing it opens it is the click target too.
     `pinLabel` overrides `label` when the rectangle and the apple should not
     say the same sentence. A `note` apple only captions the page. */
  const HOTSPOTS = {
    3: [
      ...SUMMARY.map(s => ({ kind: 'jump', page: s.page, label: s.label, rect: s.rect })),
      /* A caption, not a button: it tells you the list is live. */
      { kind: 'note', label: 'Go directly on the project', pin: [80, 43] }
    ],

    /* The apple sits on the pocket it opens, so the pocket needs no label of
       its own: clicking either one runs the clip. */
    30: [{ kind: 'pocket', src: 'assets/video/pocket-1.mp4',
           rect: [59, 29, 30, 63],
           pinLabel: 'Click to open the pocket', pin: [66, 85] }],

    76: [{ kind: 'pocket', src: 'assets/video/pocket-2.mp4',
           rect: [8.5, 32, 32, 61],
           pinLabel: 'Click to open the pocket', pin: [33, 85] }],

    /* The Venice photographs had hover previews on three of them. Manuela
       wants all of them or none, so for now none: the `zoom` kind still
       works, and each preview is one line of config away. */
    63: [{ kind: 'reader',
           label: 'Explore the book here', rect: [50, 4, 47, 92], pin: [83, 9] }],

    /* Films open on a click, never on arrival: they cover the spread, and the
       spread is the point. */
    45: [{ kind: 'film', src: 'assets/video/libro-jie-sheng.mp4',
           label: 'Leaf through the book', rect: [26, 78, 30, 14],
           frame: [22, 24, 56, 50], pin: [20, 84] }],

    49: [{ kind: 'film', src: 'assets/video/pack.mp4',
           label: 'Open the packaging', rect: [70, 4, 24, 11],
           frame: [26, 20, 48, 56], pin: [82, 8] }]
  };

  // Pages of the printed 'Ndemo book, shown in the full-screen reader.
  const BOOK = Array.from({ length: 8 }, (_, i) =>
    `assets/books/libro2-${String(i + 1).padStart(2, '0')}`);

  /* -------------------------------------------------------------- elements */

  const el = {
    stage:      document.getElementById('stage'),
    book:       document.getElementById('book'),
    spread:     document.getElementById('spread'),
    hotspots:   document.getElementById('hotspots'),
    pocket:     document.getElementById('pocketVideo'),
    film:       document.getElementById('inlineFilm'),
    filmVideo:  document.getElementById('inlineVideo'),
    filmClose:  document.getElementById('inlineFilmClose'),
    zoom:       document.getElementById('zoom'),
    zoomImage:  document.getElementById('zoomImage'),
    zoomCaption:document.getElementById('zoomCaption'),
    intro:      document.getElementById('intro'),
    outro:     document.getElementById('outro'),
    prev:       document.getElementById('prevArea'),
    next:       document.getElementById('nextArea'),
    summaryBtn: document.getElementById('summaryBtn'),
    restartBtn: document.getElementById('restartBtn'),
    reader:     document.getElementById('reader'),
    readerPage: document.getElementById('readerPage'),
    readerCount:document.getElementById('readerCount'),
    readerClose:document.getElementById('readerClose'),
    readerPrev: document.getElementById('readerPrev'),
    readerNext: document.getElementById('readerNext')
  };

  /* ----------------------------------------------------------------- state */

  let index = 0;
  let ext = 'webp';         // swapped to avif when the browser supports it
  let pocketOpen = false;
  let readerIndex = 0;

  const spreadSrc = (page) =>
    `assets/spreads/spread-${String(page).padStart(2, '0')}.${ext}`;

  /* AVIF is roughly a third smaller than WebP here, so use it where it works. */
  function detectAvif() {
    return new Promise(resolve => {
      const img = new Image();
      img.onload  = () => resolve(img.width === 1);
      img.onerror = () => resolve(false);
      img.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=';
    });
  }

  /* -------------------------------------------------------------- spreads */

  function preload(i) {
    [i - 1, i + 1, i + 2].forEach(n => {
      if (n >= 0 && n < PAGES.length) new Image().src = spreadSrc(PAGES[n]);
    });
  }

  function show(i, { instant = false } = {}) {
    index = Math.max(0, Math.min(PAGES.length - 1, i));
    const page = PAGES[index];

    closePocket();
    closeZoom();

    el.spread.src = spreadSrc(page);
    el.spread.alt = `Portfolio page ${page}`;

    el.intro.classList.toggle('is-on', index === 0);
    el.outro.classList.toggle('is-on', index === PAGES.length - 1);
    el.stage.classList.toggle('at-start', index === 0);
    el.stage.classList.toggle('at-end', index === PAGES.length - 1);

    closeFilm();
    buildHotspots(page);
    preload(index);

    if (!instant) {
      el.spread.animate(
        [{ opacity: 0.55 }, { opacity: 1 }],
        { duration: 160, easing: 'ease-out' }
      );
    }
  }

  const next = () => { if (index < PAGES.length - 1) show(index + 1); };
  const prev = () => { if (index > 0) show(index - 1); };

  /* ------------------------------------------------------------- hotspots */

  function buildHotspots(page) {
    el.hotspots.replaceChildren();
    const list = HOTSPOTS[page];
    if (!list) return;

    list.forEach(spot => {
      const act = {
        jump:   () => show(at(spot.page)),
        pocket: () => openPocket(spot.src),
        reader: () => openReader(),
        film:   () => openFilm(spot),
        zoom:   () => openZoom(spot)
      }[spot.kind];

      if (spot.rect) {
        const node = document.createElement('button');
        node.type = 'button';
        node.className = `spot spot-${spot.kind}`;
        const [x, y, w, h] = spot.rect;
        node.style.cssText = `left:${x}%;top:${y}%;width:${w}%;height:${h}%`;
        if (spot.label) {
          node.dataset.label = spot.label;
          node.setAttribute('aria-label', spot.label);
        }
        node.addEventListener('click', e => { e.stopPropagation(); act(); });

        if (spot.kind === 'zoom') {
          new Image().src = spot.img; // so the first hover is not a blank frame
          node.addEventListener('pointerenter', () => openZoom(spot));
          node.addEventListener('pointerleave', closeZoom);
        }

        el.hotspots.appendChild(node);
      }

      // The apple. Always on the page, so you can see there is something here.
      if (!spot.pin) return;

      const words = spot.pinLabel || spot.label || '';
      // `note` apples say what the page does; the rest are the thing you press
      const live = spot.kind !== 'note' && spot.kind !== 'zoom';
      const pin = document.createElement(live ? 'button' : 'span');
      pin.className = live ? 'pin' : 'pin is-note';
      pin.style.cssText = `left:${spot.pin[0]}%;top:${spot.pin[1]}%`;
      const text = document.createElement('span');
      text.textContent = words;
      pin.appendChild(text);
      if (live) {
        pin.type = 'button';
        pin.setAttribute('aria-label', words);
        pin.addEventListener('click', e => { e.stopPropagation(); act(); });
      }
      el.hotspots.appendChild(pin);
    });
  }

  /* --------------------------------------------------------------- pocket */

  /* The clip is the whole spread filmed on black, and it already runs the
     photographs out of the pocket and back in, so it simply takes over the
     frame and hands it back at the end. */
  function openPocket(src) {
    if (pocketOpen) return;
    pocketOpen = true;

    el.pocket.src = src;
    el.pocket.currentTime = 0;
    el.pocket.classList.add('is-on');
    el.book.classList.add('pocket-open');

    // A blocked autoplay leaves the first frame on screen; the next click
    // starts it. Closing the pocket is never the browser's decision to make.
    el.pocket.play().catch(() => {});
    el.pocket.onended = closePocket;
  }

  function closePocket() {
    if (!pocketOpen) return;
    pocketOpen = false;
    el.pocket.onended = null;
    el.pocket.pause();
    el.pocket.classList.remove('is-on');
    el.book.classList.remove('pocket-open');
    el.pocket.removeAttribute('src');
    el.pocket.load();
  }

  /* ----------------------------------------------------------------- film */

  function openFilm(spot) {
    const [x, y, w, h] = spot.frame;
    el.film.style.cssText = `left:${x}%;top:${y}%;width:${w}%;height:${h}%`;
    el.film.hidden = false;
    el.filmVideo.src = spot.src;
    el.filmVideo.play().catch(() => {});
  }

  function closeFilm() {
    el.filmVideo.pause();
    el.film.hidden = true;
    el.filmVideo.removeAttribute('src');
    el.filmVideo.load();
  }

  // Click the film once to pause it, again on the close button to put it away.
  el.filmVideo.addEventListener('click', e => {
    e.stopPropagation();
    el.filmVideo.paused ? el.filmVideo.play() : el.filmVideo.pause();
  });

  el.filmClose.addEventListener('click', e => { e.stopPropagation(); closeFilm(); });

  /* ----------------------------------------------------------------- zoom */

  function openZoom(spot) {
    el.zoomImage.src = spot.img;
    el.zoomCaption.textContent = spot.caption;
    el.zoom.hidden = false;
  }

  function closeZoom() {
    el.zoom.hidden = true;
  }

  /* --------------------------------------------------------------- reader */

  function openReader(i = 0) {
    readerIndex = i;
    el.reader.hidden = false;
    document.body.classList.add('reading');
    paintReader();
  }

  function closeReader() {
    el.reader.hidden = true;
    document.body.classList.remove('reading');
  }

  function paintReader() {
    el.readerPage.src = `${BOOK[readerIndex]}.${ext}`;
    el.readerPage.alt = `'Ndemo, page ${readerIndex + 1} of ${BOOK.length}`;
    el.readerCount.textContent = `${readerIndex + 1} / ${BOOK.length}`;
    if (readerIndex + 1 < BOOK.length) new Image().src = `${BOOK[readerIndex + 1]}.${ext}`;
  }

  const readerNext = () => { if (readerIndex < BOOK.length - 1) { readerIndex++; paintReader(); } };
  const readerPrev = () => { if (readerIndex > 0) { readerIndex--; paintReader(); } };

  /* ---------------------------------------------------------------- wiring */

  el.next.addEventListener('click', next);
  el.prev.addEventListener('click', prev);
  el.summaryBtn.addEventListener('click', () => show(at(3)));
  el.restartBtn.addEventListener('click', () => show(0));

  el.readerClose.addEventListener('click', closeReader);
  el.readerNext.addEventListener('click', readerNext);
  el.readerPrev.addEventListener('click', readerPrev);

  el.pocket.addEventListener('click', e => {
    e.stopPropagation();
    if (el.pocket.paused && el.pocket.currentTime === 0) el.pocket.play().catch(() => {});
    else closePocket();
  });

  document.addEventListener('keydown', e => {
    if (!el.reader.hidden) {
      if (e.key === 'Escape')     closeReader();
      if (e.key === 'ArrowRight') readerNext();
      if (e.key === 'ArrowLeft')  readerPrev();
      return;
    }
    switch (e.key) {
      case 'ArrowRight': next(); break;
      case 'ArrowLeft':  prev(); break;
      case 'Home':  e.preventDefault(); show(0); break;
      case 'End':   e.preventDefault(); show(PAGES.length - 1); break;
      case 'Escape': closePocket(); closeFilm(); break;
    }
  });

  // Swipe, for phones and trackpads.
  let touchX = null;
  el.book.addEventListener('touchstart', e => { touchX = e.changedTouches[0].clientX; }, { passive: true });
  el.book.addEventListener('touchend', e => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 45) dx < 0 ? next() : prev();
    touchX = null;
  }, { passive: true });

  /* ------------------------------------------------------------------ boot */

  detectAvif().then(ok => {
    if (ok) ext = 'avif';
    show(0, { instant: true });
  });
});
