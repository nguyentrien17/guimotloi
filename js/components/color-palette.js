/**
 * Advanced Text Color Palette & Live Contrast Meter
 * "Gửi một lời — Những lời chưa nói"
 */

import { getContrastRatio, isColorDark, ensureLegibleTextColor } from '../utils/color-utils.js';

const STORAGE_KEYS = {
  RECENT_COLORS: 'unspoken_recent_colors_v1',
  FAV_COLORS: 'unspoken_fav_colors_v1'
};

export const COLOR_PALETTES = [
  {
    name: 'Màu cơ bản & Mực',
    colors: ['#1C1917', '#292524', '#44403C', '#57534E', '#FFFFFF', '#FAF7F2', '#E7E5E4']
  },
  {
    name: 'Pastel dịu nhẹ',
    colors: ['#4A2832', '#3D2A4F', '#243C4D', '#1D3B2E', '#4A3018', '#471B26', '#362247']
  },
  {
    name: 'Tone đất & Vintage',
    colors: ['#2E231C', '#3D2513', '#33271D', '#362314', '#422806', '#523A28', '#78350F']
  },
  {
    name: 'Thiên nhiên & Rừng xanh',
    colors: ['#192B1D', '#163121', '#13352B', '#11381C', '#103632', '#064E3B', '#14532D']
  },
  {
    name: 'Đêm sâu & Trầm lặng',
    colors: ['#F4E8CE', '#F3E5D4', '#EDF4FA', '#D9F8EE', '#FFF4D6', '#E0E7FF', '#FCE7D2']
  },
  {
    name: 'Ấm áp & Hoàng hôn',
    colors: ['#421F17', '#4A2A1A', '#4A1C29', '#4D1220', '#451F06', '#7C2D12', '#9A3412']
  },
  {
    name: 'Nghệ thuật & Tương phản',
    colors: ['#A3E635', '#FDE047', '#38BDF8', '#F472B6', '#C084FC', '#F87171', '#4ADE80']
  }
];

export function getRecentColors() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RECENT_COLORS);
    return raw ? JSON.parse(raw) : ['#2E231C', '#172635', '#F4E8CE', '#421F17', '#192B1D'];
  } catch {
    return ['#2E231C', '#172635', '#F4E8CE', '#421F17', '#192B1D'];
  }
}

export function addRecentColor(hex) {
  if (!hex || !hex.startsWith('#')) return;
  try {
    const list = getRecentColors().filter(c => c.toLowerCase() !== hex.toLowerCase());
    const updated = [hex, ...list].slice(0, 8);
    localStorage.setItem(STORAGE_KEYS.RECENT_COLORS, JSON.stringify(updated));
  } catch {}
}

export function getFavoriteColors() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FAV_COLORS);
    return raw ? JSON.parse(raw) : ['#2E231C', '#F4E8CE', '#172635', '#4D1C27'];
  } catch {
    return ['#2E231C', '#F4E8CE', '#172635', '#4D1C27'];
  }
}

export function toggleFavoriteColor(hex) {
  if (!hex) return false;
  try {
    const favs = getFavoriteColors();
    const idx = favs.findIndex(c => c.toLowerCase() === hex.toLowerCase());
    let isNow = false;
    let updated = [];
    if (idx >= 0) {
      updated = favs.filter((_, i) => i !== idx);
      isNow = false;
    } else {
      updated = [hex, ...favs].slice(0, 12);
      isNow = true;
    }
    localStorage.setItem(STORAGE_KEYS.FAV_COLORS, JSON.stringify(updated));
    return isNow;
  } catch {
    return false;
  }
}

/**
 * Evaluates contrast between background and text color
 * @param {string} bg 
 * @param {string} text 
 * @returns {{ ratio: number, score: 'AAA'|'AA'|'FAIL', isGood: boolean, suggestion: string }}
 */
export function evaluateContrast(bg, text) {
  const ratio = Math.round(getContrastRatio(bg, text) * 10) / 10;
  const isGood = ratio >= 4.5;
  const score = ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : 'FAIL';
  const suggestion = ensureLegibleTextColor(bg, isColorDark(bg) ? '#F4E8CE' : '#1C1917');

  return {
    ratio,
    score,
    isGood,
    suggestion
  };
}
