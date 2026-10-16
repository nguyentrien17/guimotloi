/**
 * Page Script: Write Studio (Trang viết lời nhắn & Trình chỉnh sửa thiệp)
 * "Gửi một lời — Những lời chưa nói"
 * Comprehensive integration: 100+ Templates, 32+ Vietnamese Fonts, Live Contrast Meter & Anti-drowning Text Shadow
 */

import { messageRepository } from '../data/message-repository.js';
import { TEMPLATES_100, TEMPLATE_CATEGORIES, getTemplateById, filterTemplates } from '../../data/templates-100.js';
import { FONT_CATEGORIES, FONTS_LIST, filterFonts, getFontById } from '../components/font-library.js';
import { initEmojiPicker } from '../components/emoji-picker.js';
import { StickerEditor } from '../components/sticker-editor.js';
import { initPicker } from '../components/picker.js';
import { exportCardAsPng } from '../components/card-renderer.js';
import { saveDraft, loadDraft, clearDraft } from '../utils/storage.js';
import { MAX_CONTENT_LENGTH, setTextSafe } from '../utils/validation.js';
import { getCategoryLabel, serializeMessagesToXml } from '../utils/xml-parser.js';
import { getContrastRatio, isColorDark, ensureLegibleTextColor } from '../utils/color-utils.js';
import { app } from '../app.js';

