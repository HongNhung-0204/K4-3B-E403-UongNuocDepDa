# Checklist công việc — nhóm K4-3B-E403-UongNuocDepDa

Tài liệu đối chiếu: [README.md](README.md), [đề bài](01-challenge-brief.md), [guide](02-guide.md), [mẫu spec](03-ai-spec-template.md), [rubric](04-rubric.md), [Track E](tracks/track-e-open-lane.md) và [canvas hiện tại](canvas.md). Dấu `[x]` chỉ xác nhận file đã có trong repo; **không có nghĩa là checkpoint đã được nộp**.

## RAG từ tài liệu trong `codebase/`

- [x] Tự đọc PDF, DOCX, TXT, Markdown và tạo chỉ mục khi chạy dev/build; kiểm thử đọc PDF theo trang, DOCX và đề mục Markdown.
- [x] Truy xuất đoạn liên quan, hiển thị file/trang/đề mục/URL nguồn, trích nguyên văn khi AI chưa cấu hình; kiểm tra nội dung tài liệu không vào bundle frontend.
- [x] Đưa sổ tay VinUniversity được phép sử dụng vào `codebase/documents/`; đã nối đúng tên file và URL nguồn chính thức trong `manifest.json`, giữ `verified: true` theo xác nhận đã kiểm tra của nhóm.
- [x] Chạy 28 câu hỏi trên sổ tay (22 câu có căn cứ, 6 câu ngoài nguồn); kiểm tra đáp án, trang và URL bằng chế độ trích xuất khi không cấu hình AI. Kết quả 28/28; xem `codebase/eval/local-rag-results.md`.
- [ ] Sau khi sửa retrieval/prompt, chạy lại golden set với AI thật cho CP4–CP5, lưu output từng case và so với quality bar đã khóa. Báo cáo CP3 lượt 1 là mốc lịch sử riêng.
- [x] Khai báo sổ tay trong `codebase/documents/public-sources.json`; build từ Git sạch tự tải PDF qua HTTPS, kiểm tra SHA-256 rồi tạo chỉ mục RAG phía server. PDF và `manifest.json` local vẫn bị Git bỏ qua.
- [ ] Commit/push thay đổi Render, tạo Web Service theo `codebase/README.md`, kiểm tra câu hỏi có nguồn trên URL thật.

## Ưu tiên xử lý ngay

- [ ] **Chốt lại phạm vi Track E.** `canvas.md` đang nói về tìm đường, thư viện và tiện ích chung của VinUni; Track E chỉ nhận sản phẩm phục vụ **người tham gia khóa AI20k** và bài toán không trùng Track A–D. Chọn một việc cụ thể của học viên/TA trong khóa, có thể gặp người dùng thật và có nguồn dữ liệu kiểm chứng; nếu giữ chủ đề tiện ích thì phải chứng minh nó gắn trực tiếp với khóa.
- [ ] **Chốt một lát cắt duy nhất** theo mẫu `1 người dùng · 1 việc · 1 quyết định AI · 1 kết quả`; cập nhật `canvas.md` cho khớp lát cắt sẽ build. Chưa mở rộng sang chatbot tổng hợp, tìm đường và tra cứu mọi thứ cùng lúc.
- [ ] **Xác minh bằng chứng trong canvas.** Tìm log câu hỏi và từng câu trả lời cho số `20/100`, `11/15`; xác nhận người khảo sát ở ngoài nhóm, cách tính tỷ lệ và mức liên quan đến lát cắt cuối. Nếu không có log hoặc pain đổi, khảo sát lại; không dùng số chưa kiểm chứng trong spec/slide.
- [ ] **Tách repo nộp công khai khỏi repo tài liệu hiện tại.** Repo này đang chứa nguyên `data/`. Theo README, tạo repo nộp mới, sạch, không fork/clone nguyên lịch sử; chỉ chuyển artifact của nhóm. Không đưa data pack, khóa API, `.env` hay thông tin cá nhân lên repo công khai. Nếu repo hiện tại đã công khai, kiểm tra cả lịch sử commit và báo BTC/coach về dữ liệu đã lộ.
- [ ] **Xác nhận tình trạng CP1 và CP2 đã nộp hay chưa** bằng form/biên nhận. Không tự đánh dấu hoàn tất chỉ vì đã có `canvas.md` hoặc commit.
- [ ] **Chốt người nộp và phân công thống nhất.** `README.md` giao Sơn làm FE, Điền làm BE; `canvas.md` lại giao Sơn spec/retrieval và Điền prototype/user test. Ghi một bảng phân công cuối cùng có người chịu trách nhiệm cho evidence, spec, prompt/eval, code, demo. README yêu cầu một đội trưởng dùng cùng mã học viên ở CP1–CP5, nhưng `04-rubric.md` có câu “mỗi thành viên nộp riêng”; hỏi coach/TA để xác nhận cách nộp thực tế.

