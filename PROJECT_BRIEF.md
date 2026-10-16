# MASTER PROMPT — XÂY DỰNG WEB APP “GỬI MỘT LỜI — NHỮNG LỜI CHƯA NÓI”

## 0. VAI TRÒ VÀ MỤC TIÊU

Bạn là một Senior Software Architect, Senior Frontend Engineer, UI/UX Designer và QA Engineer. Nhiệm vụ của bạn là thiết kế và xây dựng hoàn chỉnh một ứng dụng web có tên:

**Gửi Một Lời — Những Lời Chưa Nói**

Đây là một không gian trực tuyến bằng tiếng Việt, nơi mọi người có thể viết những điều chưa nói thành thiệp điện tử, chia sẻ lời nhắn ẩn danh, đọc những tâm sự của người khác và khám phá các cung bậc cảm xúc.

Sản phẩm phải có giao diện tinh tế, giàu cảm xúc, dễ sử dụng, hoạt động tốt trên mọi kích thước màn hình và có kiến trúc đủ rõ ràng để phát triển thành một hệ thống thực tế trong tương lai.

### Nguyên tắc bắt buộc

1. Xây dựng dự án mới hoàn toàn, không yêu cầu repository cũ.
2. Không chỉ tạo bản thiết kế hoặc giao diện tĩnh. Các chức năng được yêu cầu phải thực sự hoạt động trong phạm vi kỹ thuật cho phép.
3. Không sử dụng React, Vue, Angular, Svelte hoặc bất kỳ framework UI nào.
4. Sử dụng Vanilla JavaScript ES modules, HTML5, CSS3 và Vite.
5. Mỗi trang là một file HTML độc lập, sử dụng file JavaScript riêng thông qua `<script type="module">`.
6. Thiết kế responsive mobile-first, hỗ trợ mọi kích thước màn hình thông dụng và có cơ chế xử lý bố cục linh hoạt trên những kích thước khác.
7. Tách biệt UI, nghiệp vụ, truy cập dữ liệu và xác thực.
8. Không giả lập rằng dữ liệu lưu trên một trình duyệt có thể tự động đồng bộ sang người dùng khác.
9. Không tạo cơ chế bảo mật giả hoặc nhúng thông tin đăng nhập thật vào mã nguồn phía client.
10. Không tuyên bố đã hoàn thành một chức năng nếu chức năng đó chưa được triển khai và kiểm thử.

Hãy chủ động đưa ra quyết định kỹ thuật hợp lý khi yêu cầu đã đủ rõ. Chỉ hỏi lại khi thiếu thông tin thực sự cần thiết.

---

# PHẦN I — PHẠM VI SẢN PHẨM

## 1. Đối tượng và trải nghiệm người dùng

Ứng dụng hướng đến những người muốn gửi một lời nhắn cho ai đó, viết điều khó nói thành lời hoặc đọc những câu chuyện ngắn từ người xa lạ.

Phong cách trải nghiệm:

- Nhẹ nhàng, riêng tư, ấm áp và giàu cảm xúc.
- Không phán xét người viết.
- Không yêu cầu đăng ký tài khoản trong giai đoạn đầu.
- Giao diện tiếng Việt là mặc định.
- Hạn chế các yếu tố gây xao nhãng.
- Không sử dụng quá nhiều hiệu ứng chuyển động hoặc màu sắc chói.
- Ưu tiên khả năng đọc, sự thoải mái và trải nghiệm trên thiết bị di động.

Không sử dụng thiết kế dashboard quản trị làm phong cách chủ đạo cho các trang dành cho người dùng.

## 2. Danh sách trang

Xây dựng đầy đủ các trang sau:

| Trang | File HTML | Mục đích |
|---|---|---|
| Trang chủ | `index.html` | Giới thiệu và khám phá lời nhắn |
| Viết lời nhắn | `write.html` | Soạn và tùy chỉnh thiệp |
| Đọc lời nhắn | `read.html` | Đọc, tìm kiếm, lọc và lưu thiệp |
| Khám phá cảm xúc | `explore.html` | Khám phá lời nhắn theo chủ đề |
| Quản trị | `admin.html` | Quản lý và kiểm duyệt dữ liệu demo |

Tất cả trang phải dùng chung design system, header, footer, thông báo, modal và component thiệp khi phù hợp.

Không sao chép nguyên khối HTML và CSS của một component sang nhiều trang.

---

# PHẦN II — YÊU CẦU RESPONSIVE BẮT BUỘC

## 3. Nguyên tắc tương thích thiết bị

Đây là một trong những yêu cầu ưu tiên cao nhất của toàn bộ dự án.

**Tất cả các trang, component và chức năng phải thích ứng với mọi kích thước màn hình thông dụng, từ điện thoại nhỏ đến màn hình desktop lớn. Không được chỉ tối ưu cho một kích thước màn hình cố định.**

Phải thiết kế theo mobile-first: bắt đầu từ bố cục điện thoại, sau đó mở rộng hợp lý cho tablet, laptop và desktop.

Không được chỉ làm giao diện desktop rồi thu nhỏ bằng cách giảm kích thước toàn bộ thành phần.

### 3.1. Phạm vi kiểm thử màn hình

Tối thiểu phải kiểm thử các viewport sau:

| Nhóm thiết bị | Viewport tham chiếu |
|---|---|
| Điện thoại rất nhỏ | 320 × 568 |
| Điện thoại nhỏ | 360 × 640 |
| Điện thoại thông dụng | 375 × 667 |
| Điện thoại hiện đại | 390 × 844 |
| Điện thoại lớn | 430 × 932 |
| Tablet dọc | 768 × 1024 |
| Tablet ngang | 1024 × 768 |
| Laptop | 1280 × 720 |
| Desktop | 1440 × 900 |
| Màn hình rộng | 1920 × 1080 |

Đây là các kích thước kiểm thử tham chiếu, không phải danh sách thiết bị được hỗ trợ duy nhất.

Phải xử lý tốt cả các chiều rộng nằm giữa những mốc trên, chế độ xoay ngang/dọc và trường hợp chiều cao màn hình thấp.

### 3.2. Quy tắc layout

- Không xuất hiện thanh cuộn ngang ngoài ý muốn trên toàn trang.
- Không có chữ, nút, icon, modal hoặc thiệp bị cắt khỏi viewport.
- Không dùng chiều rộng, chiều cao hoặc tọa độ cố định nếu có thể dùng bố cục linh hoạt.
- Ưu tiên CSS Grid, Flexbox, `minmax()`, `clamp()`, `%`, `rem`, `max-width` và các đơn vị viewport phù hợp.
- Dùng `min-width: 0` cho các phần tử con trong Grid/Flex khi cần để tránh tràn nội dung.
- Ảnh phải có tỷ lệ phù hợp, không méo hình.
- Nội dung dài phải xuống dòng hợp lý bằng các thuộc tính như `overflow-wrap`.
- Container chính phải có chiều rộng tối đa hợp lý và tự căn giữa trên màn hình lớn.
- Khoảng trắng, kích thước chữ, lề và khoảng cách phải thay đổi linh hoạt theo viewport.
- Không ẩn chức năng quan trọng chỉ để làm giao diện gọn hơn trên điện thoại.
- Không sử dụng desktop-only hover làm cách duy nhất để mở menu hoặc thao tác.
- Phải hỗ trợ cả thao tác chạm, chuột và bàn phím.

### 3.3. Breakpoint

