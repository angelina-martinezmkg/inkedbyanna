/* =========================================================
   inkedbyanna — script.js
   Small, dependency-free enhancements:
   1. Sticky-header offset for anchor scrolling
   2. Mobile navigation
   3. Current year in the footer
   4. Portfolio lightbox (keyboard accessible)
   The quote form is a normal HTML form handled by Netlify —
   there is intentionally no form JavaScript here.
   ========================================================= */

(function () {
  'use strict';

  /* ---------- 1. Header height → CSS variable ---------- */
  var header = document.querySelector('.site-header');
  function setHeaderHeight() {
    if (!header) return;
    document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
  }
  setHeaderHeight();
  window.addEventListener('resize', setHeaderHeight);

  /* ---------- 2. Mobile navigation ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');

  function setNav(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setNav(toggle.getAttribute('aria-expanded') !== 'true');
    });

    // Close after choosing a link
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setNav(false);
    });

    // Close with Escape and return focus to the menu button
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setNav(false);
        toggle.focus();
      }
    });

    // Reset when resizing up to desktop
    window.matchMedia('(min-width: 52.01rem)').addEventListener('change', function (mq) {
      if (mq.matches) setNav(false);
    });
  }

  /* ---------- 3. Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- 4. Portfolio lightbox ---------- */
  var dialog = document.querySelector('.lightbox');
  var triggers = Array.prototype.slice.call(document.querySelectorAll('.work__open'));

  if (!dialog || !triggers.length || typeof dialog.showModal !== 'function') return;

  var imgEl = dialog.querySelector('.lightbox__img');
  var captionEl = dialog.querySelector('.lightbox__caption');
  var closeBtn = dialog.querySelector('.lightbox__close');
  var prevBtn = dialog.querySelector('.lightbox__prev');
  var nextBtn = dialog.querySelector('.lightbox__next');
  var current = 0;
  var lastTrigger = null;

  // Give each thumbnail button a clear accessible name
  triggers.forEach(function (btn, i) {
    var thumb = btn.querySelector('img');
    btn.setAttribute('aria-label', 'View larger: ' + (thumb ? thumb.alt : 'image ' + (i + 1)));
    btn.addEventListener('click', function () { open(i); });
  });

  function show(index) {
    current = (index + triggers.length) % triggers.length;
    var thumb = triggers[current].querySelector('img');
    // Optional: add data-full="assets/big-photo.jpg" to an <img> to show a larger file here
    imgEl.src = thumb.getAttribute('data-full') || thumb.currentSrc || thumb.src;
    imgEl.alt = thumb.alt;
    captionEl.textContent = thumb.alt + ' (' + (current + 1) + ' of ' + triggers.length + ')';
  }

  function open(index) {
    lastTrigger = triggers[index];
    show(index);
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function close() { dialog.close(); }

  dialog.addEventListener('close', function () {
    document.body.style.overflow = '';
    if (lastTrigger) lastTrigger.focus();
  });

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', function () { show(current - 1); });
  nextBtn.addEventListener('click', function () { show(current + 1); });

  // Arrow keys move between images; Escape closes (built into <dialog>)
  dialog.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); show(current + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(current - 1); }
  });

  // Click on the dark area around the image closes the viewer
  dialog.addEventListener('click', function (e) {
    if (e.target === dialog || e.target.classList.contains('lightbox__figure')) close();
  });
})();
