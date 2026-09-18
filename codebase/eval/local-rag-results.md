# Kiểm tra RAG trên sổ tay AI Thực chiến — sau CP3

Ngày kiểm tra: 18/09/2026. Nguồn: `documents/20K-AI-Handbook-ver2.1.pdf`, 22 trang, URL công khai của VinUniversity ghi trong `documents/manifest.json`. Chỉ mục tạo ra 36 đoạn. Trạng thái `verified: true` theo xác nhận kiểm tra nguồn của nhóm.

## Phạm vi và kết quả

Chạy `npm run eval` với [28 câu hỏi](handbook-golden.json): 22 câu có câu trả lời trong sổ tay và 6 câu chưa có căn cứ. Bộ kiểm tra gọi trực tiếp API handler với môi trường không có khóa AI, rồi kiểm tra đoạn được truy xuất, nội dung trả lời, số trang, URL và trạng thái xác minh. Kết quả: **28/28 case đạt**; thêm 1 kiểm tra metadata đạt. Đây là phép đo retrieval và chế độ trả lời trích xuất, **không phải điểm chất lượng của câu trả lời AI thật**.

Case H19 được chỉnh tiêu chí chấm: cả trang 9 và trang 19 đều nói về việc học viên làm dự án cuối tuần, nên đáp án có căn cứ từ một trong hai trang đều hợp lệ. [Báo cáo lượt 1 CP3](run-1-results.md) vẫn ghi nguyên kết quả AI thật khi nộp: 27/28 theo tiêu chí chấm ban đầu. Không cộng gộp hai lượt đo.

Các lệnh kiểm tra bổ sung: `npm test` (45 kiểm tra Vitest và 6 kiểm tra ingest), `npm run build` (thành công), `npm run smoke:render` (server production và API), `npm run test:e2e` (5/5 ở dev và 5/5 trên server production, gồm Home → Chat → nguồn → bản đồ → chỉ đường). Tìm kiếm nội dung sổ tay và tên PDF trong `dist/` không thấy kết quả.

## Bước cần làm với bản deploy

Sau lượt đo này, nhóm đã thêm `documents/public-sources.json` để build từ Git tải sổ tay qua HTTPS và kiểm tra SHA-256 trước khi tạo chỉ mục. `npm run verify:public-source` đã tải được file chính thức và tạo lại 36 đoạn khi không có PDF local. PDF và `manifest.json` local vẫn bị Git bỏ qua; cần push thay đổi mới và kiểm tra trên URL Render trước khi coi là đã deploy.
