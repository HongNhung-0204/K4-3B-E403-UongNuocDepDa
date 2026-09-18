# MyViUni AI — Smart Campus Assistant

MVP React + Vite + TypeScript trong `codebase/`. Luồng demo: Home → Chat → câu trả lời có nguồn tham khảo → Campus Map → mô phỏng chỉ đường. Sổ tay AI Thực chiến có URL nguồn VinUniversity và được nhóm đánh dấu đã xác minh; vị trí, giờ mở cửa và tuyến đường trên bản đồ vẫn là dữ liệu demo.

## Chạy local

Yêu cầu Node.js 22.13+ (hoặc 24+) và npm để đọc PDF bằng PDF.js.

```bash
npm install
cp .env.example .env.local
# Điền ANTHROPIC_API_KEY và ANTHROPIC_MODEL hợp lệ vào .env.local
npm run dev
```

Mở URL do Vite in ra. Vite dev server cung cấp `/api/chat` cùng origin. Không đưa key vào biến `VITE_*` hoặc frontend. Chỉ dùng key mới đã rotate; `.env.local` được Git bỏ qua. Nếu chưa cấu hình gateway, câu hỏi khớp sổ tay nhận trích đoạn có nguồn; câu hỏi thư viện trong kịch bản demo nhận câu trả lời offline với nhãn “Demo fallback mode”. Câu hỏi không có nguồn trả lời deterministic fallback và không gọi model.

## Kiểm tra

```bash
npm test
npm run build
npm run smoke:render
npm start
```

`npm start` chạy bản production với giao diện và `/api/chat` cùng origin. `npm run preview` chỉ phục vụ bản build tĩnh của Vite, không có API.

Để chạy browser smoke test: cài Chromium bằng `npx playwright install chromium`, sau đó chạy `npm run test:e2e`. Trên Windows có Edge, có thể đặt `PLAYWRIGHT_CHANNEL=msedge` thay cho bước cài browser. Test gồm luồng demo, deep link, fallback, retry và kích thước màn hình.

Để chạy cùng bộ browser test trên **server production** sau `npm run build`, đặt `PLAYWRIGHT_TARGET=render` trước khi chạy `npm run test:e2e` (PowerShell: `$env:PLAYWRIGHT_TARGET='render'`).

## Biến môi trường server

| Biến | Ý nghĩa |
| --- | --- |
| `ANTHROPIC_BASE_URL` | URL gốc gateway Anthropic-compatible, mẫu trong `.env.example` |
| `ANTHROPIC_API_KEY` | Key server-only, không commit |
| `ANTHROPIC_MODEL` | Model ID do gateway hỗ trợ |

Frontend chỉ POST tới `/api/chat`. Server tìm tối đa ba đoạn từ chỉ mục tài liệu và dữ liệu demo trong `server/knowledge.json`, gọi Claude khi có nguồn và gateway đã cấu hình, rồi tự gắn source/confidence/location. Không có database, GPS thật hoặc authentication.

## Nạp tài liệu cho RAG

Đặt PDF, DOCX, TXT hoặc Markdown vào `documents/`, rồi chạy:

```bash
npm run ingest
npm run dev
```

`npm run dev` và `npm run build` cũng tự chạy bước nạp trước khi khởi động/build. Sau khi thêm, sửa hoặc xóa tài liệu trong lúc dev server đang chạy, hãy khởi động lại server. Chỉ mục được tạo tại `server/generated-knowledge.json`; retrieval ưu tiên các tài liệu vừa nạp khi câu hỏi khớp nội dung. PDF có số trang, Markdown có đề mục, và tất cả nguồn đều có tên file trong thẻ nguồn. Có thể khai báo tên hiển thị, URL, từ khóa bổ sung, vị trí bản đồ và trạng thái xác minh trong `documents/manifest.json` theo [mẫu](documents/manifest.example.json). Trạng thái mặc định là **chưa xác minh**.

