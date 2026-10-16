/**
 * Page Script: Admin & Moderation (Bảng Quản Trị & Kiểm Duyệt)
 * "Gửi một lời — Những lời chưa nói"
 * 
 * Provides comprehensive moderation, live statistics, robust filters,
 * batch actions, and full mobile-first ergonomics.
 */

import { adminRepository } from '../data/admin-repository.js';
import { renderCardDOM } from '../components/card-renderer.js';
import { setTextSafe } from '../utils/validation.js';
import { app } from '../app.js';

document.addEventListener('DOMContentLoaded', async () => {
  // DOM Elements - Auth & Sections
  const loginSection = document.getElementById('admin-login-section');
  const dashboardSection = document.getElementById('admin-dashboard-section');
  const loginForm = document.getElementById('admin-login-form');
  const userInput = document.getElementById('admin-user-input');
  const passInput = document.getElementById('admin-pass-input');
  const rememberCheckbox = document.getElementById('admin-remember-me');
  const loginErrorMsg = document.getElementById('login-error-msg');
  const authControls = document.getElementById('auth-controls');
  const adminUsernameLabel = document.getElementById('admin-username-label');
  const logoutBtn = document.getElementById('btn-admin-logout');
  const refreshBtn = document.getElementById('btn-refresh-data');
  const auditLogsBtn = document.getElementById('btn-view-audit-logs');

  // DOM Elements - Statistics
  const statTotal = document.getElementById('stat-total-count');
  const statPublished = document.getElementById('stat-published-count');
  const statHidden = document.getElementById('stat-hidden-count');
  const statPending = document.getElementById('stat-pending-count');
  const statDeleted = document.getElementById('stat-deleted-count');
  const statCards = document.querySelectorAll('.stat-card');

  // DOM Elements - Filters & Toolbar
  const searchInput = document.getElementById('admin-search-input');
  const statusFilterTabs = document.querySelectorAll('#admin-status-filters .filter-tab-btn');
  const categorySelect = document.getElementById('filter-category');
  const dateRangeSelect = document.getElementById('filter-date-range');
  const sortOrderSelect = document.getElementById('filter-sort-order');
  const resetFiltersBtn = document.getElementById('btn-reset-filters');

  // DOM Elements - Batch Actions
  const selectAllCheckbox = document.getElementById('select-all-checkbox');
  const batchActionBar = document.getElementById('batch-action-bar');
  const batchCountEl = document.getElementById('batch-selected-count');
  const batchHideBtn = document.getElementById('btn-batch-hide');
  const batchRestoreBtn = document.getElementById('btn-batch-restore');
  const batchDeleteBtn = document.getElementById('btn-batch-delete');
  const batchDeselectBtn = document.getElementById('btn-batch-deselect');

  // DOM Elements - Messages Views
  const tableBody = document.getElementById('messages-table-body');
  const mobileList = document.getElementById('messages-mobile-list');
  const emptyState = document.getElementById('admin-empty-state');
  const emptyResetBtn = document.getElementById('btn-empty-reset');

  // DOM Elements - Pagination
  const paginationBar = document.getElementById('admin-pagination-bar');
  const paginationInfo = document.getElementById('pagination-info-text');
  const pagePrevBtn = document.getElementById('btn-page-prev');
  const pageNextBtn = document.getElementById('btn-page-next');
  const pageNumbersGroup = document.getElementById('page-numbers-group');

  // DOM Elements - Detail Modal
  const detailModal = document.getElementById('admin-detail-modal');
  const detailCloseBtn = document.getElementById('detail-modal-close-btn');
  const detailDismissBtn = document.getElementById('detail-modal-dismiss-btn');
  const detailStatusPill = document.getElementById('detail-modal-status-pill');
  const detailIdCode = document.getElementById('detail-modal-id-code');
  const detailPreviewStage = document.getElementById('detail-card-preview-stage');
  const detailReasonBox = document.getElementById('detail-moderation-box');
  const detailReasonText = document.getElementById('detail-moderation-reason');
  const detailTimeText = document.getElementById('detail-moderation-time');
  const detailActionButtons = document.getElementById('detail-action-buttons');

  // DOM Elements - Moderation Reason Modal
  const reasonModal = document.getElementById('admin-reason-modal');
  const reasonTitle = document.getElementById('reason-modal-title');
  const reasonDesc = document.getElementById('reason-modal-desc');
  const reasonForm = document.getElementById('reason-modal-form');
  const reasonCustomText = document.getElementById('moderation-custom-reason');
  const reasonCancelBtn = document.getElementById('reason-modal-cancel-btn');
  const reasonCloseBtn = document.getElementById('reason-modal-close-btn');
  const reasonConfirmBtn = document.getElementById('reason-modal-confirm-btn');

  // DOM Elements - Delete Modal
  const deleteModal = document.getElementById('admin-delete-modal');
  const deleteModalTargetDesc = document.getElementById('delete-modal-target-desc');
  const deleteReasonInput = document.getElementById('delete-reason-input');
  const deleteCancelBtn = document.getElementById('delete-modal-cancel-btn');
  const deleteCloseBtn = document.getElementById('delete-modal-close-btn');
  const deleteConfirmBtn = document.getElementById('delete-modal-confirm-btn');

  // DOM Elements - Audit Modal
  const auditModal = document.getElementById('admin-audit-modal');
  const auditListContainer = document.getElementById('audit-logs-container');
  const auditCloseBtn = document.getElementById('audit-modal-close-btn');
  const auditDismissBtn = document.getElementById('audit-modal-dismiss-btn');

  // Active State
  const state = {
    status: 'all',
    category: 'all',
    emotion: 'all',
    dateRange: 'all',
    sortBy: 'newest',
    search: '',
    page: 1,
    pageSize: 10,
    selectedIds: new Set(),
    currentTargetMessage: null,
    pendingActionType: null, // 'hide' | 'pending' | 'delete' | 'batch-hide' | 'batch-delete'
    currentMessages: []
  };

  // -------------------------------------------------------------------------
  // 1. Authentication Handlers
  // -------------------------------------------------------------------------
  function checkAuthUI() {
    const isAuthed = adminRepository.isAuthenticated();
    if (isAuthed) {
      loginSection.style.display = 'none';
      dashboardSection.style.display = 'block';
      authControls.style.display = 'flex';
      const user = adminRepository.getCurrentUser();
      if (adminUsernameLabel && user) {
        adminUsernameLabel.textContent = user.username;
      }
      loadDashboard();
    } else {
      loginSection.style.display = 'flex';
      dashboardSection.style.display = 'none';
      authControls.style.display = 'none';
    }
  }

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginErrorMsg.style.display = 'none';
    const submitBtn = document.getElementById('btn-login-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Đang xác thực...';

    const username = userInput.value.trim();
    const password = passInput.value;
    const rememberMe = rememberCheckbox.checked;

    const result = await adminRepository.login(username, password, rememberMe);
    submitBtn.disabled = false;
    submitBtn.textContent = 'Đăng nhập quản trị';

    if (result.success) {
      app.showToast('Đăng nhập thành công.');
      checkAuthUI();
    } else {
      loginErrorMsg.textContent = result.error || 'Đăng nhập thất bại.';
      loginErrorMsg.style.display = 'block';
    }
  });

  logoutBtn.addEventListener('click', () => {
    if (confirm('Bạn có chắc muốn đăng xuất khỏi trang quản trị?')) {
      adminRepository.logout();
      app.showToast('Đã đăng xuất.');
      checkAuthUI();
    }
  });

  // -------------------------------------------------------------------------
  // 2. Dashboard Loading & Statistics
  // -------------------------------------------------------------------------
  async function loadDashboard() {
    await updateStats();
    await loadMessages();
  }

  async function updateStats() {
    const stats = await adminRepository.getStatistics();
    if (statTotal) statTotal.textContent = stats.total;
    if (statPublished) statPublished.textContent = stats.published;
    if (statHidden) statHidden.textContent = stats.hidden;
    if (statPending) statPending.textContent = stats.pending;
    if (statDeleted) statDeleted.textContent = stats.deleted;
  }

  // Bind Stat Cards as Quick Filter Buttons
  statCards.forEach(card => {
    card.addEventListener('click', () => {
      const targetStatus = card.dataset.filterStatus;
      statCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      state.status = targetStatus;
      state.page = 1;
      syncFilterTabs(targetStatus);
      loadMessages();
    });
  });

  function syncFilterTabs(status) {
    statusFilterTabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.status === status);
    });
  }

  // -------------------------------------------------------------------------
  // 3. Search & Filter Handlers
  // -------------------------------------------------------------------------
  let searchDebounceTimer = null;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
      state.search = e.target.value.trim();
      state.page = 1;
      loadMessages();
    }, 250);
  });

  statusFilterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      statusFilterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      state.status = tab.dataset.status;
      state.page = 1;

      // Sync stat cards active state
      statCards.forEach(c => {
        c.classList.toggle('active', c.dataset.filterStatus === state.status);
      });

      loadMessages();
    });
  });

  categorySelect.addEventListener('change', () => {
    state.category = categorySelect.value;
    state.page = 1;
    loadMessages();
  });

  dateRangeSelect.addEventListener('change', () => {
    state.dateRange = dateRangeSelect.value;
    state.page = 1;
    loadMessages();
  });

  sortOrderSelect.addEventListener('change', () => {
    state.sortBy = sortOrderSelect.value;
    state.page = 1;
    loadMessages();
  });

  function resetAllFilters() {
    state.status = 'all';
    state.category = 'all';
    state.dateRange = 'all';
    state.sortBy = 'newest';
    state.search = '';
    state.page = 1;

    searchInput.value = '';
    categorySelect.value = 'all';
    dateRangeSelect.value = 'all';
    sortOrderSelect.value = 'newest';

    syncFilterTabs('all');
    statCards.forEach(c => c.classList.toggle('active', c.dataset.filterStatus === 'all'));

    loadMessages();
    app.showToast('Đã đặt lại toàn bộ bộ lọc.');
  }

  resetFiltersBtn.addEventListener('click', resetAllFilters);
  if (emptyResetBtn) emptyResetBtn.addEventListener('click', resetAllFilters);
  refreshBtn.addEventListener('click', () => {
    loadDashboard();
    app.showToast('Dữ liệu đã được làm mới.');
  });

  // -------------------------------------------------------------------------
  // 4. Messages Loading & Rendering (Desktop Table + Mobile Cards)
  // -------------------------------------------------------------------------
  async function loadMessages() {
    const res = await adminRepository.getMessages({
      status: state.status,
      category: state.category,
      dateRange: state.dateRange,
      sortBy: state.sortBy,
      search: state.search,
      page: state.page,
      pageSize: state.pageSize
    });

    state.currentMessages = res.messages;
    renderMessages(res);
    renderPagination(res);
    updateBatchBar();
  }

  function renderMessages({ messages, total, page, pageSize }) {
    tableBody.innerHTML = '';
    mobileList.innerHTML = '';

    if (total === 0) {
      emptyState.style.display = 'block';
      document.querySelector('.admin-table').style.display = 'none';
      mobileList.style.display = 'none';
      paginationBar.style.display = 'none';
      return;
    }

    emptyState.style.display = 'none';
    if (window.innerWidth >= 860) {
      document.querySelector('.admin-table').style.display = 'table';
      mobileList.style.display = 'none';
    } else {
      document.querySelector('.admin-table').style.display = 'none';
      mobileList.style.display = 'flex';
    }
    paginationBar.style.display = 'flex';

    // 1. Render Desktop Table Rows
    messages.forEach(msg => {
      const tr = document.createElement('tr');
      const st = msg.status || 'published';
      tr.className = `row-${st}`;
      const isSelected = state.selectedIds.has(msg.id);

      tr.innerHTML = `
        <td style="text-align: center;">
          <input type="checkbox" class="msg-row-checkbox" data-id="${msg.id}" ${isSelected ? 'checked' : ''} aria-label="Chọn thư" />
        </td>
        <td>
          <span class="msg-id-code" title="${msg.id}">${msg.id.length > 12 ? msg.id.substring(0, 11) + '…' : msg.id}</span>
        </td>
        <td>
          <div class="table-content-preview">
            "${escapeHtml(msg.content)}"
          </div>
          <div style="font-size: 0.75rem; color: var(--color-ink-subtle); margin-top: 0.25rem;">
            Tác giả: <i>${escapeHtml(msg.alias || 'Một người lạ')}</i>
          </div>
        </td>
        <td>
          <div style="display: flex; align-items: center; gap: 0.35rem;">
            <span style="font-size: 1.1rem;">${msg.emotion || '💌'}</span>
            <span style="font-size: 0.85rem; font-weight: 500;">${escapeHtml(msg.categoryName)}</span>
          </div>
        </td>
        <td>
          <span style="font-size: 0.8125rem; color: var(--color-ink-subtle);" title="${msg.createdAt}">
            ${msg.getFormattedDate()}
          </span>
        </td>
        <td>
          ${renderStatusPillHtml(st)}
        </td>
        <td style="text-align: right;">
          <div class="action-btn-group" style="justify-content: flex-end;">
            <button type="button" class="admin-action-btn btn-view" data-action="view" data-id="${msg.id}" title="Xem chi tiết đầy đủ">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            </button>
            ${st === 'published' ? `
              <button type="button" class="admin-action-btn btn-hide" data-action="hide" data-id="${msg.id}" title="Ẩn thư này">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
              </button>
            ` : `
              <button type="button" class="admin-action-btn btn-restore" data-action="restore" data-id="${msg.id}" title="Hiện lại công khai">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6"></path><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
              </button>
            `}
            <button type="button" class="admin-action-btn btn-delete" data-action="delete" data-id="${msg.id}" title="Xóa thư">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </td>
      `;
      tableBody.appendChild(tr);
    });

    // 2. Render Mobile Stacked Cards
    messages.forEach(msg => {
      const card = document.createElement('div');
      const st = msg.status || 'published';
      card.className = `mobile-message-card row-${st}`;
      const isSelected = state.selectedIds.has(msg.id);

      card.innerHTML = `
        <div class="mobile-card-top">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <input type="checkbox" class="msg-row-checkbox" data-id="${msg.id}" ${isSelected ? 'checked' : ''} aria-label="Chọn thư" style="width: 18px; height: 18px;" />
            <span class="msg-id-code">${msg.id.length > 12 ? msg.id.substring(0, 11) + '…' : msg.id}</span>
          </div>
          <div>${renderStatusPillHtml(st)}</div>
        </div>

        <div class="mobile-card-content">
          "${escapeHtml(msg.content)}"
        </div>

        <div class="mobile-card-meta">
          <span>${msg.emotion} ${escapeHtml(msg.categoryName)} · <i>${escapeHtml(msg.alias || 'Một người lạ')}</i></span>
          <span>${msg.getFormattedDate()}</span>
        </div>

        <div class="mobile-card-actions">
          <button type="button" class="btn btn-secondary btn-sm" data-action="view" data-id="${msg.id}" style="flex: 1;">
            Xem chi tiết
          </button>
          ${st === 'published' ? `
            <button type="button" class="btn btn-secondary btn-sm" data-action="hide" data-id="${msg.id}" style="color: #A84B5E;">
              Ẩn thư
            </button>
          ` : `
            <button type="button" class="btn btn-secondary btn-sm" data-action="restore" data-id="${msg.id}" style="color: #2B7A4B;">
              Hiện lại
            </button>
          `}
          <button type="button" class="btn btn-secondary btn-sm" data-action="delete" data-id="${msg.id}" style="color: #DC2626;">
            Xóa
          </button>
        </div>
      `;
      mobileList.appendChild(card);
    });

    // Attach row checkboxes listeners
    const checkboxes = document.querySelectorAll('.msg-row-checkbox');
    checkboxes.forEach(cb => {
      cb.addEventListener('change', (e) => {
        const id = e.target.dataset.id;
        if (e.target.checked) {
          state.selectedIds.add(id);
        } else {
          state.selectedIds.delete(id);
        }
        updateBatchBar();
      });
    });

    // Attach row action buttons listeners
    attachActionListeners(tableBody);
    attachActionListeners(mobileList);
  }

  function renderStatusPillHtml(status) {
    if (status === 'published') {
      return '<span class="status-pill status-pill-published">● Công khai</span>';
    }
    if (status === 'hidden') {
      return '<span class="status-pill status-pill-hidden">● Đang bị ẩn</span>';
    }
    if (status === 'pending') {
      return '<span class="status-pill status-pill-pending">● Chờ duyệt</span>';
    }
    if (status === 'deleted') {
      return '<span class="status-pill status-pill-deleted">● Đã xóa</span>';
    }
    return '<span class="status-pill status-pill-published">● Công khai</span>';
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  // Handle Action Buttons (Desktop & Mobile)
  function attachActionListeners(container) {
    container.querySelectorAll('button[data-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = btn.dataset.action;
        const id = btn.dataset.id;
        const msg = state.currentMessages.find(m => m.id === id);
        if (!msg) return;

        state.currentTargetMessage = msg;

        if (action === 'view') {
          openDetailModal(msg);
        } else if (action === 'hide') {
          openReasonModal('hide', msg);
        } else if (action === 'restore') {
          handleDirectRestore(msg);
        } else if (action === 'pending') {
          openReasonModal('pending', msg);
        } else if (action === 'delete') {
          openDeleteModal(msg);
        }
      });
    });
  }

  // -------------------------------------------------------------------------
  // 5. Pagination Rendering
  // -------------------------------------------------------------------------
  function renderPagination({ total, page, pageSize, totalPages }) {
    const start = Math.min((page - 1) * pageSize + 1, total);
    const end = Math.min(page * pageSize, total);
    paginationInfo.textContent = `Hiển thị ${start} - ${end} trong ${total} bức thư`;

    pagePrevBtn.disabled = page <= 1;
    pageNextBtn.disabled = page >= totalPages;

    pageNumbersGroup.innerHTML = '';
    // Generate page numbers
    const maxButtons = 5;
    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    if (endPage - startPage < maxButtons - 1) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let p = startPage; p <= endPage; p++) {
      const pBtn = document.createElement('button');
      pBtn.type = 'button';
      pBtn.className = `page-btn ${p === page ? 'active' : ''}`;
      pBtn.textContent = p;
      pBtn.addEventListener('click', () => {
        state.page = p;
        loadMessages();
      });
      pageNumbersGroup.appendChild(pBtn);
    }
  }

  pagePrevBtn.addEventListener('click', () => {
    if (state.page > 1) {
      state.page--;
      loadMessages();
    }
  });

  pageNextBtn.addEventListener('click', () => {
    state.page++;
    loadMessages();
  });

  // -------------------------------------------------------------------------
  // 6. Batch Actions Operations
  // -------------------------------------------------------------------------
  selectAllCheckbox.addEventListener('change', (e) => {
    const checked = e.target.checked;
    state.currentMessages.forEach(m => {
      if (checked) state.selectedIds.add(m.id);
      else state.selectedIds.delete(m.id);
    });
    document.querySelectorAll('.msg-row-checkbox').forEach(cb => {
      cb.checked = checked;
    });
    updateBatchBar();
  });

  batchDeselectBtn.addEventListener('click', () => {
    state.selectedIds.clear();
    selectAllCheckbox.checked = false;
    document.querySelectorAll('.msg-row-checkbox').forEach(cb => {
      cb.checked = false;
    });
    updateBatchBar();
  });

  function updateBatchBar() {
    const count = state.selectedIds.size;
    batchCountEl.textContent = count;
    if (count > 0) {
      batchActionBar.classList.add('visible');
    } else {
      batchActionBar.classList.remove('visible');
    }
  }

  batchHideBtn.addEventListener('click', () => {
    const count = state.selectedIds.size;
    if (count === 0) return;
    openReasonModal('batch-hide', null, count);
  });

  batchRestoreBtn.addEventListener('click', async () => {
    const count = state.selectedIds.size;
    if (count === 0) return;
    if (confirm(`Bạn có chắc muốn khôi phục công khai cho ${count} bức thư đã chọn?`)) {
      batchRestoreBtn.disabled = true;
      const ids = Array.from(state.selectedIds);
      const res = await adminRepository.batchRestore(ids);
      batchRestoreBtn.disabled = false;
      if (res.success) {
        app.showToast(`Đã khôi phục thành công ${res.updatedCount} bức thư.`);
        state.selectedIds.clear();
        loadDashboard();
      }
    }
  });

  batchDeleteBtn.addEventListener('click', () => {
    const count = state.selectedIds.size;
    if (count === 0) return;
    openDeleteModal(null, count);
  });

  // -------------------------------------------------------------------------
  // 7. Modals: Detail, Reason, Delete, and Audit Logs
  // -------------------------------------------------------------------------

  // 7.1 Detail Inspection Modal
  function openDetailModal(message) {
    detailStatusPill.className = `status-pill status-pill-${message.status || 'published'}`;
    detailStatusPill.textContent = `● ${getStatusLabel(message.status)}`;
    detailIdCode.textContent = message.id;

    // Render full stationery card in preview stage
    detailPreviewStage.innerHTML = '';
    const cardEl = renderCardDOM(message, { isInteractive: false });
    cardEl.style.boxShadow = 'none';
    cardEl.style.maxWidth = '100%';
    detailPreviewStage.appendChild(cardEl);

    // Show moderation details
    if (message.moderationReason || message.moderatedAt) {
      detailReasonBox.style.display = 'block';
      detailReasonText.textContent = `Lý do: ${message.moderationReason || 'Không có'}`;
      detailTimeText.textContent = `Thời gian kiểm duyệt: ${message.moderatedAt ? new Date(message.moderatedAt).toLocaleString('vi-VN') : 'Gần đây'} bởi ${message.moderatedBy || 'Quản trị viên'}`;
    } else {
      detailReasonBox.style.display = 'none';
    }

    // Dynamic action buttons
    detailActionButtons.innerHTML = '';
    const st = message.status || 'published';

    if (st === 'published') {
      const hideBtn = document.createElement('button');
      hideBtn.type = 'button';
      hideBtn.className = 'btn btn-secondary btn-sm';
      hideBtn.style.color = '#A84B5E';
      hideBtn.textContent = 'Ẩn thư này';
      hideBtn.addEventListener('click', () => {
        closeModal(detailModal);
        openReasonModal('hide', message);
      });
      detailActionButtons.appendChild(hideBtn);
    } else {
      const restoreBtn = document.createElement('button');
      restoreBtn.type = 'button';
      restoreBtn.className = 'btn btn-secondary btn-sm';
      restoreBtn.style.color = '#2B7A4B';
      restoreBtn.textContent = 'Hiện lại thư';
      restoreBtn.addEventListener('click', () => {
        closeModal(detailModal);
        handleDirectRestore(message);
      });
      detailActionButtons.appendChild(restoreBtn);
    }

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'btn btn-secondary btn-sm';
    deleteBtn.style.color = '#DC2626';
    deleteBtn.textContent = 'Xóa thư';
    deleteBtn.addEventListener('click', () => {
      closeModal(detailModal);
      openDeleteModal(message);
    });
    detailActionButtons.appendChild(deleteBtn);

    openModal(detailModal);
  }

  detailCloseBtn.addEventListener('click', () => closeModal(detailModal));
  detailDismissBtn.addEventListener('click', () => closeModal(detailModal));

  // 7.2 Reason Modal (Hide / Pending / Batch Hide)
  function openReasonModal(actionType, message = null, batchCount = 0) {
    state.pendingActionType = actionType;
    reasonCustomText.value = '';

    if (actionType === 'hide') {
      reasonTitle.textContent = 'Ẩn Thư Khỏi Trang Công Khai';
      reasonDesc.textContent = `Bức thư (${message?.id}) sẽ không còn xuất hiện trên trang chủ, trang đọc ngẫu nhiên hay danh sách công khai.`;
    } else if (actionType === 'pending') {
      reasonTitle.textContent = 'Đánh Dấu Thư Cần Xem Xét';
      reasonDesc.textContent = `Thư (${message?.id}) sẽ tạm thời chuyển sang trạng thái chờ duyệt và chỉ hiển thị trong bảng quản trị.`;
    } else if (actionType === 'batch-hide') {
      reasonTitle.textContent = `Ẩn Hàng Loạt ${batchCount} Bức Thư`;
      reasonDesc.textContent = `Tất cả ${batchCount} bức thư đã chọn sẽ được ẩn khỏi trang công khai.`;
    }

    openModal(reasonModal);
  }

  reasonCancelBtn.addEventListener('click', () => closeModal(reasonModal));
  reasonCloseBtn.addEventListener('click', () => closeModal(reasonModal));

  reasonConfirmBtn.addEventListener('click', async () => {
    const selectedPreset = reasonForm.querySelector('input[name="moderationPresetReason"]:checked')?.value;
    let finalReason = selectedPreset;
    if (selectedPreset === 'other' || !selectedPreset) {
      finalReason = reasonCustomText.value.trim() || 'Lý do khác';
    }

    reasonConfirmBtn.disabled = true;

    if (state.pendingActionType === 'hide') {
      const res = await adminRepository.hideMessage(state.currentTargetMessage.id, finalReason);
      reasonConfirmBtn.disabled = false;
      closeModal(reasonModal);
      if (res.success) {
        app.showToast('Đã ẩn thư khỏi trang công khai.');
        loadDashboard();
      } else {
        app.showToast(res.error || 'Thao tác thất bại.');
      }
    } else if (state.pendingActionType === 'pending') {
      const res = await adminRepository.markPending(state.currentTargetMessage.id, finalReason);
      reasonConfirmBtn.disabled = false;
      closeModal(reasonModal);
      if (res.success) {
        app.showToast('Đã đánh dấu thư cần xem xét.');
        loadDashboard();
      } else {
        app.showToast(res.error || 'Thao tác thất bại.');
      }
    } else if (state.pendingActionType === 'batch-hide') {
      const ids = Array.from(state.selectedIds);
      const res = await adminRepository.batchHide(ids, finalReason);
      reasonConfirmBtn.disabled = false;
      closeModal(reasonModal);
      if (res.success) {
        app.showToast(`Đã ẩn thành công ${res.updatedCount} bức thư.`);
        state.selectedIds.clear();
        loadDashboard();
      } else {
        app.showToast(res.error || 'Thao tác thất bại.');
      }
    }
  });

  // Direct Restore
  async function handleDirectRestore(message) {
    if (confirm(`Bạn có chắc muốn khôi phục bức thư "${message.id}" về trang công khai?`)) {
      const res = await adminRepository.restoreMessage(message.id);
      if (res.success) {
        app.showToast('Đã khôi phục thư về trạng thái công khai.');
        loadDashboard();
      } else {
        app.showToast(res.error || 'Khôi phục thất bại.');
      }
    }
  }

  // 7.3 Delete Modal (Single or Batch)
  function openDeleteModal(message = null, batchCount = 0) {
    deleteReasonInput.value = '';
    if (message) {
      state.pendingActionType = 'delete';
      state.currentTargetMessage = message;
      deleteModalTargetDesc.innerHTML = `Bạn đang chuẩn bị xóa bức thư: <strong class="msg-id-code">${message.id}</strong>. Trích đoạn: "<i>${escapeHtml(message.content.substring(0, 50))}...</i>"`;
    } else {
      state.pendingActionType = 'batch-delete';
      deleteModalTargetDesc.innerHTML = `Bạn đang chuẩn bị xóa hàng loạt <strong>${batchCount}</strong> bức thư đã chọn.`;
    }
    openModal(deleteModal);
  }

  deleteCancelBtn.addEventListener('click', () => closeModal(deleteModal));
  deleteCloseBtn.addEventListener('click', () => closeModal(deleteModal));

  deleteConfirmBtn.addEventListener('click', async () => {
    const deleteType = deleteModal.querySelector('input[name="deleteTypeChoice"]:checked')?.value || 'soft';
    const isPermanent = deleteType === 'permanent';
    const reason = deleteReasonInput.value.trim() || 'Vi phạm chính sách nội dung';

    deleteConfirmBtn.disabled = true;

    if (state.pendingActionType === 'delete') {
      const res = await adminRepository.deleteMessage(state.currentTargetMessage.id, reason, isPermanent);
      deleteConfirmBtn.disabled = false;
      closeModal(deleteModal);
      if (res.success) {
        app.showToast(isPermanent ? 'Đã xóa vĩnh viễn bức thư.' : 'Đã xóa mềm bức thư.');
        loadDashboard();
      } else {
        app.showToast(res.error || 'Xóa thư thất bại.');
      }
    } else if (state.pendingActionType === 'batch-delete') {
      const ids = Array.from(state.selectedIds);
      const res = await adminRepository.batchDelete(ids, reason);
      deleteConfirmBtn.disabled = false;
      closeModal(deleteModal);
      if (res.success) {
        app.showToast(`Đã xóa thành công ${res.updatedCount} bức thư.`);
        state.selectedIds.clear();
        loadDashboard();
      } else {
        app.showToast(res.error || 'Xóa thư thất bại.');
      }
    }
  });

  // 7.4 Audit Logs Modal
  auditLogsBtn.addEventListener('click', () => {
    renderAuditLogs();
    openModal(auditModal);
  });
  auditCloseBtn.addEventListener('click', () => closeModal(auditModal));
  auditDismissBtn.addEventListener('click', () => closeModal(auditModal));

  function renderAuditLogs() {
    const logs = adminRepository.getAuditLogs();
    auditListContainer.innerHTML = '';

    if (logs.length === 0) {
      auditListContainer.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: var(--color-ink-subtle);">
          Chưa có thao tác kiểm duyệt nào được ghi lại.
        </div>
      `;
      return;
    }

    logs.forEach(log => {
      const item = document.createElement('div');
      item.className = 'audit-item';
      item.innerHTML = `
        <div class="audit-item-header">
          <span class="audit-action-badge" style="color: ${getActionColor(log.action)};">
            ${getActionLabel(log.action)}
          </span>
          <span class="audit-time">${new Date(log.timestamp).toLocaleString('vi-VN')}</span>
        </div>
        <div class="audit-details">
          ${escapeHtml(log.details || log.reason || 'Thao tác quản trị')}
        </div>
        <div style="font-size: 0.75rem; color: var(--color-ink-subtle); margin-top: 0.25rem;">
          Thực hiện bởi: <strong>${escapeHtml(log.actor || 'Quản trị viên')}</strong>
          ${log.reason ? ` · Lý do: <i>${escapeHtml(log.reason)}</i>` : ''}
        </div>
      `;
      auditListContainer.appendChild(item);
    });
  }

  function getActionLabel(action) {
    const labels = {
      hide: 'Ẩn thư',
      restore: 'Hiện lại',
      pending: 'Đánh dấu chờ duyệt',
      delete_soft: 'Xóa mềm',
      delete_permanent: 'Xóa vĩnh viễn',
      batch_hidden: 'Ẩn hàng loạt',
      batch_published: 'Hiện hàng loạt',
      batch_deleted: 'Xóa hàng loạt',
      login: 'Đăng nhập',
      logout: 'Đăng xuất'
    };
    return labels[action] || action;
  }

  function getActionColor(action) {
    if (action.includes('restore') || action.includes('published')) return '#2B7A4B';
    if (action.includes('hide') || action.includes('pending')) return '#A84B5E';
    if (action.includes('delete')) return '#DC2626';
    return 'var(--color-antique-ink)';
  }

  function getStatusLabel(status) {
    const map = {
      published: 'Công khai',
      hidden: 'Đang ẩn',
      pending: 'Chờ duyệt',
      deleted: 'Đã xóa'
    };
    return map[status] || 'Công khai';
  }

  // Modal helpers
  function openModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.remove('open');
    document.body.style.overflow = '';
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      [detailModal, reasonModal, deleteModal, auditModal].forEach(m => closeModal(m));
    }
  });

  // Listen for window resize to toggle between desktop table & mobile cards
  window.addEventListener('resize', () => {
    if (state.currentMessages.length > 0) {
      if (window.innerWidth >= 860) {
        document.querySelector('.admin-table').style.display = 'table';
        mobileList.style.display = 'none';
      } else {
        document.querySelector('.admin-table').style.display = 'none';
        mobileList.style.display = 'flex';
      }
    }
  });

  // Listen for messageModerated events to auto-refresh
  window.addEventListener('messageModerated', () => {
    updateStats();
    loadMessages();
  });

  // Initial authentication check
  checkAuthUI();
});
