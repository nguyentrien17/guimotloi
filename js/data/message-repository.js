/**
 * Message Repository — Data Access Layer
 * "Gửi một lời — Những lời chưa nói"
 * Decouples data retrieval (XML HTTP Fetch + LocalStorage) from UI components.
 */

import { MessageModel } from './message-model.js';
import { parseMessagesXml, serializeMessagesToXml } from '../utils/xml-parser.js';
import {
  getLocalMessages,
  saveLocalMessage,
  deleteLocalMessage,
  isFavorite,
  getModerationOverrides,
  saveModerationOverride,
  removeModerationOverride,
  addAdminAuditLog
} from '../utils/storage.js';
import { validateMessage } from '../utils/validation.js';
import { DEFAULT_MESSAGES_XML } from './default-xml.js';

/**
 * Message categories, each persisted as its own XML file under /data/messages/
 * instead of a single combined file.
 */
export const MESSAGE_CATEGORIES = [
  'miss_you', 'family', 'love', 'healing',
  'gratitude', 'friends', 'apology', 'unsaid', 'hope'
];

class MessageRepository {
  constructor() {
    /** @type {MessageModel[]} */
    this.cachedMessages = [];
    this.isInitialized = false;
    this.initPromise = null;
    this.xmlLoadError = null;
  }

