/**
 * Validation & Sanitization Utilities
 * "Gửi một lời — Những lời chưa nói"
 */

export const MAX_CONTENT_LENGTH = 500;
export const MAX_ALIAS_LENGTH = 50;

/**
 * Escapes characters for safe XML output
 * @param {string} str 
 * @returns {string}
 */
export function escapeXml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Validates a message before creating or saving
 * @param {Object} message 
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateMessage(message) {
  const errors = [];

  if (!message || typeof message !== 'object') {
    return { valid: false, errors: ['Dữ liệu lời nhắn không hợp lệ.'] };
  }

  const content = (message.content || '').trim();
  if (!content) {
    errors.push('Vui lòng nhập nội dung lời nhắn.');
  } else if (content.length > MAX_CONTENT_LENGTH) {
    errors.push(`Lời nhắn không được vượt quá ${MAX_CONTENT_LENGTH} ký tự (hiện tại: ${content.length}).`);
  }

  if (message.alias && message.alias.trim().length > MAX_ALIAS_LENGTH) {
    errors.push(`Danh xưng không được vượt quá ${MAX_ALIAS_LENGTH} ký tự.`);
  }

  const allowedCategories = [
    'all', 'miss_you', 'apology', 'gratitude', 'love', 
    'family', 'friends', 'healing', 'hope', 'unsaid', 'uncategorized'
  ];
  if (message.category && !allowedCategories.includes(message.category)) {
    errors.push('Danh mục không hợp lệ.');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Safe text node creation helper
 * @param {HTMLElement} element 
 * @param {string} text 
 */
export function setTextSafe(element, text) {
  if (!element) return;
  element.textContent = text == null ? '' : String(text);
}
