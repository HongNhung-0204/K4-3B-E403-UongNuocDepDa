# Bộ prompt Codex — MyViUni AI Smart Campus

## Cách dùng khuyến nghị

1. Mở Codex tại thư mục repository của dự án.
2. Đính kèm các ảnh UI tham chiếu và file `vinuni-campus-map-react.zip` nếu repository chưa có asset bản đồ.
3. Chạy **Track 0** để Codex kiểm kê trạng thái dự án.
4. Chạy lần lượt Track 1 → Track 6. Chỉ chuyển track khi tiêu chí nghiệm thu của track hiện tại đã đạt.
5. Nếu repository trống và muốn Codex tự làm toàn bộ, dùng **Master Prompt**.
6. Không dán API key vào prompt. Chỉ đặt key mới đã rotate trong `.env.local` và biến môi trường Vercel.

---

# MASTER PROMPT — TRIỂN KHAI TOÀN BỘ

```text
Bạn là senior full-stack engineer kiêm product engineer, chịu trách nhiệm hoàn thiện một MVP hackathon có thể demo ổn định tên “MyViUni AI — Smart Campus Assistant”. Hãy làm việc trực tiếp trong repository hiện tại, chủ động kiểm tra code sẵn có, triển khai end-to-end, chạy kiểm thử/build và sửa lỗi cho tới khi các tiêu chí nghiệm thu bên dưới đạt. Không chỉ đưa kế hoạch hoặc code mẫu trong chat: hãy thực sự tạo/sửa file trong repository.

## 1. Cách làm việc bắt buộc

- Trước khi sửa, đọc `package.json`, cấu trúc source, config, README và `git status` nếu có Git.
- Giữ lại code và thay đổi hợp lệ đang có. Không xóa hoặc ghi đè phần không liên quan.
- Nếu repository trống, khởi tạo React + Vite + TypeScript.
- Tạo một kế hoạch ngắn rồi triển khai ngay; không dừng sau bước lập kế hoạch.
- Chỉ hỏi tôi khi có blocker thật sự làm thay đổi kiến trúc. Với chi tiết nhỏ, tự chọn phương án đơn giản, ổn định và ghi lại giả định.
- Sau mỗi phần lớn, chạy kiểm tra phù hợp. Cuối cùng bắt buộc chạy build production và sửa tất cả lỗi TypeScript/build.
- Không để TODO, nút giả hoặc placeholder trong luồng demo chính.
- Không deploy, không đăng nhập dịch vụ và không tạo tài nguyên cloud nếu tôi chưa yêu cầu; chỉ chuẩn bị dự án sẵn sàng cho Vercel.

## 2. Mục tiêu sản phẩm

Sinh viên có thể:

1. Mở Home và chọn “Hỏi MyViUni AI”.
2. Hỏi: “Thư viện mở đến mấy giờ và ở đâu?”.
3. Nhận câu trả lời tiếng Việt dựa trên knowledge base đã retrieve.
4. Thấy mức tin cậy, nguồn, mục/trang và location card.
5. Chọn “Xem trên Campus Map”.
6. Được đưa tới `/campus?destination=library-c`.
7. Thấy bản đồ campus thật, Building C được chọn và tuyến từ Quảng trường trung tâm được vẽ.
8. Chọn “Bắt đầu chỉ đường”.
9. Xem hướng dẫn từng bước, chuyển bước trước/sau và màn hình hoàn tất.

Đây là luồng ưu tiên tuyệt đối. Những tính năng ngoài luồng này chỉ làm sau khi luồng chính chạy ổn định.

## 3. Stack bị khóa

- React 18+.
- Vite.
- TypeScript strict; không dùng `any` nếu có thể khai báo type hợp lý.
- React Router.
- Styling: dùng Tailwind nếu repository đã có; nếu chưa có thì dùng CSS Modules hoặc CSS thường có tổ chức. Không dành thời gian thay toàn bộ styling chỉ để đổi framework CSS.
- Icon: Lucide React nếu đã có hoặc có thể cài nhanh.
- Backend: Vercel Serverless Function tại `/api/chat`.
- AI: Claude thông qua Anthropic-compatible gateway, dùng `ai` và `@ai-sdk/anthropic` nếu gateway tương thích.
- RAG MVP: knowledge JSON + deterministic keyword retrieval chạy phía server.
- Campus: ảnh WebP thật + SVG overlay + JSON/TypeScript coordinates.
- Routing campus: predefined route data; không tính đường động.
- Deploy target: Vercel.

Không thêm Next.js, Firebase, Supabase, authentication, vector database, embeddings, PostGIS, Google Maps, Mapbox, GPS thật, AR, notification, admin dashboard hoặc multi-user.

## 4. Bảo mật và biến môi trường

API key từng xuất hiện trong chat phải được xem là đã lộ. Tuyệt đối không ghi key vào source, log, fixture, README hoặc output.

Dùng các biến server-only:

ANTHROPIC_BASE_URL=https://api.mwapi.dev/v1
ANTHROPIC_API_KEY=<set locally, never commit>
ANTHROPIC_MODEL=<model id supported by gateway>

- Không dùng tiền tố `VITE_` cho API key.
- Tạo `.env.example` chỉ chứa placeholder.
- Bảo đảm `.env.local` nằm trong `.gitignore`.
- Frontend chỉ gọi `/api/chat`, không gọi gateway trực tiếp.
- Validate env ở server và trả lỗi cấu hình dễ hiểu, không làm lộ secret.

## 5. Cấu trúc mục tiêu

Giữ cấu trúc hiện có nếu hợp lý; nếu cần tạo mới, ưu tiên:

api/chat.ts
public/maps/vinuni-campus.webp
src/components/BottomNav.tsx
src/components/ConfidenceBadge.tsx
src/components/SourceCard.tsx
src/components/LocationCard.tsx
src/components/VinUniCampusMap.tsx
src/pages/HomePage.tsx
src/pages/ChatPage.tsx
src/pages/CampusPage.tsx
src/pages/NavigationPage.tsx
src/pages/ProfilePage.tsx
src/data/knowledge.json
src/data/campusLocations.ts
src/data/campusRoutes.ts
src/lib/retrieval.ts
src/types/chat.ts
src/App.tsx
src/main.tsx
vercel.json
.env.example

Không tạo `AnswerPage`; answer, confidence, source và location card nằm ngay trong `ChatPage`.

## 6. UI/UX

Thiết kế mobile-first theo các ảnh tham chiếu, mục tiêu viewport khoảng 390 × 844 nhưng phải responsive lên tablet/desktop.

Visual language:

- Nền chính trắng hoặc xám rất nhạt.
- Primary blue gần `#1769E8`.
- Success green gần `#23B883`.
- Text navy gần `#10213A`.
- Card bo góc 14–20px, border nhẹ, shadow tiết chế.
- Khoảng cách nhất quán theo nhịp 4/8px.
- Bottom navigation cố định, có safe-area padding trên iOS.
- Trạng thái selected/focus/disabled/loading rõ ràng.
- Không sao chép status bar hoặc khung điện thoại từ mockup vào web app.
- Có focus-visible, label/aria phù hợp, contrast đọc được và reduced-motion.

