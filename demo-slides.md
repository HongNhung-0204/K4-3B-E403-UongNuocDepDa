# CP5 Demo Slides — MyViUni AI

> Nhóm Uống Nước Đẹp DA · Zone C6 · Track E · 5 phút
>
> **Thông điệp chính:** MyVinUni AI giúp học viên tra cứu thông tin chương trình và tiện ích có căn cứ, sau đó chuyển sang bản đồ campus khi câu trả lời gắn với địa điểm.

## Slide 1 — User & Job

### Học viên mới cần tìm thông tin và đường đi trong campus

**Job executor**

Học viên mới đến VinUni, cần biết thông tin chương trình/quyền sử dụng tiện ích hoặc tìm đến một tòa nhà.

**Core JTBD**

> Tìm nhanh thông tin khóa học, tiện ích và đường đi mà không phải dò nhiều nguồn hoặc tự tìm đường.

**Bằng chứng pain**

- **11/15 học viên (73,3%)** trong khảo sát riêng cho biết từng gặp khó khăn khi tìm đường đến địa điểm/tòa nhà.
- **20/100 bài mining (20%)** là câu hỏi về thông tin chương trình và tiện ích.
- Quote mining: “Học viên có được sử dụng sân cầu lông và bể bơi” — nguồn Facebook

---

## Slide 2 — Vì sao chọn tính năng này

### Chọn tra cứu có nguồn; giữ bản đồ làm hành động tiếp theo

| Ứng viên                        |                         Evidence |                   Tốn mỗi lần | Quyết định                 |
| ------------------------------- | -------------------------------: | ----------------------------: | -------------------------- |
| Tìm đường/tìm nơi học           | **11/15 = 73,3%** khảo sát riêng | Chưa đo thời lượng trung bình | Hỗ trợ; route hiện là demo |
| Thông tin chương trình/khóa học |         **6–8/20** bài liên quan |                **10–20 phút** | Chọn làm lõi               |
| Quyền sử dụng tiện ích          |         **4–6/20** bài liên quan |                **10–15 phút** | Chọn làm lõi               |

**Quyết định bằng số**

Hai nhóm lõi chiếm khoảng **10–14/20 bài liên quan**, có thể kiểm chứng bằng sổ tay chính thức. Code đã có chỉ mục **36 đoạn**, truy xuất tối đa **3 đoạn** và hiển thị nguồn/trang. Bộ eval hiện có **28 case handbook + 10 case mining mở rộng**.

**Vì sao không chọn tìm đường làm quyết định AI lõi?**

## Pain mạnh nhưng tuyến hiện chỉ là dữ liệu mô phỏng, chưa khảo sát thực địa. Bản đồ vẫn là bước tiếp theo khi câu trả lời có `locationId`.

## Slide 3 — Giải pháp & demo live

### Một câu lát cắt

> Học viên mới hỏi một thông tin về chương trình hoặc tiện ích campus; hệ thống quyết định nguồn chính thức có đủ căn cứ không; nếu đủ thì trả lời ngắn gọn kèm nguồn/trang và điểm đến, nếu thiếu thì nói rõ chưa có căn cứ và không bịa.

### Flow demo

`Home → Hỏi MyViUni AI → câu trả lời + nguồn → Campus Map → Navigation 4 bước`

### Automation

**Conditional:** AI chỉ trả lời khi có nguồn phù hợp; khi không chắc thì fallback hoặc từ chối. Người dùng tự quyết định mở nguồn, xem bản đồ và kiểm tra với bộ phận phụ trách.

### Demo 1 — Case chuẩn

**Input:** `Thư viện mở đến mấy giờ và ở đâu?`

**Cần chỉ ra trên màn hình:**

- Trả lời có vị trí **Building C**.
- Hiển thị nguồn và nhãn **Chưa xác minh** cho giờ mở cửa.
- Bấm **Xem trên Campus Map**.
- Chọn tuyến và hoàn tất **Bước 1/4 → Bước 4/4**.

### Demo 2 — Case khó

**Input:** `Thời tiết trên sao Hỏa hôm nay?`

**Cần chỉ ra:**

- `retrieval-fallback`.
- Không có source giả.
- Hệ thống không gọi AI khi không có nguồn.

**Nói trong 2 phút:**

Case chuẩn chứng minh đường đi end-to-end. Case khó chứng minh hệ thống biết dừng khi ngoài phạm vi.

---

## Slide 4 — Kết quả đo & failure