  /**
   * Initializes the repository by loading XML data, local storage, and applying moderation overrides
   * @returns {Promise<MessageModel[]>}
   */
  async init() {
    if (this.isInitialized) return this.cachedMessages;
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      let xmlMessages = [];
      const loadErrors = [];

      // Each category now lives in its own file under /data/messages/ instead
      // of one combined messages.xml, so fetch and parse them in parallel.
      const results = await Promise.all(
        MESSAGE_CATEGORIES.map(async (category) => {
          try {
            const response = await fetch(`/data/messages/${category}.xml`, { cache: 'no-cache' });
            if (!response.ok) {
              loadErrors.push(`${category}: HTTP ${response.status}`);
              return [];
            }
            const xmlText = await response.text();
            const parseResult = parseMessagesXml(xmlText);
            if (parseResult.error) {
              loadErrors.push(`${category}: ${parseResult.error}`);
              return [];
            }
            return parseResult.messages.map(m => new MessageModel(m));
          } catch (err) {
            loadErrors.push(`${category}: ${err?.message || 'Lỗi kết nối'}`);
            return [];
          }
        })
      );

      xmlMessages = results.flat();
      if (loadErrors.length > 0) {
        console.warn('Lỗi khi tải dữ liệu XML theo danh mục:', loadErrors);
        if (xmlMessages.length === 0) {
          this.xmlLoadError = loadErrors.join('; ');
        }
      }

      // Resilient fallback if fetch is blocked or returns empty
      if (xmlMessages.length === 0 && DEFAULT_MESSAGES_XML) {
        try {
          const fallbackResult = parseMessagesXml(DEFAULT_MESSAGES_XML);
          if (!fallbackResult.error && fallbackResult.messages) {
            xmlMessages = fallbackResult.messages.map(m => new MessageModel(m));
          }
        } catch (_) {}
      }

      // Load local user messages
      const localData = getLocalMessages();
      const localMessages = localData.map(item => new MessageModel({ ...item, isLocal: true }));

      // Merge: Local user messages first, followed by XML community sample messages
      let all = [...localMessages, ...xmlMessages];

      // Apply moderation status overrides (hidden, pending, deleted, published)
      const overrides = getModerationOverrides();
      all = all.filter(m => {
        const ov = overrides[m.id];
        if (ov && ov.isPermanent && ov.status === 'deleted') {
          return false; // permanently deleted
        }
        return true;
      });

      all.forEach(m => {
        if (overrides[m.id]) {
          const ov = overrides[m.id];
          if (ov.status) m.status = ov.status;
          if (ov.moderationReason) m.moderationReason = ov.moderationReason;
          if (ov.moderatedAt) m.moderatedAt = ov.moderatedAt;
          if (ov.moderatedBy) m.moderatedBy = ov.moderatedBy;
          if (ov.updatedAt) m.updatedAt = ov.updatedAt;
        }
      });

      this.cachedMessages = all;
      this.isInitialized = true;
      return this.cachedMessages;
    })();

    return this.initPromise;
  }

  /**
   * Returns messages for public consumption (strictly 'published' only)
   * @returns {MessageModel[]}
   */
  getPublicMessages() {
    return this.cachedMessages.filter(m => m.status === 'published');
  }

  /**
   * Returns all available messages with optional status inclusions
   * By default, returns published messages for public safety
   * @param {{ includeHidden?: boolean, includeDeleted?: boolean, includePending?: boolean }} options
   * @returns {MessageModel[]}
   */
  getAllMessages({ includeHidden = false, includeDeleted = false, includePending = false } = {}) {
    if (includeHidden && includeDeleted && includePending) {
      return [...this.cachedMessages];
    }
    return this.cachedMessages.filter(m => {
      if (m.status === 'published') return true;
      if (m.status === 'hidden' && includeHidden) return true;
      if (m.status === 'pending' && includePending) return true;
      if (m.status === 'deleted' && includeDeleted) return true;
      return false;
    });
  }

  /**
   * Returns all messages for administration and moderation
   * @returns {MessageModel[]}
   */
  getAllAdminMessages() {
    return [...this.cachedMessages];
  }

  /**
   * Finds a message by ID
   * @param {string} id 
   * @returns {MessageModel|null}
   */
  getMessageById(id) {
    if (!id) return null;
    return this.cachedMessages.find(m => m.id === id) || null;
  }

  /**
   * Returns a random message from the published pool
   * Guarantees hidden, deleted, or pending messages are NEVER selected
   * @param {string} [excludeId]
   * @param {{ excludeCategories?: string[] }} [options] - e.g. excludeCategories: ['family']
   *   to skip letters addressed to a specific named relation (mẹ/bố/bà...), which read
   *   oddly under a generic "a message for you" framing shown to an anonymous visitor.
   * @returns {MessageModel|null}
   */
  getRandomMessage(excludeId = null, { excludeCategories = [] } = {}) {
    let publicPool = this.getPublicMessages();
    if (excludeCategories.length > 0) {
      const filtered = publicPool.filter(m => !excludeCategories.includes(m.category));
      if (filtered.length > 0) publicPool = filtered;
    }
    if (publicPool.length === 0) return null;
    const pool = excludeId
      ? publicPool.filter(m => m.id !== excludeId)
      : publicPool;

    if (pool.length === 0) return publicPool[0];
    const index = Math.floor(Math.random() * pool.length);
    return pool[index];
  }

  /**
   * Filters messages based on criteria
   * Defaults to 'published' for public safety; pass status='all' for admin queries
   * @param {Object} criteria
   * @returns {MessageModel[]}
   */
  filterMessages({
    category = 'all',
    emotion = 'all',
    search = '',
    isFavoriteOnly = false,
    isLocalOnly = false,
    status = 'published'
  } = {}) {
    let result = [...this.cachedMessages];

    // Status filter
    if (status && status !== 'all') {
      result = result.filter(m => m.status === status);
    }

    if (category && category !== 'all') {
      result = result.filter(m => m.category === category);
    }

    if (emotion && emotion !== 'all') {
      result = result.filter(m => m.emotion === emotion);
    }

    if (isFavoriteOnly) {
      result = result.filter(m => isFavorite(m.id));
    }

    if (isLocalOnly) {
      result = result.filter(m => m.isLocal);
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(m => 
        (m.id && m.id.toLowerCase().includes(q)) ||
        (m.content && m.content.toLowerCase().includes(q)) ||
        (m.alias && m.alias.toLowerCase().includes(q)) ||
        (m.categoryName && m.categoryName.toLowerCase().includes(q))
      );
    }

    return result;
  }

  /**
   * Hides a message from public display (Moderation)
   * @param {string} id 
   * @param {string} reason 
   * @param {string} actor 
   * @returns {{ success: boolean, message?: MessageModel, error?: string }}
   */
  hideMessage(id, reason = 'Không phù hợp với tiêu chuẩn cộng đồng', actor = 'Quản trị viên') {
    const target = this.getMessageById(id);
    if (!target) return { success: false, error: 'Không tìm thấy thư.' };

    const now = new Date().toISOString();
    target.status = 'hidden';
    target.moderationReason = reason;
    target.moderatedAt = now;
    target.moderatedBy = actor;
    target.updatedAt = now;

    saveModerationOverride(id, {
      status: 'hidden',
      moderationReason: reason,
      moderatedAt: now,
      moderatedBy: actor
    });

    addAdminAuditLog({
      action: 'hide',
      messageId: id,
      reason,
      actor,
      details: `Đã ẩn thư ${id}: "${target.content.substring(0, 45)}..."`
    });

    window.dispatchEvent(new CustomEvent('messageModerated', { detail: { id, status: 'hidden' } }));
    return { success: true, message: target };
  }

  /**
   * Restores a previously hidden/pending message back to public status
   * @param {string} id 
   * @param {string} actor 
   * @returns {{ success: boolean, message?: MessageModel, error?: string }}
   */
  restoreMessage(id, actor = 'Quản trị viên') {
    const target = this.getMessageById(id);
    if (!target) return { success: false, error: 'Không tìm thấy thư.' };

    const now = new Date().toISOString();
    target.status = 'published';
    target.moderationReason = '';
    target.moderatedAt = now;
    target.moderatedBy = actor;
    target.updatedAt = now;

    saveModerationOverride(id, {
      status: 'published',
      moderationReason: '',
      moderatedAt: now,
      moderatedBy: actor
    });

    addAdminAuditLog({
      action: 'restore',
      messageId: id,
      actor,
      details: `Đã khôi phục thư ${id} về trạng thái công khai.`
    });

    window.dispatchEvent(new CustomEvent('messageModerated', { detail: { id, status: 'published' } }));
    return { success: true, message: target };
  }

  /**
   * Marks a message as pending review
   * @param {string} id 
   * @param {string} reason 
   * @param {string} actor 
   * @returns {{ success: boolean, message?: MessageModel, error?: string }}
   */
  markPendingMessage(id, reason = 'Chờ xem xét thêm', actor = 'Quản trị viên') {
    const target = this.getMessageById(id);
    if (!target) return { success: false, error: 'Không tìm thấy thư.' };

    const now = new Date().toISOString();
    target.status = 'pending';
    target.moderationReason = reason;
    target.moderatedAt = now;
    target.moderatedBy = actor;
    target.updatedAt = now;

    saveModerationOverride(id, {
      status: 'pending',
      moderationReason: reason,
      moderatedAt: now,
      moderatedBy: actor
    });

    addAdminAuditLog({
      action: 'pending',
      messageId: id,
      reason,
      actor,
      details: `Đã đánh dấu thư ${id} cần xem xét.`
    });

    window.dispatchEvent(new CustomEvent('messageModerated', { detail: { id, status: 'pending' } }));
    return { success: true, message: target };
  }

  /**
   * Deletes a message (soft delete by default, or permanent delete)
   * @param {string} id 
   * @param {string} reason 
   * @param {boolean} isPermanent 
   * @param {string} actor 
   * @returns {{ success: boolean, error?: string }}
   */
  deleteMessage(id, reason = 'Vi phạm chính sách nội dung', isPermanent = false, actor = 'Quản trị viên') {
    const target = this.getMessageById(id);
    if (!target) return { success: false, error: 'Không tìm thấy thư.' };

    const now = new Date().toISOString();

    if (isPermanent) {
      if (target.isLocal) {
        deleteLocalMessage(id);
      }
      saveModerationOverride(id, {
        status: 'deleted',
        moderationReason: reason,
        moderatedAt: now,
        moderatedBy: actor,
        isPermanent: true
      });
      this.cachedMessages = this.cachedMessages.filter(m => m.id !== id);
    } else {
      target.status = 'deleted';
      target.moderationReason = reason;
      target.moderatedAt = now;
      target.moderatedBy = actor;
      target.updatedAt = now;

      saveModerationOverride(id, {
        status: 'deleted',
        moderationReason: reason,
        moderatedAt: now,
        moderatedBy: actor
      });
    }

    addAdminAuditLog({
      action: isPermanent ? 'delete_permanent' : 'delete_soft',
      messageId: id,
      reason,
      actor,
      details: `Đã xóa (${isPermanent ? 'vĩnh viễn' : 'mềm'}) thư ${id}: "${target.content.substring(0, 45)}..."`
    });

    window.dispatchEvent(new CustomEvent('messageModerated', { detail: { id, status: 'deleted' } }));
    return { success: true };
  }

  /**
   * Batch updates multiple messages to a target status
   * @param {string[]} ids 
   * @param {'published'|'hidden'|'pending'|'deleted'} status 
   * @param {string} reason 
   * @param {string} actor 
   * @returns {{ success: boolean, updatedCount: number, error?: string }}
   */
  batchUpdateStatus(ids, status, reason = '', actor = 'Quản trị viên') {
    if (!Array.isArray(ids) || ids.length === 0) {
      return { success: false, updatedCount: 0, error: 'Không có thư nào được chọn.' };
    }

    let updatedCount = 0;
    ids.forEach(id => {
      if (status === 'hidden') {
        const res = this.hideMessage(id, reason, actor);
        if (res.success) updatedCount++;
      } else if (status === 'published') {
        const res = this.restoreMessage(id, actor);
        if (res.success) updatedCount++;
      } else if (status === 'pending') {
        const res = this.markPendingMessage(id, reason, actor);
        if (res.success) updatedCount++;
      } else if (status === 'deleted') {
        const res = this.deleteMessage(id, reason, false, actor);
        if (res.success) updatedCount++;
      }
    });

    addAdminAuditLog({
      action: `batch_${status}`,
      messageIds: ids,
      reason,
      actor,
      details: `Thao tác hàng loạt: Cập nhật ${updatedCount}/${ids.length} thư sang trạng thái "${status}".`
    });

    return { success: true, updatedCount };
  }

  /**
   * Creates a new message (Stored locally in localStorage, prepared for future API sync)
   * @param {Object} rawData 
   * @returns {{ success: boolean, message: MessageModel|null, errors: string[] }}
   */
  createMessage(rawData) {
    const validation = validateMessage(rawData);
    if (!validation.valid) {
      return { success: false, message: null, errors: validation.errors };
    }

    const newMsg = new MessageModel({
      ...rawData,
      id: `local-msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      isLocal: true,
      status: 'published'
    });

    // Save to local storage
    const saved = saveLocalMessage(newMsg.toJSON());
    if (saved) {
      this.cachedMessages.unshift(newMsg);
      return { success: true, message: newMsg, errors: [] };
    } else {
      return { success: false, message: null, errors: ['Không thể lưu tin nhắn vào bộ nhớ trình duyệt.'] };
    }
  }

  /**
   * Exports all messages as XML string
   * @returns {string}
   */
  exportToXml() {
    return serializeMessagesToXml(this.cachedMessages.map(m => m.toJSON()));
  }

  /**
   * Exports all messages as JSON
   * @returns {string}
   */
  exportToJson() {
    return JSON.stringify(this.cachedMessages.map(m => m.toJSON()), null, 2);
  }
}

// Export singleton instance
export const messageRepository = new MessageRepository();
