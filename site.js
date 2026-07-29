/* J. Cloutier Photography — shared site scripts */
(function () {
  var header = document.getElementById('site-header');
  if (header && !header.classList.contains('solid')) {
    var onScroll = function () {
      header.classList.toggle('scrolled', window.scrollY > 60);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');
  if (toggle && nav) {
    var setMenu = function (open) {
      nav.classList.toggle('open', open);
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.classList.toggle('nav-open', open);
    };

    toggle.addEventListener('click', function () {
      setMenu(!nav.classList.contains('open'));
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.classList.contains('open')) {
        setMenu(false);
        toggle.focus();
      }
    });
  }

  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  var query = new URLSearchParams(window.location.search);
  var interest = query.get('interest');
  var imageTitle = query.get('image');
  var interestField = document.getElementById('interest');
  if (interest && interestField) {
    interestField.value = interest === 'print' ? 'A fine-art print' : interest;
    if (imageTitle) interestField.value += ' — ' + imageTitle;
  }

  var filterbar = document.querySelector('.filterbar');
  var grid = document.querySelector('.grid');
  if (filterbar && grid) {
    var cards = Array.prototype.slice.call(grid.querySelectorAll('.card'));
    var applyFilter = function (category, updateHash) {
      cards.forEach(function (card) {
        var show = category === 'all' ||
          (category === 'featured' && card.dataset.featured === 'true') ||
          card.dataset.cat === category;
        card.hidden = !show;
      });
      filterbar.querySelectorAll('button').forEach(function (button) {
        var active = button.dataset.filter === category;
        button.classList.toggle('active', active);
        button.setAttribute('aria-pressed', String(active));
      });
      if (updateHash) {
        history.replaceState(null, '', category === 'featured' ? location.pathname : '#' + category);
      }
    };

    filterbar.addEventListener('click', function (event) {
      var button = event.target.closest('button');
      if (button) applyFilter(button.dataset.filter, true);
    });

    var hash = (location.hash || '').replace('#', '');
    var valid = ['featured', 'all', 'horses', 'ranch', 'skies', 'wildlife', 'bw'];
    applyFilter(valid.indexOf(hash) >= 0 ? hash : 'featured', false);
  }

  var lightbox = document.getElementById('lightbox');
  if (lightbox && grid) {
    var lightboxImage = lightbox.querySelector('.lb-image');
    var lightboxCaption = lightbox.querySelector('.lb-caption');
    var lightboxCount = lightbox.querySelector('.lb-count');
    var lightboxInquiry = lightbox.querySelector('.lb-inquiry');
    var closeButton = lightbox.querySelector('.lb-close');
    var previousButton = lightbox.querySelector('.lb-prev');
    var nextButton = lightbox.querySelector('.lb-next');
    var index = 0;
    var list = [];
    var lastFocus = null;

    var visibleCards = function () {
      return Array.prototype.slice.call(grid.querySelectorAll('.card:not([hidden])'));
    };

    var show = function (nextIndex) {
      list = visibleCards();
      if (!list.length) return;
      index = (nextIndex + list.length) % list.length;
      var card = list[index];
      var image = card.querySelector('img');
      var title = card.dataset.title || image.alt;
      lightboxImage.src = image.currentSrc || image.src;
      lightboxImage.alt = image.alt;
      lightboxCaption.textContent = title;
      lightboxCount.textContent = (index + 1) + ' of ' + list.length;
      lightboxInquiry.href = 'https://jcloutierphotography.pixieset.com/fineartprints/';
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('lightbox-open');
    };

    var open = function (card) {
      lastFocus = document.activeElement;
      show(visibleCards().indexOf(card));
      closeButton.focus();
    };

    var close = function () {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('lightbox-open');
      lightboxImage.removeAttribute('src');
      if (lastFocus) lastFocus.focus();
    };

    grid.addEventListener('click', function (event) {
      var card = event.target.closest('.card');
      if (!card) return;
      event.preventDefault();
      open(card);
    });
    closeButton.addEventListener('click', close);
    previousButton.addEventListener('click', function () { show(index - 1); });
    nextButton.addEventListener('click', function () { show(index + 1); });
    lightbox.addEventListener('click', function (event) {
      if (event.target === lightbox) close();
    });
    document.addEventListener('keydown', function (event) {
      if (!lightbox.classList.contains('open')) return;
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowLeft') show(index - 1);
      if (event.key === 'ArrowRight') show(index + 1);
      if (event.key === 'Tab') {
        var focusable = [closeButton, previousButton, nextButton, lightboxInquiry];
        var current = focusable.indexOf(document.activeElement);
        if (event.shiftKey && current <= 0) {
          event.preventDefault();
          focusable[focusable.length - 1].focus();
        } else if (!event.shiftKey && current === focusable.length - 1) {
          event.preventDefault();
          focusable[0].focus();
        }
      }
    });

    if (imageTitle) {
      var requestedCard = Array.prototype.slice.call(grid.querySelectorAll('.card')).find(function (card) {
        return card.dataset.title === imageTitle;
      });
      if (requestedCard) {
        applyFilter('all', false);
        open(requestedCard);
      }
    }
  }
})();