### Home

- Header MyViUni AI, trạng thái online và avatar demo.
- Hero card chào người dùng, CTA mở Chat.
- Hai service card: AI assistant và Campus navigation.
- Một announcement card nhỏ.
- Bottom nav: Home, Chat AI, Campus, Cá nhân.

### Chat

- Header assistant + trạng thái online.
- Welcome message.
- Suggested questions dạng chip/card.
- Message list cuộn được.
- Composer sticky phía trên bottom nav.
- Enter để gửi, Shift+Enter xuống dòng nếu dùng textarea.
- Loading state có skeleton/typing indicator.
- Lỗi có nút “Thử lại”.
- Không gửi lặp khi request đang chạy.
- Sau answer: ConfidenceBadge → answer → SourceCard → LocationCard.

### Verified answer

- Không hiển thị phần trăm confidence do model tự nghĩ ra.
- Confidence dựa trên retrieval score:
  - high: có source và top score mạnh;
  - medium: có source nhưng score chưa mạnh;
  - low: không có source phù hợp.
- Nếu dữ liệu chưa được trường xác minh, ghi rõ “Dữ liệu demo/chưa xác minh”, không gắn nhãn “nguồn chính thức”.

### Campus

- Dùng asset thật `public/maps/vinuni-campus.webp` và SVG overlay; không vẽ bản đồ giả thay thế.
- Có search địa điểm, zoom, chọn marker, selected state, current-location state và route polyline.
- Đọc query param `destination` và tự chọn điểm tương ứng.
- Nếu `destination=library-c`, chọn Building C, hiện location card và route từ `central-plaza`.
- Nếu không có route, vẫn chọn được địa điểm và hiển thị thông báo không có tuyến demo.

