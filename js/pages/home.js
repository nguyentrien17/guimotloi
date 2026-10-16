/**
 * Page Script: Home (Trang chủ)
 * "Gửi một lời — Những lời chưa nói"
 */

import { messageRepository } from '../data/message-repository.js';
import { renderCardDOM } from '../components/card-renderer.js';
import { TEMPLATES } from '../components/template-gallery.js';
import { app } from '../app.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize repository
  const messages = await messageRepository.init();

  // Random picks shown without context (hero CTA, daily envelope) should read
  // as "a message for you" — skip letters addressed to a specific named
  // relation (mẹ/bố/bà...), which feel out of place under that framing.
  const RANDOM_SAFE_EXCLUDE = { excludeCategories: ['family'] };

  // 1. Hero Random Read CTA Button
  const heroRandomBtn = document.getElementById('hero-random-btn');
  if (heroRandomBtn) {
    heroRandomBtn.addEventListener('click', () => {
      const randomMsg = messageRepository.getRandomMessage(null, RANDOM_SAFE_EXCLUDE);
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
    const dailyMsg = messageRepository.getRandomMessage(null, RANDOM_SAFE_EXCLUDE);

    envelope.addEventListener('click', () => {
      if (!envelope.classList.contains('opened')) {
        envelope.classList.add('opened');
        openPrompt.style.display = 'none';

        if (dailyMsg) {
          // Reuse the same polished card component used everywhere else on the
          // site (pattern texture, stickers, typography, quick actions) instead
          // of a hand-rolled, visually flat inline template.
          // The letter sheet starts as `position: absolute; inset: 0` so it sits
          // exactly behind the closed envelope's flap/seal. Once opened, take it
          // out of that fixed box and into normal flow so its real content height
          // (which varies by message length) can push .envelope-card taller via
          // its own `.opened { height: auto }` rule, instead of being clipped.
          letterSheet.style.position = 'relative';
          letterSheet.style.inset = 'auto';
          letterSheet.style.background = 'transparent';
          letterSheet.innerHTML = '';

          const cardEl = renderCardDOM(dailyMsg, {
            isInteractive: true,
            onOpenReader: (m) => app.openReaderModal(m)
          });
          cardEl.classList.add('envelope-letter-reveal');
          cardEl.style.boxShadow = 'none';
          cardEl.style.border = 'none';

          letterSheet.appendChild(cardEl);
        }
      }
    });
  }

  // 3. Render Latest Messages (4 cards)
  const latestGrid = document.getElementById('latest-messages-grid');
  if (latestGrid) {
    const recent = [...messages]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 4);
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
    // Each template declares its own `font` (serif/handwriting/sans/mono); preview
    // the name in that actual font so the showcase itself reads as varied/typographic.
    const FONT_VAR_BY_KEY = {
      serif: 'var(--font-serif)',
      handwriting: 'var(--font-handwriting)',
      sans: 'var(--font-sans)',
      mono: 'var(--font-mono)'
    };

    templateShowcase.innerHTML = '';
    TEMPLATES.slice(0, 6).forEach(tmpl => {
      const nameFont = FONT_VAR_BY_KEY[tmpl.font] || 'var(--font-serif)';
      const blurb = (Array.isArray(tmpl.tags) ? tmpl.tags.slice(0, 3).join(' · ') : '') || tmpl.categoryName || '';

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
          <div style="font-family: ${nameFont}; font-size: 1.2rem; font-weight: 600; margin-bottom: 0.35rem;">
            ${tmpl.name}
          </div>
          <p style="font-family: var(--font-accent); font-size: 0.6875rem; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; opacity: 0.7; line-height: 1.4;">
            ${blurb}
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