### Đạt quality bar, nhưng vẫn có failure cần nói rõ

**Quality bar đã chốt**

> Đạt khi **≥96% qua 28 case**, trong đó **100% case unsupported không bịa nguồn**; mọi case còn lại phải có phân tích nguyên nhân.

| Lượt đo              |             Kết quả | Trạng thái                         |
| -------------------- | ------------------: | ---------------------------------- |
| Local RAG/extractive |    **28/28 = 100%** | Đạt; đo retrieval/fallback         |
| AI thật CP3          |   **27/28 = 96,4%** | Đạt bar                            |
| Unsupported          |      **6/6 = 100%** | Không bịa nguồn                    |
| Grounded             |   **21/22 = 95,5%** | 1 failure cần phân tích            |
| Latency trung bình   |        **2.156 ms** | Dưới 3 giây                        |
| Mining mở rộng       | **10 case M01–M10** | Đã tạo, chưa gộp vào tỷ lệ 28 case |

### Failure lớn nhất — H19

`Cuối tuần học viên cần làm gì?`

- Lượt đầu trích trang 9 thay vì kỳ vọng trang 19.
- Nguyên nhân: retrieval chọn đoạn chưa tối ưu cho câu hỏi ngắn.
- Sau rà soát, trang 9 và trang 19 đều có căn cứ phù hợp.
- Bài học: câu trả lời đúng ý chưa đủ; citation cũng phải kiểm được.

---

## Slide 5 — Validation & eval

### Kết quả kiểm thử cho thấy hệ thống biết trả lời và biết từ chối

`validation/feedback.md` hiện có bản ghi của **3 người thử**, mỗi người làm **3 task**: câu có nguồn, câu không có nguồn và chat → Campus Map.

**Điểm lặp lại trong feedback hiện có:**

- Người dùng hiểu và đánh giá cao source/page.
- Nhãn “Chưa xác minh” và nút “Xem trên Campus Map” cần nổi bật hơn.
- Fallback nên hướng dẫn bước tiếp theo rõ hơn.

**Golden set:** `28 case` chính + `10 case mining mở rộng`

- **22 grounded:** lịch học, LMS, WiFi, thư viện, thẻ, chuyên cần, trợ cấp, thiết bị, thực tập.
- **6 unsupported:** mật khẩu WiFi, giờ thư viện chưa xác minh, xe buýt sân bay, dữ liệu năm 2028, ngoại lệ nghỉ học, tỷ lệ điểm thi.
- **10 mining case M01–M10:** câu hỏi nguyên văn từ Discord, có `msg_id`, chia đủ 4 lớp lỗi ①–④.
- Unit/API: **45 test pass**.
- Ingest: **6 test pass**.
- E2E: **5/5** ở dev và production.

**Kết luận kiểm thử**

- Đạt quality bar đã khóa.
- Unsupported đạt **100% không bịa**.
- Khoảng trống còn lại: 10 case mining đã được tạo nhưng chưa chạy đo và chưa gộp vào tỷ lệ 28 case; validation vẫn cần xác nhận từ người dùng nếu muốn tính bonus thật.

**Nói trong 45 giây:**

Nhóm tách hai loại bằng chứng: eval cho chất lượng hệ thống, validation cho khả năng sử dụng. Bản feedback hiện có là mock nên không dùng quote như feedback thật nếu chưa xác nhận.

---

## Slide 6 — Nếu có thêm 1 tuần

### Ba việc ưu tiên, đều trỏ về failure hoặc khoảng trống evidence

1. **Chạy đo 10 case mining mở rộng**
   - Chạy M01–M10 riêng, ghi pass/fail theo hành vi mong muốn và 4 lớp lỗi.
   - Chỉ gộp tỷ lệ sau khi có output và tiêu chí chấm rõ ràng.

2. **Kiểm chứng thực địa cho bản đồ**
   - Đo vị trí, khoảng cách và tuyến đến Building B/C.
   - Chỉ bỏ nhãn “demo” sau khi có người xác minh.
     **Bài học lớn nhất**

> Trợ lý AI đáng tin không phải là trợ lý luôn trả lời; đó là trợ lý biết chỉ ra căn cứ và biết dừng khi không đủ căn cứ.

**Kết thúc pitch:**

MyVinUni AI biến câu hỏi rời rạc thành một flow có thể kiểm chứng: **hỏi → thấy căn cứ → chọn hành động → biết giới hạn**.