document.addEventListener('DOMContentLoaded', async () => {
  await messageRepository.init();

  // Parse URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const initialTemplateId = urlParams.get('template') || 'tmpl-pastel-01';
  const initialCategory = urlParams.get('category') || 'unsaid';
  const initialEmotion = urlParams.get('emotion') || '💌';

  const defaultTemplate = getTemplateById(initialTemplateId);

  // Studio State
  const state = {
    content: '',
    category: initialCategory,
    categoryName: getCategoryLabel(initialCategory),
    emotion: initialEmotion,
    alias: '',
    design: {
      template: defaultTemplate.id,
      background: defaultTemplate.background,
      textColor: defaultTemplate.textColor,
      font: defaultTemplate.font || 'cormorant',
      fontSize: 18,
      lineHeight: 1.6,
      letterSpacing: 0,
      textShadow: 'none',
      pattern: defaultTemplate.pattern || 'none',
      textAlign: defaultTemplate.layout === 'centered' ? 'center' : 'left',
      stickers: defaultTemplate.recommendedStickers ? [
        { emoji: defaultTemplate.recommendedStickers[0] || '✨', x: 80, y: 18, scale: 1.1, rotation: 10 }
      ] : []
    }
  };

  // Active filter state for tab 2 & 3
  let currentTemplateCategory = 'all';
  let currentTemplateKeyword = '';
  let currentFontCategory = 'all';

  // DOM Elements
  const previewCard = document.getElementById('preview-stationery-card');
  const previewBody = document.getElementById('preview-card-body');
  const previewCategory = document.getElementById('preview-card-category');
  const previewDate = document.getElementById('preview-card-date');
  const previewEmotion = document.getElementById('preview-card-emotion');
  const previewAlias = document.getElementById('preview-card-alias');

  const contentTextarea = document.getElementById('input-content');
  const charCounter = document.getElementById('char-counter');
  const aliasInput = document.getElementById('input-alias');

  // Tab 2 Elements
  const templateSearchInput = document.getElementById('template-search-input');
  const templateCategoryFilterBar = document.getElementById('template-category-filter-bar');
  const templateCountDisplay = document.getElementById('template-count-display');
  const templateOptionsContainer = document.getElementById('template-options-list');

  // Tab 3 Elements: Contrast & Text Shadow & Colors
  const contrastMeterBadge = document.getElementById('contrast-meter-badge');
  const contrastIcon = document.getElementById('contrast-icon');
  const contrastText = document.getElementById('contrast-text');
  const btnAutoContrast = document.getElementById('btn-auto-contrast');
  const textShadowContainer = document.getElementById('text-shadow-choices');
  const customTextColorInput = document.getElementById('custom-text-color');
  const customBgColorInput = document.getElementById('custom-bg-color');
  const patternChoices = document.getElementById('input-pattern');
  const syncPatternChoices = (value) => {
    if (!patternChoices) return;
    patternChoices.querySelectorAll('[data-pattern]').forEach((btn) => {
      const isActive = btn.dataset.pattern === value;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-checked', String(isActive));
    });
  };

  // Tab 3 Elements: Font Library & Sliders
  const fontCategoryFilterBar = document.getElementById('font-category-filter-bar');
  const fontGalleryList = document.getElementById('font-gallery-list');
  const sliderFontSize = document.getElementById('slider-font-size');
  const sliderLineHeight = document.getElementById('slider-line-height');
  const sliderLetterSpacing = document.getElementById('slider-letter-spacing');
  const fontSizeVal = document.getElementById('font-size-val');
  const lineHeightVal = document.getElementById('line-height-val');
  const letterSpacingVal = document.getElementById('letter-spacing-val');
  const alignBtns = document.querySelectorAll('.align-choice-btn');

  // Tab 4 Elements
  const stickerPickerContainer = document.getElementById('sticker-picker-container');
  const stickerControlBar = document.getElementById('sticker-control-bar');

  // Initialize Sticker Editor on preview card
  const stickerEditor = new StickerEditor(previewCard, (updatedStickers) => {
    state.design.stickers = updatedStickers;
    autoSaveDraft();
  });

  // Check for existing saved draft
  const savedDraft = loadDraft();
  if (savedDraft && savedDraft.content && !urlParams.has('template')) {
    const shouldRestore = confirm('Bạn có một bản nháp chưa gửi từ trước. Bạn có muốn khôi phục không?');
    if (shouldRestore) {
      Object.assign(state, savedDraft);
      if (savedDraft.design) {
        state.design = { ...state.design, ...savedDraft.design };
      }
    }
  }

  // Populate Initial Form Fields from state
  if (contentTextarea) contentTextarea.value = state.content;
  if (aliasInput) aliasInput.value = state.alias;

  // Category & emotion pickers (custom dropdowns instead of a native <select>
  // / tap-to-cycle button, so the option list matches the page's type scale).
  const categoryPicker = initPicker(document.getElementById('category-picker'), (value) => {
    state.category = value;
    state.categoryName = getCategoryLabel(state.category);
    updatePreview();
    autoSaveDraft();
  });
  if (categoryPicker) categoryPicker.setValue(state.category);

  const EMOTION_CHOICES = ['💌', '🌙', '🤍', '✨', '🌻', '🥹', '🌧️', '🕊️', '💗', '💔', '🌈', '🌱', '🕯️', '🌸', '☕'];
  if (!EMOTION_CHOICES.includes(state.emotion)) EMOTION_CHOICES.unshift(state.emotion);
  const emotionPickerEl = document.getElementById('emotion-picker');
  if (emotionPickerEl) {
    // Built with DOM APIs, not innerHTML: state.emotion can come from the URL.
    const panel = emotionPickerEl.querySelector('.picker-panel');
    EMOTION_CHOICES.forEach((emo) => {
      const opt = document.createElement('button');
      opt.type = 'button';
      opt.className = 'picker-option';
      opt.setAttribute('role', 'option');
      opt.dataset.value = emo;
      opt.textContent = emo;
      panel.appendChild(opt);
    });
  }
  const emotionPicker = initPicker(emotionPickerEl, (value) => {
    state.emotion = value;
    updatePreview();
    autoSaveDraft();
  });
  if (emotionPicker) emotionPicker.setValue(state.emotion);
  if (customBgColorInput) customBgColorInput.value = state.design.background || '#FAF4EB';
  if (customTextColorInput) customTextColorInput.value = state.design.textColor || '#4A3B32';
  syncPatternChoices(state.design.pattern || 'none');

  if (sliderFontSize) {
    sliderFontSize.value = String(state.design.fontSize || 18);
    if (fontSizeVal) fontSizeVal.textContent = `${sliderFontSize.value}px`;
  }
  if (sliderLineHeight) {
    sliderLineHeight.value = String(state.design.lineHeight || 1.6);
    if (lineHeightVal) lineHeightVal.textContent = sliderLineHeight.value;
  }
  if (sliderLetterSpacing) {
    sliderLetterSpacing.value = String(state.design.letterSpacing || 0);
    if (letterSpacingVal) letterSpacingVal.textContent = `${sliderLetterSpacing.value}px`;
  }

  // =========================================================================
  // TAB 2: 100+ Stationery Templates Engine
  // =========================================================================
  function renderTemplateCategories() {
    if (!templateCategoryFilterBar) return;
    templateCategoryFilterBar.innerHTML = '';

    const allPill = document.createElement('button');
    allPill.type = 'button';
    allPill.className = `template-filter-pill ${currentTemplateCategory === 'all' ? 'active' : ''}`;
    allPill.textContent = `Tất cả (${TEMPLATES_100.length})`;
    allPill.addEventListener('click', () => {
      currentTemplateCategory = 'all';
      renderTemplateCategories();
      renderTemplateList();
    });
    templateCategoryFilterBar.appendChild(allPill);

    TEMPLATE_CATEGORIES.forEach(cat => {
      const pill = document.createElement('button');
      pill.type = 'button';
      pill.className = `template-filter-pill ${currentTemplateCategory === cat.id ? 'active' : ''}`;
      pill.textContent = `${cat.icon} ${cat.name} (${cat.count})`;
      pill.addEventListener('click', () => {
        currentTemplateCategory = cat.id;
        renderTemplateCategories();
        renderTemplateList();
      });
      templateCategoryFilterBar.appendChild(pill);
    });
  }

  function renderTemplateList() {
    if (!templateOptionsContainer) return;

    const filtered = filterTemplates({
      category: currentTemplateCategory,
      keyword: currentTemplateKeyword
    });

    if (templateCountDisplay) {
      templateCountDisplay.textContent = `Hiển thị ${filtered.length}/${TEMPLATES_100.length} mẫu thiệp`;
    }

    templateOptionsContainer.innerHTML = '';
    if (filtered.length === 0) {
      templateOptionsContainer.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 2rem; text-align: center; color: var(--color-ink-subtle); font-size: 0.875rem;">
          Không tìm thấy mẫu thiệp phù hợp với từ khóa "${currentTemplateKeyword}".
        </div>
      `;
      return;
    }

    filtered.forEach(tmpl => {
      const opt = document.createElement('div');
      opt.className = `template-card-option ${tmpl.id === state.design.template ? 'active' : ''}`;
      opt.dataset.templateId = tmpl.id;
      opt.style.backgroundColor = tmpl.background;
      opt.style.color = tmpl.textColor;
      opt.style.border = tmpl.border || '1.5px solid var(--color-border-subtle)';

      const recStickers = Array.isArray(tmpl.recommendedStickers) ? tmpl.recommendedStickers.slice(0, 3).join(' ') : '✨';

      opt.innerHTML = `
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.2rem;">
            <span class="template-option-category-badge" style="color: ${tmpl.textColor}; opacity: 0.75;">${tmpl.categoryName}</span>
            <span style="font-size: 0.95rem;">${tmpl.mood || '💌'}</span>
          </div>
          <span class="template-option-title" style="color: ${tmpl.textColor};">${tmpl.name}</span>
          <span class="template-option-desc" style="color: ${tmpl.textColor};">${tmpl.tags ? tmpl.tags.join(' · ') : ''}</span>
        </div>
        <div style="font-size: 0.95rem; margin-top: 0.4rem; display: flex; justify-content: space-between; align-items: center;">
          <span>${recStickers}</span>
          <span style="font-size: 0.65rem; padding: 0.15rem 0.4rem; border-radius: 4px; background: rgba(0,0,0,0.08); font-weight: 500;">Chọn</span>
        </div>
      `;

      opt.addEventListener('click', () => {
        applyTemplate(tmpl);
      });
      templateOptionsContainer.appendChild(opt);
    });
  }

  if (templateSearchInput) {
    templateSearchInput.addEventListener('input', (e) => {
      currentTemplateKeyword = e.target.value;
      renderTemplateList();
    });
  }

  // =========================================================================
  // TAB 3: Font Library Engine & Fine-tuning Sliders
  // =========================================================================
  function renderFontCategories() {
    if (!fontCategoryFilterBar) return;
    fontCategoryFilterBar.innerHTML = '';

    FONT_CATEGORIES.forEach(cat => {
      const pill = document.createElement('button');
      pill.type = 'button';
      pill.className = `template-filter-pill ${currentFontCategory === cat.id ? 'active' : ''}`;
      pill.textContent = cat.name;
      pill.addEventListener('click', () => {
        currentFontCategory = cat.id;
        renderFontCategories();
        renderFontList();
      });
      fontCategoryFilterBar.appendChild(pill);
    });
  }

  function renderFontList() {
    if (!fontGalleryList) return;

    const filtered = filterFonts({
      category: currentFontCategory
    });

    fontGalleryList.innerHTML = '';
    filtered.forEach(font => {
      const item = document.createElement('div');
      item.className = `font-item-card ${state.design.font === font.id ? 'active' : ''}`;
      item.dataset.fontId = font.id;

      item.innerHTML = `
        <span class="font-item-name">${font.name}</span>
        <span class="font-item-sample" style="font-family: ${font.family}; font-size: 0.95rem;">
          ${font.sample}
        </span>
      `;

      item.addEventListener('click', () => {
        state.design.font = font.id;
        fontGalleryList.querySelectorAll('.font-item-card').forEach(c => c.classList.remove('active'));
        item.classList.add('active');
        updatePreview();
        autoSaveDraft();
      });

      fontGalleryList.appendChild(item);
    });
  }

  // Typography Sliders
  if (sliderFontSize) {
    sliderFontSize.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      state.design.fontSize = val;
      if (fontSizeVal) fontSizeVal.textContent = `${val}px`;
      updatePreview();
      autoSaveDraft();
    });
  }

  if (sliderLineHeight) {
    sliderLineHeight.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      state.design.lineHeight = val;
      if (lineHeightVal) lineHeightVal.textContent = String(val);
      updatePreview();
      autoSaveDraft();
    });
  }

  if (sliderLetterSpacing) {
    sliderLetterSpacing.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      state.design.letterSpacing = val;
      if (letterSpacingVal) letterSpacingVal.textContent = `${val}px`;
      updatePreview();
      autoSaveDraft();
    });
  }

  // Text Alignment Buttons
  alignBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      alignBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.design.textAlign = btn.dataset.align;
      updatePreview();
      autoSaveDraft();
    });
  });

  // =========================================================================
  // TAB 3: Live Contrast Meter & Anti-drowning Text Shadow
  // =========================================================================
  function updateContrastMeter() {
    const bg = state.design.background || '#FAF4EB';
    const text = state.design.textColor || '#292524';
    const ratio = getContrastRatio(bg, text);
    const rounded = Math.round(ratio * 10) / 10;

    if (!contrastMeterBadge || !contrastText || !contrastIcon) return;

    contrastMeterBadge.className = 'contrast-badge';
    if (ratio >= 7.0) {
      contrastMeterBadge.classList.add('optimal');
      contrastIcon.textContent = '✓';
      contrastText.textContent = `WCAG AAA · Tương phản ${rounded}:1 (Rất sắc nét & Dễ đọc)`;
    } else if (ratio >= 4.5) {
      contrastMeterBadge.classList.add('optimal');
      contrastIcon.textContent = '✓';
      contrastText.textContent = `WCAG AA · Tương phản ${rounded}:1 (Đạt chuẩn)`;
    } else if (ratio >= 3.0) {
      contrastMeterBadge.classList.add('caution');
      contrastIcon.textContent = '⚠️';
      contrastText.textContent = `Tương phản ${rounded}:1 (Hơi mờ, nên tăng tương phản)`;
    } else {
      contrastMeterBadge.classList.add('warning');
      contrastIcon.textContent = '✕';
      contrastText.textContent = `CẢNH BÁO: Tương phản ${rounded}:1 (Chữ bị chìm, khó đọc!)`;
    }
  }

  // One-click Auto Contrast Button
  if (btnAutoContrast) {
    btnAutoContrast.addEventListener('click', () => {
      const bg = state.design.background || '#FAF4EB';
      state.design.textColor = ensureLegibleTextColor(bg, state.design.textColor);
      
      // If patterned or complex, add a soft or glow shadow
      if (state.design.pattern && state.design.pattern !== 'none' && state.design.textShadow === 'none') {
        state.design.textShadow = isColorDark(bg) ? 'glow' : 'soft';
      }

      syncTextColorSwatches(state.design.textColor);
      if (customTextColorInput) customTextColorInput.value = state.design.textColor;
      syncTextShadowButtons(state.design.textShadow);
      updatePreview();
      autoSaveDraft();
      app.showToast('Đã tự động tối ưu màu chữ và hiệu ứng tương phản cao nhất!');
    });
  }

  // Text Shadow Choice Buttons
  if (textShadowContainer) {
    const shadowBtns = textShadowContainer.querySelectorAll('button');
    shadowBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        shadowBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.design.textShadow = btn.dataset.shadow;
        updatePreview();
        autoSaveDraft();
      });
    });
  }

  function syncTextShadowButtons(shadow) {
    if (!textShadowContainer) return;
    textShadowContainer.querySelectorAll('button').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.shadow === (shadow || 'none'));
    });
  }

  // Text Color Swatches & Custom Input
  const textSwatches = document.querySelectorAll('.text-color-swatch');
  textSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      textSwatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      state.design.textColor = swatch.dataset.color;
      if (customTextColorInput) customTextColorInput.value = state.design.textColor;
      updatePreview();
      autoSaveDraft();
    });
  });

  if (customTextColorInput) {
    customTextColorInput.addEventListener('input', (e) => {
      state.design.textColor = e.target.value;
      syncTextColorSwatches(state.design.textColor);
      updatePreview();
      autoSaveDraft();
    });
  }

  // Background Swatches & Custom Input
  const colorSwatches = document.querySelectorAll('.color-swatch-btn:not(.text-color-swatch)');
  colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      colorSwatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      state.design.background = swatch.dataset.color;
      if (customBgColorInput) customBgColorInput.value = state.design.background;
      
      // Auto-adapt text color to prevent drowning
      state.design.textColor = ensureLegibleTextColor(state.design.background, state.design.textColor);
      syncTextColorSwatches(state.design.textColor);
      if (customTextColorInput) customTextColorInput.value = state.design.textColor;

      updatePreview();
      autoSaveDraft();
    });
  });

  if (customBgColorInput) {
    customBgColorInput.addEventListener('input', (e) => {
      state.design.background = e.target.value;
      state.design.textColor = ensureLegibleTextColor(state.design.background, state.design.textColor);
      syncTextColorSwatches(state.design.textColor);
      if (customTextColorInput) customTextColorInput.value = state.design.textColor;
      updatePreview();
      autoSaveDraft();
    });
  }

  // Pattern Selection
  if (patternChoices) {
    patternChoices.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-pattern]');
      if (!btn) return;
      state.design.pattern = btn.dataset.pattern;
      syncPatternChoices(state.design.pattern);
      updatePreview();
      autoSaveDraft();
    });
  }

  // =========================================================================
  // TAB 4: Emoji & Sticker Library
  // =========================================================================
  if (stickerPickerContainer) {
    initEmojiPicker(stickerPickerContainer, (emoji) => {
      stickerEditor.addSticker(emoji);
      app.showToast(`Đã thêm sticker ${emoji} lên thiệp.`);
    });
  }

  // Sticker Action Bar
  window.addEventListener('stickerSelectionChange', (e) => {
    const { selectedIndex } = e.detail;
    if (stickerControlBar) {
      if (selectedIndex >= 0) {
        stickerControlBar.classList.add('visible');
      } else {
        stickerControlBar.classList.remove('visible');
      }
    }
  });

  const btnScaleUp = document.getElementById('btn-sticker-scale-up');
  const btnScaleDown = document.getElementById('btn-sticker-scale-down');
  const btnRotateLeft = document.getElementById('btn-sticker-rotate-left');
  const btnRotateRight = document.getElementById('btn-sticker-rotate-right');
  const btnBringFront = document.getElementById('btn-sticker-front');
  const btnDeleteSticker = document.getElementById('btn-sticker-delete');

  if (btnScaleUp) btnScaleUp.addEventListener('click', () => stickerEditor.adjustScale(0.15));
  if (btnScaleDown) btnScaleDown.addEventListener('click', () => stickerEditor.adjustScale(-0.15));
  if (btnRotateLeft) btnRotateLeft.addEventListener('click', () => stickerEditor.adjustRotation(-15));
  if (btnRotateRight) btnRotateRight.addEventListener('click', () => stickerEditor.adjustRotation(15));
  if (btnBringFront) btnBringFront.addEventListener('click', () => stickerEditor.bringToFront());
  if (btnDeleteSticker) btnDeleteSticker.addEventListener('click', () => stickerEditor.deleteSelected());

  // Bind Tab Navigation in Studio
  const editorTabs = document.querySelectorAll('.editor-tab-btn');
  const editorContents = document.querySelectorAll('.editor-tab-content');

  editorTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      editorTabs.forEach(t => t.classList.remove('active'));
      editorContents.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      const targetId = tab.dataset.tabTarget;
      const targetContent = document.getElementById(targetId);
      if (targetContent) targetContent.classList.add('active');
    });
  });

  // Bind Textarea & Form Inputs
  contentTextarea.addEventListener('input', () => {
    state.content = contentTextarea.value;
    const len = state.content.length;
    charCounter.textContent = `${len}/${MAX_CONTENT_LENGTH}`;
    charCounter.classList.toggle('warning', len > MAX_CONTENT_LENGTH - 20);
    updatePreview();
    autoSaveDraft();
  });

  aliasInput.addEventListener('input', () => {
    state.alias = aliasInput.value;
    updatePreview();
    autoSaveDraft();
  });

  // Random Inspiration Prompt
  const promptBtn = document.getElementById('btn-inspiration-prompt');
  if (promptBtn) {
    const prompts = [
      'Điều gì bạn đã giữ kín trong lòng suốt nhiều năm qua mà chưa từng dám nói với ai?',
      'Một lời xin lỗi mà bạn đã nợ một người rất lâu rồi...',
      'Nếu có thể gửi một lá thư về quá khứ cho chính mình năm 18 tuổi, bạn sẽ nói gì?',
      'Một lời cảm ơn ấm áp bạn muốn gửi đến người đã thầm lặng giúp đỡ mình...',
      'Những lời chưa kịp nói trước khi hai người xa nhau mãi mãi...'
    ];
    promptBtn.addEventListener('click', () => {
      const p = prompts[Math.floor(Math.random() * prompts.length)];
      if (!contentTextarea.value.trim() || confirm('Thay thế gợi ý vào ô nhập lời nhắn?')) {
        contentTextarea.value = p;
        state.content = p;
        contentTextarea.dispatchEvent(new Event('input'));
      }
    });
  }

  // Reset Design
  const resetBtn = document.getElementById('btn-reset-design');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Bạn có chắc muốn đặt lại thiết kế về mặc định không?')) {
        applyTemplate(defaultTemplate);
        state.content = '';
        contentTextarea.value = '';
        charCounter.textContent = `0/${MAX_CONTENT_LENGTH}`;
        updatePreview();
        clearDraft();
        app.showToast('Đã đặt lại thiết kế.');
      }
    });
  }

  // Export PNG
  const exportPngBtn = document.getElementById('btn-export-png');
  if (exportPngBtn) {
    exportPngBtn.addEventListener('click', () => {
      if (!state.content.trim()) {
        app.showToast('Vui lòng viết nội dung trước khi xuất ảnh thiệp.');
        return;
      }
      exportCardAsPng({
        id: 'draft-card',
        content: state.content,
        categoryName: state.categoryName,
        emotion: state.emotion,
        alias: state.alias || 'Một người lạ',
        createdAt: new Date().toISOString(),
        getFormattedDate: () => new Date().toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }),
        design: state.design
      });
    });
  }

  // Export Config (JSON / XML) Modal
  const exportConfigBtn = document.getElementById('btn-export-config');
  if (exportConfigBtn) {
    exportConfigBtn.addEventListener('click', () => {
      showExportConfigModal();
    });
  }

  // Submit Message
  const submitBtn = document.getElementById('btn-submit-message');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      handleSubmitMessage();
    });
  }

  function applyTemplate(tmpl) {
    state.design.template = tmpl.id;
    state.design.background = tmpl.background;
    state.design.textColor = tmpl.textColor;
    state.design.font = tmpl.font || 'cormorant';
    state.design.pattern = tmpl.pattern || 'none';
    state.design.textAlign = tmpl.layout === 'centered' ? 'center' : 'left';

    if (customBgColorInput) customBgColorInput.value = tmpl.background;
    if (customTextColorInput) customTextColorInput.value = tmpl.textColor;
    syncPatternChoices(state.design.pattern);

    syncTextColorSwatches(state.design.textColor);

    if (tmpl.recommendedStickers && tmpl.recommendedStickers.length > 0) {
      state.design.stickers = [
        { emoji: tmpl.recommendedStickers[0], x: 80, y: 18, scale: 1.1, rotation: 10 }
      ];
      stickerEditor.loadStickers(state.design.stickers);
    }

    // Update active highlight in template list
    if (templateOptionsContainer) {
      templateOptionsContainer.querySelectorAll('.template-card-option').forEach(el => {
        el.classList.toggle('active', el.dataset.templateId === tmpl.id);
      });
    }

    // Sync font list active state
    if (fontGalleryList) {
      fontGalleryList.querySelectorAll('.font-item-card').forEach(el => {
        el.classList.toggle('active', el.dataset.fontId === state.design.font);
      });
    }

    updatePreview();
    autoSaveDraft();
    app.showToast(`Đã áp dụng mẫu "${tmpl.name}".`);
  }

  function syncTextColorSwatches(color) {
    const textSwatches = document.querySelectorAll('.text-color-swatch');
    textSwatches.forEach(s => {
      s.classList.toggle('active', s.dataset.color.toLowerCase() === (color || '').toLowerCase());
    });
  }

  function updatePreview() {
    const bg = state.design.background || '#FAF4EB';
    const isDark = isColorDark(bg);

    // 1. Template CSS class & dark card marker
    previewCard.className = `stationery-card template-${state.design.template || 'tmpl-pastel-01'}` + (isDark ? ' is-dark-card' : '');
    
    // 2. Inline styles
    previewCard.style.background = bg;
    previewCard.style.color = state.design.textColor;

    // 3. Patterns
    if (state.design.pattern && state.design.pattern !== 'none') {
      previewCard.classList.add(`pattern-${state.design.pattern}`);
    }

    // 4. Content & Safe Text
    setTextSafe(previewBody, state.content || 'Hãy viết những điều bạn chưa kịp nói vào đây...');
    previewBody.style.color = state.design.textColor;
    if (previewAlias) {
      previewAlias.style.color = state.design.textColor;
    }
    if (!state.content) {
      previewBody.style.opacity = '0.7';
    } else {
      previewBody.style.opacity = '1';
    }

    // 5. Font resolution from Library
    let resolvedFamily = 'var(--font-serif)';
    if (state.design.font) {
      if (state.design.font === 'handwriting') {
        resolvedFamily = 'var(--font-handwriting)';
      } else if (state.design.font === 'sans') {
        resolvedFamily = 'var(--font-sans)';
      } else if (state.design.font === 'mono') {
        resolvedFamily = 'var(--font-mono)';
      } else if (state.design.font === 'serif') {
        resolvedFamily = 'var(--font-serif)';
      } else {
        const fObj = getFontById(state.design.font);
        if (fObj && fObj.family) {
          resolvedFamily = fObj.family;
        }
      }
    }
    previewBody.style.fontFamily = resolvedFamily;
    previewBody.style.fontSize = `${state.design.fontSize || 18}px`;
    previewBody.style.lineHeight = String(state.design.lineHeight || 1.6);
    previewBody.style.letterSpacing = `${state.design.letterSpacing || 0}px`;
    previewBody.style.textAlign = state.design.textAlign || 'left';

    // 6. Text Shadow / Anti-drowning
    if (state.design.textShadow && state.design.textShadow !== 'none') {
      const ts = state.design.textShadow;
      if (ts === 'soft') {
        previewBody.style.textShadow = '0 1px 3px rgba(0,0,0,0.35)';
      } else if (ts === 'glow') {
        previewBody.style.textShadow = '0 0 8px rgba(255,255,255,0.85), 0 0 16px rgba(254, 240, 138, 0.5)';
      } else if (ts === 'outline') {
        previewBody.style.textShadow = '-1px -1px 0 rgba(0,0,0,0.5), 1px -1px 0 rgba(0,0,0,0.5), -1px 1px 0 rgba(0,0,0,0.5), 1px 1px 0 rgba(0,0,0,0.5)';
      } else if (ts === 'deep') {
        previewBody.style.textShadow = '2px 2px 4px rgba(0,0,0,0.6)';
      } else {
        previewBody.style.textShadow = ts;
      }
    } else {
      previewBody.style.textShadow = 'none';
    }

    // 7. Metadata
    setTextSafe(previewCategory, state.categoryName);
    setTextSafe(previewDate, new Date().toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }));
    setTextSafe(previewAlias, `— ${state.alias.trim() || 'Một người lạ'}`);
    if (previewEmotion) previewEmotion.textContent = state.emotion;

    // 8. Re-evaluate live contrast
    updateContrastMeter();
  }

  let autoSaveTimeout = null;
  function autoSaveDraft() {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(() => {
      saveDraft(state);
    }, 1000);
  }

  function showExportConfigModal() {
    const xmlConfig = serializeMessagesToXml([{
      id: 'custom-card-config',
      content: state.content || '(Lời nhắn)',
      category: state.category,
      categoryName: state.categoryName,
      emotion: state.emotion,
      alias: state.alias || 'Một người lạ',
      createdAt: new Date().toISOString(),
      status: 'draft',
      design: state.design
    }]);

    const jsonConfig = JSON.stringify(state, null, 2);

    let modal = document.getElementById('config-export-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'config-export-modal';
      modal.className = 'modal-backdrop';
      modal.innerHTML = `
        <div class="modal-dialog" style="max-width: 640px;">
          <div class="modal-header">
            <h3 style="font-size: 1.15rem; font-weight: 600;">Xuất cấu hình thiết kế (XML / JSON)</h3>
            <button type="button" class="icon-btn" id="config-modal-close" aria-label="Đóng">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          <div class="modal-body">
            <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
              <button type="button" class="btn btn-secondary btn-sm active" id="config-tab-xml">Định dạng XML</button>
              <button type="button" class="btn btn-secondary btn-sm" id="config-tab-json">Định dạng JSON</button>
            </div>
            <textarea id="config-code-view" class="form-textarea" style="font-family: var(--font-mono); font-size: 0.8125rem; height: 260px;" readonly></textarea>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary btn-sm" id="config-copy-btn">Sao chép</button>
            <button type="button" class="btn btn-primary btn-sm" id="config-download-btn">Tải file về máy</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      const close = () => {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      };
      modal.querySelector('#config-modal-close').addEventListener('click', close);
      modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
    }

    const codeView = modal.querySelector('#config-code-view');
    let currentFormat = 'xml';
    codeView.value = xmlConfig;

    const tabXml = modal.querySelector('#config-tab-xml');
    const tabJson = modal.querySelector('#config-tab-json');

    tabXml.onclick = () => {
      currentFormat = 'xml';
      tabXml.classList.add('active');
      tabJson.classList.remove('active');
      codeView.value = xmlConfig;
    };

    tabJson.onclick = () => {
      currentFormat = 'json';
      tabJson.classList.add('active');
      tabXml.classList.remove('active');
      codeView.value = jsonConfig;
    };

    modal.querySelector('#config-copy-btn').onclick = () => {
      navigator.clipboard.writeText(codeView.value)
        .then(() => app.showToast('Đã sao chép cấu hình vào clipboard.'));
    };

    modal.querySelector('#config-download-btn').onclick = () => {
      const blob = new Blob([codeView.value], { type: currentFormat === 'xml' ? 'text/xml' : 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `unspoken-card-config.${currentFormat}`;
      a.click();
      app.showToast(`Đã tải file .${currentFormat} về máy.`);
    };

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function handleSubmitMessage() {
    if (!state.content.trim()) {
      app.showToast('Vui lòng viết nội dung lời nhắn trước khi gửi.');
      contentTextarea.focus();
      return;
    }

    if (state.content.length > MAX_CONTENT_LENGTH) {
      app.showToast(`Lời nhắn dài quá giới hạn ${MAX_CONTENT_LENGTH} ký tự.`);
      return;
    }

    let submitModal = document.getElementById('submit-confirm-modal');
    if (!submitModal) {
      submitModal = document.createElement('div');
      submitModal.id = 'submit-confirm-modal';
      submitModal.className = 'modal-backdrop';
      submitModal.innerHTML = `
        <div class="modal-dialog" style="max-width: 520px;">
          <div class="modal-header">
            <h3 style="font-size: 1.15rem; font-weight: 600;">Gửi lời nhắn của bạn</h3>
            <button type="button" class="icon-btn" id="submit-modal-close" aria-label="Đóng">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          <div class="modal-body">
            <div style="background-color: var(--color-cream); border-left: 3px solid var(--color-dusty-rose); padding: 1rem; border-radius: var(--radius-xs); margin-bottom: 1.25rem;">
              <p style="font-size: 0.875rem; color: var(--color-antique-ink); line-height: 1.6;">
                <strong>Lưu ý về cơ chế lưu trữ:</strong> Trong phiên bản kiến trúc hiện tại (Client-side &amp; XML thuần), lời nhắn của bạn được <strong>lưu trữ cục bộ an toàn trong trình duyệt (localStorage)</strong> của bạn và hòa vào dòng tin của trang "Đọc lời nhắn".
              </p>
              <p style="font-size: 0.8125rem; color: var(--color-ink-subtle); margin-top: 0.5rem; line-height: 1.5;">
                Để phát tán lời nhắn lên máy chủ công khai toàn cầu cho người lạ khác cùng đọc, hệ thống sẽ cần một API backend ghi dữ liệu XML chung.
              </p>
            </div>
            <p style="font-size: 0.9375rem; color: var(--color-ink-muted);">
              Bạn đã sẵn sàng để những lời này được nói ra chưa?
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary btn-sm" id="submit-cancel-btn">Xem lại</button>
            <button type="button" class="btn btn-primary btn-sm" id="submit-confirm-btn">Xác nhận gửi</button>
          </div>
        </div>
      `;
      document.body.appendChild(submitModal);

      const close = () => {
        submitModal.classList.remove('open');
        document.body.style.overflow = '';
      };
      submitModal.querySelector('#submit-modal-close').addEventListener('click', close);
      submitModal.querySelector('#submit-cancel-btn').addEventListener('click', close);
      submitModal.addEventListener('click', (e) => { if (e.target === submitModal) close(); });
    }

    submitModal.querySelector('#submit-confirm-btn').onclick = () => {
      const result = messageRepository.createMessage({
        content: state.content,
        category: state.category,
        categoryName: state.categoryName,
        emotion: state.emotion,
        alias: state.alias || 'Một người lạ',
        design: state.design
      });

      submitModal.classList.remove('open');
      document.body.style.overflow = '';

      if (result.success) {
        clearDraft();
        app.showToast('Lời nhắn đã được lưu thành công! Bạn có thể xem lại tại trang Đọc lời nhắn.');
        setTimeout(() => {
          window.location.href = 'read.html?filter=local';
        }, 1200);
      } else {
        app.showToast(result.errors[0] || 'Lỗi khi gửi lời nhắn.');
      }
    };

    submitModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  // Initialize Tab 2 and Tab 3 dynamic UI
  renderTemplateCategories();
  renderTemplateList();
  renderFontCategories();
  renderFontList();

  // Initial Preview render & sticker loading
  updatePreview();
  stickerEditor.loadStickers(state.design.stickers);
});
