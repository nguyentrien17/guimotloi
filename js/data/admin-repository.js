/**
 * Admin Repository & API Client — Data Access & Moderation Contract
 * "Gửi một lời — Những lời chưa nói"
 * 
 * Separates administration operations from UI components.
 * Connects to /api/admin endpoints when server is available,
 * and seamlessly provides full local fallback for offline/client-only environments.
 * 
 * ============================================================================
 * ARCHITECTURE & SECURITY NOTICE:
 * In a client-only static environment (pure HTML/JS on static file hosting),
 * JavaScript running in the browser CANNOT provide absolute server-authoritative
 * access control, nor can it securely write to static XML files on disk without
 * a backend API.
 * 
 * To ensure high security in production:
 * 1. Admin endpoints must require cryptographic JWT / Bearer token validation.
 * 2. Status changes (hide, delete, restore) must be committed to a persistent database (PostgreSQL/Firestore/MongoDB).
 * 3. Never store admin secrets, private keys, or credentials in client bundles.
 * ============================================================================
 */

import { messageRepository } from './message-repository.js';
import {
  getAdminSession,
  setAdminSession,
  clearAdminSession,
  getAdminAuditLogs,
  addAdminAuditLog
} from '../utils/storage.js';

export const ADMIN_API_CONTRACT = {
  version: '1.0.0',
  endpoints: [
    {
      method: 'POST',
      path: '/api/admin/auth/login',
      description: 'Xác thực tài khoản quản trị và cấp token phiên làm việc',
      requestBody: { username: 'admin', password: 'string' },
      response: { token: 'jwt-bearer-token', user: { username: 'admin', role: 'admin' }, expiresIn: 86400 }
    },
    {
      method: 'GET',
      path: '/api/admin/stats',
      description: 'Lấy số liệu thống kê thư (tổng số, công khai, bị ẩn, chờ duyệt, đã xóa)',
      headers: { Authorization: 'Bearer <token>' },
      response: { total: 20, published: 18, hidden: 1, pending: 1, deleted: 0 }
    },
    {
      method: 'GET',
      path: '/api/admin/messages',
      description: 'Lấy danh sách thư có phân trang, tìm kiếm và lọc trạng thái',
      headers: { Authorization: 'Bearer <token>' },
      queryParams: ['status', 'category', 'emotion', 'search', 'dateRange', 'sortBy', 'page', 'pageSize'],
      response: { messages: [], total: 20, page: 1, pageSize: 10, totalPages: 2 }
    },
    {
      method: 'PATCH',
      path: '/api/admin/messages/:id/status',
      description: 'Cập nhật trạng thái kiểm duyệt (published, hidden, pending, deleted) kèm lý do',
      headers: { Authorization: 'Bearer <token>' },
      requestBody: { status: 'hidden', reason: 'string' },
      response: { success: true, message: {} }
    },
    {
      method: 'DELETE',
      path: '/api/admin/messages/:id',
      description: 'Xóa thư (mềm hoặc vĩnh viễn) sau khi xác nhận',
      headers: { Authorization: 'Bearer <token>' },
      requestBody: { reason: 'string', isPermanent: false },
      response: { success: true }
    },
    {
      method: 'POST',
      path: '/api/admin/messages/batch',
      description: 'Cập nhật trạng thái hoặc xóa hàng loạt cho nhiều thư đã chọn',
      headers: { Authorization: 'Bearer <token>' },
      requestBody: { ids: ['msg-1', 'msg-2'], status: 'hidden', reason: 'string' },
      response: { success: true, updatedCount: 2 }
    },
    {
      method: 'GET',
      path: '/api/admin/audit-logs',
      description: 'Lấy lịch sử thao tác kiểm duyệt phục vụ truy vết',
      headers: { Authorization: 'Bearer <token>' },
      response: { logs: [] }
    }
  ]
};

class AdminRepository {
  constructor() {
    this.session = getAdminSession();
    this.useServerApi = true; // Attempt server API first
  }

