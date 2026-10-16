/**
 * Page Script: Home (Trang chủ)
 * "Gửi một lời — Những lời chưa nói"
 */

import { messageRepository } from '../data/message-repository.js';
import { renderCardDOM } from '../components/card-renderer.js';
import { TEMPLATES } from '../components/template-gallery.js';
import { isColorDark, ensureLegibleTextColor } from '../utils/color-utils.js';
import { app } from '../app.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize repository
  const messages = await messageRepository.init();

  // 1. Hero Random Read CTA Button
  const heroRandomBtn = document.getElementById('hero-random-btn');
  if (heroRandomBtn) {
    heroRandomBtn.addEventListener('click', () => {
      const randomMsg = messageRepository.getRandomMessage();
      if (randomMsg) {
        app.openReaderModal(randomMsg);
      }
    });
  }

  // 2. Interactive Envelope: "Lời nhắn dành cho bạn hôm nay"
  const envelope = document.getElementById('daily-envelope');
  const openPrompt = document.getElementById('envelope-open-prompt');
  const letterSheet = document.getElementById('envelope-letter-content');

  if (envelope && openPrompt && letterSheet) {
    // Pick an inspiring daily message
    const dailyMsg = messageRepository.getRandomMessage();

    envelope.addEventListener('click', () => {
      if (!envelope.classList.contains('opened')) {
        envelope.classList.add('opened');
        openPrompt.style.display = 'none';

        if (dailyMsg) {
          const bg = dailyMsg.design.background || '#FAF4EB';
          const isDark = isColorDark(bg);
          const textColor = ensureLegibleTextColor(bg, dailyMsg.design.textColor || (isDark ? '#F4E8CE' : '#2E231C'));

          letterSheet.style.background = bg;
          letterSheet.style.color = textColor;
          letterSheet.className = `template-${dailyMsg.design.template || 'letter-vintage'}` + (isDark ? ' is-dark-card' : '');

          letterSheet.innerHTML = `
            <div style="padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between; height: 100%; text-align: ${dailyMsg.design.textAlign || 'left'}; color: ${textColor};">
              <div>
                <div class="unboxed-meta" style="margin-bottom: 0.75rem; color: ${textColor}; opacity: 0.85;">
                  <span style="font-weight: 600;">${dailyMsg.categoryName}</span>
                  <span class="meta-separator" style="color: ${textColor}; opacity: 0.5;">·</span>
                  <span>${dailyMsg.emotion}</span>
                </div>
                <p style="font-family: var(--font-serif); font-size: 1.18rem; line-height: 1.8; color: ${textColor}; font-weight: 500; font-style: italic;">
                  "${dailyMsg.content}"
                </p>
              </div>
              <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid ${isDark ? 'rgba(244, 232, 206, 0.2)' : 'rgba(0,0,0,0.08)'}; padding-top: 0.75rem; margin-top: 1rem;">
                <span style="font-size: 0.875rem; color: ${textColor}; opacity: 0.85; font-style: italic;">— ${dailyMsg.alias || 'Một người lạ'}</span>
                <button type="button" class="btn btn-secondary btn-sm" id="daily-read-full-btn" style="${isDark ? 'background: rgba(255,255,255,0.15); color: #F4E8CE; border-color: rgba(244,232,206,0.3);' : ''}">Đọc chi tiết</button>
              </div>
            </div>
          `;

          const readFullBtn = letterSheet.querySelector('#daily-read-full-btn');
          if (readFullBtn) {
            readFullBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              app.openReaderModal(dailyMsg);
            });
          }
        }
      }
    });
  }

  // 3. Render Latest Messages (4 cards)
  const latestGrid = document.getElementById('latest-messages-grid');
  if (latestGrid) {
    const recent = messages.slice(0, 4);
    latestGrid.innerHTML = '';
    recent.forEach(msg => {
      const cardEl = renderCardDOM(msg, {
        isInteractive: true,
        onOpenReader: (m) => app.openReaderModal(m)
      });
      latestGrid.appendChild(cardEl);
    });
  }

  // 4. Render Template Showcase
  const templateShowcase = document.getElementById('template-showcase-grid');
  if (templateShowcase) {
    templateShowcase.innerHTML = '';
    TEMPLATES.slice(0, 6).forEach(tmpl => {
      const card = document.createElement('div');
      card.className = `template-card-option`;
      card.style.height = '180px';
      card.style.display = 'flex';
      card.style.flexDirection = 'column';
      card.style.justifyContent = 'space-between';
      card.style.padding = '1.25rem';
      card.style.borderRadius = 'var(--radius-md)';
      card.style.boxShadow = 'var(--shadow-card)';
      card.style.position = 'relative';
      card.style.backgroundColor = tmpl.background;
      card.style.color = tmpl.textColor;
      if (tmpl.border) card.style.border = tmpl.border;

      card.innerHTML = `
        <div>
          <div style="font-family: var(--font-serif); font-size: 1.15rem; font-weight: 600; margin-bottom: 0.35rem;">
            ${tmpl.name}
          </div>
          <p style="font-size: 0.8125rem; opacity: 0.85; line-height: 1.4;">
            ${tmpl.description}
          </p>
        </div>
        <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(0,0,0,0.08); padding-top: 0.75rem;">
          <span style="font-size: 1.1rem;">${tmpl.recommendedStickers.join(' ')}</span>
          <a href="write.html?template=${tmpl.id}" class="btn btn-secondary btn-sm" style="font-size: 0.75rem; padding: 0.3rem 0.65rem;">
            Viết mẫu này
          </a>
        </div>
      `;
      templateShowcase.appendChild(card);
    });
  }
});
