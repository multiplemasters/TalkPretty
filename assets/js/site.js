/* TalkPretty — progressive enhancement. Pages are fully readable without this file. */
(function () {
  'use strict';

  var THEME_KEY = 'talkpretty-theme';
  var FAV_KEY = 'talkpretty-favorites';
  var root = document.documentElement;

  function read(key, fallback) {
    try { var v = localStorage.getItem(key); return v === null ? fallback : v; } catch (e) { return fallback; }
  }
  function write(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* storage unavailable; state lasts for this page only */ }
  }
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  /* ---------- Theme ---------- */
  var themeBtn = $('#theme-toggle');
  function applyTheme(t) {
    root.dataset.theme = t;
    if (themeBtn) themeBtn.setAttribute('aria-pressed', String(t === 'dark'));
  }
  applyTheme(root.dataset.theme === 'dark' ? 'dark' : 'light');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      write(THEME_KEY, next);
    });
  }
  if (window.matchMedia) {
    var mq = matchMedia('(prefers-color-scheme: dark)');
    var onChange = function (e) { if (read(THEME_KEY, null) === null) applyTheme(e.matches ? 'dark' : 'light'); };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
  }

  /* ---------- Favorites ---------- */
  var favs = [];
  try { favs = JSON.parse(read(FAV_KEY, '[]')); } catch (e) { favs = []; }
  if (!Array.isArray(favs)) favs = [];

  var saveBtns = $all('[data-save]');
  var savedCount = $('#saved-count');
  var onFavsChanged = function () {};

  function isSaved(slug) { return favs.indexOf(slug) !== -1; }
  function paintSaveButtons() {
    saveBtns.forEach(function (btn) {
      var slug = btn.getAttribute('data-save');
      var title = btn.getAttribute('data-title');
      var on = isSaved(slug);
      btn.setAttribute('aria-pressed', String(on));
      var label = btn.querySelector('.save-label');
      if (label) label.textContent = on ? 'Saved' : 'Save';
      else btn.setAttribute('aria-label', (on ? 'Remove ' : 'Save ') + title + (on ? ' from saved' : ''));
    });
    if (savedCount) savedCount.textContent = String(favs.length);
  }
  saveBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var slug = btn.getAttribute('data-save');
      favs = isSaved(slug) ? favs.filter(function (s) { return s !== slug; }) : favs.concat(slug);
      write(FAV_KEY, JSON.stringify(favs));
      paintSaveButtons();
      onFavsChanged();
    });
  });
  paintSaveButtons();
  // Re-enable transitions only after the first paint so restored state doesn't animate in.
  requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.remove('preload'); }); });

  /* ---------- Copy (framework pages) ---------- */
  var copyBtn = $('#copy-btn');
  if (copyBtn) {
    var copyLabel = $('#copy-label');
    var timer;
    copyBtn.addEventListener('click', function () {
      var text = copyBtn.getAttribute('data-copy') || '';
      var done = function () {
        copyBtn.classList.add('copied');
        copyLabel.textContent = 'Copied';
        clearTimeout(timer);
        timer = setTimeout(function () {
          copyBtn.classList.remove('copied');
          copyLabel.textContent = 'Copy steps';
        }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, done);
      } else {
        done();
      }
    });
  }

  /* ---------- Library filtering (home page) ---------- */
  var grid = $('#grid');
  if (!grid) return;

  var cards = $all('.card', grid);
  var input = $('#search');
  var clearSearch = $('#clear-search');
  var chips = $all('.chip');
  var savedOnlyBtn = $('#saved-only');
  var savedOnlyCount = $('#saved-only-count');
  var clearFilters = $('#clear-filters');
  var countN = $('#count-n');
  var countLabel = $('#count-label');
  var empty = $('#empty');
  var emptyTitle = $('h3', empty);
  var emptyText = $('p', empty);

  var state = { q: '', topic: 'All', saved: /[?&]saved=1\b/.test(location.search) };

  function apply() {
    var q = state.q.trim().toLowerCase();
    var shown = 0;
    cards.forEach(function (card) {
      var okQ = !q || card.getAttribute('data-search').indexOf(q) !== -1;
      var okT = state.topic === 'All' || card.getAttribute('data-topics').split('|').indexOf(state.topic) !== -1;
      var okS = !state.saved || isSaved(card.getAttribute('data-slug'));
      var show = okQ && okT && okS;
      card.hidden = !show;
      if (show) shown++;
    });

    countN.textContent = String(shown);
    countLabel.textContent = shown === 1 ? 'framework' : 'frameworks';

    chips.forEach(function (chip) {
      chip.setAttribute('aria-pressed', String(chip.getAttribute('data-topic') === state.topic));
    });
    savedOnlyBtn.setAttribute('aria-pressed', String(state.saved));
    savedOnlyCount.textContent = '(' + favs.length + ')';
    clearSearch.hidden = !state.q;
    clearFilters.hidden = !(state.q || state.topic !== 'All' || state.saved);

    empty.hidden = shown !== 0;
    if (shown === 0) {
      if (state.saved && favs.length === 0) {
        emptyTitle.textContent = 'No saved frameworks yet';
        emptyText.textContent = 'Star a framework to keep it here.';
      } else {
        emptyTitle.textContent = 'Nothing matches yet';
        emptyText.textContent = 'Try a shorter search, another category, or clear the filters.';
      }
    }
  }

  input.addEventListener('input', function () { state.q = input.value; apply(); });
  clearSearch.addEventListener('click', function () { state.q = ''; input.value = ''; input.focus(); apply(); });
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () { state.topic = chip.getAttribute('data-topic'); apply(); });
  });
  savedOnlyBtn.addEventListener('click', function () { state.saved = !state.saved; apply(); });
  clearFilters.addEventListener('click', function () {
    state.q = ''; state.topic = 'All'; state.saved = false; input.value = ''; apply();
  });

  var savedLink = $('#saved-link');
  if (savedLink) {
    savedLink.addEventListener('click', function (e) {
      e.preventDefault();
      state.saved = !state.saved;
      apply();
      var lib = $('#library');
      if (lib && state.saved) lib.scrollIntoView({ behavior: 'auto' });
    });
  }

  onFavsChanged = apply;
  apply();
})();