### Navigation

- Route `/navigation/:routeId`.
- Hiện điểm đến, tiến độ `currentStep / totalSteps`, khoảng cách bước hiện tại, instruction và instruction tiếp theo.
- Có Previous, Next và End.
- Bước cuối có màn hình “Bạn đã đến nơi”.
- Không giả định đây là GPS realtime; ghi rõ “Mô phỏng chỉ đường trong campus”.

### Profile

- Static/mocked; không auth.
- Hiện tên demo, ngành học, vài preference UI.
- Không ưu tiên hơn core flow.

## 7. Knowledge base và retrieval

Định nghĩa type `KnowledgeChunk`:

- id
- title
- content
- source
- section optional
- page optional
- keywords string[]
- locationId optional
- verified boolean

Tạo một dataset demo nhỏ cho các chủ đề Library, CECS Lab, ký túc xá, nhà ăn và một vài câu hỏi campus. Nội dung không được trình bày là quy định chính thức nếu chưa có tài liệu đã xác minh.

Retrieval phải deterministic:

1. Lowercase.
2. Unicode normalize NFD và bỏ dấu tiếng Việt.
3. Bỏ punctuation, chuẩn hóa whitespace.
4. So khớp phrase/keyword có trọng số cao.
5. So khớp token trong title/content có trọng số thấp hơn.
6. Có thể thưởng điểm cho title exact match.
7. Sắp xếp giảm dần, tie-break ổn định theo thứ tự dữ liệu.
8. Lọc score <= 0.
9. Lấy tối đa 3 chunks.

Viết unit tests tối thiểu cho:

- “thư viện mở đến mấy giờ” tìm đúng library-hours;
- query không dấu vẫn tìm được nội dung có dấu;
- query không liên quan trả danh sách rỗng;
- thứ tự kết quả ổn định.

Không gọi Claude khi retrieval không có source. Trả câu fallback:

“Mình chưa tìm thấy thông tin đủ tin cậy trong dữ liệu campus hiện có để trả lời câu hỏi này.”

## 8. API contract

Frontend gửi:

POST /api/chat
{
  "messages": [
    { "role": "user" | "assistant", "content": "..." }
  ]
}

Server phải:

1. Validate body, role, content, số message và kích thước input.
2. Lấy user question cuối cùng.
3. Retrieve tối đa 3 chunks ở server.
4. Nếu không có source, trả deterministic fallback mà không gọi model.
5. Tạo context có source metadata.
6. Gọi Claude bằng system prompt buộc chỉ dựa trên context.
7. Server tự gắn `sources`, `confidence` và `locationId`; không tin model tự tạo metadata.
8. Timeout hợp lý và xử lý upstream error.

Response JSON ổn định:

{
  "answer": "string",
  "confidence": {
    "level": "high" | "medium" | "low",
    "label": "string"
  },
  "sources": [
    {
      "id": "string",
      "title": "string",
      "source": "string",
      "section": "string | null",
      "page": "number | null",
      "verified": "boolean"
    }
  ],
  "locationId": "string | null",
  "mode": "live" | "retrieval-fallback" | "offline-demo"
}

System prompt cho Claude phải yêu cầu:

- trả lời tiếng Việt, ngắn gọn và thân thiện;
- chỉ dùng SOURCES được cung cấp;
- không bịa thời gian, quy định, địa điểm hoặc citation;
- nếu context không đủ phải nói không đủ thông tin;
- không trả JSON metadata vì metadata do server quản lý.