Nguồn công khai đã được phép dùng có thể khai báo trong [`documents/public-sources.json`](documents/public-sources.json) với URL HTTPS và SHA-256. Nếu PDF không có trong checkout Git, ingest tải từ URL và kiểm tra hash trước khi tạo chỉ mục; nếu file local cùng tên có sẵn, ingest vẫn kiểm tra hash đó. Chạy `npm run verify:public-source` để thử đúng đường tải từ Git sạch. File PDF, `manifest.json` local và chỉ mục vẫn không được commit.

Khi chưa cấu hình AI, app trả về trích đoạn nguyên văn phù hợp nhất từ tài liệu kèm nguồn. Khi có cấu hình AI, chỉ tối đa ba đoạn liên quan được gửi từ server đến gateway để tổng hợp. PDF scan dạng ảnh cần OCR trước. Tài liệu và chỉ mục chứa nguyên văn nội dung, được Git bỏ qua theo mặc định; chỉ chủ động đưa tài liệu được phép công khai vào repo khi deploy. Xem [hướng dẫn tài liệu](documents/README.md) để biết thêm.

## Dữ liệu cần xác minh

- Vị trí Thư viện tại Building C, CECS Lab tại Building B, ký túc xá tại Building D và nhà ăn tại Building A đang theo bundle/bộ dữ liệu demo.
- Giờ mở cửa thư viện chưa có tài liệu được VinUni xác minh; ứng dụng không đưa giờ cụ thể.
- Khoảng cách, thời gian và từng bước tuyến đi bộ là dữ liệu mô phỏng; cần khảo sát thực địa trước khi dùng làm hướng dẫn chính thức.

## Deploy Vercel

Chọn root directory là `codebase`, framework Vite, build command `npm run build`, output `dist`. Thiết lập ba biến môi trường server trong Vercel rồi deploy. `api/chat.ts` là Vercel Function; `vercel.json` giữ `/api/*` và rewrite các route React Router về `index.html`.

Bundle `vinuni-campus-map/` được cung cấp để tích hợp, gồm ảnh WebP thật, SVG overlay và dữ liệu tọa độ/tuyến demo.

## Deploy Render

Tạo **Web Service** từ repository đã push, chọn branch `main` và cấu hình:

| Mục | Giá trị |
| --- | --- |
| Root Directory | `codebase` |
| Language | Node |
| Build Command | `npm ci --include=dev && npm run build` |
| Start Command | `npm start` |
| Health Check Path | `/healthz` |
| Node version | `24.21.0` (`.node-version`; cũng có thể đặt `NODE_VERSION=24.21.0` trong Environment) |

Trong mục Environment của Web Service, đặt `ANTHROPIC_BASE_URL`, `ANTHROPIC_API_KEY` và `ANTHROPIC_MODEL`. Không dùng biến `VITE_*` cho API key. `PORT` do Render cấp; server lắng nghe trên `0.0.0.0`. Render build sẽ tải sổ tay từ URL chính thức, kiểm tra SHA-256 rồi bundle chỉ mục vào **server**; nội dung sổ tay không nằm trong `dist/` frontend. Nếu nguồn công khai thay đổi, build sẽ dừng để nhóm kiểm tra và cập nhật hash. Không cần database hoặc persistent disk cho nguồn hiện tại.

Sau deploy, thử `/healthz`, mở trực tiếp `/chat` và `/campus`, hỏi “Phòng C401 chứa bao nhiêu người?” rồi kiểm tra câu trả lời có nguồn sổ tay trang 13. Cuối cùng đi hết Home → Chat → nguồn → Campus Map → Navigation. Gói Free của Render có thể ngủ khi không có lưu lượng; frontend cho phép chờ tối đa 90 giây cho lần đánh thức đầu tiên.

Tài liệu Render: [Web Services](https://render.com/docs/web-services), [Root Directory](https://render.com/docs/monorepo-support), [Node version](https://render.com/docs/node-version), [Environment Variables](https://render.com/docs/configure-environment-variables).
