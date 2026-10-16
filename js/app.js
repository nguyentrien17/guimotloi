/**
 * Global Application Core
 * "Gửi một lời — Những lời chưa nói"
 * Handles global toast notifications, ambient atmosphere, modal controls, and active nav states.
 */

import { getUserSettings, updateUserSettings, recordReport } from './utils/storage.js';
import { exportCardAsPng } from './components/card-renderer.js';

class AppController {
  constructor() {
    this.initToastContainer();
    this.initMobileMenu();
    this.initAmbientParticles();
    this.initFocusReaderModal();
    this.initReportModal();
    this.bindGlobalListeners();
  }

  initToastContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    this.toastContainer = container;
  }

  showToast(text, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${text}</span>
    `;
    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const panel = document.getElementById('mobile-nav-panel');

    if (btn && panel) {
      btn.addEventListener('click', () => {
        panel.classList.toggle('open');
        const isOpen = panel.classList.contains('open');
        btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });

      // Close on link click
      panel.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          panel.classList.remove('open');
          btn.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }

  initAmbientParticles() {
    const settings = getUserSettings();
    if (!settings.ambientEffects) return;

    let container = document.getElementById('ambient-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'ambient-container';
      container.className = 'ambient-container';
      document.body.appendChild(container);
    }

    // Generate falling petals
    const petalCount = window.innerWidth < 768 ? 6 : 14;
    for (let i = 0; i < petalCount; i++) {
      const petal = document.createElement('div');
      petal.className = 'petal';
      const size = 8 + Math.random() * 12;
      petal.style.width = `${size}px`;
      petal.style.height = `${size * 1.3}px`;
      petal.style.left = `${Math.random() * 100}vw`;
      petal.style.animationDuration = `${12 + Math.random() * 16}s`;
      petal.style.animationDelay = `${Math.random() * 10}s`;
      container.appendChild(petal);
    }
  }

  initFocusReaderModal() {
    let backdrop = document.getElementById('focus-reader-modal');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'focus-reader-modal';
      backdrop.className = 'modal-backdrop';
      backdrop.innerHTML = `
        <div class="modal-dialog" style="max-width: 640px;">
          <div class="modal-header">
            <span class="unboxed-meta" id="reader-modal-meta">
              <span id="reader-category">Tâm tình</span>
              <span class="meta-separator">·</span>
              <span id="reader-date">Gần đây</span>
            </span>
            <button type="button" class="icon-btn" id="reader-close-btn" aria-label="Đóng">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          <div class="modal-body" style="padding: 2rem 2.25rem;">
            <div id="reader-card-stage" style="position: relative;"></div>
          </div>
          <div class="modal-footer" style="justify-content: space-between;">
            <button type="button" class="btn btn-ghost btn-sm" id="reader-report-btn" style="color: var(--color-ink-subtle);">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
              Báo cáo nội dung
            </button>
            <div style="display: flex; gap: 0.5rem;">
              <button type="button" class="btn btn-secondary btn-sm" id="reader-copy-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                Sao chép
              </button>
              <button type="button" class="btn btn-primary btn-sm" id="reader-export-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Tải ảnh thiệp
              </button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(backdrop);
    }

    this.readerModal = backdrop;
    this.currentReaderMessage = null;

    // Close handlers
    const closeBtn = backdrop.querySelector('#reader-close-btn');
    closeBtn.addEventListener('click', () => this.closeReaderModal());
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) this.closeReaderModal();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && backdrop.classList.contains('open')) {
        this.closeReaderModal();
      }
    });

    // Copy text
    backdrop.querySelector('#reader-copy-btn').addEventListener('click', () => {
      if (this.currentReaderMessage?.content) {
        navigator.clipboard.writeText(this.currentReaderMessage.content)
          .then(() => this.showToast('Đã sao chép nội dung lời nhắn.'))
          .catch(() => this.showToast('Không thể sao chép tự động.'));
      }
    });

    // Export image
    backdrop.querySelector('#reader-export-btn').addEventListener('click', () => {
      if (this.currentReaderMessage) {
        exportCardAsPng(this.currentReaderMessage);
      }
    });

    // Report
    backdrop.querySelector('#reader-report-btn').addEventListener('click', () => {
      if (this.currentReaderMessage) {
        this.closeReaderModal();
        this.openReportModal(this.currentReaderMessage.id);
      }
    });
  }

  openReaderModal(message) {
    this.currentReaderMessage = message;
    const catEl = this.readerModal.querySelector('#reader-category');
    const dateEl = this.readerModal.querySelector('#reader-date');
    const stage = this.readerModal.querySelector('#reader-card-stage');

    catEl.textContent = message.categoryName || 'Tâm tình';
    dateEl.textContent = message.getFormattedDate();
    stage.innerHTML = '';

    // Import dynamic renderer to avoid circular dependency
    import('./components/card-renderer.js').then(({ renderCardDOM }) => {
      const card = renderCardDOM(message, { isInteractive: false });
      card.style.boxShadow = 'none';
      stage.appendChild(card);
      this.readerModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  closeReaderModal() {
    this.readerModal.classList.remove('open');
    document.body.style.overflow = '';
    this.currentReaderMessage = null;
  }

  initReportModal() {
    let backdrop = document.getElementById('report-modal');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'report-modal';
      backdrop.className = 'modal-backdrop';
      backdrop.innerHTML = `
        <div class="modal-dialog" style="max-width: 480px;">
          <div class="modal-header">
            <h3 style="font-size: 1.15rem; font-weight: 600;">Báo cáo nội dung</h3>
            <button type="button" class="icon-btn" id="report-close-btn" aria-label="Đóng">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          <div class="modal-body">
            <p style="font-size: 0.9375rem; color: var(--color-ink-muted); margin-bottom: 1rem;">
              Chúng tôi luôn giữ gìn không gian này nhẹ nhàng và văn minh. Hãy cho chúng tôi biết lý do bạn muốn báo cáo:
            </p>
            <form id="report-form" style="display: flex; flex-direction: column; gap: 0.75rem;">
              <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.9375rem; cursor: pointer;">
                <input type="radio" name="reportReason" value="spam" checked />
                Nội dung rác hoặc quảng cáo
              </label>
              <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.9375rem; cursor: pointer;">
                <input type="radio" name="reportReason" value="harassment" />
                Ngôn từ xúc phạm, thù địch hoặc bắt nạt
              </label>
              <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.9375rem; cursor: pointer;">
                <input type="radio" name="reportReason" value="privacy" />
                Tiết lộ thông tin định danh cá nhân riêng tư
              </label>
              <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.9375rem; cursor: pointer;">
                <input type="radio" name="reportReason" value="other" />
                Lý do khác
              </label>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary btn-sm" id="report-cancel-btn">Hủy</button>
            <button type="button" class="btn btn-primary btn-sm" id="report-submit-btn">Gửi báo cáo</button>
          </div>
        </div>
      `;
      document.body.appendChild(backdrop);
    }

    this.reportModal = backdrop;
    this.targetReportId = null;

    const close = () => {
      backdrop.classList.remove('open');
      document.body.style.overflow = '';
      this.targetReportId = null;
    };

    backdrop.querySelector('#report-close-btn').addEventListener('click', close);
    backdrop.querySelector('#report-cancel-btn').addEventListener('click', close);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) close();
    });

    backdrop.querySelector('#report-submit-btn').addEventListener('click', () => {
      const selected = backdrop.querySelector('input[name="reportReason"]:checked')?.value || 'other';
      if (this.targetReportId) {
        recordReport(this.targetReportId, selected);
        this.showToast('Cảm ơn bạn. Chúng tôi đã ghi nhận báo cáo và sẽ kiểm duyệt.');
      }
      close();
    });
  }

  openReportModal(messageId) {
    this.targetReportId = messageId;
    this.reportModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  bindGlobalListeners() {
    window.addEventListener('toastMessage', (e) => {
      if (e.detail?.text) {
        this.showToast(e.detail.text);
      }
    });

    window.addEventListener('openReaderMessage', (e) => {
      if (e.detail?.message) {
        this.openReaderModal(e.detail.message);
      }
    });
  }
}

export const app = new AppController();