Có thể sử dụng các breakpoint khởi đầu sau, nhưng được phép điều chỉnh theo nội dung thực tế:

- Dưới 480px: điện thoại nhỏ.
- Từ 480px đến dưới 768px: điện thoại lớn và thiết bị trung gian.
- Từ 768px đến dưới 1024px: tablet.
- Từ 1024px đến dưới 1440px: laptop và desktop thông dụng.
- Từ 1440px trở lên: desktop rộng.

Không bắt buộc mọi component phải sử dụng cùng một breakpoint. Hãy chọn breakpoint dựa trên thời điểm nội dung thực sự cần đổi bố cục.

### 3.4. Header và điều hướng

- Desktop: có thể sử dụng thanh điều hướng ngang.
- Mobile: chuyển thành menu phù hợp với màn hình nhỏ.
- Nút menu phải có kích thước chạm đủ lớn và trạng thái mở/đóng rõ ràng.
- Không để các mục điều hướng đè lên logo hoặc nút CTA.
- Khi menu mở, phải có cách đóng rõ ràng, hỗ trợ bàn phím và không gây mất kiểm soát tiêu điểm.
- Không yêu cầu người dùng phải rê chuột để truy cập chức năng.

### 3.5. Kích thước vùng tương tác

- Mục tiêu tối thiểu 44 × 44 CSS px cho các nút và icon button trên thiết bị cảm ứng.
- Các nút đặt gần nhau phải có khoảng cách đủ để tránh bấm nhầm.
- Không dùng icon nhỏ làm vùng chạm duy nhất.
- Input, select, textarea và nút hành động phải dễ sử dụng trên màn hình nhỏ.
- Không để bàn phím ảo che nút gửi hoặc nút lưu.

### 3.6. Tab, chip và thanh công cụ

Các thanh tab, filter chip và thanh công cụ có nhiều mục phải:

- Cuộn ngang mượt khi không đủ chiều rộng.
- Không ép chữ xuống nhiều dòng gây vỡ bố cục.
- Không cắt mất item cuối.
- Có thể nhận biết mục đang được chọn.
- Hỗ trợ thao tác bằng bàn phím khi phù hợp.
- Không tạo thanh cuộn ngang cho toàn bộ trang chỉ vì một thanh tab.

### 3.7. Modal và vùng nhập liệu

- Ưu tiên `100dvh` và có fallback phù hợp cho trình duyệt cũ.
- Modal cao phải có vùng nội dung cuộn riêng.
- Nút xác nhận và hủy phải luôn có thể truy cập.
- Xử lý tốt bàn phím ảo trên điện thoại.
- Không khóa trang ở trạng thái không thể cuộn hoặc không thể đóng modal.
- Có thể đóng bằng nút đóng và phím Escape khi phù hợp.
- Khi đóng modal, tiêu điểm bàn phím nên quay về phần tử đã mở modal.

### 3.8. Trình soạn thiệp trên điện thoại

Trình soạn thiệp phải được thiết kế riêng cho màn hình nhỏ, không bê nguyên bố cục desktop sang mobile.

- Desktop: có thể sử dụng bố cục hai cột gồm vùng chỉnh sửa và preview.
- Tablet: giảm chiều rộng các panel, cho phép bố cục linh hoạt.
- Mobile: chuyển thành bố cục một cột, có thể đặt preview phía trên hoặc phía dưới các công cụ.
- Có thể sử dụng nút hoặc tab chuyển đổi giữa chỉnh sửa và xem trước nếu cần.
- Các điều khiển màu, font, sticker và căn chỉnh phải dễ thao tác bằng ngón tay.
- Không để canvas hoặc preview vượt quá chiều rộng màn hình.
- Khi xoay thiết bị, thiệp và sticker phải giữ đúng tỷ lệ, không mất vị trí.

### 3.9. Sticker và vùng thiệp

- Khung thiệp sử dụng `aspect-ratio` phù hợp, không chỉ dùng `min-height`.
- Vị trí sticker lưu theo tọa độ phần trăm tương đối với khung thiệp.
- Không lưu vị trí dựa trên tọa độ pixel tuyệt đối của màn hình.
- Kéo thả phải hoạt động bằng cảm ứng và chuột.
- Có thể dùng Pointer Events để thống nhất cách xử lý.
- Xử lý sự kiện `pointerdown`, `pointermove`, `pointerup` và `pointercancel` phù hợp.
- Không để thao tác kéo sticker làm cuộn trang ngoài ý muốn.
- Cho phép chọn, di chuyển, đổi kích thước, xoay và xóa sticker.
- Không làm mất thao tác cuộn trang ở những vùng khác.
- Sticker phải tránh hoặc có thể được người dùng điều chỉnh khỏi vùng tiêu đề và icon cảm xúc.

### 3.10. Khả năng tiếp cận

- Tương phản chữ và nền đáp ứng WCAG 2.2 AA ở các trường hợp phù hợp.
- Không truyền tải trạng thái chỉ bằng màu sắc.
- Có focus indicator rõ ràng.
- Form có label và thông báo lỗi dễ hiểu.
- Hỗ trợ điều hướng bằng bàn phím.
- Sử dụng ngữ nghĩa HTML đúng.
- Tôn trọng `prefers-reduced-motion`.
- Không dùng hiệu ứng chớp nháy gây khó chịu.

### 3.11. Kiểm thử responsive thực tế

Sau khi triển khai, phải kiểm tra từng trang và các chức năng chính tại những viewport tham chiếu.

Báo cáo rõ:

- Viewport đã kiểm tra.
- Lỗi layout được phát hiện.
- Lỗi đã sửa.
- Vấn đề chưa thể kiểm chứng trên thiết bị thật.

Không được khẳng định tương thích tuyệt đối với mọi thiết bị nếu chưa kiểm thử. Mục tiêu là thiết kế linh hoạt, tuân thủ tiêu chuẩn web và có khả năng thích ứng với các kích thước màn hình khác nhau.

---

# PHẦN III — CÔNG NGHỆ VÀ KIẾN TRÚC

## 4. Công nghệ bắt buộc

- HTML5.
- CSS3 thuần.
- Vanilla JavaScript ES modules.
- Vite làm dev server và bundler.
- XML làm nguồn dữ liệu mẫu công khai.
- `localStorage` cho bản nháp, yêu thích và dữ liệu cục bộ của bản demo.
- HTML5 Canvas hoặc giải pháp tương thích đã được kiểm thử để xuất ảnh PNG.

Không sử dụng framework UI hoặc CSS framework.

Có thể dùng thư viện chuyên dụng nhỏ nếu thực sự cần, ví dụ để hỗ trợ xuất ảnh. Mọi dependency phải được khai báo trong `package.json`, có lý do sử dụng và không được thay thế kiến trúc Vanilla JavaScript.

## 5. Cấu hình Vite

- Cấu hình multi-page build thông qua `build.rollupOptions.input`.
- Các file HTML phải là entry point độc lập.
- Tổ chức mã nguồn theo module.
- Dùng alias rõ ràng nếu có lợi cho bảo trì.
- Cấu hình đường dẫn tài nguyên tương đối phù hợp với môi trường triển khai.
- Bảo đảm CSS, JavaScript, font và XML được tải đúng sau khi build production.
- Không chỉ kiểm tra bằng dev server.
- Cung cấp lệnh build và preview production.