## CP1 — Canvas và repo · 19:30 ngày 17/09

- [x] Đã có bản nháp `canvas.md` 7 dòng, ba willing users có tên và bảng thành viên trong `README.md`.
- [ ] Sửa canvas theo phạm vi/lát cắt đã chốt; pain nêu rõ ai, đang làm gì, vướng đâu, hậu quả gì; bằng chứng đầu phải truy ngược được về log.
- [ ] Xác nhận đội trưởng, mã học viên, link repo nộp công khai và biên nhận CP1. Kiểm tra link bằng cửa sổ ẩn danh.

## CP2 — Luồng có thể xem/bấm · 21:00 ngày 17/09

- [ ] Vẽ sơ đồ hoặc mock cho luồng từ nhập câu hỏi → kiểm tra nguồn → trả lời có dẫn nguồn / hỏi lại hoặc báo chưa đủ căn cứ → người dùng sửa câu hỏi.
- [ ] Có commit đầu trong repo nộp; xác nhận artifact và biên nhận CP2.

## CP3 — AI thật và lượt đo đầu · 16:00 ngày 18/09

Trạng thái nộp CP3 và push code: **nhóm xác nhận đã hoàn tất**. Các tiêu chí chi tiết bên dưới vẫn cần đối chiếu với artifact và biên nhận khi tổng kết.

- [x] Tạo `codebase/` với prototype end-to-end cho lát cắt đã chốt; có **ít nhất một lời gọi AI thật** ở quyết định trung tâm. Ghi trace/log minh họa, nói rõ phần nào dùng dữ liệu giả hoặc mock; giữ API key trong biến môi trường.
- [x] Chuẩn bị nguồn căn cứ được phép dùng. Với câu hỏi không có nguồn, nguồn mâu thuẫn, thiếu thông tin hoặc ngoài phạm vi, định nghĩa hành vi hỏi lại/từ chối và bước tiếp theo; không tự bịa câu trả lời.
- [x] Tạo `eval/` và golden set **≥20 case**: ≥2 case cho mỗi lớp khó (nguồn sự thật, mơ hồ, ngoài phạm vi, đặc thù domain), 8–10 case thường, 2–4 case hiếm; ≥10 case lấy/phát triển từ data thật trong pack, ghi mã nguồn và chỉ trích ngắn.
- [x] Định nghĩa 2–3 chiều chất lượng với điều kiện đạt/trượt có thể chấm lại; cho hai người chấm thử cùng 5 output để sửa tiêu chí còn mơ hồ.
- [x] Chạy toàn bộ golden set lần 1, lưu output của **mọi case** kể cả lỗi, tổng số đạt/tổng số và tỷ lệ %, phân tích lỗi lớn nhất.
- [x] Quay video thao tác màn hình khoảng 30 giây cho thấy AI chạy thật; nộp video và số đo CP3, lưu biên nhận.

## CP4 — Chốt `spec.md` · 21:00 ngày 18/09