Nếu gateway lỗi, chỉ dùng offline demo fallback cho một số câu hỏi demo đã biết và phải hiển thị badge rõ “Demo fallback mode”. Không giả vờ là live AI.

## 9. Campus data

Nếu có file `vinuni-campus-map-react.zip`, giải nén/copy có chọn lọc các phần sau vào project:

- `public/maps/vinuni-campus.webp`
- `src/components/VinUniCampusMap.tsx`
- `src/components/VinUniCampusMap.css`
- `src/data/campusLocations.ts`
- `src/data/campusRoutes.ts`

Không tạo bản sao trùng lặp nếu file đã tồn tại; merge cẩn thận với code hiện có.

Giữ chung ID giữa RAG và Campus:

- library chunk → `locationId: "library-c"`
- location map → `id: "library-c"`
- URL → `/campus?destination=library-c`
- route → `to: "library-c"`

Khoảng cách và instruction trong route là dữ liệu demo. Ghi chú trong code/README rằng cần khảo sát thực địa trước khi xem là dữ liệu chính thức.

## 10. Routing

Tối thiểu:

- `/` → HomePage
- `/chat` → ChatPage
- `/campus` → CampusPage
- `/navigation/:routeId` → NavigationPage
- `/profile` → ProfilePage
- route không tồn tại → redirect về `/`

Bottom nav phải phản ánh route đang active.

## 11. State và persistence

- Dùng React state/context đơn giản; không thêm Redux.
- Có thể lưu chat hiện tại trong `sessionStorage` để reload không mất ngay, nhưng chỉ làm nếu không ảnh hưởng core flow.
- Không lưu API key hoặc dữ liệu nhạy cảm ở client.
- Không cần backend database.

## 12. Vercel/Vite

- Thêm `vercel.json` phù hợp cho Vite SPA và `/api` functions.
- SPA rewrite không được nuốt `/api/*`.
- `npm run build` tạo `dist` thành công.
- README ghi rõ biến môi trường cần set trên Vercel.
- Không commit `.env.local`.

## 13. Chất lượng và kiểm thử

Bắt buộc kiểm tra:

- TypeScript/build production.
- Unit tests retrieval nếu test runner đã có; nếu chưa có, cài Vitest ở mức tối thiểu.
- Manual smoke test hoặc browser test nếu môi trường cho phép:
  1. Home → Chat.
  2. Gửi câu hỏi thư viện.
  3. Answer/source/location card xuất hiện.
  4. Location CTA mở đúng campus destination.
  5. Marker C và route xuất hiện.
  6. Start navigation mở đúng route.
  7. Next/Previous/Finish hoạt động.
- Reload trực tiếp ở `/campus?destination=library-c` không 404 trong cấu hình deploy.
- Không có secret trong bundle client: tìm kiếm các chuỗi `ANTHROPIC_API_KEY`, `sk-`, `mwapi` trong `dist` và bảo đảm không có key.
- Không có lỗi console nghiêm trọng.

## 14. Tiêu chí hoàn thành

Chỉ coi là xong khi:

- Core flow chạy end-to-end.
- Campus dùng ảnh thật, không phải placeholder.
- Chat không expose API key.
- Answer chỉ gắn citation được retrieve.
- Trạng thái no-source và upstream-error hoạt động.
- App usable ở 390px và desktop.
- Build production pass.
- README đủ để người khác chạy bằng `npm install`, cấu hình `.env.local`, `npm run dev`.

## 15. Báo cáo cuối

Khi hoàn tất, trả lời ngắn gọn theo format:

1. Kết quả đã hoàn thành.
2. Các file chính đã tạo/sửa.
3. Lệnh đã chạy và kết quả build/test.
4. Biến môi trường tôi cần tự điền.
5. Các dữ liệu demo cần được VinUni xác minh.
6. Các bước chạy local và deploy Vercel.

Bắt đầu bằng việc kiểm tra repository hiện tại, sau đó triển khai cho tới khi build pass. Không dừng ở bản kế hoạch.
```

---

# TRACK 0 — KIỂM KÊ VÀ KHÓA PHẠM VI

```text
Hãy kiểm tra repository hiện tại của MyViUni AI nhưng chưa thực hiện refactor lớn.

