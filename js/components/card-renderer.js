/**
 * Card Renderer & Canvas PNG Exporter
 * "Gửi một lời — Những lời chưa nói"
 * Provides safe DOM card creation and client-side PNG export via HTML5 Canvas.
 */

import { setTextSafe } from '../utils/validation.js';
import { isFavorite, toggleFavorite } from '../utils/storage.js';
import { isColorDark, ensureLegibleTextColor } from '../utils/color-utils.js';
import { getFontById } from './font-library.js';

/**
 * Creates a DOM element for a stationery card
 * @param {import('../data/message-model.js').MessageModel} message 
 * @param {Object} options 
 * @returns {HTMLElement}
 */
export function renderCardDOM(message, { isInteractive = true, onOpenReader = null } = {}) {
  const card = document.createElement('article');
  card.className = `stationery-card template-${message.design.template || 'letter-vintage'}`;
  card.dataset.id = message.id;

  const bg = message.design.background || '#FAF4EB';
  const isDark = isColorDark(bg);
  if (isDark) {
    card.classList.add('is-dark-card');
  }

  // Ensure high contrast legible text
  const safeTextColor = ensureLegibleTextColor(bg, message.design.textColor || (isDark ? '#F4E8CE' : '#1C1917'));

  card.style.background = bg;
  card.style.color = safeTextColor;

  if (message.design.pattern && message.design.pattern !== 'none') {
    card.classList.add(`pattern-${message.design.pattern}`);
  }

  // Card Inner
  const inner = document.createElement('div');
  inner.className = 'stationery-card-inner';

  // 1. Header Row
  const headerRow = document.createElement('div');
  headerRow.className = 'card-header-row';

  const metaGroup = document.createElement('div');
  metaGroup.className = 'unboxed-meta';

  const catSpan = document.createElement('span');
  catSpan.className = 'card-meta-category';
  setTextSafe(catSpan, message.categoryName);

  const dot = document.createElement('span');
  dot.className = 'meta-separator';
  dot.setAttribute('aria-hidden', 'true');
  dot.textContent = '·';

  const dateSpan = document.createElement('span');
  dateSpan.className = 'card-meta-date';
  setTextSafe(dateSpan, message.getFormattedDate());

  metaGroup.appendChild(catSpan);
  metaGroup.appendChild(dot);
  metaGroup.appendChild(dateSpan);

  if (message.isLocal) {
    const dot2 = document.createElement('span');
    dot2.className = 'meta-separator';
    dot2.setAttribute('aria-hidden', 'true');
    dot2.textContent = '·';
    
    const localTag = document.createElement('span');
    localTag.style.color = 'var(--color-dusty-rose)';
    localTag.style.fontWeight = '500';
    setTextSafe(localTag, 'Của bạn (Cục bộ)');

    metaGroup.appendChild(dot2);
    metaGroup.appendChild(localTag);
  }

  const emotionIndicator = document.createElement('div');
  emotionIndicator.className = 'card-emotion-indicator';
  emotionIndicator.textContent = message.emotion || '💌';

  headerRow.appendChild(metaGroup);
  headerRow.appendChild(emotionIndicator);

  // 2. Content Area
  const contentArea = document.createElement('div');
  contentArea.className = 'card-content-area';

  const bodyText = document.createElement('p');
  bodyText.className = 'card-body-text';
  setTextSafe(bodyText, message.content);
  bodyText.style.color = safeTextColor;

  // Dynamic Font resolution from library or standard presets
  let resolvedFamily = 'var(--font-serif)';
  if (message.design.font) {
    if (message.design.font === 'handwriting') {
      resolvedFamily = 'var(--font-handwriting)';
    } else if (message.design.font === 'sans') {
      resolvedFamily = 'var(--font-sans)';
    } else if (message.design.font === 'mono') {
      resolvedFamily = 'var(--font-mono)';
    } else if (message.design.font === 'serif') {
      resolvedFamily = 'var(--font-serif)';
    } else {
      const fObj = getFontById(message.design.font);
      if (fObj && fObj.family) {
        resolvedFamily = fObj.family;
      }
    }
  }
  bodyText.style.fontFamily = resolvedFamily;

  if (message.design.fontSize) {
    bodyText.style.fontSize = `${message.design.fontSize}px`;
  }
  if (message.design.lineHeight) {
    bodyText.style.lineHeight = String(message.design.lineHeight);
  }
  if (message.design.letterSpacing) {
    bodyText.style.letterSpacing = `${message.design.letterSpacing}px`;
  }

  // Text Shadow / Anti-drowning effects
  if (message.design.textShadow && message.design.textShadow !== 'none') {
    const ts = message.design.textShadow;
    if (ts === 'soft') {
      bodyText.style.textShadow = '0 1px 3px rgba(0,0,0,0.35)';
    } else if (ts === 'glow') {
      bodyText.style.textShadow = '0 0 8px rgba(255,255,255,0.85), 0 0 16px rgba(254, 240, 138, 0.5)';
    } else if (ts === 'outline') {
      bodyText.style.textShadow = '-1px -1px 0 rgba(0,0,0,0.5), 1px -1px 0 rgba(0,0,0,0.5), -1px 1px 0 rgba(0,0,0,0.5), 1px 1px 0 rgba(0,0,0,0.5)';
    } else if (ts === 'deep') {
      bodyText.style.textShadow = '2px 2px 4px rgba(0,0,0,0.6)';
    } else {
      bodyText.style.textShadow = ts;
    }
  }

  if (message.design.textAlign) {
    bodyText.style.textAlign = message.design.textAlign;
  }

  contentArea.appendChild(bodyText);

  // 3. Footer Row
  const footerRow = document.createElement('div');
  footerRow.className = 'card-footer-row';

  const aliasSpan = document.createElement('span');
  aliasSpan.className = 'card-author-alias';
  setTextSafe(aliasSpan, `— ${message.alias || 'Một người lạ'}`);
  aliasSpan.style.color = safeTextColor;

  const quickActions = document.createElement('div');
  quickActions.className = 'card-actions-quick';

  // Bookmark button
  const favBtn = document.createElement('button');
  favBtn.className = 'card-quick-btn fav-toggle-btn';
  favBtn.setAttribute('type', 'button');
  favBtn.setAttribute('aria-label', 'Lưu vào yêu thích');
  const bookmarked = isFavorite(message.id);
  favBtn.innerHTML = bookmarked 
    ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="#C98F9D" stroke="#C98F9D" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>`
    : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>`;

  favBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isNow = toggleFavorite(message.id);
    favBtn.innerHTML = isNow
      ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="#C98F9D" stroke="#C98F9D" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>`
      : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>`;
    
    window.dispatchEvent(new CustomEvent('toastMessage', {
      detail: { text: isNow ? 'Đã lưu vào danh sách yêu thích.' : 'Đã bỏ lưu khỏi yêu thích.' }
    }));
    window.dispatchEvent(new CustomEvent('favoriteChanged', { detail: { id: message.id, isFavorite: isNow } }));
  });

  // Export card image button
  const exportBtn = document.createElement('button');
  exportBtn.className = 'card-quick-btn export-card-btn';
  exportBtn.setAttribute('type', 'button');
  exportBtn.setAttribute('aria-label', 'Tải ảnh thiệp PNG');
  exportBtn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`;

  exportBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    exportCardAsPng(message);
  });

  quickActions.appendChild(favBtn);
  quickActions.appendChild(exportBtn);

  footerRow.appendChild(aliasSpan);
  footerRow.appendChild(quickActions);

  inner.appendChild(headerRow);
  inner.appendChild(contentArea);
  inner.appendChild(footerRow);

  // 4. Stickers layer
  const stickersLayer = document.createElement('div');
  stickersLayer.className = 'sticker-container-layer is-static';
  if (Array.isArray(message.design.stickers)) {
    message.design.stickers.forEach((stk, idx) => {
      const sEl = document.createElement('div');
      sEl.className = 'interactive-sticker';
      sEl.style.pointerEvents = 'none';
      sEl.textContent = stk.emoji;
      // The header row always renders its own emotion icon in the top-right
      // corner; nudge any decorative sticker placed in that same reserved
      // zone further down so it doesn't visually double up with it.
      const inHeaderZone = stk.x >= 65 && stk.y <= 28;
      const safeY = inHeaderZone ? Math.min(stk.y + 22, 92) : stk.y;
      sEl.style.left = `${stk.x}%`;
      sEl.style.top = `${safeY}%`;
      // Fixed px, tuned against the canonical 580px design canvas below —
      // the whole canvas (text + stickers together) is scaled as one rigid
      // unit at render time, so this never needs to vary by screen size.
      sEl.style.fontSize = `${26 * (stk.scale || 1)}px`;
      sEl.style.transform = `translate(-50%, -50%) rotate(${stk.rotation || 0}deg)`;
      sEl.style.zIndex = idx + 1;
      stickersLayer.appendChild(sEl);
    });
  }

  // The card is designed once at a fixed canonical size (580×386.67px, a
  // 3:2 canvas) and this whole canvas — text wrapping, sticker positions,
  // spacing, everything — is scaled down/up as a single rigid unit to fit
  // whatever width the card actually renders at. This guarantees the layout
  // never "re-flows" differently between desktop and mobile; only the scale
  // changes, exactly like viewing a fixed-size image at different sizes.
  const canvas = document.createElement('div');
  canvas.className = 'stationery-card-canvas';
  canvas.appendChild(inner);
  canvas.appendChild(stickersLayer);

  card.appendChild(canvas);

  // Click to open focus reader if allowed
  if (isInteractive && typeof onOpenReader === 'function') {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      onOpenReader(message);
    });
  }

  return card;
}

/**
 * Client-Side PNG Card Exporter using HTML5 Canvas
 * Renders high-fidelity card graphic at 1200x800 resolution
 * @param {import('../data/message-model.js').MessageModel} message 
 */
export function exportCardAsPng(message) {
  const canvas = document.createElement('canvas');
  const width = 1200;
  const height = 800;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    alert('Trình duyệt không hỗ trợ Canvas.');
    return;
  }

  const bg = message.design.background || '#FAF4EB';
  const isDark = isColorDark(bg);
  const textColor = ensureLegibleTextColor(bg, message.design.textColor || (isDark ? '#F4E8CE' : '#292524'));

  // Background
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // Border frame
  ctx.strokeStyle = isDark ? 'rgba(244, 232, 206, 0.22)' : 'rgba(46, 35, 28, 0.15)';
  ctx.lineWidth = 4;
  ctx.strokeRect(32, 32, width - 64, height - 64);

  // Inner hairline
  ctx.strokeStyle = isDark ? 'rgba(244, 232, 206, 0.12)' : 'rgba(46, 35, 28, 0.08)';
  ctx.lineWidth = 1;
  ctx.strokeRect(48, 48, width - 96, height - 96);

  // Header metadata
  ctx.font = '500 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = textColor;
  ctx.globalAlpha = 0.85;
  const headerMeta = `${message.categoryName || 'Tâm tình'} · ${message.getFormattedDate()}`;
  ctx.fillText(headerMeta, 80, 110);

  // Emotion icon
  ctx.font = '48px serif';
  ctx.globalAlpha = 1.0;
  ctx.fillText(message.emotion || '💌', width - 140, 115);

  // Stickers on canvas
  if (Array.isArray(message.design.stickers)) {
    message.design.stickers.forEach(stk => {
      const px = (stk.x / 100) * width;
      const py = (stk.y / 100) * height;
      const size = Math.round(56 * (stk.scale || 1));

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(((stk.rotation || 0) * Math.PI) / 180);
      ctx.font = `${size}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(stk.emoji, 0, 0);
      ctx.restore();
    });
  }

  // Body content text wrapping
  const fontChoice = message.design.font || 'serif';
  let fontFamily = '"Cormorant Garamond", Georgia, serif';
  let baseFontSize = message.design.fontSize ? Math.round(message.design.fontSize * 1.8) : 38;
  let lineHeight = message.design.lineHeight ? Math.round(baseFontSize * message.design.lineHeight) : 62;

  if (fontChoice === 'handwriting') {
    fontFamily = '"Dancing Script", cursive';
  } else if (fontChoice === 'sans') {
    fontFamily = '"Plus Jakarta Sans", sans-serif';
  } else if (fontChoice === 'mono') {
    fontFamily = '"JetBrains Mono", monospace';
  } else if (fontChoice === 'serif') {
    fontFamily = '"Cormorant Garamond", serif';
  } else {
    const fObj = getFontById(fontChoice);
    if (fObj && fObj.family) {
      fontFamily = fObj.family;
    }
  }

  // Configure text shadow on canvas for contrast protection
  if (message.design.textShadow && message.design.textShadow !== 'none') {
    if (message.design.textShadow === 'soft') {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 3;
    } else if (message.design.textShadow === 'glow') {
      ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
      ctx.shadowBlur = 14;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    } else if (message.design.textShadow === 'outline' || message.design.textShadow === 'deep') {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
    }
  } else {
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
  }

  ctx.font = `${baseFontSize}px ${fontFamily}`;
  ctx.fillStyle = textColor;
  ctx.globalAlpha = 0.98;

  const maxWidth = width - 240;
  const lines = wrapText(ctx, message.content, maxWidth);
  
  // Calculate vertical center
  const totalTextHeight = lines.length * lineHeight;
  let startY = Math.max(220, (height - totalTextHeight) / 2);

  lines.forEach((line, idx) => {
    let textX = 100;
    if (message.design.textAlign === 'center') {
      textX = width / 2;
      ctx.textAlign = 'center';
    } else if (message.design.textAlign === 'right') {
      textX = width - 100;
      ctx.textAlign = 'right';
    } else {
      ctx.textAlign = 'left';
    }
    ctx.fillText(line, textX, startY + (idx * lineHeight));
  });

  // Footer: Author & Brand watermark
  ctx.textAlign = 'left';
  ctx.font = 'italic 26px "Cormorant Garamond", serif';
  ctx.fillStyle = textColor;
  ctx.globalAlpha = 0.85;
  ctx.fillText(`— ${message.alias || 'Một người lạ'}`, 100, height - 100);

  ctx.textAlign = 'right';
  ctx.font = '18px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = textColor;
  ctx.globalAlpha = 0.65;
  ctx.fillText('Gửi một lời — Những lời chưa nói', width - 100, height - 100);

  // Trigger download
  const link = document.createElement('a');
  link.download = `unspoken-card-${message.id}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();

  window.dispatchEvent(new CustomEvent('toastMessage', {
    detail: { text: 'Đã xuất thiệp thành ảnh PNG chất lượng cao.' }
  }));
}

/**
 * Text wrapper for Canvas
 */
function wrapText(ctx, text, maxWidth) {
  const words = text.split(/\s+/);
  const lines = [];
  let currentLine = words[0] || '';

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + ' ' + word).width;
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}
