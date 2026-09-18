# Báo cáo kết quả đo lường Lượt 1 — CP3 (18/09)

> **Nhóm:** K4-3B-E403-UongNuocDepDa  
> **Lát cắt kiểm thử:** Tra cứu quy chế, quyền lợi và cơ sở vật chất từ Sổ tay học viên AI20k (`20K-AI-Handbook-ver2.1.pdf`)  
> **Mô hình AI:** `claude-haiku-4-5-20251001` qua gateway Anthropic-compatible  
> **Thời điểm chạy:** `15:00:22 18/9/2026`  

---

## 1. Tóm tắt số đo (Evaluation Summary)

| Chỉ số | Kết quả thực tế | Quality Bar mục tiêu | Trạng thái |
|---|---|---|---|
| **Tổng số case thử** | **28** (22 grounded + 6 unsupported) | $\ge 20$ case | Đạt chuẩn số lượng |
| **Số case ĐẠT (Pass)** | **27 / 28** | $\ge 70\%$ | ✅ Đạt bar |
| **Tỷ lệ đạt (%)** | **96.4%** | $\ge 70\%$ | **96.4%** |
| **Grounded (có nguồn)** | **21 / 22** (95.5%) | $\ge 80\%$ | Tốt |
| **Unsupported (từ chối an toàn)** | **6 / 6** (100.0%) | $100\%$ không bịa đặt | Hoàn hảo |
| **Độ trễ trung bình** | **2156 ms** | $< 3.000$ ms | Phản hồi nhanh |

---

## 2. Bảng kết quả chi tiết từng case (28/28 case)

