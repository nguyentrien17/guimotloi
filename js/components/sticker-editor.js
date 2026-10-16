/**
 * Sticker Editor — Interactive Drag, Drop, Rotate & Scale Engine
 * Works seamlessly with Mouse and Touch (Pointer Events).
 */

export class StickerEditor {
  /**
   * @param {HTMLElement} stageElement - The parent stationery card container
   * @param {Function} onChange - Callback whenever sticker positions or properties change
   */
  constructor(stageElement, onChange) {
    this.stageElement = stageElement;
    this.onChange = onChange;
    this.stickers = [];
    this.selectedStickerIndex = -1;
    this.isDragging = false;
    this.activePointerId = null;
    this.dragOffset = { x: 0, y: 0 };

    this.initLayer();
    this.bindEvents();
  }

  initLayer() {
    let layer = this.stageElement.querySelector('.sticker-container-layer');
    if (!layer) {
      layer = document.createElement('div');
      layer.className = 'sticker-container-layer';
      this.stageElement.appendChild(layer);
    }
    this.layer = layer;
  }

  bindEvents() {
    this.layer.addEventListener('pointerdown', this.onPointerDown.bind(this));
    window.addEventListener('pointermove', this.onPointerMove.bind(this));
    window.addEventListener('pointerup', this.onPointerUp.bind(this));
    window.addEventListener('pointercancel', this.onPointerUp.bind(this));

    // Deselect if clicking outside
    this.stageElement.addEventListener('pointerdown', (e) => {
      if (!e.target.closest('.interactive-sticker')) {
        this.selectSticker(-1);
      }
    });
  }

  /**
   * Loads stickers array
   * @param {Array} stickers 
   */
  loadStickers(stickers = []) {
    this.stickers = stickers.map(s => ({
      emoji: s.emoji || '✨',
      x: typeof s.x === 'number' ? s.x : 50,
      y: typeof s.y === 'number' ? s.y : 50,
      scale: typeof s.scale === 'number' ? s.scale : 1,
      rotation: typeof s.rotation === 'number' ? s.rotation : 0
    }));
    this.selectedStickerIndex = -1;
    this.render();
  }

  /**
   * Adds a new sticker to the center of the card
   * @param {string} emoji 
   */
  addSticker(emoji) {
    const newStk = {
      emoji,
      x: 35 + Math.random() * 30, // Random placement near center
      y: 25 + Math.random() * 40,
      scale: 1.1,
      rotation: (Math.random() * 20) - 10
    };
    this.stickers.push(newStk);
    this.selectedStickerIndex = this.stickers.length - 1;
    this.render();
    this.emitChange();
  }

  /**
   * Removes currently selected sticker
   */
  deleteSelected() {
    if (this.selectedStickerIndex >= 0 && this.selectedStickerIndex < this.stickers.length) {
      this.stickers.splice(this.selectedStickerIndex, 1);
      this.selectedStickerIndex = -1;
      this.render();
      this.emitChange();
    }
  }

  /**
   * Updates scale of selected sticker
   * @param {number} delta 
   */
  adjustScale(delta) {
    if (this.selectedStickerIndex >= 0) {
      const stk = this.stickers[this.selectedStickerIndex];
      stk.scale = Math.max(0.5, Math.min(2.5, (stk.scale || 1) + delta));
      this.render();
      this.emitChange();
    }
  }

  /**
   * Rotates selected sticker
   * @param {number} degrees 
   */
  adjustRotation(degrees) {
    if (this.selectedStickerIndex >= 0) {
      const stk = this.stickers[this.selectedStickerIndex];
      stk.rotation = ((stk.rotation || 0) + degrees) % 360;
      this.render();
      this.emitChange();
    }
  }

  /**
   * Moves selected sticker by percentage offsets (accessible button/keyboard control)
   * @param {number} deltaX 
   * @param {number} deltaY 
   */
  moveSelected(deltaX, deltaY) {
    if (this.selectedStickerIndex >= 0 && this.selectedStickerIndex < this.stickers.length) {
      const stk = this.stickers[this.selectedStickerIndex];
      stk.x = Math.max(5, Math.min(95, (stk.x || 50) + deltaX));
      stk.y = Math.max(5, Math.min(95, (stk.y || 50) + deltaY));
      this.render();
      this.emitChange();
    }
  }

