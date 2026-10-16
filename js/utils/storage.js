/**
 * Storage Utilities for localStorage
 * "Gửi một lời — Những lời chưa nói"
 */

const STORAGE_KEYS = {
  DRAFT: 'unspoken_draft_card_v1',
  LOCAL_MESSAGES: 'unspoken_local_messages_v1',
  FAVORITES: 'unspoken_favorite_ids_v1',
  SETTINGS: 'unspoken_user_settings_v1',
  REPORTED: 'unspoken_reported_ids_v1'
};

/**
 * Saves current draft to localStorage
 * @param {Object} draftData 
 */
export function saveDraft(draftData) {
  try {
    localStorage.setItem(STORAGE_KEYS.DRAFT, JSON.stringify({
      ...draftData,
      updatedAt: new Date().toISOString()
    }));
    return true;
  } catch (err) {
    console.error('Lỗi khi lưu bản nháp vào localStorage:', err);
    return false;
  }
}

/**
 * Loads draft from localStorage
 * @returns {Object|null}
 */
export function loadDraft() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DRAFT);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error('Lỗi khi đọc bản nháp:', err);
    return null;
  }
}

/**
 * Clears saved draft
 */
export function clearDraft() {
  try {
    localStorage.removeItem(STORAGE_KEYS.DRAFT);
  } catch (err) {
    console.error('Lỗi khi xóa bản nháp:', err);
  }
}

/**
 * Retrieves user-created local messages
 * @returns {Array}
 */
export function getLocalMessages() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOCAL_MESSAGES);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Lỗi khi đọc danh sách tin nhắn cục bộ:', err);
    return [];
  }
}

/**
 * Saves a user-created message locally
 * @param {Object} message 
 */
export function saveLocalMessage(message) {
  try {
    const current = getLocalMessages();
    const updated = [message, ...current];
    localStorage.setItem(STORAGE_KEYS.LOCAL_MESSAGES, JSON.stringify(updated));
    return true;
  } catch (err) {
    console.error('Lỗi khi lưu tin nhắn cục bộ:', err);
    return false;
  }
}

/**
 * Deletes a local message by ID
 * @param {string} messageId 
 */
export function deleteLocalMessage(messageId) {
  try {
    const current = getLocalMessages();
    const filtered = current.filter(m => m.id !== messageId);
    localStorage.setItem(STORAGE_KEYS.LOCAL_MESSAGES, JSON.stringify(filtered));
    return true;
  } catch (err) {
    console.error('Lỗi khi xóa tin nhắn cục bộ:', err);
    return false;
  }
}

/**
 * Retrieves bookmarked message IDs
 * @returns {string[]}
 */
export function getFavoriteIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

/**
 * Toggles a message in favorites
 * @param {string} messageId 
 * @returns {boolean} true if now bookmarked, false if removed
 */
export function toggleFavorite(messageId) {
  try {
    const favs = getFavoriteIds();
    let isNowFav = false;
    let updated = [];
    if (favs.includes(messageId)) {
      updated = favs.filter(id => id !== messageId);
      isNowFav = false;
    } else {
      updated = [...favs, messageId];
      isNowFav = true;
    }
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
    return isNowFav;
  } catch (err) {
    console.error('Lỗi khi lưu trạng thái yêu thích:', err);
    return false;
  }
}

/**
 * Checks if a message is bookmarked
 * @param {string} messageId 
 * @returns {boolean}
 */
export function isFavorite(messageId) {
  const favs = getFavoriteIds();
  return favs.includes(messageId);
}

/**
 * Records a message as reported locally
 * @param {string} messageId 
 * @param {string} reason 
 */
export function recordReport(messageId, reason) {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REPORTED);
    const reports = raw ? JSON.parse(raw) : [];
    reports.push({ id: messageId, reason, timestamp: new Date().toISOString() });
    localStorage.setItem(STORAGE_KEYS.REPORTED, JSON.stringify(reports));
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Retrieves user settings
 * @returns {Object}
 */
export function getUserSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return raw ? JSON.parse(raw) : { ambientEffects: true, sound: false };
  } catch (err) {
    return { ambientEffects: true, sound: false };
  }
}

/**
 * Updates user settings
 * @param {Object} partial 
 */
export function updateUserSettings(partial) {
  try {
    const current = getUserSettings();
    const updated = { ...current, ...partial };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    return updated;
  } catch (err) {
    return getUserSettings();
  }
}

/**
 * Retrieves moderation status overrides for all messages
 * @returns {Record<string, { status: string, moderationReason?: string, moderatedAt?: string, moderatedBy?: string, updatedAt?: string }>}
 */
export function getModerationOverrides() {
  try {
    const raw = localStorage.getItem('unspoken_admin_moderation_v1');
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.error('Lỗi khi đọc bản ghi kiểm duyệt:', err);
    return {};
  }
}

/**
 * Saves or updates a moderation override for a message
 * @param {string} messageId 
 * @param {Object} overrideData 
 */
export function saveModerationOverride(messageId, overrideData) {
  try {
    const current = getModerationOverrides();
    current[messageId] = {
      ...(current[messageId] || {}),
      ...overrideData,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem('unspoken_admin_moderation_v1', JSON.stringify(current));
    return true;
  } catch (err) {
    console.error('Lỗi khi lưu trạng thái kiểm duyệt:', err);
    return false;
  }
}

/**
 * Removes a moderation override (restores to default status)
 * @param {string} messageId 
 */
export function removeModerationOverride(messageId) {
  try {
    const current = getModerationOverrides();
    if (current[messageId]) {
      delete current[messageId];
      localStorage.setItem('unspoken_admin_moderation_v1', JSON.stringify(current));
    }
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Retrieves admin audit history
 * @returns {Array<{ id: string, action: string, messageId?: string, messageIds?: string[], reason?: string, actor?: string, timestamp: string, details?: string }>}
 */
export function getAdminAuditLogs() {
  try {
    const raw = localStorage.getItem('unspoken_admin_audit_logs_v1');
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

/**
 * Records an entry into the admin audit log
 * @param {Object} entry 
 */
export function addAdminAuditLog(entry) {
  try {
    const current = getAdminAuditLogs();
    const newEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      actor: 'Quản trị viên',
      ...entry
    };
    const updated = [newEntry, ...current].slice(0, 100); // keep last 100 entries
    localStorage.setItem('unspoken_admin_audit_logs_v1', JSON.stringify(updated));
    return newEntry;
  } catch (err) {
    return null;
  }
}

/**
 * Retrieves the current admin authentication session
 * @returns {{ token: string, username: string, expiresAt: number }|null}
 */
export function getAdminSession() {
  try {
    // Check sessionStorage first, then localStorage
    const raw = sessionStorage.getItem('unspoken_admin_session_v1') || localStorage.getItem('unspoken_admin_session_v1');
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (session.expiresAt && Date.now() > session.expiresAt) {
      clearAdminSession();
      return null;
    }
    return session;
  } catch (err) {
    return null;
  }
}

/**
 * Saves admin authentication session
 * @param {{ token: string, username: string, expiresAt: number }} session 
 * @param {boolean} rememberMe 
 */
export function setAdminSession(session, rememberMe = false) {
  try {
    const serialized = JSON.stringify(session);
    if (rememberMe) {
      localStorage.setItem('unspoken_admin_session_v1', serialized);
    } else {
      sessionStorage.setItem('unspoken_admin_session_v1', serialized);
    }
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Clears admin authentication session
 */
export function clearAdminSession() {
  try {
    sessionStorage.removeItem('unspoken_admin_session_v1');
    localStorage.removeItem('unspoken_admin_session_v1');
  } catch (_) {}
}