  /**
   * Authenticates administrator
   * @param {string} username 
   * @param {string} password 
   * @param {boolean} rememberMe 
   * @returns {Promise<{ success: boolean, error?: string }>}
   */
  async login(username, password, rememberMe = false) {
    if (!username || !password) {
      return { success: false, error: 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.' };
    }

    try {
      // 1. Try server-side authentication API
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (res.ok) {
        const data = await res.json();
        const session = {
          token: data.token,
          username: data.user?.username || username,
          role: data.user?.role || 'admin',
          expiresAt: Date.now() + (data.expiresIn || 86400) * 1000
        };
        this.session = session;
        setAdminSession(session, rememberMe);
        addAdminAuditLog({
          action: 'login',
          actor: session.username,
          details: 'Đăng nhập thành công vào bảng quản trị.'
        });
        return { success: true };
      }
    } catch (_) {
      // Server API unreachable, fallback to client contract check for development
    }

    // 2. Local-dev-only fallback. `import.meta.env.DEV` is replaced with the
    // literal `false` by Vite in a production build (`vite build`), so this
    // entire block — hardcoded credentials included — is dead-code-eliminated
    // and never ships in the deployed bundle. In production, login requires
    // the real /api/admin/auth/login backend above.
    if (import.meta.env.DEV && username.trim() === 'admin' && password === 'dev-only-local-admin') {
      const session = {
        token: `dev-token-${Date.now()}-${Math.random().toString(36).substring(2)}`,
        username: 'admin',
        role: 'admin',
        expiresAt: Date.now() + (rememberMe ? 7 * 86400000 : 86400000)
      };
      this.session = session;
      setAdminSession(session, rememberMe);
      addAdminAuditLog({
        action: 'login',
        actor: 'admin (Demo/Local)',
        details: 'Đăng nhập thành công (môi trường phát triển cục bộ).'
      });
      return { success: true };
    }

    return {
      success: false,
      error: 'Thông tin đăng nhập không chính xác. Vui lòng kiểm tra lại.'
    };
  }

  /**
   * Logs out current administrator
   */
  logout() {
    if (this.session) {
      addAdminAuditLog({
        action: 'logout',
        actor: this.session.username || 'Quản trị viên',
        details: 'Đã đăng xuất khỏi phiên làm việc.'
      });
    }
    this.session = null;
    clearAdminSession();
    return true;
  }

  /**
   * Checks if admin is currently authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    this.session = getAdminSession();
    return Boolean(this.session && (!this.session.expiresAt || Date.now() < this.session.expiresAt));
  }

  /**
   * Current admin user profile
   */
  getCurrentUser() {
    return this.session ? { username: this.session.username, role: this.session.role } : null;
  }

  /**
   * Calculates live statistics from actual message repository data
   * @returns {Promise<{ total: number, published: number, hidden: number, pending: number, deleted: number }>}
   */
  async getStatistics() {
    await messageRepository.init();
    const all = messageRepository.getAllAdminMessages();

    const stats = {
      total: all.length,
      published: 0,
      hidden: 0,
      pending: 0,
      deleted: 0
    };

    all.forEach(m => {
      const st = m.status || 'published';
      if (st === 'published') stats.published++;
      else if (st === 'hidden') stats.hidden++;
      else if (st === 'pending') stats.pending++;
      else if (st === 'deleted') stats.deleted++;
    });

    return stats;
  }

  /**
   * Retrieves messages with filters, search, sorting and pagination
   * @param {Object} options
   * @returns {Promise<{ messages: import('./message-model.js').MessageModel[], total: number, page: number, pageSize: number, totalPages: number }>}
   */
  async getMessages({
    status = 'all',
    category = 'all',
    emotion = 'all',
    search = '',
    dateRange = 'all',
    sortBy = 'newest',
    page = 1,
    pageSize = 10
  } = {}) {
    await messageRepository.init();

    // 1. Get raw pool
    let list = messageRepository.filterMessages({
      category,
      emotion,
      search,
      status // 'all' or specific status
    });

    // 2. Filter by dateRange
    if (dateRange && dateRange !== 'all') {
      const now = new Date();
      list = list.filter(m => {
        try {
          const date = new Date(m.createdAt);
          if (isNaN(date.getTime())) return true;
          const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

          if (dateRange === 'today') return diffHours <= 24;
          if (dateRange === 'week') return diffHours <= 24 * 7;
          if (dateRange === 'month') return diffHours <= 24 * 30;
          return true;
        } catch {
          return true;
        }
      });
    }

    // 3. Sort
    list.sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime() || 0;
      const timeB = new Date(b.createdAt).getTime() || 0;
      if (sortBy === 'oldest') {
        return timeA - timeB;
      }
      return timeB - timeA; // newest first
    });

