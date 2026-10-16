/**
 * Message Model — Domain Entity
 * "Gửi một lời — Những lời chưa nói"
 */

import { getCategoryLabel } from '../utils/xml-parser.js';

export class MessageModel {
  /**
   * @param {Object} data 
   */
  constructor(data = {}) {
    this.id = data.id || `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    this.content = data.content || '';
    this.category = data.category || 'unsaid';
    this.categoryName = data.categoryName || getCategoryLabel(this.category);
    this.emotion = data.emotion || '💌';
    this.alias = data.alias || 'Một người lạ';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.status = data.status || 'published'; // 'published' | 'hidden' | 'pending' | 'deleted'
    this.isLocal = Boolean(data.isLocal);
    this.moderationReason = data.moderationReason || '';
    this.moderatedAt = data.moderatedAt || null;
    this.moderatedBy = data.moderatedBy || '';
    this.updatedAt = data.updatedAt || null;

    // Design attributes
    const design = data.design || {};
    this.design = {
      template: design.template || 'letter-vintage',
      background: design.background || '#FAF4EB',
      textColor: design.textColor || '#4A3B32',
      font: design.font || 'serif',
      pattern: design.pattern || 'none',
      textAlign: design.textAlign || 'left',
      stickers: Array.isArray(design.stickers) ? [...design.stickers] : []
    };
  }

  /**
   * Creates a plain JSON object representation
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.id,
      content: this.content,
      category: this.category,
      categoryName: this.categoryName,
      emotion: this.emotion,
      alias: this.alias,
      createdAt: this.createdAt,
      status: this.status,
      isLocal: this.isLocal,
      moderationReason: this.moderationReason,
      moderatedAt: this.moderatedAt,
      moderatedBy: this.moderatedBy,
      updatedAt: this.updatedAt,
      design: {
        template: this.design.template,
        background: this.design.background,
        textColor: this.design.textColor,
        font: this.design.font,
        pattern: this.design.pattern,
        textAlign: this.design.textAlign,
        stickers: this.design.stickers.map(s => ({ ...s }))
      }
    };
  }

  /**
   * Clones current message instance
   * @returns {MessageModel}
   */
  clone() {
    return new MessageModel(this.toJSON());
  }

  /**
   * Formats the creation date as an explicit dd/mm/yyyy string
   * @returns {string}
   */
  getFormattedDate() {
    try {
      const date = new Date(this.createdAt);
      if (isNaN(date.getTime())) return 'Gần đây';

      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return 'Gần đây';
    }
  }
}