Mục tiêu:

1. Đọc package.json, source tree, router, styling, config, env example, API folder và git status.
2. Xác định project đã là React + Vite + TypeScript hay chưa.
3. Tìm các màn hình/component/data đã có.
4. Kiểm tra có asset `vinuni-campus.webp` hoặc bundle `vinuni-campus-map-react.zip` không.
5. Kiểm tra rủi ro secret: `.env*`, chuỗi `sk-`, API key hard-code, biến `VITE_*` chứa secret. Không in giá trị secret ra output.
6. Chạy các lệnh kiểm tra sẵn có trong package.json mà không thay đổi source.
7. Đưa ra kế hoạch triển khai tối đa 6 bước theo ưu tiên core flow.

Stack khóa: React + Vite + TypeScript + React Router + Vercel Function + Claude gateway + JSON retrieval + ảnh campus thật/SVG overlay. Không đề xuất Next.js, database, vector DB, Google Maps, GPS hoặc auth.

Output cần có:

- trạng thái hiện tại;
- thứ có thể tái sử dụng;
- file thiếu;
- blocker thật sự;
- kế hoạch track 1–6.

Không sửa file ở track này trừ khi cần xóa một secret đã hard-code khỏi file tracked; nếu phát hiện secret, dừng và báo đường dẫn/vị trí mà không lặp lại giá trị secret.
```

---

# TRACK 1 — APP SHELL VÀ UI

```text
Hãy triển khai app shell và UI mobile-first của MyViUni AI trong repository hiện tại.

Phạm vi chỉ gồm:

- React Router routes `/`, `/chat`, `/campus`, `/navigation/:routeId`, `/profile`.
- HomePage, ChatPage shell, CampusPage shell, NavigationPage shell, ProfilePage static.
- BottomNav dùng chung, active state theo route, safe-area.
- Visual style bám ảnh tham chiếu: primary blue #1769E8, success green #23B883, navy #10213A, nền sáng, rounded cards, shadow nhẹ.
- Responsive từ 390px lên desktop.
- Accessibility cơ bản: semantic elements, labels, focus-visible, reduced-motion.

Chưa gọi AI và chưa làm retrieval trong track này. Dùng mock state có type rõ ràng để UI hiển thị đủ loading, answer, source card, location card và error state; tất cả mock phải dễ thay bằng API ở track sau.

Không sao chép khung điện thoại/status bar từ ảnh vào app. Không thêm UI framework nặng nếu project chưa có.

Hoàn thành khi:

- các route render đúng;
- bottom nav hoạt động;
- không overflow ngang ở 390px;
- UI answer/source/location có thể xem bằng mock;
- `npm run build` pass.

Hãy trực tiếp sửa file, chạy build và báo các file đã thay đổi.
```

---

# TRACK 2 — KNOWLEDGE JSON, RETRIEVAL VÀ API CLAUDE

```text
Hãy triển khai backend/RAG MVP cho MyViUni AI, giữ nguyên UI hiện có.

Yêu cầu:

1. Tạo typed `KnowledgeChunk` gồm id, title, content, source, section?, page?, keywords[], locationId?, verified.
2. Tạo dataset demo nhỏ cho Library, CECS Lab, ký túc xá và nhà ăn. Đánh dấu `verified: false` nếu chưa có tài liệu chính thức.
3. Viết deterministic retrieval có normalize tiếng Việt không dấu, phrase scoring, token scoring, stable sort và top 3.
4. Thêm Vitest và unit tests cho query có dấu, không dấu, query không liên quan và stable order.
5. Tạo Vercel function `/api/chat`.
6. Dùng server-only env `ANTHROPIC_BASE_URL`, `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL`.
7. Frontend không được import knowledge base nếu retrieval cần nằm server; tách code chung/server phù hợp với Vite/Vercel.
8. Không gọi model khi retrieval rỗng.
9. Model chỉ sinh phần answer; sources, confidence và locationId do server gắn từ retrieval.
10. Validate request, giới hạn input, timeout và xử lý upstream error.
11. Tạo `.env.example`, cập nhật `.gitignore` và README; không ghi secret thật.

