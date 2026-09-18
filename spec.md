# Template AI Spec _(spec.md — commit trước hạn chốt spec: 21:00 18/9, tại CP4 · quality bar chốt từ thời điểm nộp)_

> Cấu trúc phủ đúng "SPEC 8 phần" của chương trình: Bằng chứng (§1-§2) · Lát cắt (§4) · Canvas (đính kèm CP1) · Augment/Automate (§4) · 4 đường đi của trải nghiệm (§6) · Kiểu lỗi (§5) · Kiểm thử (§7) · Phân công (§8). Hướng dẫn viết từng mục: `02-guide.md`.

```markdown
# AI SPEC — · Nhóm Uống Nước Đẹp DA · Zone C6

Hướng: [ ] A — VLearn [ ] B — Trợ lý Học viên [ ] C — Lesson Studio [ ] D — Học tập thích ứng [x] E — Làn mở
Loại: [ ] Tối ưu tính năng có sẵn [x] Tính năng mới

## §1. User & Job

- Job executor + workflow (đính kèm worksheet JTBD / ảnh sơ đồ):
  - Người thực hiện công việc: học viên mới đến trường VinUni, đang trong giai đoạn tìm hiểu thông tin khóa học và các dịch vụ tiện ích trong khuôn viên trường.
  - Workflow: khi cần biết thông tin khóa học hoặc quyền sử dụng tiện ích, học viên phải tra cứu nhiều nguồn hoặc hỏi người khác; khi cần đến một tòa nhà/địa điểm, học viên phải tự xác định vị trí và đường đi trong campus trước khi di chuyển.
- Core JTBD (không tên sản phẩm/AI trong câu):
  - Tìm nhanh thông tin khóa học, tiện ích và đường đi trong campus khi mới đến VinUni mà không mất thời gian dò nhiều nguồn hoặc tự tìm đường.
- Problem statement (KHÔNG chữ AI):
  - Khi mới đến học tại VinUni, học viên mất thời gian tra cứu nhiều nguồn để biết thông tin khóa học/quyền sử dụng tiện ích và gặp khó khăn khi tìm đường đến các tòa nhà. Việc này làm tăng thời gian chuẩn bị, gây nhầm lẫn trong ngày đầu và có thể khiến học viên đến sai hoặc chậm địa điểm.
- Evidence (chuẩn A và/hoặc B — log đầy đủ trong repo):
  - Số liệu mining / kết quả tìm kiếm (n = 100, 20% cùng chủ đề):
    - Tổng cộng đã lướt 100 bài trong group học viên và các nguồn thông tin liên quan.
    - 20/100 (20%) bài viết/câu hỏi liên quan trực tiếp đến thông tin học của chương trình và các tiện ích trong trường.
    - Những bài này chủ yếu mô tả pain point tra cứu: học viên không biết thông tin khóa học và tiện ích nào được sử dụng, phải hỏi/tra nhiều nguồn mới tìm được đáp án.
    - **Giới hạn của mining:** trong 100 bài này không có đủ câu hỏi trực tiếp về việc tìm đường, nên không dùng tỷ lệ 20% để kết luận về pain tìm đường.
    - Nguồn: group học viên.
  - Khảo sát bổ sung về tìm đường (n = 15):
    - 11/15 học viên (73,3%) cho biết đã gặp khó khăn khi tìm đường đến địa điểm/tòa nhà trong campus.
    - Đây là bằng chứng khảo sát riêng cho pain tìm đường, không phải kết quả đếm từ 100 bài cào. Tần suất theo tuần/tháng và thời gian trung bình cần được ghi trong log khảo sát nếu nhóm đã hỏi các câu đó.
    - Nguồn: khảo sát 15 học viên; log cần lưu câu hỏi, từng câu trả lời và thời điểm khảo sát trong repo.
  - ≥5 quote/ví dụ nguyên văn + nguồn:
  - "Mọi người cho em hỏi nhà đa năng sân cầu lông có cần đăng kí mới được sử dụng không ạ"?" — https://www.facebook.com/share/p/19VECFDm1W/
  - "Trong 6 tuần học thì em có được dùng bể bơi của Vinuni không ạ?" — https://www.facebook.com/share/p/18AbZZLLzD/
  - "Anh/chị cho em hỏi 6 tuần đầu sẽ học trực tiếp tại trường, và 6 tuần sau đấy sẽ thực tập tại công ty fulltime ạ. Công ty thực tập thì nhà trường sẽ sắp xếp hay sao ạ, và trong 6 tuần thực tập thì có cần buổi nào phải có mặt ở trường không ạ. Em cảm ơn anh/chị!" — https://www.facebook.com/share/p/18AbZZLLzD/.
  - "Thứ 7, CN có chỗ nào ngồi làm việc không ạ" — https://www.facebook.com/share/p/18AbZZLLzD/.
  - "Các bạn khóa khác cho mình hỏi chương trình đào tạo của lv2" — https://www.facebook.com/share/p/1ED1rzc4Si/.
  - "Anh chị và các bạn cho mình hỏi lv2 khác gì với lv3" — https://www.facebook.com/share/p/1F5c1ALwBE/.
  - "Thư viện trường có máy in không, học viên có được sử dụng không" — https://www.facebook.com/share/p/19jWrxXice/
  - "Mọi người ơi, em hiện chỉ còn học 1 buổi 1 tuần trên trường và có điểm danh thì chương trình có tạo điều kiện cho nghỉ buổi hôm đó không ạ? " — https://www.facebook.com/share/p/1MCePVshfT/
-

## §2. Impact & quyết định chọn

- Bảng impact (tách đúng nguồn bằng chứng: mining 100 bài và khảo sát 15 học viên):

  | Ứng viên                                     |                         Bao nhiêu người/bài gặp | Tần suất                                                 | Tốn gì mỗi lần                                                                                   | Khả thi                                                                                       | Quyết định                                          |
  | -------------------------------------------- | ----------------------------------------------: | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- | --------------------------------------------------- |
  | Học viên mới cần tìm đường hoặc tìm nơi học  | **11/15 học viên (73,3%) trong khảo sát riêng** | Chưa đo được tần suất; pain được hỏi ở nhóm học viên mới | Mất thời gian xác định vị trí và tuyến đi; thời lượng trung bình chưa có trong khảo sát hiện tại | Có thể làm với dữ liệu địa điểm, nhưng tuyến đường hiện chỉ là demo và mới có một số điểm đến | Giữ ở phần hỗ trợ, không chọn làm quyết định AI lõi |
  | Học viên cần thông tin chương trình/khóa học |                     khoảng 6–8/20 bài liên quan | 1–2 lần/tháng                                            | Mất 10–20 phút để xác định lớp, chương trình, lịch học và yêu cầu                                | Có sổ tay chính thức để truy xuất, nhưng nội dung rộng và có thể thay đổi                     | Chọn làm lõi                                        |
  | Học viên cần kiểm tra quyền sử dụng tiện ích |                     khoảng 4–6/20 bài liên quan | 1–2 lần/tháng, tăng ở đầu học kỳ                         | Mất 10–15 phút để xác minh thư viện, máy in, bể bơi hoặc sân thể thao                            | Có thể trả lời kèm nguồn và điều kiện; hệ thống đã có cơ chế không trả lời khi thiếu nguồn    | Chọn làm lõi                                        |

- Ứng viên ĐÃ LOẠI + vì sao:
  - **Tìm đường hoặc tìm nơi học** có bằng chứng pain mạnh hơn về tỷ lệ gặp (**11/15 = 73,3%**), nhưng không được chọn làm quyết định AI trung tâm vì dữ liệu tuyến hiện chỉ là bản demo, chưa khảo sát thực địa; phần này chỉ nhận kết quả `locationId` rồi mở bản đồ và tuyến mô phỏng. Đây là phần hỗ trợ quan trọng của flow, không phải ứng viên bị phủ nhận nhu cầu.
  - Không chọn riêng **bản đồ campus** làm sản phẩm lõi vì bản đồ giải quyết việc xem vị trí tốt hơn việc xác minh quy định; các điểm phụ, khoảng cách và tuyến đường trong code vẫn được ghi rõ là dữ liệu demo.
- Ứng viên CHỌN + vì sao (bằng số):
  - **Trợ lý tra cứu thông tin chương trình và quyền sử dụng tiện ích:** chọn vì hai nhóm câu hỏi chiếm khoảng **10–14/20 bài liên quan**, mỗi lần khiến học viên mất **10–20 phút**, và có thể kiểm chứng bằng nguồn chính thức. Code đã có 36 đoạn chỉ mục từ sổ tay AI20K, truy xuất tối đa 3 đoạn, hiển thị nguồn/trang và trả lời “chưa đủ căn cứ” khi không có nguồn. Bản đồ được giữ làm hành động tiếp theo khi câu trả lời gắn với địa điểm.

## §3. Giải pháp tương tự đã nghiên cứu

- **NotebookLM:** nạp tài liệu → hỏi → trả lời kèm trích dẫn. Đáng học: citation nằm ngay cạnh câu trả lời để người dùng tự kiểm. Đáng né: phụ thuộc hoàn toàn vào bộ tài liệu đã nạp, không tự xử lý được dữ liệu campus trực quan. Mình khác: kết quả có `locationId` để nối sang Campus Map và có fallback trích đoạn khi AI không khả dụng.
- **Google Maps:** tìm địa điểm → xem vị trí → chọn tuyến → đi theo từng bước. Đáng học: hành động tiếp theo sau khi chọn điểm đến rất rõ. Đáng né: bản đồ không giải thích quy định/quyền sử dụng tiện ích. Mình khác: chat quyết định nguồn có đủ căn cứ trước, sau đó mới đưa người dùng sang tuyến demo; không giả vờ có định vị GPS hay tuyến thực địa.

## §4. Thiết kế

- Lát cắt MỘT CÂU (1 user · 1 việc · 1 quyết định AI · 1 kết quả): **Học viên mới hỏi một thông tin về chương trình hoặc tiện ích campus · hệ thống quyết định nguồn chính thức có đủ căn cứ không · nếu đủ thì trả lời tiếng Việt ngắn gọn kèm nguồn/trang và điểm đến, nếu thiếu thì nói rõ chưa có căn cứ và không bịa.**
- Non-goals (≥3 thứ KHÔNG build):
  - Không thay đổi lịch học, quy định, hồ sơ hoặc quyền sử dụng thay cho nhà trường.
  - Không trả lời dựa trên trí nhớ mô hình khi retrieval không tìm thấy nguồn.
  - Không cung cấp giờ mở cửa/quy định chưa được xác minh; câu hỏi về giờ thư viện hiện phải ghi rõ chưa xác minh.
  - Không làm định vị GPS, tính khoảng cách thực tế hoặc cam kết tuyến đường ngoài dữ liệu demo.
  - Không xây đăng nhập, hồ sơ cá nhân, thông báo thật hoặc lưu dữ liệu người dùng.
- Mức prototype nhắm tới: [ ] Sketch [ ] Mock [x] Working — **thật:** UI các route `/`, `/chat`, `/campus`, `/navigation/:routeId`; API `POST /api/chat`; retrieval tiếng Việt; chỉ mục 36 đoạn; gọi Anthropic-compatible server-side; nguồn, confidence, fallback và retry; test unit/E2E. **Mock/demo:** kiến thức campus cục bộ, ảnh bản đồ, vị trí phụ, khoảng cách và 2 tuyến mô phỏng từ Quảng trường trung tâm; chưa có GPS hay dữ liệu vận hành trực tiếp.
- Automation: [ ] augment [x] conditional [ ] automate — AI tự trả lời khi có nguồn phù hợp và chuyển sang extractive/offline fallback hoặc thông báo thiếu nguồn khi không chắc; người dùng vẫn tự quyết định có tin, mở nguồn, đi bản đồ hay kiểm tra với bộ phận phụ trách. Sai quy định có thể làm học viên mất thời gian hoặc vi phạm nội quy, nên không được automate việc chốt quyền sử dụng.
- §4b. Nguyên tắc đã áp dụng (≥4 — HAX/PAIR, xem guide):
  | Nguyên tắc | Áp cụ thể vào đâu trong prototype |
  |---|---|
  | G1 — Làm rõ hệ thống làm được gì | Màn hình Chat giới thiệu phạm vi hỏi thông tin campus/vị trí; Campus ghi rõ tuyến đi bộ là mô phỏng. |
  | G2 — Làm rõ làm tốt đến đâu | Mỗi answer hiển thị confidence, nguồn tham khảo, trang/URL và nhãn “Chưa xác minh” với dữ liệu demo. |
  | G10 — Thu hẹp phạm vi khi nghi ngờ | `retrieve()` trả rỗng thì trả `retrieval-fallback`; prompt yêu cầu nói rõ phần thiếu thay vì suy đoán. |
  | G11 — Giải thích vì sao | Source card hiển thị tài liệu, section/page; câu trả lời extractive ghi “Trích từ...” để người dùng kiểm lại. |
  | G9 — Sửa dễ dàng | Người dùng có thể hỏi lại trong cùng cuộc trò chuyện; khi upstream lỗi có nút `Thử lại`, khi chọn sai tuyến có thể quay lại Campus. |
  | PAIR — Feedback & Control | Người dùng luôn là người bấm mở nguồn, xem bản đồ, bắt đầu/kết thúc chỉ đường; hệ thống không tự điều hướng hay thực hiện hành động bên ngoài. |

## §5. Kiểu lỗi — 4 lớp chỗ khó + kịch bản (≥8) [bảng theo guide §2.5]

| Tình huống cụ thể                                                                 | Lớp                     | Hành vi mong muốn                                                                       | Nguyên tắc áp dụng       |
| --------------------------------------------------------------------------------- | ----------------------- | --------------------------------------------------------------------------------------- | ------------------------ |
| Hỏi “mật khẩu WiFi là gì?” nhưng sổ tay không có                                  | ① Nguồn sự thật         | Không gọi AI; trả “chưa tìm thấy thông tin đủ tin cậy”, không hiện source giả           | G10, PAIR Errors         |
| Hỏi giờ đóng cửa thư viện trong khi nguồn chưa xác minh                           | ① Nguồn sự thật         | Nói rõ giờ chưa được xác minh, khuyên kiểm tra với thư viện; không bịa giờ              | G2, G10                  |
| Hỏi “nghỉ thêm buổi thứ 5 nếu bị ốm được không?” nhưng thiếu tình trạng phê duyệt | ② Mơ hồ/thiếu thông tin | Không kết luận quyền nghỉ; yêu cầu kiểm tra quy trình/phê duyệt                         | G10, G11                 |
| Hỏi “ở đâu?” nhưng không nói rõ đang hỏi thư viện hay CECS Lab                    | ② Mơ hồ/thiếu thông tin | Hỏi lại địa điểm trước khi gắn `locationId`                                             | G10, G9                  |
| Hỏi dự báo thời tiết sao Hỏa hoặc xe buýt ra sân bay                              | ③ Ngoài phạm vi         | Trả fallback không có nguồn, không cố trả lời ngoài campus/chương trình                 | G1, G10                  |
| Người dùng muốn AI tự xin nghỉ hoặc đổi lịch học                                  | ③ Ngoài thẩm quyền      | Nêu không thực hiện hành động thay người dùng; hướng dẫn liên hệ đúng bộ phận           | PAIR Feedback & Control  |
| Hỏi quyền sử dụng thư viện nhưng câu trả lời trộn dữ liệu demo và sổ tay          | ④ Đặc thù domain        | Tách rõ nguồn verified/unverified, hiển thị nhãn và không biến demo thành quy định thật | G2, G11                  |
| Câu hỏi có số liệu như học phí, trợ cấp, số buổi nghỉ nhưng trích sai trang       | ④ Đặc thù domain        | Ưu tiên đoạn có số liệu, hiện trang nguồn; nếu không khớp thì không kết luận            | G11, PAIR Explainability |

## §6. Bốn đường đi của trải nghiệm

- Happy path: Người dùng hỏi một câu trong sổ tay, retrieval tìm được nguồn, AI trả lời tiếng Việt kèm confidence + source card; nếu có địa điểm thì hiện `Xem trên Campus Map`, người dùng chọn tuyến và đi qua 4 bước.
- Low-confidence (②): Input mơ hồ hoặc chỉ khớp yếu → hệ thống không gắn điểm đến tùy tiện, hiển thị mức khớp thấp/trung bình và yêu cầu người dùng hỏi lại cụ thể hơn.
- Failure/không căn cứ (①): Không có hit → `retrieval-fallback`, câu trả lời cố định không có source; không gọi AI. Với upstream lỗi nhưng có dữ liệu → dùng `offline-demo` hoặc `extractive` và gắn nhãn AI chưa phản hồi.
- Correction (user sửa): Người dùng sửa câu hỏi và gửi lại ngay trong chat; nếu request lỗi, bấm `Thử lại`; nếu destination/tuyến sai, quay lại Campus và chọn địa điểm khác. Prototype chưa có nút sửa trực tiếp nội dung câu trả lời.
- Khi bị đòi ngoài phạm vi (③): Từ chối ngắn gọn vì không có nguồn campus/chương trình, không suy đoán, hướng dẫn người dùng tìm bộ phận phụ trách khi phù hợp.
- Case đặc thù domain (④): Với quyền sử dụng, điểm danh, trợ cấp, học phí hoặc lịch học, câu trả lời phải dựa trên source và trang/URL; dữ liệu bản đồ demo luôn có disclaimer, không được trình bày như thông tin vận hành đã xác minh.

## §7. Kiểm thử

- Chiều chất lượng + định nghĩa kiểm chứng được:
  - **Factuality/grounding:** case grounded chỉ đạt khi câu trả lời chứa đáp án kỳ vọng và source/page nằm trong golden set; case unsupported phải không bịa và không gắn source.
  - **Coverage:** hệ thống xử lý đủ cả 22 câu grounded và 6 câu unsupported, gồm happy path, thiếu nguồn, số liệu, quy định và địa điểm.
  - **Robustness:** câu tiếng Việt có dấu/không dấu và lỗi upstream vẫn đi vào một trạng thái có thể giải thích (`live`, `extractive`, `offline-demo`, `retrieval-fallback` hoặc lỗi có mã).
- Golden set (≥20 case theo cơ cấu trong guide §2.6, file trong eval/): `codebase/eval/handbook-golden.json` có **28 case**, gồm **22 grounded + 6 unsupported**; 22 grounded bao phủ lịch học, LMS, WiFi, thư viện, thẻ, chuyên cần, bảo lưu, điểm, trợ cấp, thiết bị, thực tập và địa điểm; 6 unsupported kiểm tra từ chối an toàn. Bộ này có ≥2 case lớp ① và ≥2 case lớp ②/③/④ khi đối chiếu với bảng §5. Lưu ý: bộ hiện tại chủ yếu phát triển từ sổ tay, chưa chứng minh đủ 10 case lấy trực tiếp từ chatlog mining Facebook; đây là khoảng trống evidence cần ghi nhận, không được gọi nhầm là đã đạt.
- Quality bar (chốt từ hạn chốt spec của khoá, giữ nguyên sau đó): **“Đạt khi ≥96% qua 28 case, trong đó 100% case unsupported không bịa nguồn; mọi case còn lại phải có phân tích nguyên nhân.”**
- Kết quả các lượt chạy (bảng % — cập nhật đến trước CP6):

  | Lượt đo              | Bộ/đường chạy                                                 |                                                                                        Kết quả | Đối chiếu quality bar                                                                                |
  | -------------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------: | ---------------------------------------------------------------------------------------------------- |
  | Local RAG/extractive | 28 case, API handler không có khóa AI                         |                                                                 **28/28 = 100%**, metadata đạt | Đạt; đây là đo retrieval/fallback, không phải điểm AI sinh thật                                      |
  | AI thật CP3          | 28 case, 22 grounded + 6 unsupported                          | **27/28 = 96,4%**; grounded 21/22 = 95,5%; unsupported 6/6 = 100%; latency trung bình 2.156 ms | Đạt bar; H19 từng trích trang 9 thay vì trang 19, sau đó được xác nhận trang 9 hoặc 19 đều có căn cứ |
  | Regression/build     | `npm test`, `npm run build`, smoke render, E2E dev/production |                                          **45 Vitest + 6 ingest; E2E 5/5 ở dev và production** | Không thay thế golden set, dùng để kiểm tra flow và hồi quy                                          |

## §8. Phân công & kế hoạch

- Phân công có tên:
  - **Nguyễn Thị Hồng Nhung:** evidence, mining/khảo sát, workflow tìm đường và bảng impact.
  - **Nguyễn Bảo Sơn:** spec, retrieval/prompt, tiêu chí “đủ căn cứ”, golden set và đánh giá kết quả.
  - **Vũ Văn Điền:** backend/API, AI call server-side, fallback và kiểm thử tích hợp.
  - **Nguyễn Bảo Sơn + Vũ Văn Điền:** frontend/prototype, Campus Map, navigation, demo và dry run.
- Willing users (≥2 tên) + kế hoạch vòng validation _(bonus, nếu làm)_: **Nguyễn Hoàng Tuyên, Trần Xuân Tùng, Trần Quốc Vượng**. Giao mỗi người 3 task: hỏi một câu grounded, hỏi một câu unsupported và đi từ câu trả lời có location sang bản đồ; ghi lại thời gian tìm đáp án, quote, lỗi hiểu nhầm và đề xuất thay đổi trước CP5. Hiện danh sách đã được khai báo; log validation ngoài nhóm cần bổ sung nếu nhóm thực hiện bonus.
- Multi-prototype (nếu làm): **Chưa thực hiện**; nhóm chọn tập trung một flow có thể demo end-to-end thay vì dựng hai phương án thiếu bằng chứng. Phương án đang giữ là conditional retrieval + citation + link bản đồ.

## §9. Changelog

| Thời điểm        | Đổi gì                                                                           | Vì sao (trỏ về feedback/case nào)                                                      |
| ---------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| 18/09/2026 · CP3 | Chốt lát cắt trợ lý tra cứu có nguồn, bổ sung golden set 28 case và fallback     | Kết quả đo CP3: 27/28 AI thật; cần phân biệt nguồn verified, demo và unsupported       |
| 18/09/2026 · CP4 | Ghi rõ automation conditional, 4 lớp lỗi, 4 đường trải nghiệm và giới hạn bản đồ | Code đã có retrieval fallback, retry, source card, campus route demo và E2E kiểm chứng |
```
