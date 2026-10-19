/**
 * Lightweight custom dropdown ("picker").
 * Replaces native <select> where the OS-rendered option list looks out of
 * place (oversized text, overflowing the viewport on mobile).
 *
 * Markup:
 *   <div class="picker">
 *     <button type="button" class="picker-trigger" aria-haspopup="listbox" aria-expanded="false">
 *       <span class="picker-value"></span>
 *     </button>
 *     <div class="picker-panel" role="listbox" hidden>
 *       <button type="button" class="picker-option" role="option" data-value="...">Label</button>
 *     </div>
 *   </div>
 */

const openPickers = new Set();

document.addEventListener('pointerdown', (e) => {
  openPickers.forEach((picker) => {
    if (!picker.root.contains(e.target)) picker.close();
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    openPickers.forEach((picker) => picker.close(true));
  }
});

/**
 * @param {HTMLElement} root - the .picker element
 * @param {(value: string) => void} onSelect
 */
export function initPicker(root, onSelect) {
  if (!root) return null;

  const trigger = root.querySelector('.picker-trigger');
  const panel = root.querySelector('.picker-panel');
  const valueEl = root.querySelector('.picker-value');
  const options = () => Array.from(panel.querySelectorAll('.picker-option'));

  // The panel is position: fixed and placed against the viewport, so no
  // ancestor with overflow (editor panel, tab content) can clip it. It opens
  // below the trigger, or above when there's more room there, never under
  // the sticky site header, and shrinks its max-height to the space it has.
  const GAP = 6;
  const EDGE = 8;
  const MAX_HEIGHT = 280;
  const placePanel = () => {
    const r = trigger.getBoundingClientRect();
    const header = document.querySelector('.site-header');
    const minTop = (header ? Math.max(0, header.getBoundingClientRect().bottom) : 0) + EDGE;
    const maxBottom = window.innerHeight - EDGE;

    // Width: match the trigger, unless the stylesheet gives the panel its
    // own width (emoji grid) — then right-align it to the trigger. Set it
    // before measuring height, since wrapping depends on it.
    const ownWidth = root.classList.contains('picker-emoji');
    if (!ownWidth) panel.style.width = `${r.width}px`;
    const width = ownWidth ? panel.offsetWidth : r.width;

    const spaceBelow = maxBottom - (r.bottom + GAP);
    const spaceAbove = (r.top - GAP) - minTop;

    panel.style.maxHeight = `${MAX_HEIGHT}px`;
    const natural = Math.min(panel.scrollHeight, MAX_HEIGHT);
    const dropUp = spaceBelow < natural && spaceAbove > spaceBelow;
    const height = Math.max(120, Math.min(natural, dropUp ? spaceAbove : spaceBelow));
    panel.style.maxHeight = `${height}px`;

    let left = ownWidth ? r.right - width : r.left;
    left = Math.max(EDGE, Math.min(left, window.innerWidth - width - EDGE));

    panel.style.left = `${left}px`;
    panel.style.top = dropUp ? `${Math.max(minTop, r.top - GAP - height)}px` : `${r.bottom + GAP}px`;
    root.classList.toggle('drop-up', dropUp);
  };

  // Keep the panel attached to its trigger while the page scrolls/resizes;
  // close it if the trigger scrolls out of view.
  const onViewportChange = (e) => {
    if (panel.hidden || (e && panel.contains(e.target))) return;
    const r = trigger.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) picker.close();
    else placePanel();
  };

  const picker = {
    root,
    open() {
      openPickers.forEach((p) => p !== picker && p.close());
      panel.hidden = false;
      placePanel();
      root.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
      openPickers.add(picker);
      window.addEventListener('scroll', onViewportChange, true);
      window.addEventListener('resize', onViewportChange);
      const selected = panel.querySelector('.picker-option.selected') || options()[0];
      if (selected) {
        // Scroll only the panel (scrollIntoView could also move the page).
        panel.scrollTop = selected.offsetTop - (panel.clientHeight - selected.offsetHeight) / 2;
        selected.focus({ preventScroll: true });
      }
    },
    close(returnFocus = false) {
      if (panel.hidden) return;
      window.removeEventListener('scroll', onViewportChange, true);
      window.removeEventListener('resize', onViewportChange);
      panel.hidden = true;
      root.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
      openPickers.delete(picker);
      if (returnFocus) trigger.focus();
    },
    setValue(value) {
      let match = null;
      options().forEach((opt) => {
        const isSelected = opt.dataset.value === value;
        opt.classList.toggle('selected', isSelected);
        opt.setAttribute('aria-selected', String(isSelected));
        if (isSelected) match = opt;
      });
      if (match && valueEl) valueEl.textContent = match.dataset.label || match.textContent.trim();
    }
  };

  trigger.addEventListener('click', () => {
    if (panel.hidden) picker.open();
    else picker.close();
  });

  panel.addEventListener('click', (e) => {
    const opt = e.target.closest('.picker-option');
    if (!opt) return;
    picker.setValue(opt.dataset.value);
    picker.close(true);
    onSelect(opt.dataset.value);
  });

  // Arrow-key navigation between options
  panel.addEventListener('keydown', (e) => {
    const list = options();
    const idx = list.indexOf(document.activeElement);
    if (idx < 0) return;
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (step) {
      e.preventDefault();
      list[(idx + step + list.length) % list.length].focus();
    } else if (e.key === 'Tab') {
      picker.close();
    }
  });

  return picker;
}