Response contract:

{
  answer: string;
  confidence: { level: 'high' | 'medium' | 'low'; label: string };
  sources: Array<{ id; title; source; section; page; verified }>;
  locationId: string | null;
  mode: 'live' | 'retrieval-fallback' | 'offline-demo';
}

Nếu upstream lỗi, chỉ dùng offline fallback cho scenario demo đã định nghĩa và trả `mode: offline-demo`. Tuyệt đối không giả vờ đó là live AI.

Hoàn thành khi test retrieval và production build pass, API không làm lộ key, và README có hướng dẫn env.
```

---

# TRACK 3 — NỐI CHAT END-TO-END

```text
Hãy nối ChatPage hiện có với `/api/chat` và hoàn thiện verified-answer flow.

Yêu cầu:

- Message type rõ ràng, ID ổn định, role user/assistant.
- Suggested questions gửi được bằng click.
- Composer hỗ trợ Enter gửi, Shift+Enter xuống dòng.
- Không gửi nội dung rỗng hoặc double-submit.
- Loading/typing indicator.
- Timeout/error message và nút retry giữ nguyên question.
- Render answer, ConfidenceBadge, SourceCard và LocationCard từ API contract.
- Không tự tạo source/confidence ở client.
- Nếu source `verified: false`, UI ghi “Dữ liệu demo/chưa xác minh”; không ghi “nguồn chính thức”.
- Nếu `locationId` tồn tại, CTA mở `/campus?destination=<locationId>`.
- Nếu `mode=offline-demo`, hiển thị warning badge rõ ràng.
- Scroll xuống message mới nhưng tôn trọng reduced-motion.
- Giữ composer và bottom nav không che nội dung trên màn hình nhỏ.

Smoke test scenario:

1. Mở `/chat`.
2. Gửi “Thư viện mở đến mấy giờ và ở đâu?”.
3. Thấy answer + source + location card.
4. Click CTA và URL trở thành `/campus?destination=library-c`.

Chạy test/build và sửa lỗi trước khi kết thúc.
```

---

# TRACK 4 — CAMPUS MAP THẬT

```text
Hãy tích hợp campus map thật vào MyViUni AI.

Input ưu tiên là bundle `vinuni-campus-map-react.zip`. Nếu các file đã có trong repository thì không giải nén đè; hãy đọc và merge.

Cần dùng:

- `public/maps/vinuni-campus.webp`;
- `VinUniCampusMap.tsx` và CSS;
- `campusLocations.ts`;
- `campusRoutes.ts`.

Yêu cầu:

- Bản đồ dùng ảnh thật làm nền và SVG overlay tương tác.
- Search location.
- Marker A–L và landmark có click/keyboard.
- Current location mặc định `central-plaza`.
- Đọc `destination` từ query string.
- `destination=library-c` tự chọn Building C và hiện route nếu có.
- Selected/current marker khác nhau rõ ràng.
- Zoom và viewport cuộn/pan sử dụng được trên mobile.
- Route polyline không chặn click marker.
- Location card hiển thị tên, subtitle, khoảng cách/thời gian nếu có route.
- Start Navigation gọi route đúng.
- Unknown destination không crash; fallback về campus overview.
- Asset có alt text phù hợp; marker có accessible name.

Không thay bằng Google Maps, Mapbox hoặc một SVG bản đồ giả. Không sửa tọa độ nếu chưa kiểm tra trực quan với đúng asset 1600×925.

Hoàn thành khi `/campus?destination=library-c` hiển thị đúng Building C và route từ quảng trường; build pass.
```

---

# TRACK 5 — NAVIGATION SIMULATION

```text
Hãy hoàn thiện NavigationPage dùng predefined route data.

Route URL: `/navigation/:routeId`.

Yêu cầu:

