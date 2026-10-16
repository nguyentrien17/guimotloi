/**
 * Font Library — 32+ Vietnamese Supported Fonts & Typography Controls
 * "Gửi một lời — Những lời chưa nói"
 */

export const FONT_CATEGORIES = [
  { id: 'all', name: 'Tất cả font' },
  { id: 'serif', name: 'Serif thanh lịch' },
  { id: 'sans', name: 'Sans-serif hiện đại' },
  { id: 'handwriting', name: 'Chữ viết tay & Thư' },
  { id: 'display', name: 'Display & Cá tính' },
  { id: 'mono', name: 'Đánh máy Mono' },
  { id: 'cute', name: 'Dễ thương & Trẻ trung' }
];

export const FONTS_LIST = [
  // 1. Serif thanh lịch (6 fonts)
  {
    id: 'cormorant',
    name: 'Cormorant Garamond',
    category: 'serif',
    family: "'Cormorant Garamond', Georgia, serif",
    sample: 'Những lời chưa nói hóa thành thơ',
    isSerif: true
  },
  {
    id: 'playfair',
    name: 'Playfair Display',
    category: 'serif',
    family: "'Playfair Display', 'Times New Roman', serif",
    sample: 'Ký ức dịu dàng theo năm tháng',
    isSerif: true
  },
  {
    id: 'lora',
    name: 'Lora Editorial',
    category: 'serif',
    family: "'Lora', Georgia, serif",
    sample: 'Gửi về phương xa lời cầu chúc',
    isSerif: true
  },
  {
    id: 'merriweather',
    name: 'Merriweather',
    category: 'serif',
    family: "'Merriweather', Georgia, serif",
    sample: 'Từng trang giấy thấm đượm tâm tình',
    isSerif: true
  },
  {
    id: 'prata',
    name: 'Prata Elegant',
    category: 'serif',
    family: "'Prata', 'Times New Roman', serif",
    sample: 'Vẻ đẹp cổ điển vượt thời gian',
    isSerif: true
  },
  {
    id: 'cinzel',
    name: 'Cinzel Classic',
    category: 'serif',
    family: "'Cinzel', Georgia, serif",
    sample: 'Trang trọng và uy nghi',
    isSerif: true
  },

  // 2. Sans-serif hiện đại (8 fonts)
  {
    id: 'plus-jakarta',
    name: 'Plus Jakarta Sans',
    category: 'sans',
    family: "'Plus Jakarta Sans', system-ui, sans-serif",
    sample: 'Sạch sẽ, tinh tế, dễ đọc',
    isSerif: false
  },
  {
    id: 'be-vietnam',
    name: 'Be Vietnam Pro',
    category: 'sans',
    family: "'Be Vietnam Pro', system-ui, sans-serif",
    sample: 'Thiết kế chuẩn mực cho tiếng Việt',
    isSerif: false
  },
  {
    id: 'montserrat',
    name: 'Montserrat',
    category: 'sans',
    family: "'Montserrat', system-ui, sans-serif",
    sample: 'Hiện đại và giàu năng lượng',
    isSerif: false
  },
  {
    id: 'inter',
    name: 'Inter Pure',
    category: 'sans',
    family: "'Inter', system-ui, sans-serif",
    sample: 'Chuẩn xác từng chi tiết quang học',
    isSerif: false
  },
  {
    id: 'roboto',
    name: 'Roboto Crisp',
    category: 'sans',
    family: "'Roboto', system-ui, sans-serif",
    sample: 'Cân bằng và thân thuộc',
    isSerif: false
  },
  {
    id: 'open-sans',
    name: 'Open Sans',
    category: 'sans',
    family: "'Open Sans', system-ui, sans-serif",
    sample: 'Thân thiện và rộng mở',
    isSerif: false
  },
  {
    id: 'public-sans',
    name: 'Public Sans',
    category: 'sans',
    family: "'Public Sans', system-ui, sans-serif",
    sample: 'Vững chãi và trung thực',
    isSerif: false
  },
  {
    id: 'manrope',
    name: 'Manrope Geometric',
    category: 'sans',
    family: "'Manrope', system-ui, sans-serif",
    sample: 'Hình học đương đại tối giản',
    isSerif: false
  },

  // 3. Handwriting & Chữ viết tay (6 fonts)
  {
    id: 'dancing-script',
    name: 'Dancing Script',
    category: 'handwriting',
    family: "'Dancing Script', cursive",
    sample: 'Nét chữ bay bổng nhẹ nhàng',
    isSerif: false
  },
  {
    id: 'caveat',
    name: 'Caveat Notes',
    category: 'handwriting',
    family: "'Caveat', cursive",
    sample: 'Như vừa chép vội trên trang nhật ký',
    isSerif: false
  },
  {
    id: 'marck-script',
    name: 'Marck Script',
    category: 'handwriting',
    family: "'Marck Script', cursive",
    sample: 'Thư tay cổ điển mực đen',
    isSerif: false
  },
  {
    id: 'pacifico',
    name: 'Pacifico Wave',
    category: 'handwriting',
    family: "'Pacifico', cursive",
    sample: 'Ngọt ngào như sóng biển vỗ bờ',
    isSerif: false
  },
  {
    id: 'satisfy',
    name: 'Satisfy Brush',
    category: 'handwriting',
    family: "'Satisfy', cursive",
    sample: 'Nét cọ mềm mại chứa chan',
    isSerif: false
  },
  {
    id: 'kalam',
    name: 'Kalam Pen',
    category: 'handwriting',
    family: "'Kalam', cursive",
    sample: 'Bút mực chân thành mộc mạc',
    isSerif: false
  },

  // 4. Monospace đánh máy (4 fonts)
  {
    id: 'jetbrains-mono',
    name: 'JetBrains Mono',
    category: 'mono',
    family: "'JetBrains Mono', monospace",
    sample: 'Dòng lệnh & Ký ức nguyên bản',
    isSerif: false
  },
  {
    id: 'space-mono',
    name: 'Space Mono',
    category: 'mono',
    family: "'Space Mono', monospace",
    sample: 'Máy điện tín truyền tin xa',
    isSerif: false
  },
  {
    id: 'source-code',
    name: 'Source Code Pro',
    category: 'mono',
    family: "'Source Code Pro', monospace",
    sample: 'Đều đặn như tiếng gõ phím',
    isSerif: false
  },
  {
    id: 'fira-code',
    name: 'Fira Code',
    category: 'mono',
    family: "'Fira Code', monospace",
    sample: 'Tối giản và thẳng thắn',
    isSerif: false
  },

  // 5. Display & Cá tính (5 fonts)
  {
    id: 'bricolage',
    name: 'Bricolage Grotesque',
    category: 'display',
    family: "'Bricolage Grotesque', sans-serif",
    sample: 'Cá tính & Nghệ thuật đương đại',
    isSerif: false
  },
  {
    id: 'oswald',
    name: 'Oswald Condensed',
    category: 'display',
    family: "'Oswald', sans-serif",
    sample: 'Mạnh mẽ, cô đọng, sắc bén',
    isSerif: false
  },
  {
    id: 'antonio',
    name: 'Antonio Headline',
    category: 'display',
    family: "'Antonio', sans-serif",
    sample: 'Tiêu đề cao vút ấn tượng',
    isSerif: false
  },
  {
    id: 'comfortaa',
    name: 'Comfortaa Round',
    category: 'display',
    family: "'Comfortaa', cursive",
    sample: 'Tròn trịa, êm dịu, ấm áp',
    isSerif: false
  },
  {
    id: 'lobster',
    name: 'Lobster Retro',
    category: 'display',
    family: "'Lobster', cursive",
    sample: 'Hoài cổ retro thập niên 60',
    isSerif: false
  },

  // 6. Cute & Trẻ trung (3 fonts)
  {
    id: 'quicksand',
    name: 'Quicksand Soft',
    category: 'cute',
    family: "'Quicksand', sans-serif",
    sample: 'Đầu bo tròn, dễ thương, hiền lành',
    isSerif: false
  },
  {
    id: 'nunito',
    name: 'Nunito Friendly',
    category: 'cute',
    family: "'Nunito', sans-serif",
    sample: 'Ấm áp và vô cùng dễ mến',
    isSerif: false
  },
  {
    id: 'playwrite',
    name: 'Playwrite VN',
    category: 'cute',
    family: "'Playwrite VN', cursive",
    sample: 'Nét chữ tập viết thân thương',
    isSerif: false
  }
];

/**
 * Searches and filters fonts
 * @param {Object} options 
 * @returns {Array}
 */
export function filterFonts({ category = 'all', keyword = '' } = {}) {
  let list = [...FONTS_LIST];

  if (category && category !== 'all') {
    list = list.filter(f => f.category === category);
  }

  if (keyword && keyword.trim()) {
    const q = keyword.trim().toLowerCase();
    list = list.filter(f => 
      f.name.toLowerCase().includes(q) || 
      f.sample.toLowerCase().includes(q)
    );
  }

  return list;
}

/**
 * Finds font definition by ID
 * @param {string} id 
 * @returns {Object}
 */
export function getFontById(id) {
  return FONTS_LIST.find(f => f.id === id) || FONTS_LIST[0];
}
