/* J. Cloutier Photography — shared site scripts */
(function () {
  // ---- Header background on scroll ----
  var header = document.getElementById('site-header');
  if (header && !header.classList.contains('solid')) {
    var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 60); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ---- Mobile nav ----
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
      toggle.classList.toggle('open');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.classList.remove('open');
      });
    });
  }

  // ---- Year in footer ----
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  // ---- Gallery filter ----
  var filterbar = document.querySelector('.filterbar');
  var grid = document.querySelector('.grid');
  if (filterbar && grid) {
    var cards = Array.prototype.slice.call(grid.querySelectorAll('.card'));
    var apply = function (cat) {
      cards.forEach(function (c) {
        c.style.display = (cat === 'all' || c.dataset.cat === cat) ? '' : 'none';
      });
      filterbar.querySelectorAll('button').forEach(function (b) {
        b.classList.toggle('active', b.dataset.filter === cat);
      });
    };
    filterbar.addEventListener('click', function (e) {
      var btn = e.target.closest('button');
      if (btn) apply(btn.dataset.filter);
    });
    // honor #hash deep links (e.g. gallery.html#horses)
    var hash = (location.hash || '').replace('#', '');
    var valid = ['all', 'horses', 'ranch', 'skies', 'wildlife', 'bw'];
    apply(valid.indexOf(hash) >= 0 ? hash : 'all');
  }

  // ---- Lightbox ----
  var lb = document.getElementById('lightbox');
  if (lb && grid) {
    var lbImg = lb.querySelector('img');
    var visible = function () {
      return Array.prototype.slice.call(grid.querySelectorAll('.card'))
        .filter(function (c) { return c.style.display !== 'none'; });
    };
    var idx = 0, list = [];
    var show = function (i) {
      list = visible();
      if (!list.length) return;
      idx = (i + list.length) % list.length;
      var src = list[idx].querySelector('img').getAttribute('src');
      lbImg.setAttribute('src', src);
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    };
    var close = function () { lb.classList.remove('open'); document.body.style.overflow = ''; };
    grid.addEventListener('click', function (e) {
      var card = e.target.closest('.card');
      if (!card) return;
      e.preventDefault();
      show(visible().indexOf(card));
    });
    lb.querySelector('.lb-close').addEventListener('click', close);
    lb.querySelector('.lb-prev').addEventListener('click', function () { show(idx - 1); });
    lb.querySelector('.lb-next').addEventListener('click', function () { show(idx + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
  }
})();
