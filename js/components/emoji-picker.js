/**
 * Emoji & Sticker Library
 * Categorized picker for cards and stationery decorations.
 */

export const STICKER_CATEGORIES = [
  {
    id: 'love',
    name: 'Tình yêu',
    items: ['💌', '💗', '💕', '❤️', '🌸', '🌹', '💐', '💍', '🧸', '🎀']
  },
  {
    id: 'miss_you',
    name: 'Buồn & Nhớ',
    items: ['🌙', '🌧️', '🥹', '💔', '🥀', '🌫️', '🍂', '⚓', '⏳', '🖤']
  },
  {
    id: 'hope',
    name: 'Hy vọng',
    items: ['🌈', '☀️', '🌻', '🌅', '🌱', '🍀', '🎈', '🕊️', '🪁', '⭐']
  },
  {
    id: 'peace',
    name: 'Bình yên',
    items: ['🤍', '☁️', '🌿', '🍵', '🌾', '🕊️', '🌊', '🌲', '🕯️', '🪐']
  },
  {
    id: 'gratitude',
    name: 'Biết ơn',
    items: ['✨', '🙏', '🌷', '🌟', '🎁', '💎', '🎉', '🏮', '🎐', '🎇']
  },
  {
    id: 'travel_memory',
    name: 'Kỷ niệm & Đời thường',
    items: ['📮', '📜', '🚲', '☕', '🏠', '❄️', '🛵', '🧭', '🗝️', '🦋']
  }
];

/**
 * Initializes the sticker picker inside a container element
 * @param {HTMLElement} container 
 * @param {Function} onSelectSticker 
 */
export function initEmojiPicker(container, onSelectSticker) {
  if (!container) return;

  container.innerHTML = `
    <div class="sticker-categories" role="tablist">
      ${STICKER_CATEGORIES.map((cat, idx) => `
        <button type="button" class="sticker-cat-btn ${idx === 0 ? 'active' : ''}" data-cat-id="${cat.id}">
          ${cat.name}
        </button>
      `).join('')}
    </div>
    <div class="sticker-picker-grid" id="sticker-grid-items">
      ${STICKER_CATEGORIES[0].items.map(emoji => `
        <button type="button" class="sticker-picker-item" data-emoji="${emoji}" title="Thêm ${emoji}">
          ${emoji}
        </button>
      `).join('')}
    </div>
  `;

  const catBtns = container.querySelectorAll('.sticker-cat-btn');
  const grid = container.querySelector('#sticker-grid-items');

  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      catBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const catId = btn.dataset.catId;
      const category = STICKER_CATEGORIES.find(c => c.id === catId);
      if (category && grid) {
        grid.innerHTML = category.items.map(emoji => `
          <button type="button" class="sticker-picker-item" data-emoji="${emoji}" title="Thêm ${emoji}">
            ${emoji}
          </button>
        `).join('');
      }
    });
  });

  // Delegate click for emojis
  grid.addEventListener('click', (e) => {
    const itemBtn = e.target.closest('.sticker-picker-item');
    if (itemBtn && itemBtn.dataset.emoji) {
      onSelectSticker(itemBtn.dataset.emoji);
    }
  });
}
