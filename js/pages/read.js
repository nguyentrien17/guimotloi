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
    search: ''
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
  categoryTabs.forEach(tab => {
    if (tab.dataset.category === filterState.category) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }

    tab.addEventListener('click', () => {
      categoryTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
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

      if (searchInput) searchInput.value = '';

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

    const filtered = messageRepository.filterMessages({
      category: filterState.category,
      emotion: filterState.emotion,
      search: filterState.search,
      isFavoriteOnly,
      isLocalOnly
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

  // Initial render
  renderMessages();
});