  /**
   * Brings selected sticker to the front
   */
  bringToFront() {
    if (this.selectedStickerIndex >= 0 && this.selectedStickerIndex < this.stickers.length - 1) {
      const item = this.stickers.splice(this.selectedStickerIndex, 1)[0];
      this.stickers.push(item);
      this.selectedStickerIndex = this.stickers.length - 1;
      this.render();
      this.emitChange();
    }
  }

  selectSticker(index) {
    this.selectedStickerIndex = index;
    const stickerNodes = this.layer.querySelectorAll('.interactive-sticker');
    stickerNodes.forEach((node, i) => {
      node.classList.toggle('selected', i === index);
    });
    this.emitSelectionChange();
  }

  onPointerDown(e) {
    const stickerEl = e.target.closest('.interactive-sticker');
    if (!stickerEl) return;

    e.preventDefault();
    const index = parseInt(stickerEl.dataset.index, 10);
    this.selectSticker(index);

    this.isDragging = true;
    this.activePointerId = e.pointerId;
    stickerEl.setPointerCapture(e.pointerId);

    const rect = this.layer.getBoundingClientRect();
    const stk = this.stickers[index];
    const currentXpx = (stk.x / 100) * rect.width;
    const currentYpx = (stk.y / 100) * rect.height;

    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    this.dragOffset = {
      x: clickX - currentXpx,
      y: clickY - currentYpx
    };
  }

  onPointerMove(e) {
    if (!this.isDragging || this.selectedStickerIndex < 0) return;

    const rect = this.layer.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const clickX = e.clientX - rect.left - this.dragOffset.x;
    const clickY = e.clientY - rect.top - this.dragOffset.y;

    // Convert to percentage with boundary limits (5% to 95%)
    let pctX = (clickX / rect.width) * 100;
    let pctY = (clickY / rect.height) * 100;

    pctX = Math.max(5, Math.min(95, pctX));
    pctY = Math.max(5, Math.min(95, pctY));

    const stk = this.stickers[this.selectedStickerIndex];
    stk.x = Math.round(pctX * 10) / 10;
    stk.y = Math.round(pctY * 10) / 10;

    // Update only the moving element's style directly for maximum 60fps responsiveness
    const el = this.layer.querySelector(`[data-index="${this.selectedStickerIndex}"]`);
    if (el) {
      el.style.left = `${stk.x}%`;
      el.style.top = `${stk.y}%`;
    }
  }

  onPointerUp(e) {
    if (this.isDragging) {
      this.isDragging = false;
      this.activePointerId = null;
      this.emitChange();
    }
  }

  render() {
    this.layer.innerHTML = '';
    this.stickers.forEach((stk, index) => {
      const el = document.createElement('div');
      el.className = 'interactive-sticker' + (index === this.selectedStickerIndex ? ' selected' : '');
      el.dataset.index = index;
      el.textContent = stk.emoji;
      el.style.left = `${stk.x}%`;
      el.style.top = `${stk.y}%`;
      el.style.fontSize = `${28 * (stk.scale || 1)}px`;
      el.style.transform = `translate(-50%, -50%) rotate(${stk.rotation || 0}deg)`;
      el.style.zIndex = index + 1;
      this.layer.appendChild(el);
    });
  }

  emitChange() {
    if (typeof this.onChange === 'function') {
      this.onChange(this.getStickersData());
    }
  }

  emitSelectionChange() {
    const event = new CustomEvent('stickerSelectionChange', {
      detail: {
        selectedIndex: this.selectedStickerIndex,
        selectedSticker: this.selectedStickerIndex >= 0 ? this.stickers[this.selectedStickerIndex] : null
      }
    });
    window.dispatchEvent(event);
  }

  getStickersData() {
    return this.stickers.map(s => ({ ...s }));
  }
}