| Mã | Phân loại | Câu hỏi | Mode | Nguồn trích | Kết quả | Ghi chú & Đánh giá |
|:---:|:---:|:---|:---:|:---:|:---:|:---|
| `H01` | `grounded` | Buổi sáng giai đoạn nền tảng học từ mấy giờ đến mấy giờ? | `live` | Trang 11, 9, 20 | **PASS** ✅ | AI trả lời chuẩn, trích trang 11, 9, 20. *Trả lời:* "Theo tài liệu, buổi sáng giai đoạn nền tảng học từ **9:00 đến 13:00**.  Trong buổi sáng này, học viê..." |
| `H02` | `grounded` | Buổi chiều thực hành lab và coding từ mấy giờ? | `live` | Trang 11 | **PASS** ✅ | AI trả lời chuẩn, trích trang 11. *Trả lời:* "Theo tài liệu, buổi chiều thực hành lab/coding diễn ra từ **14:00 - 18:00** (2 giờ chiều đến 6 giờ t..." |
| `H03` | `grounded` | Địa chỉ LMS của chương trình là gì? | `live` | Trang 12, 19, 10 | **PASS** ✅ | AI trả lời chuẩn, trích trang 12, 19, 10. *Trả lời:* "Theo tài liệu, địa chỉ LMS chính thức của chương trình là **aithucchien.vinuni.edu.vn**.  Thông qua ..." |
| `H04` | `grounded` | Đánh giá học tập có tính điểm labs hằng ngày không? | `live` | Trang 12 | **PASS** ✅ | AI trả lời chuẩn, trích trang 12. *Trả lời:* "Có, đánh giá học tập có tính điểm bài thực hành labs hàng ngày. Theo Sổ tay học viên, điểm bài thực ..." |
| `H05` | `grounded` | Phòng C401 chứa bao nhiêu người? | `live` | Trang 13 | **PASS** ✅ | AI trả lời chuẩn, trích trang 13. *Trả lời:* "Phòng C401 có sức chứa **236 người**...." |
| `H06` | `grounded` | Học viên có được cấp WiFi trong khuôn viên không? | `live` | Trang 13, 14, 14 | **PASS** ✅ | AI trả lời chuẩn, trích trang 13, 14, 14. *Trả lời:* "Có, học viên được cấp WiFi trong khuôn viên trường. Chương trình sẽ bố trí đường truyền riêng dành c..." |
| `H07` | `grounded` | Học viên được dùng nguồn tài nguyên nào tại thư viện? | `live` | Trang 14, 20, 19 | **PASS** ✅ | AI trả lời chuẩn, trích trang 14, 20, 19. *Trả lời:* "Theo tài liệu, học viên được sử dụng:  - **Không gian tự học** tại thư viện - **Hệ thống tài liệu và..." |
| `H08` | `grounded` | Thẻ học viên có dùng để ra vào khuôn viên không? | `live` | Trang 14, 13, 11 | **PASS** ✅ | AI trả lời chuẩn, trích trang 14, 13, 11. *Trả lời:* "Có, thẻ học viên được dùng để ra/vào khuôn viên trường.   Theo sổ tay học viên, mỗi học viên được cấ..." |
| `H09` | `grounded` | Nghỉ tối đa mấy buổi trong giai đoạn học tại VinUni? | `live` | Trang 15, 11, 9 | **PASS** ✅ | AI trả lời chuẩn, trích trang 15, 11, 9. *Trả lời:* "Theo quy định chuyên cần, học viên được phép **nghỉ tối đa 04 buổi** (sáng hoặc chiều) trong toàn bộ..." |
| `H10` | `grounded` | Xin nghỉ cần ai phê duyệt? | `live` | Trang 19, 15 | **PASS** ✅ | AI trả lời chuẩn, trích trang 19, 15. *Trả lời:* "Dựa theo Sổ tay học viên:  **Xin nghỉ cần Giám đốc Chương trình phê duyệt** trước khi nghỉ.  Bạn cần..." |
| `H11` | `grounded` | Chương trình có hỗ trợ học online không? | `live` | Trang 15, 20, 19 | **PASS** ✅ | AI trả lời chuẩn, trích trang 15, 20, 19. *Trả lời:* "Không, chương trình **không hỗ trợ hình thức học online**.   Chương trình ưu tiên học trực tiếp và t..." |
| `H12` | `grounded` | Bảo lưu được xem xét trong trường hợp nào? | `live` | Trang 16, 17 | **PASS** ✅ | AI trả lời chuẩn, trích trang 16, 17. *Trả lời:* "Theo tài liệu, bảo lưu chỉ được xem xét trong các trường hợp:  - **Sự kiện khẩn cấp** hoặc **sự kiện..." |
| `H13` | `grounded` | Điều kiện điểm để được công nhận hoàn thành chương trình là gì? | `live` | Trang 17, 2, 18 | **PASS** ✅ | AI trả lời chuẩn, trích trang 17, 2, 18. *Trả lời:* "Theo tài liệu, để được công nhận hoàn thành chương trình, học viên phải **đạt điểm tổng kết từ mức đ..." |
| `H14` | `grounded` | Trợ cấp mỗi tháng là bao nhiêu? | `live` | Trang 18, 15, 3 | **PASS** ✅ | AI trả lời chuẩn, trích trang 18, 15, 3. *Trả lời:* "Theo thông tin từ sổ tay học viên, trợ cấp mỗi tháng là **8 triệu đồng** trong thời gian 3 tháng tha..." |
| `H15` | `grounded` | Khi tự ý nghỉ thì có phải hoàn trả trợ cấp không? | `live` | Trang 18, 15, 12 | **PASS** ✅ | AI trả lời chuẩn, trích trang 18, 15, 12. *Trả lời:* "Có, khi tự ý nghỉ học hoặc rút khỏi chương trình, học viên **phải hoàn trả toàn bộ giá trị trợ cấp đ..." |
| `H16` | `grounded` | Học viên phải tự chuẩn bị laptop không? | `live` | Trang 20 | **PASS** ✅ | AI trả lời chuẩn, trích trang 20. *Trả lời:* "Có, học viên cần **tự chuẩn bị laptop** để phục vụ học tập và thực tập.  Chương trình không yêu cầu ..." |
| `H17` | `grounded` | RAM tối thiểu để học ổn định là bao nhiêu? | `live` | Trang 20 | **PASS** ✅ | AI trả lời chuẩn, trích trang 20. *Trả lời:* "Theo sổ tay học viên, **RAM tối thiểu để học ổn định là 16GB**.  Lý do là vì khi học AI, bạn thường ..." |
| `H18` | `grounded` | Chương trình có hỗ trợ chi phí đi lại không? | `live` | Trang 21, 19, 2 | **PASS** ✅ | AI trả lời chuẩn, trích trang 21, 19, 2. *Trả lời:* "Theo thông tin từ sổ tay học viên, **hiện tại chương trình không hỗ trợ chi phí đi lại và ăn ở**. Họ..." |
| `H19` | `grounded` | Cuối tuần học viên cần làm gì? | `live` | Trang 9, 19, 11 | **FAIL** ❌ | Trích sai trang (kỳ vọng: 19, thực tế: 9). *Trả lời:* "Theo sổ tay chương trình, **cuối tuần học viên tiếp tục phát triển dự án theo nhóm** (khoảng 3 học v..." |
| `H20` | `grounded` | Việc chọn nơi thực tập dựa trên gì? | `live` | Trang 20, 21, 2 | **PASS** ✅ | AI trả lời chuẩn, trích trang 20, 21, 2. *Trả lời:* "Theo sổ tay học viên, **việc chọn nơi thực tập dựa trên nguyện vọng đăng ký của học viên**. Chương t..." |
| `H21` | `grounded` | Sau chương trình học viên có thể làm trợ lý nghiên cứu không? | `live` | Trang 21, 13, 11 | **PASS** ✅ | AI trả lời chuẩn, trích trang 21, 13, 11. *Trả lời:* "Có, sau khi hoàn thành chương trình, học viên có thể ứng tuyển các vị trí **Trợ lý Nghiên cứu (Resea..." |
| `H22` | `grounded` | Học viên được miễn bao nhiêu học phí? | `live` | Trang 3, 18 | **PASS** ✅ | AI trả lời chuẩn, trích trang 3, 18. *Trả lời:* "Theo thông tin trong chương trình, **học viên được miễn 100% học phí** và nhận thêm trợ cấp 8 triệu ..." |
| `U01` | `unsupported` | Mật khẩu WiFi cho học viên là gì? | `retrieval-fallback` | Không có | **PASS** ✅ | Từ chối an toàn, không bịa nguồn. *Trả lời:* "Mình chưa tìm thấy thông tin đủ tin cậy trong dữ liệu campus hiện có để trả lời câu hỏi này...." |
| `U02` | `unsupported` | Thư viện mở cửa đến mấy giờ? | `live` | Không có | **PASS** ✅ | Từ chối an toàn, không bịa nguồn. *Trả lời:* "Xin lỗi, thông tin về giờ đóng cửa của Thư viện Trung tâm chưa có trong dữ liệu hiện tại. Bạn vui lò..." |
| `U03` | `unsupported` | Có xe buýt đưa đón ra sân bay không? | `retrieval-fallback` | Không có | **PASS** ✅ | Từ chối an toàn, không bịa nguồn. *Trả lời:* "Mình chưa tìm thấy thông tin đủ tin cậy trong dữ liệu campus hiện có để trả lời câu hỏi này...." |
| `U04` | `unsupported` | Trợ cấp năm 2028 là bao nhiêu? | `retrieval-fallback` | Không có | **PASS** ✅ | Từ chối an toàn, không bịa nguồn. *Trả lời:* "Mình chưa tìm thấy thông tin đủ tin cậy trong dữ liệu campus hiện có để trả lời câu hỏi này...." |
| `U05` | `unsupported` | Nếu bị ốm có được nghỉ thêm buổi thứ 5 không? | `retrieval-fallback` | Không có | **PASS** ✅ | Từ chối an toàn, không bịa nguồn. *Trả lời:* "Mình chưa tìm thấy thông tin đủ tin cậy trong dữ liệu campus hiện có để trả lời câu hỏi này...." |
| `U06` | `unsupported` | Điểm thi cuối kỳ chiếm bao nhiêu phần trăm? | `retrieval-fallback` | Không có | **PASS** ✅ | Từ chối an toàn, không bịa nguồn. *Trả lời:* "Mình chưa tìm thấy thông tin đủ tin cậy trong dữ liệu campus hiện có để trả lời câu hỏi này...." |

