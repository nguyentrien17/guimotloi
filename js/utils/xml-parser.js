/**
 * XML Parser & Serializer for Unspoken Messages
 * Handles XML DOM parsing, validation, and serialization safely.
 */

import { escapeXml } from './validation.js';

/**
 * Parses XML text into an array of message objects
 * @param {string} xmlText 
 * @returns {{ messages: Array, error: string|null }}
 */
export function parseMessagesXml(xmlText) {
  if (!xmlText || typeof xmlText !== 'string') {
    return { messages: [], error: 'Dữ liệu XML trống hoặc không hợp lệ.' };
  }

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

  // Check for XML parsing error
  const parserError = xmlDoc.querySelector('parsererror');
  if (parserError) {
    return {
      messages: [],
      error: 'Lỗi cú pháp XML: ' + (parserError.textContent || 'Định dạng XML không chuẩn xác.')
    };
  }

  const messageNodes = xmlDoc.querySelectorAll('message');
  const messages = [];

  messageNodes.forEach(node => {
    try {
      const id = node.getAttribute('id') || `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
      const content = node.querySelector('content')?.textContent?.trim() || '';
      const category = node.querySelector('category')?.textContent?.trim() || 'unsaid';
      const categoryName = node.querySelector('categoryName')?.textContent?.trim() || getCategoryLabel(category);
      const emotion = node.querySelector('emotion')?.textContent?.trim() || '💌';
      const alias = node.querySelector('alias')?.textContent?.trim() || 'Một người lạ';
      const createdAt = node.querySelector('createdAt')?.textContent?.trim() || new Date().toISOString();
      const status = node.querySelector('status')?.textContent?.trim() || 'published';

      // Design settings
      const designNode = node.querySelector('design');
      const template = designNode?.querySelector('template')?.textContent?.trim() || 'letter-vintage';
      const background = designNode?.querySelector('background')?.textContent?.trim() || '#FAF4EB';
      const textColor = designNode?.querySelector('textColor')?.textContent?.trim() || '#4A3B32';
      const font = designNode?.querySelector('font')?.textContent?.trim() || 'serif';
      const pattern = designNode?.querySelector('pattern')?.textContent?.trim() || 'none';
      const textAlign = designNode?.querySelector('textAlign')?.textContent?.trim() || 'left';

      // Stickers
      const stickers = [];
      const stickerNodes = designNode?.querySelectorAll('sticker') || [];
      stickerNodes.forEach(sNode => {
        stickers.push({
          emoji: sNode.getAttribute('emoji') || '✨',
          x: parseFloat(sNode.getAttribute('x') || '50'),
          y: parseFloat(sNode.getAttribute('y') || '50'),
          scale: parseFloat(sNode.getAttribute('scale') || '1'),
          rotation: parseFloat(sNode.getAttribute('rotation') || '0')
        });
      });

      messages.push({
        id,
        content,
        category,
        categoryName,
        emotion,
        alias,
        createdAt,
        status,
        isLocal: false,
        design: {
          template,
          background,
          textColor,
          font,
          pattern,
          textAlign,
          stickers
        }
      });
    } catch (e) {
      console.warn('Bỏ qua một thẻ message bị lỗi trong XML:', e);
    }
  });

  return { messages, error: null };
}

/**
 * Serializes an array of message objects to a valid XML string
 * @param {Array} messages 
 * @returns {string}
 */
export function serializeMessagesToXml(messages) {
  const xmlLines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<messages version="1.0">'
  ];

  messages.forEach(msg => {
    xmlLines.push(`  <message id="${escapeXml(msg.id)}">`);
    xmlLines.push(`    <content>${escapeXml(msg.content)}</content>`);
    xmlLines.push(`    <category>${escapeXml(msg.category)}</category>`);
    xmlLines.push(`    <categoryName>${escapeXml(msg.categoryName || getCategoryLabel(msg.category))}</categoryName>`);
    xmlLines.push(`    <emotion>${escapeXml(msg.emotion || '💌')}</emotion>`);
    xmlLines.push(`    <alias>${escapeXml(msg.alias || 'Một người lạ')}</alias>`);
    xmlLines.push(`    <createdAt>${escapeXml(msg.createdAt || new Date().toISOString())}</createdAt>`);
    xmlLines.push(`    <status>${escapeXml(msg.status || 'published')}</status>`);
    
    if (msg.design) {
      xmlLines.push('    <design>');
      xmlLines.push(`      <template>${escapeXml(msg.design.template || 'letter-vintage')}</template>`);
      xmlLines.push(`      <background>${escapeXml(msg.design.background || '#FAF4EB')}</background>`);
      xmlLines.push(`      <textColor>${escapeXml(msg.design.textColor || '#4A3B32')}</textColor>`);
      xmlLines.push(`      <font>${escapeXml(msg.design.font || 'serif')}</font>`);
      xmlLines.push(`      <pattern>${escapeXml(msg.design.pattern || 'none')}</pattern>`);
      xmlLines.push(`      <textAlign>${escapeXml(msg.design.textAlign || 'left')}</textAlign>`);
      
      if (Array.isArray(msg.design.stickers) && msg.design.stickers.length > 0) {
        xmlLines.push('      <stickers>');
        msg.design.stickers.forEach(stk => {
          xmlLines.push(`        <sticker emoji="${escapeXml(stk.emoji)}" x="${stk.x}" y="${stk.y}" scale="${stk.scale || 1}" rotation="${stk.rotation || 0}"/>`);
        });
        xmlLines.push('      </stickers>');
      } else {
        xmlLines.push('      <stickers/>');
      }

      xmlLines.push('    </design>');
    }

    xmlLines.push('  </message>');
  });

  xmlLines.push('</messages>');
  return xmlLines.join('\n');
}

/**
 * Helper to get Vietnamese category labels
 * @param {string} cat 
 * @returns {string}
 */
export function getCategoryLabel(cat) {
  const map = {
    'all': 'Tất cả',
    'gratitude': 'Lời cảm ơn',
    'apology': 'Lời xin lỗi',
    'miss_you': 'Nỗi nhớ',
    'love': 'Tình yêu',
    'family': 'Gia đình',
    'friends': 'Bạn bè',
    'healing': 'Chữa lành',
    'hope': 'Hy vọng',
    'unsaid': 'Những điều khó nói',
    'uncategorized': 'Tâm tình khác'
  };
  return map[cat] || 'Tâm tình khác';
}