- [x] Tạo `spec.md` theo `03-ai-spec-template.md`, điền đủ §1–§9 và commit trước hạn.
- [x] Hoàn thiện evidence chuẩn A (**≥20 người ngoài nhóm, ≥50% xác nhận, log đủ câu hỏi và từng câu trả lời**) và/hoặc chuẩn B (**số đếm, ≥5 ví dụ nguyên văn, phương pháp đếm kiểm lại được**). Chỉ dẫn mã dữ liệu ngắn; không chép nguyên pack.
- [x] Viết problem statement không có chữ AI; bảng impact **≥3 ứng viên** với số người, tần suất, thiệt hại mỗi lần, tính khả thi; giữ lý do loại ứng viên khác và lý do chọn.
- [ ] Ghi ≥3 non-goals, mức prototype thực tế và lựa chọn augment/conditional/automate dựa trên hậu quả nếu AI sai.
- [ ] Áp dụng ≥4 nguyên tắc HAX/PAIR, mỗi nguyên tắc trỏ đến đúng vị trí/hành vi trong prototype; trong đó có G10 và cách xử lý khi AI không chắc.
- [ ] Viết 4 lớp chỗ khó cụ thể và **≥8 kịch bản** có hành vi mong muốn; thể hiện happy path, low-confidence, failure và correction trong spec/prototype.
- [ ] **Chốt quality bar bằng số trước khi đối chiếu kết quả cuối** (ví dụ tỷ lệ đạt + điều kiện cứng về căn cứ nguồn); không đổi bar sau CP4. Khai rõ mục nào còn thiếu khi nộp.

## CP5 — Nộp cuối · 22:30 ngày 18/09

- [ ] Cập nhật prototype từ lỗi đo được; sau mỗi thay đổi chạy lại toàn bộ golden set, lưu từng lượt và so sánh với quality bar đã chốt.
- [ ] Làm `demo-slides.pdf` **6 trang** theo guide §5.1: user/job và pain; bảng impact; giải pháp + demo case thường/case khó; kết quả đo so với bar và failure; feedback user hoặc phân tích eval; việc sẽ làm tiếp. Mỗi trang có số, quote có nguồn hoặc kết quả kiểm chứng được.
- [ ] Quay **video demo dự phòng** đúng luồng sẽ trình bày, riêng với video 30 giây ở CP3; dry run và bấm giờ.
- [ ] Soát repo nộp: `README.md`, `spec.md`, `demo-slides.pdf`, `codebase/`, `eval/`, `reflection/`; thêm `validation/` nếu làm bonus. Xác nhận không có data pack/secret trong file **và lịch sử**.
- [ ] Nộp PDF + video theo form CP5, giữ biên nhận. Sau CP5 không nộp thêm artifact.

## CP6 — Thuyết trình · 09:00 ngày 19/09

- [ ] Diễn tập demo live một case thường, một case khó và một case lạ giám khảo có thể đưa tại chỗ; chuẩn bị mở video dự phòng khi cần.
- [ ] Mỗi thành viên trình bày ít nhất một phần và giải thích được đúng phần mình làm, lựa chọn automation, lỗi nguy hiểm nhất, tỷ lệ đạt và khoảng cách tới quality bar.
- [ ] Xác nhận thể lệ thời lượng cuối cùng với BTC: guide/rubric ghi **5 phút trình bày + 5 phút hỏi đáp**, còn README mô tả vòng cụm E403 **6 phút/nhóm**.
- [ ] Mỗi thành viên viết reflection cá nhân: vai trò, việc đã làm, AI đã hỗ trợ thế nào, bài học từ một case fail của nhóm.

## Bonus R6 — Người dùng thật thử prototype

- [ ] Mời các willing users đã ghi trong canvas dùng thử một task thật, quan sát họ tự thao tác; lưu `validation/` gồm tên/vai, task, hành vi quan sát, quote nguyên văn, mức nghiêm trọng và quyết định sửa/giữ.
- [ ] Có **ít nhất 2 người ngoài nhóm** và một thay đổi từ feedback hoặc lý do có căn cứ để giữ nguyên trong `spec.md` §9. README phần bonus yêu cầu **5 người**, trong khi rubric/guide ghi **≥2**; ưu tiên 5 nếu kịp và xác nhận mức áp dụng với TA.
