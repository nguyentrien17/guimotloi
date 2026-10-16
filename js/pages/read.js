/**
 * Page Script: Read & Discover (Trang đọc lời nhắn)
 * "Gửi một lời — Những lời chưa nói"
 */

import { messageRepository } from '../data/message-repository.js';
import { renderCardDOM } from '../components/card-renderer.js';
import { app } from '../app.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize repository
  await messageRepository.init();

  // Parse URL query filters
  const urlParams = new URLSearchParams(window.location.search);
  const initialCategory = urlParams.get('category') || 'all';
  const initialEmotion = urlParams.get('emotion') || 'all';
  const initialFilter = urlParams.get('filter') || 'all'; // 'all' | 'local' | 'favorites'

  // Filter State
  const filterState = {
    category: initialCategory,
    emotion: initialEmotion,
    sourceFilter: initialFilter,
    search: '',
    dateRange: 'all', // 'all' | 'today' | '7d' | '30d' | 'custom'
    dateFrom: '',     // 'YYYY-MM-DD', used when dateRange === 'custom'
    dateTo: ''
  };

  // DOM Elements
  const messagesGrid = document.getElementById('messages-grid');
  const countBadge = document.getElementById('filtered-count');
  const searchInput = document.getElementById('search-messages-input');
  const randomReadBtn = document.getElementById('btn-random-read');
  const clearFiltersBtn = document.getElementById('btn-clear-filters');
  const emptyStateContainer = document.getElementById('empty-state-container');

  // Random Read Button
  if (randomReadBtn) {
    randomReadBtn.addEventListener('click', () => {
      const randomMsg = messageRepository.getRandomMessage();
      if (randomMsg) {
        app.openReaderModal(randomMsg);
      } else {
        app.showToast('Chưa có lời nhắn nào.');
      }
    });
  }

  // Bind Source Tabs (Tất cả, Lời nhắn của bạn, Yêu thích)
  const sourceTabs = document.querySelectorAll('.source-tab-btn');
  sourceTabs.forEach(tab => {
    if (tab.dataset.source === filterState.sourceFilter) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }

    tab.addEventListener('click', () => {
      sourceTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      filterState.sourceFilter = tab.dataset.source;
      renderMessages();
    });
  });

  // Bind Category Tabs
  const categoryTabs = document.querySelectorAll('.cat-tab-btn');

  // Center a tab inside the horizontally scrolling category bar (scrolls the
  // bar only — scrollIntoView would also jump the page vertically).
  const centerTabInBar = (tab, smooth) => {
    const bar = tab.parentElement;
    const tabRect = tab.getBoundingClientRect();
    const barRect = bar.getBoundingClientRect();
    const left = bar.scrollLeft + (tabRect.left - barRect.left) - (bar.clientWidth - tabRect.width) / 2;
    bar.scrollTo({ left, behavior: smooth ? 'smooth' : 'auto' });
  };

  categoryTabs.forEach(tab => {
    if (tab.dataset.category === filterState.category) {
      tab.classList.add('active');
      centerTabInBar(tab, false);
    } else {
      tab.classList.remove('active');
    }

    tab.addEventListener('click', () => {
      categoryTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      centerTabInBar(tab, true);
      filterState.category = tab.dataset.category;
      renderMessages();
    });
  });

  // Bind Emotion Filter Chips
  const emotionChips = document.querySelectorAll('.emotion-filter-chip');
  emotionChips.forEach(chip => {
    if (chip.dataset.emotion === filterState.emotion) {
      chip.classList.add('active');
    } else {
      chip.classList.remove('active');
    }

    chip.addEventListener('click', () => {
      emotionChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      filterState.emotion = chip.dataset.emotion;
      renderMessages();
    });
  });

  // Bind Date Filter (presets + custom from/to range)
  const dateChips = document.querySelectorAll('.date-filter-chip');
  const dateRangeInputs = document.getElementById('date-range-inputs');
  const dateFromInput = document.getElementById('date-from-input');
  const dateToInput = document.getElementById('date-to-input');

  const setDateRange = (range) => {
    filterState.dateRange = range;
    dateChips.forEach(c => c.classList.toggle('active', c.dataset.range === range));
    if (dateRangeInputs) dateRangeInputs.hidden = range !== 'custom';
  };

  dateChips.forEach(chip => {
    chip.addEventListener('click', () => {
      setDateRange(chip.dataset.range);
      renderMessages();
    });
  });

  // Can't pick dates in the future, and "to" can't be before "from".
  const todayIso = toDateInputValue(new Date());
  if (dateFromInput) dateFromInput.max = todayIso;
  if (dateToInput) dateToInput.max = todayIso;

  if (dateFromInput) {
    dateFromInput.addEventListener('change', () => {
      filterState.dateFrom = dateFromInput.value;
      if (dateToInput) dateToInput.min = dateFromInput.value;
      renderMessages();
    });
  }
  if (dateToInput) {
    dateToInput.addEventListener('change', () => {
      filterState.dateTo = dateToInput.value;
      if (dateFromInput) dateFromInput.max = dateToInput.value || todayIso;
      renderMessages();
    });
  }

  // Search input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      filterState.search = e.target.value;
      renderMessages();
    });
  }

  // Clear filters
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
      filterState.category = 'all';
      filterState.emotion = 'all';
      filterState.sourceFilter = 'all';
      filterState.search = '';
      filterState.dateFrom = '';
      filterState.dateTo = '';

      if (searchInput) searchInput.value = '';
      if (dateFromInput) { dateFromInput.value = ''; dateFromInput.max = todayIso; }
      if (dateToInput) { dateToInput.value = ''; dateToInput.min = ''; }
      setDateRange('all');

      categoryTabs.forEach(t => t.classList.toggle('active', t.dataset.category === 'all'));
      emotionChips.forEach(c => c.classList.toggle('active', c.dataset.emotion === 'all'));
      sourceTabs.forEach(t => t.classList.toggle('active', t.dataset.source === 'all'));

      renderMessages();
    });
  }

  // Listen for favorite changes to re-render if in Favorites tab
  window.addEventListener('favoriteChanged', () => {
    if (filterState.sourceFilter === 'favorites') {
      renderMessages();
    }
  });

  function renderMessages() {
    const isFavoriteOnly = filterState.sourceFilter === 'favorites';
    const isLocalOnly = filterState.sourceFilter === 'local';

    const { dateFrom, dateTo } = getDateBounds();

    const filtered = messageRepository.filterMessages({
      category: filterState.category,
      emotion: filterState.emotion,
      search: filterState.search,
      isFavoriteOnly,
      isLocalOnly,
      dateFrom,
      dateTo
    });

    if (countBadge) {
      countBadge.textContent = `${filtered.length} lời nhắn`;
    }

    if (!messagesGrid) return;

    messagesGrid.innerHTML = '';

    if (filtered.length === 0) {
      if (emptyStateContainer) emptyStateContainer.style.display = 'block';
      messagesGrid.style.display = 'none';
    } else {
      if (emptyStateContainer) emptyStateContainer.style.display = 'none';
      messagesGrid.style.display = 'grid';

      filtered.forEach(msg => {
        const cardEl = renderCardDOM(msg, {
          isInteractive: true,
          onOpenReader: (m) => app.openReaderModal(m)
        });
        messagesGrid.appendChild(cardEl);
      });
    }
  }

  /**
   * Converts the date filter into [dateFrom, dateTo) ms timestamps, using the
   * viewer's local day boundaries (so "Hôm nay" means today on their clock).
   */
  function getDateBounds() {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const daysAgo = (n) => {
      const d = new Date(startOfToday);
      d.setDate(d.getDate() - n);
      return d.getTime();
    };

    switch (filterState.dateRange) {
      case 'today':
        return { dateFrom: startOfToday.getTime(), dateTo: null };
      case '7d':
        return { dateFrom: daysAgo(6), dateTo: null };
      case '30d':
        return { dateFrom: daysAgo(29), dateTo: null };
      case 'custom': {
        const from = parseDateInput(filterState.dateFrom);
        const to = parseDateInput(filterState.dateTo);
        if (to) to.setDate(to.getDate() + 1); // inclusive end day
        return { dateFrom: from ? from.getTime() : null, dateTo: to ? to.getTime() : null };
      }
      default:
        return { dateFrom: null, dateTo: null };
    }
  }

  // Initial render
  renderMessages();
});

/** 'YYYY-MM-DD' -> local-midnight Date (new Date('YYYY-MM-DD') would be UTC). */
function parseDateInput(value) {
  if (!value) return null;
  const [y, m, d] = value.split('-').map(Number);
  return y && m && d ? new Date(y, m - 1, d) : null;
}

/** Date -> 'YYYY-MM-DD' in local time, for <input type="date"> min/max. */
function toDateInputValue(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
