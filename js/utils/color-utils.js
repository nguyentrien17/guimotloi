/**
 * Color & Contrast Utilities
 * Ensures optimal legibility (WCAG AA/AAA) across all card templates and custom palettes.
 */

/**
 * Parses any color format (hex, rgb, rgba, hsl, gradient) to {r, g, b}
 * For gradients, extracts and averages component colors to accurately evaluate background luminance.
 * @param {string} colorStr 
 * @returns {{ r: number, g: number, b: number }}
 */
export function parseColor(colorStr) {
  if (!colorStr || typeof colorStr !== 'string') {
    return { r: 250, g: 244, b: 235 };
  }

  const str = colorStr.trim().toLowerCase();

  // 1. Handle Gradients (linear-gradient, radial-gradient, conic-gradient)
  if (str.includes('gradient')) {
    const hexMatches = str.match(/#[0-9a-f]{3,8}/gi);
    const rgbMatches = [...str.matchAll(/rgba?\((\d+),\s*(\d+),\s*(\d+)/g)];

    const colorComponents = [];

    if (hexMatches && hexMatches.length > 0) {
      hexMatches.forEach(h => {
        let hex = h.slice(1);
        if (hex.length === 3 || hex.length === 4) {
          hex = hex.substring(0, 3).split('').map(c => c + c).join('');
        }
        if (hex.length >= 6) {
          colorComponents.push({
            r: parseInt(hex.substring(0, 2), 16) || 0,
            g: parseInt(hex.substring(2, 4), 16) || 0,
            b: parseInt(hex.substring(4, 6), 16) || 0
          });
        }
      });
    }

    if (rgbMatches && rgbMatches.length > 0) {
      rgbMatches.forEach(m => {
        colorComponents.push({
          r: parseInt(m[1], 10),
          g: parseInt(m[2], 10),
          b: parseInt(m[3], 10)
        });
      });
    }

    if (colorComponents.length > 0) {
      // Calculate average RGB of gradient stops
      const avgR = Math.round(colorComponents.reduce((acc, c) => acc + c.r, 0) / colorComponents.length);
      const avgG = Math.round(colorComponents.reduce((acc, c) => acc + c.g, 0) / colorComponents.length);
      const avgB = Math.round(colorComponents.reduce((acc, c) => acc + c.b, 0) / colorComponents.length);
      return { r: avgR, g: avgG, b: avgB };
    }
  }

  // 2. Handle Hex: #RGB, #RGBA, #RRGGBB, #RRGGBBAA
  if (str.startsWith('#')) {
    let hex = str.slice(1);
    if (hex.length === 3 || hex.length === 4) {
      hex = hex.substring(0, 3).split('').map(c => c + c).join('');
    }
    if (hex.length >= 6) {
      return {
        r: parseInt(hex.substring(0, 2), 16) || 0,
        g: parseInt(hex.substring(2, 4), 16) || 0,
        b: parseInt(hex.substring(4, 6), 16) || 0
      };
    }
  }

  // 3. Handle rgb(r, g, b) or rgba(r, g, b, a)
  const rgbMatch = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1], 10),
      g: parseInt(rgbMatch[2], 10),
      b: parseInt(rgbMatch[3], 10)
    };
  }

  // 4. Named colors fallback
  const namedColors = {
    white: { r: 255, g: 255, b: 255 },
    black: { r: 0, g: 0, b: 0 },
    cream: { r: 250, g: 247, b: 242 },
    parchment: { r: 245, g: 239, b: 230 }
  };
  if (namedColors[str]) {
    return namedColors[str];
  }

  return { r: 250, g: 244, b: 235 };
}

/**
 * Calculates relative luminance (0 to 1) based on WCAG standard
 * @param {string} colorStr 
 * @returns {number}
 */
export function getLuminance(colorStr) {
  const { r, g, b } = parseColor(colorStr);
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

/**
 * Determines whether a color is perceptually dark
 * @param {string} colorStr 
 * @returns {boolean}
 */
export function isColorDark(colorStr) {
  return getLuminance(colorStr) < 0.38;
}

/**
 * Computes WCAG contrast ratio between two colors (1 to 21)
 * @param {string} color1 
 * @param {string} color2 
 * @returns {number}
 */
export function getContrastRatio(color1, color2) {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Ensures text color has high, comfortable contrast against background (WCAG AA/AAA)
 * Prevents text from ever sinking or fading into cards.
 * @param {string} bgColor 
 * @param {string} preferredTextColor 
 * @returns {string}
 */
export function ensureLegibleTextColor(bgColor, preferredTextColor) {
  const isDarkBg = isColorDark(bgColor);
  const ratio = getContrastRatio(bgColor, preferredTextColor);

  // If contrast is healthy (>= 4.5:1), keep preferred color
  if (ratio >= 4.5) {
    return preferredTextColor;
  }

  // If background is dark and current text is too dark, switch to luminous warm cream/gold
  if (isDarkBg) {
    return '#F4E8CE';
  }

  // If background is light and current text is too light, switch to deep antique ink
  return '#1C1917';
}

