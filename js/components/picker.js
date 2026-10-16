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

  // Open upward when the space below — inside the nearest clipping/scrolling
  // ancestor, or the viewport — is too short for the panel.
  const placePanel = () => {
    root.classList.remove('drop-up');
    const triggerRect = trigger.getBoundingClientRect();
    let top = 0;
    let bottom = window.innerHeight;
    for (let el = root.parentElement; el && el !== document.body; el = el.parentElement) {
      if (getComputedStyle(el).overflowY !== 'visible') {
        const r = el.getBoundingClientRect();
        top = Math.max(top, r.top);
        bottom = Math.min(bottom, r.bottom);
      }
    }
    const needed = panel.offsetHeight + 8;
    const below = bottom - triggerRect.bottom;
    const above = triggerRect.top - top;
    if (below < needed && above > below) root.classList.add('drop-up');
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
      const selected = panel.querySelector('.picker-option.selected') || options()[0];
      if (selected) {
        selected.scrollIntoView({ block: 'nearest' });
        selected.focus({ preventScroll: true });
      }
    },
    close(returnFocus = false) {
      if (panel.hidden) return;
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
