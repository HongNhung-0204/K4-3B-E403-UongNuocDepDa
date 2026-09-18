# Validation Feedback

## Mục tiêu validation

Kiểm tra ba việc chính:

1. Người dùng có nhận ra câu trả lời có nguồn hay không.
2. Người dùng có hiểu hệ thống từ chối khi không đủ căn cứ hay không.
3. Người dùng có đi được từ câu trả lời có địa điểm sang Campus Map và tuyến mô phỏng hay không.

## Người thử 1

- Tên/vai trò: Nguyễn Hoàng Tuyên — học viên
- Willing user: Có, dữ liệu mock
- Thời gian: 18/09/2026, 19:00

| Task                                                        | Hoàn thành? |      Thời gian | Quan sát                                                        |
| ----------------------------------------------------------- | ----------- | -------------: | --------------------------------------------------------------- |
| Hỏi câu có nguồn: “Phòng C401 chứa bao nhiêu người?”        | Có          |        32 giây | Nhìn thấy câu trả lời và trang nguồn.                           |
| Hỏi câu không có nguồn: “Mật khẩu WiFi cho học viên là gì?” | Có          |        18 giây | Hiểu rằng hệ thống không có đủ căn cứ và không bịa câu trả lời. |
| Hỏi về thư viện rồi mở Campus Map                           | Có          | 1 phút 42 giây | Tìm thấy liên kết bản đồ và hoàn tất các bước chỉ đường.        |

### Quote nguyên văn

> “Em thấy có nguồn và số trang nên dễ kiểm tra hơn. Phần bản đồ thì em biết phải bấm vào đâu.”

### Vấn đề và đề xuất

- Mức độ: Thấp
- Vấn đề: Nhãn “Chưa xác minh” chưa được chú ý ngay lần đầu.
- Đề xuất: Làm nhãn trạng thái nguồn nổi bật hơn.
- Thay đổi: Đưa vào backlog, chưa sửa trong prototype hiện tại.

## Người thử 2

- Tên/vai trò: Trần Xuân Tùng — học viên mới
- Willing user: Có, dữ liệu mock
- Thời gian: 18/09/2026, 19:08

| Task                                                          | Hoàn thành?               |      Thời gian | Quan sát                                                       |
| ------------------------------------------------------------- | ------------------------- | -------------: | -------------------------------------------------------------- |
| Hỏi câu có nguồn: “Học viên được miễn bao nhiêu học phí?”     | Có                        |        41 giây | Đọc được con số và mở source card để kiểm tra.                 |
| Hỏi câu ngoài phạm vi: “Có xe buýt đưa đón ra sân bay không?” | Có                        |        21 giây | Không cố hỏi lại nhiều lần sau khi thấy thông báo thiếu nguồn. |
| Hỏi “Thư viện ở đâu?” rồi mở Campus Map                       | Có, cần hướng dẫn lần đầu | 2 phút 05 giây | Cần được nhắc rằng cần bấm vào thẻ địa điểm để xem bản đồ.     |

### Quote nguyên văn

> “Nếu có thêm nút đi thẳng đến bản đồ ở ngay dưới câu trả lời thì em sẽ tìm nhanh hơn.”

### Vấn đề và đề xuất

- Mức độ: Trung bình
- Vấn đề: Hành động tiếp theo trên location card chưa đủ nổi bật.
- Đề xuất: Làm rõ nút “Xem trên Campus Map”.
- Thay đổi: Đề xuất chỉnh CTA trong vòng tiếp theo; chưa sửa ở bản CP5.

## Người thử 3

- Tên/vai trò: Trần Quốc Vượng — học viên
- Willing user: Có, dữ liệu mock
- Thời gian: 18/09/2026, 19:16

| Task                                                      | Hoàn thành? |      Thời gian | Quan sát                                      |
| --------------------------------------------------------- | ----------- | -------------: | --------------------------------------------- |
| Hỏi câu có nguồn: “Nghỉ tối đa mấy buổi?”                 | Có          |        37 giây | Tin câu trả lời sau khi thấy nguồn tham khảo. |
| Hỏi câu không có nguồn: “Thời tiết trên sao Hỏa hôm nay?” | Có          |        16 giây | Nhận ra đây là câu hỏi ngoài phạm vi.         |
| Hỏi về CECS Lab và mở bản đồ                              | Có          | 1 phút 28 giây | Xem được Building B và tuyến mô phỏng.        |

### Quote nguyên văn

> “Em thích việc hệ thống nói rõ chưa có thông tin thay vì tự đoán, nhưng em muốn biết nên hỏi bộ phận nào tiếp theo.”

### Vấn đề và đề xuất

- Mức độ: Trung bình
- Vấn đề: Fallback chưa luôn hướng dẫn rõ bước tiếp theo.
- Đề xuất: Thêm hướng dẫn liên hệ thư viện hoặc bộ phận phụ trách khi câu hỏi liên quan đến quy định chưa xác minh.
- Thay đổi: Đưa vào backlog vì cần xác minh đúng đầu mối trước khi hiển thị.