- Resolve route ID an toàn; route không tồn tại có empty/error state và nút quay lại Campus.
- Hiện destination, tổng khoảng cách, thời gian ước tính.
- State `currentStep` bắt đầu từ 0.
- Hiện khoảng cách và instruction của bước hiện tại.
- Hiện preview instruction tiếp theo nếu tồn tại.
- Nút Previous disabled ở bước đầu.
- Nút Next chuyển bước nhưng không vượt mảng.
- Bước cuối chuyển sang completed state: “Bạn đã đến nơi”.
- Có “Kết thúc” quay về Campus.
- Hiện progress bar hoặc `Bước x/y`.
- Ghi rõ đây là “Mô phỏng chỉ đường trong campus”, không phải GPS realtime.
- UI bám dark navigation mockup nhưng vẫn dễ đọc và responsive.
- Không dùng timer auto-next mặc định; demo bằng nút sẽ ổn định hơn.

Viết test tối thiểu cho step bounds nếu test infrastructure cho phép. Chạy build trước khi hoàn tất.
```

---

# TRACK 6 — QA, POLISH VÀ VERCEL-READY

```text
Hãy thực hiện vòng QA cuối cho MyViUni AI. Không thêm tính năng lớn.

Checklist bắt buộc:

1. Chạy format/lint/test/build theo scripts hiện có.
2. Sửa tất cả lỗi TypeScript, build và lỗi runtime tìm thấy.
3. Smoke test Home → Chat → Answer → Campus → Navigation → Complete.
4. Test direct-load `/campus?destination=library-c`.
5. Test unknown route/destination.
6. Test no-source query.
7. Test upstream AI error hoặc mock failure path.
8. Kiểm tra 390×844, tablet và desktop.
9. Kiểm tra keyboard navigation và focus-visible.
10. Kiểm tra bottom nav/composer không che nội dung.
11. Kiểm tra image loading và alt text.
12. Kiểm tra `dist` không chứa API key hoặc secret. Không in secret ra báo cáo.
13. Kiểm tra `.env.local` bị ignore.
14. Hoàn thiện `vercel.json` cho Vite SPA + `/api` function.
15. Hoàn thiện README với setup local, env, build và deploy Vercel.
16. Ghi rõ dữ liệu campus/giờ mở cửa/route nào vẫn là demo và cần xác minh.

Không refactor kiến trúc nếu app đã pass. Ưu tiên độ ổn định demo, loading/error states và visual consistency.

Kết thúc bằng báo cáo:

- những gì đã pass;
- lệnh test/build và kết quả;
- file chính thay đổi;
- env người dùng phải tự cấu hình;
- các giới hạn/dữ liệu cần xác minh;
- lệnh chạy local và hướng dẫn deploy ngắn.
```

---

# PROMPT SỬA LỖI SAU MỖI TRACK

```text
Hãy tiếp tục từ trạng thái repository hiện tại và xử lý toàn bộ lỗi còn lại của track vừa làm.

Quy trình:

1. Đọc output lỗi thực tế từ lint/test/build/browser; không đoán.
2. Xác định root cause trước khi sửa.
3. Sửa tối thiểu, không refactor phần đang hoạt động.
4. Chạy lại đúng lệnh đã thất bại.
5. Sau khi pass, chạy production build và smoke test core flow.
6. Không bỏ qua test, không tắt TypeScript strict, không thêm `any`, `@ts-ignore` hoặc disable lint chỉ để làm xanh build trừ khi có lý do kỹ thuật rõ ràng và được giải thích.

Chỉ kết thúc khi lỗi đã được tái kiểm tra và không còn tái hiện. Báo ngắn gọn root cause, file sửa và lệnh xác minh.
```

---

# PROMPT DEMO-DAY FREEZE

```text
Đây là vòng đóng băng trước demo. Không thêm feature và không đổi kiến trúc.

Hãy chỉ:

- sửa lỗi chặn luồng demo;
- kiểm tra API failure fallback;
- kiểm tra Home → Chat → Campus → Navigation;
- bảo đảm build production pass;
- loại bỏ secret khỏi client/repository;
- bảo đảm UI ổn ở 390×844;
- ghi lại đúng 1 kịch bản demo 2–3 phút và 3 câu hỏi dự phòng;
- liệt kê các thao tác cần chuẩn bị trước khi trình bày: env, mạng, tab trình duyệt, fallback mode.

Không cài database, auth, vector search, map SDK, analytics hoặc dependency mới không cần thiết.
```