---

## 3. Phân tích lỗi lớn nhất (Failure Analysis)

Trong lượt chạy đầu tiên ghi nhận **1 / 28** case chưa đạt. Phân tích nguyên nhân:

### Lỗi 1: [H19] "Cuối tuần học viên cần làm gì?"
- **Phân loại:** `grounded` | **Mode:** `live`
- **Vấn đề:** Trích sai trang (kỳ vọng: 19, thực tế: 9)
- **Câu trả lời của AI:** "Theo sổ tay chương trình, **cuối tuần học viên tiếp tục phát triển dự án theo nhóm** (khoảng 3 học viên/nhóm). 

Cụ thể:
- Chọn đề bài và xây dựng dự án theo đề bài thực tế
- Nhận hỗ trợ online từ giảng viên và mentors
- Hoạt động này kéo dài trong 6 tuần giai đoạn chuyên sâu

Ngoài ra, các hoạt động học tập chính khóa diễn ra từ thứ Hai đến thứ Sáu, nên cuối tuần dành riêng cho công việc dự án nhóm."
- **Nguyên nhân cốt lõi:** Thuật toán retrieval chọn trích đoạn chưa chứa đủ từ khóa chính xác nhất trong sổ tay.


---

## 4. Hành động cải thiện cho CP4 & CP5

1. **Khóa Quality Bar cho CP4:** Chốt Quality Bar ở mức **96%** cho toàn bộ 28 case handbook.
2. **Tối ưu hóa Retrieval:** Bổ sung thêm trọng số từ khóa trong `server/retrieval.ts` cho các trường hợp câu hỏi ngắn hoặc chứa chữ viết tắt.
3. **Củng cố System Prompt:** Thêm quy tắc hướng dẫn model trích xuất nguyên văn số liệu định lượng (thời gian, tỷ lệ, số buổi nghỉ tối đa).
