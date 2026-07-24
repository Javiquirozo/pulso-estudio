/* Pulso Estudio · Home interactions */
(function () {
  // sticky nav background
  var nav = document.getElementById('nav');
  function onScroll() {
    if (window.scrollY > 20) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // mobile menu
  var burger = document.getElementById('burger');
  var links = document.getElementById('navLinks');
  burger.addEventListener('click', function () { links.classList.toggle('open'); });
  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { links.classList.remove('open'); });
  });

  // FAQ: only one open at a time
  var items = document.querySelectorAll('.faq-item');
  items.forEach(function (it) {
    it.addEventListener('toggle', function () {
      if (it.open) items.forEach(function (o) { if (o !== it) o.open = false; });
    });
  });

  // carousel arrows
  var car = document.getElementById('carousel');
  var prev = document.getElementById('prev');
  var next = document.getElementById('next');
  function step() { var c = car.querySelector('.pf-card'); return c ? c.offsetWidth + 22 : 360; }
  if (prev && next && car) {
    prev.addEventListener('click', function () { car.scrollBy({ left: -step(), behavior: 'smooth' }); });
    next.addEventListener('click', function () { car.scrollBy({ left: step(), behavior: 'smooth' }); });
  }

  // scroll reveal (IO + immediate in-view fallback)
  var reveals = document.querySelectorAll('.reveal');
  function revealInView() {
    var h = window.innerHeight || document.documentElement.clientHeight;
    reveals.forEach(function (el) {
      if (el.classList.contains('in')) return;
      if (el.getBoundingClientRect().top < h - 30) el.classList.add('in');
    });
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  }
  // safety: reveal whatever is already on screen (deferred so animation plays), then on scroll/load
  requestAnimationFrame(function () { requestAnimationFrame(revealInView); });
  window.addEventListener('load', revealInView);
  window.addEventListener('scroll', revealInView, { passive: true });
  setTimeout(revealInView, 400);

  // performance: lazy-load below-the-fold images
  document.querySelectorAll('img').forEach(function (img) {
    if (!img.closest('.nav-logo') && !img.closest('.hero') && !img.hasAttribute('loading')) {
      img.loading = 'lazy';
      img.decoding = 'async';
    }
  });

  // count-up numbers
  var cnums = document.querySelectorAll('.cnum');
  if (cnums.length) {
    var animateNum = function (el) {
      var target = parseFloat(el.getAttribute('data-target')) || 0;
      var dur = 1100, start = null;
      function tick(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased);
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    };
    if ('IntersectionObserver' in window) {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { animateNum(e.target); cio.unobserve(e.target); }
        });
      }, { threshold: 0.4 });
      cnums.forEach(function (el) { cio.observe(el); });
    } else {
      cnums.forEach(animateNum);
    }
  }

  // portfolio lightbox
  var lb = document.getElementById('lb');
  if (lb) {
  var lbGrid = document.getElementById('lbGrid');
  var lbTitle = document.getElementById('lbTitle');
  var lbMeta = document.getElementById('lbMeta');
  var lbClose = document.getElementById('lbClose');
  function openLb(card) {
    var imgs = (card.getAttribute('data-gallery') || '').split(',').filter(Boolean);
    if (!imgs.length) return;
    lbTitle.textContent = card.getAttribute('data-title') || '';
    lbMeta.textContent = card.getAttribute('data-meta') || '';
    lbGrid.innerHTML = '';
    lbGrid.classList.toggle('single', imgs.length === 1);
    imgs.forEach(function (src) {
      var im = document.createElement('img');
      im.src = src.trim(); im.alt = ''; im.loading = 'lazy';
      lbGrid.appendChild(im);
    });
    lbGrid.scrollTop = 0;
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeLb() {
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  document.querySelectorAll('.pf-card[data-gallery]').forEach(function (c) {
    c.addEventListener('click', function () { openLb(c); });
  });
  if (lbClose) lbClose.addEventListener('click', closeLb);
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLb(); });
  }
})();
