# Gửi Một Lời — Những Lời Chưa Nói

Không gian trực tuyến bằng tiếng Việt để viết những điều chưa nói thành thiệp điện tử, đọc tâm sự của người khác và khám phá các cung bậc cảm xúc. Không cần đăng ký tài khoản.

## Tính năng

- **Viết lời nhắn** (`write.html`): soạn thiệp, chọn mẫu, bảng màu, font, emoji và sticker.
- **Đọc lời nhắn** (`read.html`): đọc, tìm kiếm, lọc và lưu thiệp.
- **Khám phá cảm xúc** (`explore.html`): duyệt lời nhắn theo chủ đề (xin lỗi, gia đình, bạn bè, biết ơn, chữa lành, hy vọng, tình yêu, nhớ về, điều chưa nói).
- **Quản trị** (`admin.html`): quản lý và kiểm duyệt dữ liệu, được ẩn sau đường dẫn bí mật.
- Giao diện responsive, thiết kế mobile-first.

## Công nghệ

- Vanilla JavaScript (ES modules), HTML5, CSS3, không dùng framework UI
- [Vite](https://vite.dev/) để build
- Cloudflare Worker (`worker/index.js`) đứng trước bản build tĩnh để ẩn trang admin và cung cấp API đăng nhập admin
- Mỗi trang là một file HTML độc lập với file JS riêng

## Cấu trúc thư mục

```
├── index.html, write.html, read.html, explore.html, admin.html
├── css/            # variables, base, layout, components, editor, admin, responsive
├── js/
│   ├── pages/      # logic từng trang
│   ├── components/ # card-renderer, color-palette, emoji-picker, font-library, ...
│   ├── data/       # model và repository dữ liệu
│   └── utils/      # storage, validation, xml-parser, color-utils
├── data/           # bộ mẫu thiệp (templates-100.js)
├── public/data/messages/   # lời nhắn mẫu theo chủ đề (XML)
├── worker/index.js # Cloudflare Worker
└── wrangler.jsonc  # cấu hình triển khai
```

Chi tiết yêu cầu sản phẩm xem trong [PROJECT_BRIEF.md](PROJECT_BRIEF.md).

## Chạy trên máy

Yêu cầu: Node.js 18+.

```bash
npm install
npm run dev      # chạy tại http://localhost:3000
npm run build    # build ra thư mục dist/
npm run preview  # xem thử bản build
npm run lint     # kiểm tra kiểu bằng tsc
```

## Triển khai (Cloudflare Workers)

```bash
npm run build
npx wrangler deploy
```

Trang admin chỉ hoạt động khi đã cấu hình đủ các secret của Worker:

| Secret | Ý nghĩa |
|---|---|
| `ADMIN_PATH` | Đường dẫn bí mật tới trang admin, ví dụ `/quan-ly-7f3k9x2m` (dài, ngẫu nhiên) |
| `ADMIN_USERNAME` | Tên đăng nhập admin |
| `ADMIN_PASSWORD` | Mật khẩu admin |
| `ADMIN_SESSION_SECRET` | Chuỗi ngẫu nhiên dùng để ký token phiên (hiệu lực 24 giờ) |

```bash
npx wrangler secret put ADMIN_PATH
```

Nếu thiếu bất kỳ secret nào, trang admin và API đăng nhập bị tắt (trả về 404). Các đường dẫn `/admin`, `/admin.html` luôn trả về 404.

## Lưu ý

Dữ liệu người dùng lưu trên trình duyệt (local storage) và không tự đồng bộ giữa các thiết bị hay người dùng.
