/**
 * Page Script: Explore Emotional Realms (Trang khám phá theo chủ đề cảm xúc)
 * "Gửi một lời — Những lời chưa nói"
 */

import { messageRepository } from '../data/message-repository.js';
import { renderCardDOM } from '../components/card-renderer.js';
import { app } from '../app.js';

export const REALMS = [
  {
    id: 'realm-unsaid',
    title: 'Những lời chưa kịp nói',
    subtitle: 'Khi một khoảnh khắc trôi qua và ta nhận ra mình đã nợ một câu nói suốt đời.',
    category: 'unsaid',
    emotion: '🌙',
    quote: 'Có những cuộc gặp gỡ cuối cùng mà cả hai người đều không hề hay biết đó là lần sau chót.',
    template: 'night-sky',
    color: '#182035'
  },
  {
    id: 'realm-past-love',
    title: 'Gửi người từng thương',
    subtitle: 'Gửi về những chiều thu đã cũ, nơi hai người từng là cả thế giới của nhau.',
    category: 'love',
    emotion: '🌧️',
    quote: 'Mong cậu sau này một đời an yên, dù trong những ngày tháng ấy không còn có mình nữa.',
    template: 'postcard-travel',
    color: '#2C3E50'
  },
  {
    id: 'realm-parents',
    title: 'Những lời chưa từng nói với cha mẹ',
    subtitle: 'Nỗi nghẹn ngào trước mái tóc đã pha sương và đôi bàn tay gầy chai sạn theo năm tháng.',
    category: 'family',
    emotion: '🤍',
    quote: 'Con đi khắp bốn phương trời, mới nhận ra mâm cơm của mẹ là chốn ấm áp nhất trần gian.',
    template: 'letter-vintage',
    color: '#4A3B32'
  },
  {
    id: 'realm-self',
    title: 'Những lời nhắn cho chính mình',
    subtitle: 'Một cái ôm nhẹ nhàng cho bạn sau những ngày gồng mình bước qua giông bão.',
    category: 'healing',
    emotion: '🌻',
    quote: 'Bạn đã đi được một đoạn đường rất dài rồi. Hãy tha thứ cho những vụng về của bản thân trong quá khứ.',
    template: 'sunset-cloud',
    color: '#63423A'
  },
  {
    id: 'realm-healing',
    title: 'Những ngày cần được chữa lành',
    subtitle: 'Khoảng lặng êm đềm khi tâm hồn mỏi mệt giữa bộn bề cuộc sống.',
    category: 'healing',
    emotion: '🕊️',
    quote: 'Sau cơn mưa rào dai dẳng, bầu trời nhất định sẽ lại xanh trong lành.',
    template: 'healing-glow',
    color: '#234B54'
  },
  {
    id: 'realm-apology',
    title: 'Lời xin lỗi chân thành',
    subtitle: 'Gửi đến những người ta từng vô tình làm tổn thương trong quá khứ.',
    category: 'apology',
    emotion: '💔',
    quote: 'Tôi nợ bạn một lời xin lỗi, và nợ chính mình sự thanh thản.',
    template: 'antique-candle',
    color: '#211D22'
  },
  {
    id: 'realm-gratitude',
    title: 'Biết ơn những điều bình dị',
    subtitle: 'Cảm ơn những cái nắm tay, những nụ cười bất chợt đã sưởi ấm những ngày đơn độc.',
    category: 'gratitude',
    emotion: '✨',
    quote: 'Sự tử tế dù là nhỏ nhất cũng không bao giờ bị lãng quên.',
    template: 'minimal-paper',
    color: '#2D3748'
  },
  {
    id: 'realm-secrets',
    title: 'Những bí mật giữ kín trong tim',
    subtitle: 'Nơi cất giữ những điều ta chưa từng thổ lộ với bất kỳ ai trên cõi đời này.',
    category: 'unsaid',
    emotion: '💌',
    quote: 'Hãy để những điều sâu kín nhất được thở ra trong trang giấy này.',
    template: 'secret-diary',
    color: '#4A3F35'
  }
];

document.addEventListener('DOMContentLoaded', async () => {
  await messageRepository.init();

  const realmsContainer = document.getElementById('realms-container');
  if (!realmsContainer) return;

  realmsContainer.innerHTML = '';

  REALMS.forEach((realm, index) => {
    // Find matching messages for this realm
    const matchingMessages = messageRepository.filterMessages({ category: realm.category });
    const sampleMsg = matchingMessages.length > 0 ? matchingMessages[index % matchingMessages.length] : null;

    const section = document.createElement('section');
    section.className = 'realm-card-block';
    section.style.marginBottom = '4.5rem';
    section.style.padding = '2.5rem';
    section.style.backgroundColor = 'var(--color-white)';
    section.style.borderRadius = 'var(--radius-lg)';
    section.style.border = '1px solid var(--color-border-hairline)';
    section.style.boxShadow = 'var(--shadow-card)';

    const innerGrid = document.createElement('div');
    innerGrid.style.display = 'grid';
    innerGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))';
    innerGrid.style.gap = '2.5rem';
    innerGrid.style.alignItems = 'center';

    // Left info
    const leftInfo = document.createElement('div');
    leftInfo.innerHTML = `
      <div class="unboxed-meta" style="margin-bottom: 0.75rem;">
        <span style="font-size: 1.25rem;">${realm.emotion}</span>
        <span class="meta-separator">·</span>
        <span style="font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-dusty-rose);">
          Chủ đề 0${index + 1}
        </span>
      </div>
      <h2 style="font-family: var(--font-serif); font-size: 2rem; line-height: 1.25; margin-bottom: 0.75rem; color: var(--color-antique-ink);">
        ${realm.title}
      </h2>
      <p style="font-size: 1.05rem; color: var(--color-ink-muted); line-height: 1.7; margin-bottom: 1.25rem;">
        ${realm.subtitle}
      </p>
      <blockquote style="font-family: var(--font-serif); font-style: italic; font-size: 1.15rem; color: var(--color-warm-brown); border-left: 2px solid var(--color-soft-pink); padding-left: 1.25rem; margin-bottom: 2rem; line-height: 1.7;">
        "${realm.quote}"
      </blockquote>
      <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
        <a href="write.html?category=${realm.category}&emotion=${realm.emotion}&template=${realm.template}" class="btn btn-primary">
          Viết lời nhắn cho chủ đề này
        </a>
        <a href="read.html?category=${realm.category}" class="btn btn-secondary">
          Xem ${matchingMessages.length} lời nhắn liên quan
        </a>
      </div>
    `;

    // Right sample card
    const rightPreview = document.createElement('div');
    rightPreview.style.position = 'relative';

    if (sampleMsg) {
      const cardDom = renderCardDOM(sampleMsg, {
        isInteractive: true,
        onOpenReader: (m) => app.openReaderModal(m)
      });
      rightPreview.appendChild(cardDom);
    } else {
      rightPreview.innerHTML = `
        <div style="padding: 2.5rem; text-align: center; border: 1px dashed var(--color-border-subtle); border-radius: var(--radius-md); background-color: var(--color-cream);">
          <p style="font-size: 0.9375rem; color: var(--color-ink-subtle);">Chưa có lời nhắn nào trong chủ đề này. Hãy là người đầu tiên gửi gắm nhé!</p>
        </div>
      `;
    }

    innerGrid.appendChild(leftInfo);
    innerGrid.appendChild(rightPreview);
    section.appendChild(innerGrid);
    realmsContainer.appendChild(section);
  });
});
