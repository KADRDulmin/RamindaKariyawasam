/* animations.js — anime.js scroll & entrance animations */
(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (typeof anime === 'undefined') { console.warn('anime.js not loaded'); return; }

  /* ── Wait for React boards to mount ──────────────────────────────────── */
  function onReady(cb) {
    var t = setInterval(function () {
      if (document.querySelector('#board-about .section-head')) {
        clearInterval(t);
        cb();
      }
    }, 60);
  }

  onReady(function () {
    injectDividers();
    heroEntrance();
    scrollReveal();
    confettiBurst();
  });

  /* ── helpers ──────────────────────────────────────────────────────────── */
  function getRot(el) {
    var v = el.style.getPropertyValue('--rot');
    return v ? parseFloat(v) : 0;
  }
  function getChipRot(el) {
    var v = el.style.getPropertyValue('--chip-rot');
    return v ? parseFloat(v) : 0;
  }
  function observe(elements, opts, cb) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        cb(e.target);
      });
    }, opts);
    elements.forEach(function (el) { io.observe(el); });
    return io;
  }

  /* ── DECORATIVE WAVY DIVIDERS ─────────────────────────────────────────── */
  function injectDividers() {
    var boards = document.querySelectorAll('.board-wrap');
    boards.forEach(function (board, i) {
      if (i === 0) return; // skip home
      var wrap = document.createElement('div');
      wrap.style.cssText = 'position:relative;height:40px;overflow:visible;pointer-events:none;margin:-20px 0;z-index:2';
      var svgNS = 'http://www.w3.org/2000/svg';
      var svg = document.createElementNS(svgNS, 'svg');
      svg.setAttribute('viewBox', '0 0 1200 40');
      svg.setAttribute('preserveAspectRatio', 'none');
      svg.style.cssText = 'width:100%;height:40px;display:block;opacity:0.35';
      var path = document.createElementNS(svgNS, 'path');
      path.setAttribute('d', 'M0 20 Q 100 8, 200 20 T 400 20 T 600 20 T 800 20 T 1000 20 T 1200 20');
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', 'var(--ink-soft)');
      path.setAttribute('stroke-width', '2');
      path.setAttribute('stroke-linecap', 'round');
      var totalLen = 1260;
      path.style.strokeDasharray = totalLen;
      path.style.strokeDashoffset = totalLen;
      svg.appendChild(path);
      wrap.appendChild(svg);
      board.parentNode.insertBefore(wrap, board);

      // Animate the path draw when board enters view
      observe([board], { threshold: 0.05, rootMargin: '0px 0px 0px 0px' }, function () {
        anime({
          targets: path,
          strokeDashoffset: [totalLen, 0],
          duration: 1200,
          easing: 'easeInOutSine',
          delay: 200
        });
      });
    });
  }

  /* ── HERO ENTRANCE ────────────────────────────────────────────────────── */
  function heroEntrance() {
    var home = document.querySelector('#board-home');
    if (!home) return;

    var greeting  = home.querySelector('.hero-text-col .scribble');
    var h1        = home.querySelector('h1');
    var heroP     = home.querySelector('.hero-text-col > p');
    var btns      = Array.from(home.querySelectorAll('.hero-text-col .btn'));
    var polaroid  = home.querySelector('.polaroid-wrap');
    var floatNotes = Array.from(home.querySelectorAll('.hero-float-notes .note'));
    var statNotes  = Array.from(home.querySelectorAll('.no-tape'));

    // Set initial invisible states
    function hide(el, tx, ty, sc, rot) {
      if (!el) return;
      el.style.opacity = '0';
      var parts = [];
      if (tx) parts.push('translateX(' + tx + 'px)');
      if (ty) parts.push('translateY(' + ty + 'px)');
      if (sc != null) parts.push('scale(' + sc + ')');
      if (rot != null) parts.push('rotate(' + rot + 'deg)');
      if (parts.length) el.style.transform = parts.join(' ');
    }

    if (greeting) hide(greeting, 0, -18);
    if (h1)       hide(h1,       0,  28);
    if (heroP)    hide(heroP,    0,  16);
    btns.forEach(function (b)  { hide(b,  0, 10, 0.75); });
    if (polaroid)  hide(polaroid, 0, -36);
    floatNotes.forEach(function (n) { hide(n, 0, 40, 1, getRot(n)); });
    statNotes.forEach(function  (n) { hide(n, 0, 24, 0.8, getRot(n)); });

    // Split h1 .scribble-u chars for char-by-char entrance
    var scribbleU = h1 && h1.querySelector('.scribble-u');
    var origText = '';
    var charSpans = [];
    if (scribbleU) {
      origText = scribbleU.textContent;
      scribbleU.textContent = '';
      origText.split('').forEach(function (c) {
        var s = document.createElement('span');
        var initRot = Math.random() * 12 - 6;
        s.textContent = c;
        s.dataset.rot = initRot;
        s.style.cssText = 'display:inline-block;opacity:0;transform:translateY(18px) rotate(' + initRot + 'deg)';
        scribbleU.appendChild(s);
        charSpans.push(s);
      });
    }

    var tl = anime.timeline({ easing: 'easeOutExpo' });

    // 1. Greeting text
    tl.add({
      targets: greeting,
      opacity: [0, 1],
      translateY: [-18, 0],
      duration: 550,
      delay: 180,
      complete: function () { if (greeting) greeting.style.transform = ''; }
    });

    // 2. H1 (minus scribble-u)
    tl.add({
      targets: h1,
      opacity: [0, 1],
      translateY: [28, 0],
      duration: 700,
      easing: 'easeOutBack',
      complete: function () { if (h1) h1.style.transform = ''; }
    }, '-=320');

    // 3. Char-by-char "Kariyawasam"
    if (charSpans.length) {
      tl.add({
        targets: charSpans,
        opacity: [0, 1],
        translateY: [18, 0],
        rotate: function (el) { return [parseFloat(el.dataset.rot) || 0, 0]; },
        duration: 380,
        delay: anime.stagger(38),
        easing: 'spring(1, 90, 12, 0)',
        complete: function () {
          if (scribbleU) {
            scribbleU.textContent = origText;
          }
        }
      }, '-=500');
    }

    // 4. Hero paragraph
    tl.add({
      targets: heroP,
      opacity: [0, 1],
      translateY: [16, 0],
      duration: 600,
      complete: function () { if (heroP) heroP.style.transform = ''; }
    }, '-=550');

    // 5. CTA buttons
    tl.add({
      targets: btns,
      opacity: [0, 1],
      scale: [0.75, 1],
      translateY: [10, 0],
      duration: 480,
      delay: anime.stagger(85),
      easing: 'spring(1, 80, 12, 0)',
      complete: function () { btns.forEach(function (b) { b.style.transform = ''; }); }
    }, '-=380');

    // 6. Polaroid frame swings in
    tl.add({
      targets: polaroid,
      opacity: [0, 1],
      translateY: [-36, 0],
      duration: 900,
      easing: 'spring(1, 55, 8, 0)',
      complete: function () { if (polaroid) polaroid.style.transform = ''; }
    }, '-=700');

    // 7. Floating notes stagger in
    tl.add({
      targets: floatNotes,
      opacity: [0, 1],
      translateY: [40, 0],
      duration: 700,
      delay: anime.stagger(110),
      easing: 'spring(1, 70, 10, 0)',
      complete: function () { floatNotes.forEach(function (n) { n.style.transform = ''; }); }
    }, '-=400');

    // 8. Stats notes pop in with spring stagger
    tl.add({
      targets: statNotes,
      opacity: [0, 1],
      scale: [0.8, 1],
      translateY: [24, 0],
      duration: 620,
      delay: anime.stagger(95),
      easing: 'spring(1, 80, 10, 0)',
      complete: function () { statNotes.forEach(function (n) { n.style.transform = ''; }); }
    }, '-=350');

    // 9. Count-up for stat numbers
    var counter = { p: 0 };
    tl.add({
      targets: counter,
      p: 1,
      duration: 850,
      easing: 'easeOutExpo',
      update: function () {
        statNotes.forEach(function (note) {
          var numEl = note.querySelector('.scribble');
          if (!numEl) return;
          if (!numEl.dataset.orig) numEl.dataset.orig = numEl.textContent.trim();
          var m = numEl.dataset.orig.match(/^(\d+)(\+?)$/);
          if (!m) return;
          numEl.textContent = Math.round(parseInt(m[1]) * counter.p) + (m[2] || '');
        });
      },
      complete: function () {
        statNotes.forEach(function (note) {
          var numEl = note.querySelector('.scribble');
          if (numEl && numEl.dataset.orig) numEl.textContent = numEl.dataset.orig;
        });
      }
    }, '-=400');
  }

  /* ── SCROLL REVEAL ────────────────────────────────────────────────────── */
  function scrollReveal() {
    // Pre-hide section heads (non-home)
    document.querySelectorAll('#board-about .section-head, #board-work .section-head, #board-nsbm .section-head, #board-toolkit .section-head, #board-contact .section-head').forEach(function (el) {
      var num = el.querySelector('.num');
      var h2  = el.querySelector('h2');
      if (num) { num.style.opacity = '0'; num.style.transform = 'scale(0.3) rotate(-20deg)'; }
      if (h2)  { h2.style.opacity  = '0'; h2.style.transform  = 'translateX(-55px)'; }
    });

    // Pre-hide notes in non-home boards
    var BOARDS = ['#board-about','#board-work','#board-nsbm','#board-toolkit','#board-contact'];
    BOARDS.forEach(function (id) {
      var board = document.querySelector(id);
      if (!board) return;
      board.querySelectorAll('.note').forEach(function (n) {
        var rot = getRot(n);
        n.style.opacity = '0';
        n.style.transform = 'translateY(48px) rotate(' + (rot + 7) + 'deg) scale(0.88)';
      });
    });

    // Observe section heads
    observe(
      Array.from(document.querySelectorAll('.section-head')),
      { threshold: 0.25 },
      animateSectionHead
    );

    // Observe notes
    BOARDS.forEach(function (id) {
      var board = document.querySelector(id);
      if (!board) return;
      observe(
        Array.from(board.querySelectorAll('.note')),
        { threshold: 0.08, rootMargin: '0px 0px -20px 0px' },
        animateNote
      );
    });

    // Observe timeline items in about section (year dot + title rows)
    var aboutBoard = document.querySelector('#board-about');
    if (aboutBoard) {
      // Timeline items sit inside the paddingLeft:24px relative container;
      // they have a position:absolute dot child — select by that dot
      var timelineDots = Array.from(aboutBoard.querySelectorAll('[style*="border-radius: 50%"][style*="position: absolute"]'));
      var timelineItems = timelineDots.map(function (dot) { return dot.parentNode; }).filter(Boolean);
      // deduplicate
      timelineItems = timelineItems.filter(function (el, idx, arr) { return arr.indexOf(el) === idx; });

      timelineItems.forEach(function (item) {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
      });
      observe(timelineItems, { threshold: 0.2 }, function (item) {
        anime({
          targets: item,
          opacity: [0, 1],
          translateX: [-30, 0],
          duration: 580,
          easing: 'easeOutExpo',
          complete: function () { item.style.transform = ''; }
        });
      });
    }
  }

  function animateSectionHead(el) {
    var num = el.querySelector('.num');
    var h2  = el.querySelector('h2');
    if (num) {
      anime({
        targets: num,
        scale: [0.3, 1],
        rotate: ['-20deg', '0deg'],
        opacity: [0, 1],
        duration: 700,
        easing: 'spring(1, 80, 10, 0)',
        complete: function () { num.style.transform = ''; }
      });
    }
    if (h2) {
      anime({
        targets: h2,
        translateX: [-55, 0],
        opacity: [0, 1],
        duration: 720,
        easing: 'easeOutExpo',
        delay: 130,
        complete: function () { h2.style.transform = ''; }
      });
    }
  }

  function animateNote(el) {
    if (el.classList.contains('dragging') || el.classList.contains('placed')) return;
    var rot   = getRot(el);
    var chips = Array.from(el.querySelectorAll('.chip'));

    chips.forEach(function (c) {
      var cr = getChipRot(c);
      c.style.opacity = '0';
      c.style.transform = 'scale(0) rotate(' + cr + 'deg)';
    });

    anime({
      targets: el,
      opacity: [0, 1],
      translateY: [48, 0],
      rotate: [rot + 7, rot],
      scale: [0.88, 1],
      duration: 680,
      easing: 'spring(1, 75, 10, 0)',
      complete: function () { el.style.transform = ''; }
    });

    if (chips.length) {
      anime({
        targets: chips,
        opacity: [0, 1],
        scale: [0, 1],
        duration: 400,
        delay: anime.stagger(48, { start: 280 }),
        easing: 'spring(1, 85, 12, 0)',
        complete: function (anim) {
          anim.animatables.forEach(function (a) { a.target.style.transform = ''; });
        }
      });
    }
  }

  /* ── CONFETTI BURST ───────────────────────────────────────────────────── */
  function confettiBurst() {
    var contact = document.querySelector('#board-contact');
    if (!contact) return;
    var fired = false;
    observe([contact], { threshold: 0.22 }, function (el) {
      if (fired) return;
      fired = true;
      burst(el);
    });
  }

  function burst(anchor) {
    var cs = getComputedStyle(document.documentElement);
    var colors = [
      cs.getPropertyValue('--note-yellow').trim()  || '#ffe58a',
      cs.getPropertyValue('--note-pink').trim()    || '#ffb7c5',
      cs.getPropertyValue('--note-mint').trim()    || '#b7e3c2',
      cs.getPropertyValue('--note-sky').trim()     || '#a9d2ef',
      cs.getPropertyValue('--note-lav').trim()     || '#d7c2f2',
      cs.getPropertyValue('--note-peach').trim()   || '#ffcfa1'
    ];
    var rect = anchor.getBoundingClientRect();
    var cx = window.scrollX + rect.left + rect.width / 2;
    var cy = window.scrollY + rect.top  + 80;
    var n  = 24;

    for (var i = 0; i < n; i++) {
      (function (i) {
        var el  = document.createElement('div');
        var w   = 7 + Math.random() * 11;
        var h   = 7 + Math.random() * 11;
        var rot = Math.random() * 360;
        var isCircle = Math.random() > 0.45;
        el.style.cssText = [
          'position:absolute',
          'width:'  + w + 'px',
          'height:' + h + 'px',
          'background:' + colors[i % colors.length],
          'border:1.5px solid rgba(42,36,31,0.35)',
          'border-radius:' + (isCircle ? '50%' : '3px'),
          'left:' + cx + 'px',
          'top:'  + cy + 'px',
          'pointer-events:none',
          'z-index:9100',
          'opacity:1',
          'transform:rotate(' + rot + 'deg)'
        ].join(';');
        document.body.appendChild(el);

        var angle = (2 * Math.PI * i / n) + (Math.random() - 0.5) * 0.9;
        var dist  = 90 + Math.random() * 210;
        var tx = cx + Math.cos(angle) * dist;
        var ty = cy + Math.sin(angle) * dist + 70;

        anime({
          targets: el,
          left:    tx,
          top:     ty,
          rotate:  rot + (Math.random() * 720 - 360),
          opacity: [1, 0],
          duration: 1100 + Math.random() * 700,
          easing:   'easeOutCubic',
          delay:    Math.random() * 160,
          complete: function () { if (el.parentNode) el.parentNode.removeChild(el); }
        });
      })(i);
    }
  }

})();