    // 4. Pagination
    const total = list.length;
    const validPageSize = Math.max(1, pageSize);
    const totalPages = Math.max(1, Math.ceil(total / validPageSize));
    const validPage = Math.min(Math.max(1, page), totalPages);
    const startIndex = (validPage - 1) * validPageSize;
    const paginatedMessages = list.slice(startIndex, startIndex + validPageSize);

    return {
      messages: paginatedMessages,
      total,
      page: validPage,
      pageSize: validPageSize,
      totalPages
    };
  }

  /**
   * Retrieves full details of a specific message
   * @param {string} id 
   */
  async getMessageDetail(id) {
    await messageRepository.init();
    return messageRepository.getMessageById(id);
  }

  /**
   * Hides a message from public display
   * @param {string} id 
   * @param {string} reason 
   */
  async hideMessage(id, reason) {
    if (!this.isAuthenticated()) {
      return { success: false, error: 'Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.' };
    }
    const actor = this.session?.username || 'Quản trị viên';
    return messageRepository.hideMessage(id, reason || 'Không phù hợp tiêu chuẩn cộng đồng', actor);
  }

  /**
   * Restores a hidden/pending message back to published
   * @param {string} id 
   */
  async restoreMessage(id) {
    if (!this.isAuthenticated()) {
      return { success: false, error: 'Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.' };
    }
    const actor = this.session?.username || 'Quản trị viên';
    return messageRepository.restoreMessage(id, actor);
  }

  /**
   * Marks a message as pending review
   * @param {string} id 
   * @param {string} reason 
   */
  async markPending(id, reason) {
    if (!this.isAuthenticated()) {
      return { success: false, error: 'Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.' };
    }
    const actor = this.session?.username || 'Quản trị viên';
    return messageRepository.markPendingMessage(id, reason || 'Cần xem xét thêm', actor);
  }

  /**
   * Deletes a message (soft delete or permanent)
   * @param {string} id 
   * @param {string} reason 
   * @param {boolean} isPermanent 
   */
  async deleteMessage(id, reason, isPermanent = false) {
    if (!this.isAuthenticated()) {
      return { success: false, error: 'Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.' };
    }
    const actor = this.session?.username || 'Quản trị viên';
    return messageRepository.deleteMessage(id, reason || 'Vi phạm chính sách nội dung', isPermanent, actor);
  }

  /**
   * Batch hides multiple messages
   * @param {string[]} ids 
   * @param {string} reason 
   */
  async batchHide(ids, reason) {
    if (!this.isAuthenticated()) {
      return { success: false, error: 'Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.' };
    }
    const actor = this.session?.username || 'Quản trị viên';
    return messageRepository.batchUpdateStatus(ids, 'hidden', reason || 'Ẩn hàng loạt bởi quản trị viên', actor);
  }

  /**
   * Batch restores multiple messages
   * @param {string[]} ids 
   */
  async batchRestore(ids) {
    if (!this.isAuthenticated()) {
      return { success: false, error: 'Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.' };
    }
    const actor = this.session?.username || 'Quản trị viên';
    return messageRepository.batchUpdateStatus(ids, 'published', '', actor);
  }

  /**
   * Batch deletes multiple messages
   * @param {string[]} ids 
   * @param {string} reason 
   */
  async batchDelete(ids, reason) {
    if (!this.isAuthenticated()) {
      return { success: false, error: 'Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.' };
    }
    const actor = this.session?.username || 'Quản trị viên';
    return messageRepository.batchUpdateStatus(ids, 'deleted', reason || 'Xóa hàng loạt bởi quản trị viên', actor);
  }

  /**
   * Retrieves audit logs of all moderation actions
   */
  getAuditLogs() {
    return getAdminAuditLogs();
  }
}

// Export singleton instance
export const adminRepository = new AdminRepository();