Các lệnh tối thiểu:

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run preview`

Nếu bổ sung lint hoặc test, hãy cấu hình và cung cấp các lệnh tương ứng.

## 6. Kiến trúc module

Tổ chức dự án theo nguyên tắc phân tách trách nhiệm:

- `pages`: logic khởi tạo riêng cho từng trang.
- `components`: component giao diện dùng chung.
- `features`: nghiệp vụ độc lập.
- `repositories`: tầng truy cập dữ liệu.
- `services`: nghiệp vụ dùng chung và tích hợp hệ thống.
- `utils`: các hàm thuần, định dạng và kiểm tra.
- `styles`: design token, base style và component style.
- `data`: fallback data và dữ liệu cấu hình.
- `public/data/messages`: các file XML công khai.

Cấu trúc thư mục gợi ý:

```text
project/
├── index.html
├── write.html
├── read.html
├── explore.html
├── admin.html
├── package.json
├── vite.config.js
├── README.md
├── public/
│   └── data/
│       └── messages/
│           ├── miss_you.xml
│           ├── family.xml
│           ├── love.xml
│           ├── healing.xml
│           ├── gratitude.xml
│           ├── friends.xml
│           ├── apology.xml
│           ├── unsaid.xml
│           └── hope.xml
└── src/
    ├── pages/
    │   ├── home/
    │   ├── write/
    │   ├── read/
    │   ├── explore/
    │   └── admin/
    ├── components/
    │   ├── card/
    │   ├── modal/
    │   ├── tabs/
    │   ├── filters/
    │   ├── notification/
    │   └── navigation/
    ├── features/
    │   ├── message-editor/
    │   ├── template-gallery/
    │   ├── sticker-editor/
    │   ├── favorites/
    │   └── moderation/
    ├── repositories/
    │   ├── messageRepository.js
    │   ├── adminRepository.js
    │   ├── local/
    │   └── xml/
    ├── services/
    ├── utils/
    ├── data/
    │   ├── fallbackMessages.js
    │   ├── categories.js
    │   └── templates.js
    └── styles/
        ├── tokens.css
        ├── base.css
        ├── typography.css
        ├── layout.css
        ├── components.css
        ├── utilities.css
        └── responsive.css
```

Đây là cấu trúc định hướng. Có thể chia nhỏ hoặc điều chỉnh nếu có lý do kỹ thuật, nhưng không được gom toàn bộ ứng dụng vào một file JavaScript hoặc một file CSS khổng lồ.

## 7. Repository interface

Giao diện không được tự truy cập trực tiếp `localStorage` hoặc tự fetch XML ở nhiều nơi.

Thiết kế repository để sau này thay nguồn dữ liệu bằng API thật mà không phải sửa UI.

Các phương thức gợi ý:

```js
messageRepository.getMessages(filters)
messageRepository.getMessageById(id)
messageRepository.createMessage(payload)
messageRepository.updateMessage(id, changes)
messageRepository.deleteMessage(id, options)
messageRepository.getDraft()
messageRepository.saveDraft(draft)
messageRepository.getFavorites()
messageRepository.toggleFavorite(id)

