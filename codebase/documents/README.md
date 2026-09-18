# Tài liệu cho RAG

Đặt file `.pdf`, `.docx`, `.txt` hoặc `.md` vào thư mục này (có thể chia thành thư mục con). Chạy `npm run ingest`, hoặc chạy `npm run dev`/`npm run build`: hai lệnh này tự lập lại chỉ mục trước khi khởi động. Nếu server dev đang chạy, hãy khởi động lại sau khi thêm/sửa/xóa tài liệu.

App đọc text, chia thành các đoạn khoảng 1.100 ký tự và lưu vào `server/generated-knowledge.json`. Câu hỏi sẽ tìm tối đa ba đoạn liên quan và gửi **chỉ các đoạn đó** đến AI server-side. Nguồn hiển thị tên file, đề mục Markdown và số trang PDF. PDF dạng ảnh scan cần OCR thành text trước; `.docx` không có số trang cố định.

Không cần metadata để bắt đầu. Muốn đặt tên, gắn URL nguồn công khai, từ đồng nghĩa hoặc liên kết điểm trên bản đồ, sao chép `manifest.example.json` thành `manifest.json` và sửa theo tên file tương đối. `verified` mặc định là `false`; chỉ đặt `true` sau khi bạn kiểm tra tài liệu và nguồn phát hành. `locationId` phải khớp ID của điểm trên bản đồ.

File tài liệu, `manifest.json` và chỉ mục tạo ra được Git bỏ qua vì chỉ mục chứa nguyên văn tài liệu. Nếu muốn deploy Vercel bằng tài liệu **được phép công khai**, hãy chủ động đưa các file đó vào repository; lệnh build trên Vercel sẽ tạo lại chỉ mục. Đừng đưa tài liệu nội bộ hoặc nhạy cảm vào repo công khai. Cách nạp này không có upload qua giao diện web hay lưu trữ riêng tư trên cloud.

Nếu không cấu hình `ANTHROPIC_*` ở server, app trích nguyên văn câu liên quan nhất từ tài liệu và hiện nhãn “Trích từ tài liệu”. Khi cấu hình AI, server gửi các đoạn tìm được để tổng hợp câu trả lời. Câu hỏi không tìm được nguồn sẽ nhận thông báo thiếu dữ liệu.