adminRepository.getStats(filters)
adminRepository.getMessages(filters)
adminRepository.moderateMessage(id, action, reason)
adminRepository.getAuditLogs(filters)
```

Đây là hợp đồng định hướng. Hãy điều chỉnh chữ ký để phù hợp với nghiệp vụ thực tế và thống nhất giữa các implementation.

Các phương thức bất đồng bộ nên trả về Promise nhất quán, kể cả khi implementation hiện tại sử dụng dữ liệu cục bộ.

Không để UI phụ thuộc vào cách dữ liệu được lưu trữ.

---

# PHẦN IV — MÔ HÌNH DỮ LIỆU VÀ LƯU TRỮ

## 8. Mô hình Message

Mỗi lời nhắn phải có cấu trúc dữ liệu thống nhất.

```js
{
  id: "unique-id",
  content: "Nội dung lời nhắn",
  category: "miss_you",
  categoryName: "Nỗi nhớ",
  emotion: "💌",
  alias: "Một người xa lạ",
  createdAt: "2026-10-16T08:30:00.000Z",

  status: "pending",

  source: "local",
  isLocal: true,

  moderationReason: null,
  moderatedAt: null,
  moderatedBy: null,

  design: {
    template: "template-id",
    background: "#F8EFE8",
    textColor: "#493A3A",
    font: "serif",
    pattern: "none",
    textAlign: "center",

    stickers: [
      {
        id: "sticker-id",
        emoji: "🌷",
        x: 85,
        y: 15,
        scale: 1,
        rotation: 0
      }
    ]
  }
}
```

Quy tắc:

- `id` phải duy nhất.
- `createdAt` dùng ISO 8601.
- Thời gian hiển thị theo múi giờ địa phương của người xem.
- `status` chỉ nhận các giá trị được quy định.
- `source` thể hiện nguồn dữ liệu, ví dụ `xml`, `local` hoặc `api`.
- `isLocal` chỉ là thuộc tính hỗ trợ trải nghiệm bản demo, không phải cơ chế xác thực.
- `moderationReason`, `moderatedAt` và `moderatedBy` phải được quản lý nhất quán.
- `design` cần có giá trị mặc định hợp lệ.
- Vị trí sticker dùng phần trăm trong khung thiệp.
- Dữ liệu đầu vào phải được xác thực trước khi lưu.
- Không tin tưởng các trường trạng thái hoặc quyền do client gửi lên khi tích hợp backend.

### 8.1. Trạng thái nghiệp vụ

Sử dụng các trạng thái:

- `pending`: chờ duyệt.
- `published`: đã được công khai.
- `hidden`: bị ẩn.
- `deleted`: đã xóa mềm.

Xóa cứng là một thao tác riêng, không phải trạng thái.

Quy tắc hiển thị:

- Chỉ lời nhắn hợp lệ có trạng thái `published` mới được xuất hiện trong danh sách công khai.
- Bản nháp không được xem là lời nhắn đã gửi.
- Lời nhắn `pending`, `hidden` và `deleted` không xuất hiện ở trang đọc công khai.
- Lời nhắn XML mẫu được đánh dấu là nguồn `xml`.
- Dữ liệu cục bộ phải được phân biệt rõ với dữ liệu máy chủ.
- Không cho phép thay đổi trạng thái quản trị chỉ bằng thao tác sửa giao diện.
- Trường hợp xóa mềm phải có thể khôi phục theo quyền phù hợp.

Trong bản demo, các quy tắc này chỉ bảo đảm hành vi nhất quán trên trình duyệt hiện tại, không cung cấp tính toàn vẹn dữ liệu giữa nhiều người dùng.

## 9. Danh mục cảm xúc

Cố định chín danh mục:

| ID | Tên |
|---|---|
| `miss_you` | Nỗi nhớ |
| `family` | Gia đình |
| `love` | Tình yêu |
| `healing` | Chữa lành |
| `gratitude` | Lời cảm ơn |
| `friends` | Bạn bè |
| `apology` | Lời xin lỗi |
| `unsaid` | Những điều khó nói |
| `hope` | Hy vọng |

Định nghĩa trong một module dùng chung. Không lặp lại danh mục dưới dạng các mảng độc lập ở từng trang.

## 10. XML và dữ liệu fallback

Tạo chín file XML, mỗi file ứng với một danh mục.

Mỗi file có khoảng 2–3 lời nhắn mẫu, tổng cộng tối thiểu 18 lời nhắn.

Nội dung phải bằng tiếng Việt tự nhiên, chân thật, giàu cảm xúc và không rập khuôn.

Yêu cầu:

- Không sử dụng các câu văn giống nhau chỉ thay một vài từ.
- Bao phủ nhiều hoàn cảnh và góc nhìn.
- Không viết tất cả lời nhắn theo kiểu tình yêu đôi lứa.
- Các lời nhắn phải phù hợp với danh mục.
- Những lời nhắn dành riêng cho một người cụ thể trong gia đình phải có thông tin ngữ cảnh rõ ràng.

Dữ liệu XML phải có schema nhất quán và được parse an toàn.

Repository cần:

1. Fetch song song các file XML bằng `Promise.allSettled` hoặc cơ chế tương đương có thể cô lập lỗi từng file.
2. Parse và xác thực từng file.
3. Bỏ qua hoặc báo lỗi rõ ràng với dữ liệu XML không hợp lệ.
4. Tiếp tục tải các danh mục khác khi một file bị lỗi.
5. Gộp các kết quả hợp lệ.
6. Dùng fallback nhúng trong JavaScript nếu toàn bộ dữ liệu XML không khả dụng.
7. Không nhân đôi dữ liệu fallback và dữ liệu XML.
8. Sắp xếp lời nhắn theo `createdAt` giảm dần khi hiển thị danh sách mới nhất.

**Không được chỉ dựa vào dữ liệu trong thư mục `src` nếu production build không đưa dữ liệu đó ra đúng đường dẫn.**

Phải kiểm tra thực tế các file XML sau khi build và preview production.

---

# PHẦN V — DESIGN SYSTEM

## 11. Ngôn ngữ thiết kế

Tạo một design system thống nhất, lấy cảm hứng từ giấy viết thư, phong bì, sổ tay, bưu thiếp và những kỷ niệm cá nhân.

Không sao chép nguyên mẫu giao diện của một website có sẵn.

Thiết kế phải có bản sắc riêng, tinh tế, dễ đọc và đủ hiện đại.

### 11.1. Bảng màu

Màu chủ đạo:

- Nền kem ấm.
- Chữ chính màu mực đậm.
- Hồng bụi làm accent.
- Lavender.
- Xanh sage.
- Peach.
- Xanh đêm.
- Vàng nhạt dùng cho một số mẫu tối.

Tạo các cặp màu nền/chữ có tương phản phù hợp.

Tất cả màu sắc phải được định nghĩa thành CSS custom properties trong file `tokens.css`.

Ví dụ:

```css
:root {
  --color-background: #FAF6F0;
  --color-surface: #FFFDF9;
  --color-text: #342D2D;
  --color-text-muted: #756A6A;
  --color-accent: #B66E7C;
  --color-accent-hover: #965564;
  --color-border: #E7DDD5;

  --color-lavender: #E9E2F5;
  --color-lavender-deep: #66517D;
  --color-sage: #E0EADF;
  --color-sage-deep: #49634E;

  --color-night: #202638;
  --color-night-text: #F5EAD0;
}
```

Đây là giá trị khởi đầu, có thể điều chỉnh trong quá trình thiết kế.

Các file CSS còn lại phải tham chiếu design token, không hard-code màu riêng lẻ.

Nếu cần thêm màu, phải bổ sung token có tên và mục đích rõ ràng.

Màu của từng mẫu thiệp có thể được lưu trong dữ liệu template, nhưng phải tuân theo bảng màu được quản lý tập trung.

### 11.2. Typography

Sử dụng tối thiểu sáu font có vai trò riêng biệt:

1. Serif thanh lịch: thương hiệu và tiêu đề chính.
2. Sans hiện đại: nội dung, form và giao diện mặc định.
3. Script hoặc handwriting: lời trích dẫn và điểm nhấn cá nhân.
4. Accent: nhãn nhỏ, kicker và eyebrow.
5. Display: tiêu đề phụ và card title.
6. Mono hoặc một font có character riêng: mã, nhãn hoặc mẫu thiệp đặc biệt.

Có thể cân nhắc Playfair Display, Be Vietnam Pro, Dancing Script, DM Mono, Cormorant Garamond và một font display phù hợp.

Phải kiểm tra khả năng hiển thị tiếng Việt, bao gồm dấu và ký tự đặc biệt, trước khi chọn font chính thức.

Quy định rõ vai trò font trong token:

```css
:root {
  --font-heading: "Playfair Display", serif;
  --font-body: "Be Vietnam Pro", sans-serif;
  --font-script: "Dancing Script", cursive;
  --font-accent: "DM Mono", monospace;
  --font-display: "Cormorant Garamond", serif;
  --font-special: monospace;
}
```

Đây là ví dụ minh họa. Có thể điều chỉnh danh sách font nhưng phải giữ rõ vai trò.

- Không sử dụng font script cho nội dung dài.
- Không để font tải chậm làm vỡ bố cục.
- Có fallback font phù hợp.
- Cân nhắc tải font cần thiết theo mức độ ưu tiên và điều kiện mạng.

### 11.3. Spacing, radius, shadow và motion

Tạo token cho:

- Spacing.
- Border radius từ 4px đến pill.
- Border width.
- Shadow tối thiểu bốn cấp.
- Transition fast, normal và gentle.
- Container width.
- Breakpoint.
- Z-index.

Không sử dụng các giá trị tùy ý tràn lan trong CSS.

Hiệu ứng chuyển động phải nhẹ nhàng, không làm giảm khả năng sử dụng hoặc ảnh hưởng hiệu suất.

---

# PHẦN VI — COMPONENT THIỆP DÙNG CHUNG

## 12. Message Card

Xây dựng một component thiệp dùng chung cho trang chủ, đọc lời nhắn, khám phá cảm xúc và phong thư ngẫu nhiên.

Không tạo nhiều phiên bản component gần giống nhau chỉ vì xuất hiện ở các trang khác nhau.

Component nhận dữ liệu thiệp và các tùy chọn hiển thị cần thiết.

Các thành phần:

- Header.
- Tên danh mục.
- Ngày tạo theo định dạng `dd/mm/yyyy`.
- Icon cảm xúc.
- Nội dung lời nhắn.
- Danh xưng người viết.
- Nút yêu thích.
- Nút tải PNG nếu phù hợp.
- Sticker trang trí.
- Lớp pattern nền.
- Tương tác mở chi tiết.

Yêu cầu kỹ thuật:

- Pattern là lớp overlay độc lập, không ghi đè gradient nền.
- Sticker phải giữ đúng tỷ lệ.
- Sticker gần góc trên bên phải phải tránh icon cảm xúc mặc định.
- Nội dung dài không làm vỡ khung thiệp.
- Component phải hỗ trợ các biến thể kích thước theo ngữ cảnh.
- Không hiển thị nút hoặc trạng thái tương tác không hoạt động.
- Ngày tạo phải được định dạng theo locale phù hợp.
- Không sử dụng dạng “3 giờ trước” cho component này.

Nếu thiệp có thao tác mở chi tiết, phải phân biệt thao tác đó với các nút yêu thích hoặc tải ảnh bên trong để tránh kích hoạt nhầm.

---

# PHẦN VII — YÊU CẦU TỪNG TRANG

## 13. Trang chủ — `index.html`

### 13.1. Hero

- Logo và thương hiệu.
- Tiêu đề giàu cảm xúc.
- Mô tả ngắn gọn.
- CTA chính: “Viết một lời nhắn”.
- CTA phụ: “Đọc ngẫu nhiên”.
- Hình ảnh hoặc minh họa mang tính biểu tượng.
- Layout thích ứng từ mobile đến desktop.

### 13.2. Phong thư tương tác

- Hiển thị phong thư ở trạng thái đóng.
- Khi người dùng nhấn, phong thư mở bằng animation nhẹ.
- Hiển thị một lời nhắn ngẫu nhiên phù hợp với ngữ cảnh.
- Có nút đọc lời nhắn khác.
- Có nút lưu yêu thích.
- Có nút mở thiệp chi tiết.
- Có trạng thái loading, lỗi và trường hợp không có dữ liệu.
- Tôn trọng `prefers-reduced-motion`.

Không chọn ngẫu nhiên những lời nhắn có ngữ cảnh quá riêng tư khi giới thiệu là lời nhắn dành cho bất kỳ ai.

Ví dụ, thư viết riêng cho mẹ, bố hoặc bà phải được loại trừ khỏi luồng ngẫu nhiên chung, trừ khi người dùng đã chọn đúng chủ đề.

### 13.3. Lời nhắn mới nhất

- Hiển thị lưới thiệp.
- Sắp xếp theo `createdAt` giảm dần.
- Có giới hạn số lượng hiển thị.
- Có liên kết xem tất cả.
- Không để dữ liệu cũ hoặc dữ liệu bị ẩn xuất hiện.
- Grid tự chuyển số cột theo chiều rộng màn hình.

### 13.4. Showcase mẫu thiệp

- Giới thiệu các phong cách thiệp.
- Có thumbnail và tên mẫu.
- Có thể chuyển sang trang viết với mẫu đã chọn.
- Dữ liệu mẫu lấy từ template registry.
- Không tạo danh sách HTML thủ công tách biệt với dữ liệu thực.

### 13.5. Nguyên tắc cộng đồng

Giải thích rõ:

- Tôn trọng sự riêng tư.
- Không công kích hoặc quấy rối.
- Không đăng thông tin cá nhân của người khác.
- Không đăng nội dung trái pháp luật.
- Nội dung có thể được kiểm duyệt theo quy tắc cộng đồng.

### 13.6. Footer

Có điều hướng tới các trang, thông tin về sản phẩm, chính sách riêng tư và nguyên tắc cộng đồng.

---

## 14. Trang viết lời nhắn — `write.html`

Đây là một trong những chức năng quan trọng nhất của sản phẩm.

### 14.1. Cấu trúc trình soạn

Chia thành bốn nhóm công cụ:

**A. Nội dung**

- Nhập lời nhắn.
- Chọn danh mục.
- Chọn emoji.
- Nhập danh xưng.
- Đếm số ký tự.
- Hiển thị giới hạn ký tự.
- Kiểm tra nội dung rỗng hoặc quá dài.
- Thông báo lỗi rõ ràng.

**B. Mẫu thiệp**

- Thư viện tối thiểu 100 mẫu.
- Có tìm kiếm mẫu.
- Có lọc theo phong cách.
- Có lọc theo màu.
- Có lọc theo chủ đề.
- Có thumbnail.
- Có đánh dấu mẫu đang chọn.
- Có preview trước khi áp dụng.

**C. Màu sắc và chữ**

- Chọn màu nền.
- Chọn màu chữ.
- Chọn font.
- Chọn căn trái, giữa hoặc phải.
- Chọn pattern.
- Chọn hiệu ứng đổ bóng chữ.
- Hiển thị cảnh báo tương phản.
- Có tùy chọn màu đề xuất.
- Có nút khôi phục thiết kế mặc định.

**D. Sticker**

- Thư viện sticker.
- Thêm sticker vào thiệp.
- Kéo thả.
- Thay đổi vị trí.
- Thay đổi kích thước.
- Xoay sticker.
- Xóa sticker.
- Khôi phục vị trí mặc định nếu cần.
- Hỗ trợ cảm ứng và chuột.

### 14.2. Live preview

Mọi thay đổi về nội dung hoặc thiết kế phải được phản ánh ngay trong preview.

Không cần tải lại trang để cập nhật.

Preview và thiệp được lưu phải sử dụng cùng một cấu trúc dữ liệu thiết kế.

### 14.3. Tự động lưu bản nháp

- Lưu nội dung và thiết kế vào `localStorage`.
- Có thông báo “Đang lưu”, “Đã lưu” hoặc lỗi lưu.
- Có thể khôi phục bản nháp sau khi tải lại trang.
- Không ghi đè bản nháp bằng dữ liệu rỗng khi trang khởi tạo.
- Có xử lý trường hợp `localStorage` bị đầy hoặc không khả dụng.
- Có thể xóa bản nháp theo xác nhận của người dùng.

### 14.4. Xuất PNG

- Xuất thiệp thành ảnh PNG.
- Giữ đúng màu sắc, font, pattern và sticker trong phạm vi được hỗ trợ.
- Không xuất các nút điều khiển của trình soạn.
- Chờ tài nguyên cần thiết tải xong.
- Hiển thị tiến trình hoặc trạng thái xuất.
- Thông báo rõ nếu xuất thất bại.
- Có nút thử lại.
- Kiểm tra khả năng tải ảnh trên desktop và mobile.

Không tuyên bố xuất ảnh hoàn hảo nếu thư viện hoặc trình duyệt không hỗ trợ đầy đủ một hiệu ứng.

### 14.5. Gửi lời nhắn và quy trình kiểm duyệt

**Quy tắc bắt buộc: mọi lời nhắn mới do người dùng gửi phải có trạng thái mặc định là `pending` (chờ duyệt), không được tự động chuyển thành `published`.**

Trong phiên bản demo chưa có backend:

- Xác thực nội dung trước khi gửi.
- Tạo ID duy nhất và thời gian tạo theo ISO 8601.
- Lưu lời nhắn vào kho dữ liệu cục bộ với `source: "local"` và `status: "pending"`.
- Thông báo rõ lời nhắn đã được lưu cục bộ và đang chờ duyệt.
- Không hiển thị lời nhắn đó trong danh sách công khai hoặc luồng đọc ngẫu nhiên.
- Cho phép xem lời nhắn trong khu vực dữ liệu cục bộ của người viết, kèm trạng thái chờ duyệt.
- Nếu thao tác lưu thất bại, hiển thị lỗi và không thông báo gửi thành công.

Trong phiên bản có backend thật:

- Gửi lời nhắn đến API.
- Server tự xác thực dữ liệu và thiết lập trạng thái `pending`.
- Không cho client tự quyết định trạng thái ban đầu hoặc tự gửi yêu cầu tạo lời nhắn với trạng thái `published`.
- Chỉ sau khi admin duyệt thành công ở server, lời nhắn mới được chuyển thành `published` và xuất hiện trong dữ liệu công khai.

Quy trình trạng thái:

`pending → published`

`pending → hidden`

`published → hidden`

`hidden → published` khi được khôi phục hoặc duyệt lại theo quy tắc quản trị.

Lời nhắn đã xóa mềm không được xuất hiện công khai. Xóa cứng là thao tác riêng, có xác nhận và phải tuân theo chính sách lưu trữ dữ liệu.

**Giới hạn bản demo:** admin chỉ có thể duyệt dữ liệu cục bộ được lưu trên cùng trình duyệt. Không được mô phỏng rằng thao tác duyệt đã có hiệu lực trên toàn hệ thống. Nếu cần trải nghiệm kiểm duyệt demo, hãy hiển thị rõ nguồn dữ liệu và trạng thái demo.

---

## 15. Trang đọc lời nhắn — `read.html`

Các chức năng:

- Lưới thiệp.
- Tìm kiếm theo nội dung và danh xưng.
- Lọc theo danh mục.
- Lọc theo cảm xúc.
- Sắp xếp mới nhất trước.
- Nút đọc ngẫu nhiên.
- Tab “Lời nhắn cục bộ của bạn”.
- Tab “Đã lưu yêu thích”.
- Modal chi tiết.
- Nút yêu thích.
- Nút tải PNG nếu phù hợp.
- Empty state.
- Loading state.
- Error state.
- Phân trang hoặc cơ chế tải thêm phù hợp.

Quy tắc:

- Tìm kiếm không phân biệt chữ hoa/chữ thường.
- Nên hỗ trợ tìm kiếm tiếng Việt không dấu.
- Bộ lọc có thể kết hợp.
- Khi xóa từ khóa, danh sách phải cập nhật đúng.
- Trạng thái tab, bộ lọc và phân trang phải nhất quán.
- Không hiển thị dữ liệu đã ẩn hoặc đã xóa trong danh sách công khai.
- Dữ liệu cục bộ phải có nhãn rõ ràng để tránh nhầm với dữ liệu công khai.

Modal chi tiết phải hỗ trợ màn hình nhỏ, bàn phím, nút đóng và cuộn nội dung.

---

## 16. Trang khám phá — `explore.html`

Xây dựng tám chủ đề cảm xúc:

1. Nỗi nhớ.
2. Tình yêu.
3. Gia đình.
4. Chữa lành.
5. Lòng biết ơn.
6. Tình bạn.
7. Những lời xin lỗi.
8. Hy vọng và những điều chưa nói.

Mỗi chủ đề bao gồm:

- Tên.
- Mô tả.
- Màu sắc hoặc minh họa riêng.
- Lời nhắn tiêu biểu.
- CTA “Đọc thêm”.
- CTA “Viết một lời nhắn”.

Các chủ đề phải có nội dung khác nhau, không chỉ thay tiêu đề.

Khi chuyển từ trang khám phá sang trang đọc hoặc viết, phải giữ được danh mục được chọn.

Bố cục card và minh họa phải tự thích ứng trên mobile, tablet và desktop.

---

## 17. Trang quản trị — `admin.html`

Trang quản trị là chế độ demo ở giai đoạn đầu.

### 17.1. Màn hình đăng nhập và bảo vệ trang quản trị

Trang quản trị là chế độ demo trong giai đoạn đầu.

- Không hard-code mật khẩu admin thật trong JavaScript gửi tới trình duyệt.
- Không lưu mật khẩu dạng rõ trong `localStorage`.
- Chỉ cung cấp tài khoản demo trong môi trường development, có điều kiện build rõ ràng.
- Trong production, nếu chưa có backend xác thực thật, vô hiệu hóa đăng nhập và mọi thao tác quản trị phía client.
- Không coi giao diện đăng nhập phía client là cơ chế bảo mật.

**Phương án bảo vệ tạm thời khi deploy sớm:**

Nếu triển khai website công khai trước khi hoàn thành backend, phải cấu hình Basic Auth hoặc cơ chế bảo vệ truy cập tương đương tại tầng hosting, reverse proxy hoặc nền tảng triển khai để hạn chế truy cập vào `/admin.html`.

Nếu đã có API quản trị, phải bảo vệ cả các endpoint `/api/admin/*` ở tầng server; không chỉ chặn trang HTML.

Yêu cầu triển khai:

1. Không đặt thông tin xác thực trong mã nguồn frontend hoặc repository công khai.
2. Sử dụng HTTPS khi truyền thông tin xác thực.
3. Cấu hình xác thực ở máy chủ hoặc dịch vụ hosting, không mô phỏng bằng JavaScript.
4. Kiểm tra trực tiếp rằng truy cập không xác thực bị từ chối.
5. Không mặc định rằng Basic Auth đã bảo vệ các API nếu chưa kiểm tra cấu hình thực tế.
6. Ghi rõ phương án bảo vệ hiện tại trong README.

Basic Auth chỉ là biện pháp bảo vệ tạm thời cho giai đoạn triển khai sớm. Khi có backend thật, phải thay thế hoặc bổ sung bằng cơ chế xác thực, phân quyền và kiểm tra quyền truy cập tại server.

Nếu nền tảng hosting không hỗ trợ Basic Auth hoặc bảo vệ theo đường dẫn, phải nêu rõ giới hạn và đề xuất một phương án bảo vệ ở tầng hosting hoặc reverse proxy phù hợp. Không tuyên bố đã bảo vệ `/admin.html` nếu chưa cấu hình và kiểm tra thực tế.

### 17.2. Dashboard

Hiển thị thống kê:

- Công khai.
- Chờ duyệt.
- Đã ẩn.
- Đã xóa mềm.

Các số liệu phải lấy từ repository, không gắn số giả cố định.

### 17.3. Danh sách quản trị

- Bảng danh sách.
- Tìm kiếm.
- Lọc theo trạng thái.
- Lọc theo danh mục.
- Sắp xếp.
- Phân trang.
- Chọn một hàng.
- Chọn nhiều hàng.
- Chọn tất cả trang hiện tại.
- Bỏ chọn.
- Hiển thị trạng thái rõ ràng.

Trên mobile, không ép bảng rộng tràn màn hình. Có thể chuyển sang danh sách card hoặc bố cục responsive phù hợp, nhưng phải giữ đủ thông tin và thao tác quan trọng.

### 17.4. Chi tiết và kiểm duyệt

Cho phép các hành động demo:

- Duyệt và công khai.
- Ẩn.
- Khôi phục.
- Xóa mềm.
- Xóa cứng khi đáp ứng điều kiện cho phép.

Mỗi thao tác kiểm duyệt phải có quy tắc xác nhận rõ ràng.

- Các thao tác nguy hiểm phải có hộp thoại xác nhận.
- Yêu cầu lý do đối với hành động kiểm duyệt phù hợp.
- Có thể hoàn tác hoặc khôi phục khi nghiệp vụ cho phép.
- Cập nhật trạng thái giao diện sau khi repository xác nhận thành công.
- Nếu thao tác thất bại, giữ dữ liệu nhất quán và thông báo lỗi.

### 17.5. Audit log

Ghi lại các sự kiện quản trị demo:

- Thời gian.
- Hành động.
- ID lời nhắn.
- Trạng thái trước và sau.
- Lý do.
- Tác nhân demo.

Nhật ký trên client chỉ có giá trị trong phạm vi trình duyệt hiện tại, có thể bị sửa hoặc xóa và không được coi là audit log bảo mật.

Khi có backend, audit log thật phải được tạo và bảo vệ ở phía server.

---

# PHẦN VIII — BẢO MẬT VÀ QUYỀN RIÊNG TƯ

## 18. Bảo vệ nội dung người dùng

Bắt buộc:

- Không dùng `innerHTML` để chèn nội dung người dùng nhập.
- Dùng `textContent`, `createElement` và các API DOM an toàn.
- Không thực thi nội dung lời nhắn như JavaScript.
- Không dùng `eval` hoặc tạo mã thực thi từ dữ liệu.
- Xác thực dữ liệu trước khi lưu.
- Kiểm soát độ dài nội dung.
- Kiểm tra danh mục, màu sắc, font, pattern và sticker theo danh sách cho phép.
- Không tin tưởng dữ liệu đọc từ `localStorage`.
- Không đưa dữ liệu người dùng vào CSS hoặc URL theo cách không an toàn.
- Parse XML theo cách phù hợp, kiểm tra cấu trúc và từ chối dữ liệu không hợp lệ.
- Không cho phép nội dung XML tùy ý trở thành HTML thực thi.

## 19. Quyền riêng tư

- Không yêu cầu đăng ký tài khoản trong giai đoạn đầu.
- Không thu thập dữ liệu cá nhân không cần thiết.
- Có thông báo rõ về dữ liệu được lưu cục bộ.
- Không khẳng định tính ẩn danh tuyệt đối nếu hệ thống vẫn lưu IP, log hoặc thông tin nhận diện ở backend tương lai.
- Không hiển thị thông tin riêng tư do người dùng khác vô tình đưa vào nội dung.
- Có nguyên tắc cộng đồng và cơ chế báo cáo nội dung khi mở rộng.

## 20. Giới hạn bảo mật của bản demo

Phải ghi rõ trong README và giao diện quản trị:

- XML là dữ liệu công khai, không phải database có khả năng ghi dữ liệu.
- `localStorage` chỉ thuộc trình duyệt hiện tại.
- Trạng thái kiểm duyệt phía client không thể áp dụng cho mọi người dùng.
- Không có xác thực admin thật nếu chưa có backend.
- Không có đồng bộ dữ liệu đa thiết bị.
- Không được coi bản demo là hệ thống lưu trữ hoặc kiểm duyệt production.

Không được tuyên bố đạt một cấp độ bảo mật cụ thể khi chưa có đánh giá, kiểm thử và các biện pháp triển khai tương ứng.

---

# PHẦN IX — HỢP ĐỒNG API TƯƠNG LAI

## 21. Chuẩn bị cho backend

Thiết kế các repository và service để có thể thay implementation cục bộ bằng API mà không thay đổi giao diện.

Định nghĩa hợp đồng API dự kiến trong một tài liệu riêng, ví dụ `docs/api-contract.md`.

Các endpoint tham khảo:

| Method | Path | Chức năng |
|---|---|---|
| GET | `/api/messages` | Danh sách lời nhắn công khai |
| GET | `/api/messages/:id` | Chi tiết lời nhắn |
| POST | `/api/messages` | Gửi lời nhắn |
| POST | `/api/messages/:id/report` | Báo cáo nội dung |
| POST | `/api/admin/auth/login` | Đăng nhập quản trị |
| POST | `/api/admin/auth/logout` | Đăng xuất |
| GET | `/api/admin/me` | Kiểm tra phiên quản trị |
| GET | `/api/admin/stats` | Thống kê |
| GET | `/api/admin/messages` | Danh sách quản trị |
| GET | `/api/admin/messages/:id` | Chi tiết quản trị |
| PATCH | `/api/admin/messages/:id/moderation` | Thay đổi trạng thái kiểm duyệt |
| DELETE | `/api/admin/messages/:id` | Xóa theo chính sách |
| GET | `/api/admin/audit-logs` | Truy vấn nhật ký kiểm duyệt |

Tài liệu phải mô tả:

- Request shape.
- Response shape.
- Quy tắc xác thực.
- Quy tắc phân quyền.
- Mã lỗi.
- Validation.
- Phân trang.
- Lọc và sắp xếp.
- Cách xử lý trạng thái không hợp lệ.
- Các hành vi chưa được hỗ trợ.

Đây là hợp đồng thiết kế, không phải tuyên bố rằng các endpoint đã tồn tại.

Khi triển khai backend thật:

- Xác thực admin ở server.
- Hash mật khẩu bằng thuật toán phù hợp.
- Ưu tiên cookie `HttpOnly`, `Secure`, `SameSite` phù hợp.
- Có biện pháp chống CSRF khi dùng cookie theo cấu hình triển khai.
- Kiểm tra quyền tại từng endpoint.
- Có rate limiting và chống spam.
- Xử lý CORS phù hợp.
- Validate toàn bộ dữ liệu ở server.
- Tạo audit log ở server.
- Có chính sách backup, khôi phục và xóa dữ liệu.
- Không tin tưởng trạng thái hoặc quyền do client gửi lên.

---

# PHẦN X — TEMPLATE REGISTRY

## 22. Thư viện tối thiểu 100 mẫu thiệp

Tạo ít nhất 100 mẫu có ID duy nhất.

Không tạo 100 mẫu chỉ khác nhau về tên hoặc một mã màu.

Chia thành các nhóm phong cách, ví dụ:

1. Minimal.
2. Vintage.
3. Romantic.
4. Pastel.
5. Botanical.
6. Night & Nostalgia.
7. Scrapbook.
8. Handwritten.
9. Modern Editorial.

Mỗi mẫu cần có:

- ID.
- Tên.
- Mô tả.
- Nhóm phong cách.
- Nhãn chủ đề phù hợp.
- Màu nền.
- Màu chữ.
- Font.
- Pattern.
- Căn chỉnh.
- Sticker mặc định hoặc gợi ý.
- Thumbnail hoặc preview.
- Các thuộc tính cần thiết để tái tạo thiết kế.

Các mẫu phải sử dụng chung hệ thống render, không tạo một component riêng cho từng mẫu.

Dùng dữ liệu template có cấu trúc để người dùng có thể tìm kiếm, lọc và chọn mẫu.

Nếu AI tạo mẫu bằng cách kết hợp các token màu, font, pattern và bố cục, hãy bảo đảm kết quả đủ đa dạng về thị giác, không chỉ khác nhau về tên.

---

# PHẦN XI — KIỂM THỬ VÀ NGHIỆM THU

## 23. Kiểm thử chức năng

Kiểm tra tối thiểu:

- Điều hướng giữa tất cả các trang.
- Tải dữ liệu XML.
- Fallback khi một file XML bị lỗi.
- Fallback khi toàn bộ XML không tải được.
- Sắp xếp theo thời gian.
- Tìm kiếm có dấu và không dấu.
- Kết hợp bộ lọc.
- Lưu và khôi phục bản nháp.
- Lưu và bỏ yêu thích.
- Chọn template.
- Live preview.
- Thêm, di chuyển, xoay và xóa sticker.
- Xuất PNG.
- Xử lý lỗi lưu dữ liệu.
- Các thao tác quản trị demo.
- Xác nhận trước khi xóa.
- Cập nhật thống kê sau khi thay đổi dữ liệu.
- Hiển thị loading, empty, error và success state.

## 24. Kiểm thử responsive

Tất cả trang phải được kiểm tra tại các viewport tham chiếu trong phần 3.

Đặc biệt kiểm tra:

- Header và menu.
- Hero.
- Lưới thiệp.
- Bộ lọc.
- Modal chi tiết.
- Trình soạn thiệp.
- Thanh công cụ.
- Sticker kéo thả.
- Bảng quản trị.
- Form đăng nhập.
- Footer.

Phải kiểm tra cả trường hợp nội dung dài, danh xưng dài, lời nhắn nhiều dòng, bàn phím ảo và xoay màn hình.

## 25. Kiểm thử kỹ thuật

- `npm run build` hoàn thành thành công.
- Tất cả HTML entry được build.
- Các asset được tham chiếu đúng.
- XML tải được trong production preview.
- Không có lỗi JavaScript nghiêm trọng.
- Không có đường dẫn asset phụ thuộc sai vào thư mục phát triển.
- Không có lỗi import module.
- Không có dữ liệu người dùng được chèn trực tiếp bằng `innerHTML`.
- Không có mật khẩu admin thật trong bundle production.
- Không có thao tác UI quan trọng chỉ là placeholder.
- Kiểm tra lỗi mạng và trạng thái dữ liệu rỗng.
- Có README với hướng dẫn cài đặt, chạy, build và giới hạn bảo mật.

Nếu có công cụ kiểm thử tự động, hãy tạo test cho các chức năng nghiệp vụ quan trọng. Nếu không thể chạy kiểm thử trên thiết bị thật, phải nêu rõ giới hạn thay vì khẳng định đã kiểm tra.

---

# PHẦN XII — QUY TRÌNH THỰC HIỆN

## 26. Thực hiện theo từng giai đoạn

Không cố gắng sinh toàn bộ code của dự án lớn trong một khối duy nhất.

### Giai đoạn 1: Khởi tạo nền tảng

- Tạo project Vite.
- Tạo cấu hình multi-page.
- Tạo các file HTML.
- Tạo CSS token.
- Tạo layout chung.
- Tạo repository interface.
- Kiểm tra dev server và production build.

### Giai đoạn 2: Dữ liệu và component dùng chung

- Tạo chín file XML.
- Tạo fallback.
- Tạo category registry.
- Tạo template registry tối thiểu 100 mẫu.
- Xây dựng Message Card.
- Xây dựng modal, tab và notification.

### Giai đoạn 3: Trang chủ và trang đọc

- Hoàn thiện giao diện.
- Kết nối dữ liệu.
- Hoàn thiện tìm kiếm, lọc, yêu thích và modal.
- Kiểm thử responsive.

### Giai đoạn 4: Trình soạn thiệp

- Xây dựng bốn nhóm công cụ.
- Live preview.
- Auto-save.
- Sticker editor.
- Xuất PNG.
- Kiểm thử trên mobile.

### Giai đoạn 5: Trang khám phá

- Tạo tám chủ đề.
- Kết nối template và message registry.
- Hoàn thiện luồng điều hướng giữa các trang.

### Giai đoạn 6: Quản trị demo

- Dashboard.
- Danh sách.
- Tìm kiếm và lọc.
- Phân trang.
- Thao tác kiểm duyệt.
- Audit log.
- Khóa an toàn trong production khi chưa có backend.

### Giai đoạn 7: QA và bàn giao

- Chạy toàn bộ build.
- Kiểm tra lỗi.
- Kiểm tra responsive.
- Sửa các vấn đề phát hiện được.
- Hoàn thiện README.
- Hoàn thiện tài liệu API.
- Báo cáo chức năng hoàn thành và giới hạn còn tồn tại.

Ở mỗi giai đoạn, hãy cập nhật trực tiếp các file trong project, không chỉ đưa ra ví dụ code trong câu trả lời.

Nếu môi trường hỗ trợ terminal, hãy sử dụng nó để chạy build và kiểm thử. Nếu một lệnh thất bại, hãy phân tích nguyên nhân, sửa lỗi và chạy lại khi có thể.

Không chuyển sang giai đoạn tiếp theo khi lỗi nghiêm trọng của giai đoạn hiện tại vẫn chưa được xử lý.

---

# PHẦN XIII — TIÊU CHÍ BÀN GIAO CUỐI CÙNG

## 27. Danh sách nghiệm thu bắt buộc

Trước khi báo hoàn thành, xác nhận từng mục:

- [ ] Dự án được xây dựng từ đầu.
- [ ] Sử dụng Vanilla JavaScript ES modules.
- [ ] Không dùng framework UI.
- [ ] Vite multi-page build hoạt động.
- [ ] Có đủ năm trang HTML.
- [ ] Có chín file XML độc lập.
- [ ] Có tối thiểu 18 lời nhắn mẫu.
- [ ] Có fallback data.
- [ ] Có tối thiểu 100 mẫu thiệp có cấu trúc.
- [ ] Có một Message Card component dùng chung.
- [ ] Có design token tập trung.
- [ ] Có ít nhất sáu font hoặc vai trò typography được xác định rõ.
- [ ] Có trình soạn thiệp và live preview.
- [ ] Có auto-save và khôi phục bản nháp.
- [ ] Có sticker editor hỗ trợ cảm ứng.
- [ ] Có xuất PNG và xử lý lỗi.
- [ ] Có tìm kiếm, lọc và yêu thích.
- [ ] Có tám chủ đề khám phá.
- [ ] Có quản trị demo và audit log.
- [ ] Không hard-code mật khẩu admin thật.
- [ ] Có tài liệu hợp đồng API.
- [ ] Nội dung người dùng được hiển thị an toàn.
- [ ] XML hoạt động trong production build.
- [ ] Tất cả trang có responsive layout.
- [ ] Đã kiểm tra các viewport tham chiếu.
- [ ] Không có lỗi nghiêm trọng trong build.
- [ ] Có README đầy đủ.

Đánh dấu từng mục theo một trong các trạng thái:

- Hoàn thành và đã kiểm thử.
- Đã triển khai nhưng chưa kiểm thử đầy đủ.
- Chưa hoàn thành.
- Không áp dụng.

Không đánh dấu hoàn thành chỉ vì đã tạo file hoặc viết code.

## 28. Định dạng báo cáo cuối cùng

Sau khi thực hiện, cung cấp:

1. Tổng quan kiến trúc.
2. Cấu trúc thư mục thực tế.
3. Các chức năng đã hoàn thành.
4. Các chức năng đã kiểm thử.
5. Kết quả `npm run build`.
6. Kết quả kiểm tra responsive theo viewport.
7. Các lỗi đã phát hiện và sửa.
8. Các giới hạn còn tồn tại.
9. Hướng dẫn chạy local.
10. Hướng dẫn build và preview production.
11. Các bước cần thực hiện trước khi triển khai công khai.
12. Những thành phần cần backend thật.

Nếu không thể thực hiện một phần do giới hạn môi trường, phải ghi rõ. Không được tự bịa kết quả kiểm thử hoặc khẳng định rằng tính năng đã hoạt động khi chưa xác minh.

---

# YÊU CẦU CUỐI CÙNG

Hãy bắt đầu bằng việc kiểm tra môi trường làm việc, khởi tạo dự án và lập kế hoạch triển khai.

Ưu tiên theo thứ tự:

1. Kiến trúc đúng.
2. Tất cả trang hoạt động.
3. Responsive trên mọi kích thước màn hình mục tiêu.
4. Trải nghiệm người dùng tốt.
5. An toàn dữ liệu.
6. Khả năng kiểm thử.
7. Khả năng bảo trì và mở rộng.

Không hy sinh chức năng để đổi lấy giao diện đẹp. Không hy sinh responsive để đổi lấy bố cục desktop ấn tượng. Không tạo tính năng giả chỉ để hoàn thành checklist.

Hãy xây dựng **“Gửi Một Lời — Những Lời Chưa Nói”** thành một sản phẩm có bản sắc, hoạt động nhất quán trên điện thoại, máy tính bảng, laptop và desktop, với nền tảng kỹ thuật đủ tốt để tiếp tục phát triển thành ứng dụng thực tế.
