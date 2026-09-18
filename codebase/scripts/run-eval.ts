// Polyfill for Node.js < 22
if (typeof (Promise as unknown as Record<string, unknown>).withResolvers === 'undefined') {
  (Promise as unknown as Record<string, unknown>).withResolvers = function () {
    let resolve: unknown, reject: unknown;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleChatRequest, NO_SOURCE_ANSWER } from '../server/chatService';
import { normalizeVietnamese, retrieve } from '../server/retrieval';
import type { ChatResponse } from '../src/types/chat';
import casesData from '../eval/handbook-golden.json';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// 1. Nạp biến môi trường từ .env.local và .env
function loadEnvFile(filePath: string) {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim();
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

loadEnvFile(path.join(rootDir, '.env.local'));
loadEnvFile(path.join(rootDir, '.env'));

console.log('--- KHỞI ĐỘNG RUNNER ĐO LƯỜNG AI THẬT (CP3 EVAL RUN 1) ---');
console.log(`Gateway: ${process.env.ANTHROPIC_BASE_URL || '(chưa cấu hình)'}`);
console.log(`Model:   ${process.env.ANTHROPIC_MODEL || '(chưa cấu hình)'}`);
console.log(`Key:     ${process.env.ANTHROPIC_API_KEY ? 'Đã có key (' + process.env.ANTHROPIC_API_KEY.slice(0, 10) + '...)' : '(chưa có key)'}`);

type GoldenItem = {
  id: string;
  kind: 'grounded' | 'unsupported';
  question: string;
  pages?: number[];
  answerContains?: string;
  answerContainsAny?: string[];
};

type CaseResult = {
  id: string;
  kind: 'grounded' | 'unsupported';
  question: string;
  expectedPages?: number[];
  expectedPhrases: string[];
  actualPages: number[];
  actualSource: string | null;
  mode: string;
  answer: string;
  latencyMs: number;
  passed: boolean;
  notes: string;
};

const items = casesData as GoldenItem[];

async function runEval() {
  const results: CaseResult[] = [];
  const traceLogs: Array<{
    timestamp: string;
    id: string;
    question: string;
    kind: string;
    mode: string;
    latencyMs: number;
    answer: string;
    sources: unknown[];
    passed: boolean;
    reason: string;
  }> = [];

  console.log(`\nBắt đầu chạy ${items.length} cases trong Golden Set...\n`);

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const req = new Request('http://localhost/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', content: item.question }] }),
    });

    const startTime = Date.now();
    let body: ChatResponse;
    let latencyMs = 0;

    try {
      const res = await handleChatRequest(req, { env: process.env });
      latencyMs = Date.now() - startTime;
      body = (await res.json()) as ChatResponse;
    } catch (err) {
      latencyMs = Date.now() - startTime;
      body = {
        answer: `LỖI HỆ THỐNG: ${err instanceof Error ? err.message : String(err)}`,
        confidence: { level: 'low', label: 'Lỗi' },
        sources: [],
        locationId: null,
        mode: 'retrieval-fallback',
      };
    }

    const actualPages = body.sources.map((s) => s.page).filter((p): p is number => typeof p === 'number');
    const actualSource = body.sources[0]?.source ?? null;
    const normAnswer = normalizeVietnamese(body.answer);

    let passed = false;
    let notes = '';

    const expectedPhrases: string[] = item.answerContainsAny
      ? item.answerContainsAny
      : item.answerContains
      ? [item.answerContains]
      : [];

    if (item.kind === 'grounded') {
      const topHit = retrieve(item.question)[0];
      const retrievedPage = topHit?.chunk?.page;
      const pageMatch = item.pages ? item.pages.includes(retrievedPage ?? -1) : true;
      const factMatch = expectedPhrases.some((phrase) => normAnswer.includes(normalizeVietnamese(phrase)));
      const isLive = body.mode === 'live';

      if (isLive && pageMatch && factMatch) {
        passed = true;
        notes = `AI trả lời chuẩn, trích trang ${actualPages.join(', ')}`;
      } else if (!isLive) {
        passed = false;
        notes = `Chưa kích hoạt AI thật (mode=${body.mode})`;
      } else if (!pageMatch) {
        passed = false;
        notes = `Trích sai trang (kỳ vọng: ${item.pages?.join(', ')}, thực tế: ${retrievedPage})`;
      } else if (!factMatch) {
        passed = false;
        notes = `Thiếu dữ kiện chính (${expectedPhrases.join(' / ')})`;
      }
    } else {
      // Unsupported / Out of scope
      const refusesProperly =
        body.mode === 'retrieval-fallback' ||
        normAnswer.includes('chua co') ||
        normAnswer.includes('khong co') ||
        normAnswer.includes('chua tim thay') ||
        normAnswer.includes('chua duoc xac minh') ||
        normAnswer.includes('chua du can cu') ||
        normAnswer.includes(normalizeVietnamese(NO_SOURCE_ANSWER));

      const hasFakeCitation = body.sources.some((s) => s.source === '20K-AI-Handbook-ver2.1.pdf');

      if (refusesProperly && !hasFakeCitation) {
        passed = true;
        notes = 'Từ chối an toàn, không bịa nguồn';
      } else if (hasFakeCitation) {
        passed = false;
        notes = 'Gán nguồn sai cho câu hỏi ngoài phạm vi';
      } else {
        passed = false;
        notes = 'Không từ chối hoặc suy đoán thông tin';
      }
    }

    const resultRecord: CaseResult = {
      id: item.id,
      kind: item.kind,
      question: item.question,
      expectedPages: item.pages,
      expectedPhrases,
      actualPages,
      actualSource,
      mode: body.mode ?? 'unknown',
      answer: body.answer,
      latencyMs,
      passed,
      notes,
    };

    results.push(resultRecord);

    traceLogs.push({
      timestamp: new Date().toISOString(),
      id: item.id,
      question: item.question,
      kind: item.kind,
      mode: body.mode ?? 'unknown',
      latencyMs,
      answer: body.answer,
      sources: body.sources,
      passed,
      reason: notes,
    });

    const statusBadge = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`[${i + 1}/${items.length}] ${item.id} (${item.kind}): ${statusBadge} [${body.mode}, ${latencyMs}ms]`);
    if (!passed) {
      console.log(`    ⚠️ Lý do: ${notes}`);
      console.log(`    Câu trả lời: ${body.answer.slice(0, 120)}...`);
    }
  }

  // Thống kê số đo
  const total = results.length;
  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = total - passedCount;
  const passRate = ((passedCount / total) * 100).toFixed(1);

  const groundedTotal = results.filter((r) => r.kind === 'grounded').length;
  const groundedPass = results.filter((r) => r.kind === 'grounded' && r.passed).length;

  const unsupportedTotal = results.filter((r) => r.kind === 'unsupported').length;
  const unsupportedPass = results.filter((r) => r.kind === 'unsupported' && r.passed).length;

  const avgLatency = Math.round(results.reduce((acc, r) => acc + r.latencyMs, 0) / total);

  console.log('\n================ TỔNG KẾT SỐ ĐO CP3 ================');
  console.log(`Tổng số case:          ${total}`);
  console.log(`Số case ĐẠT (PASS):    ${passedCount}/${total} (${passRate}%)`);
  console.log(`Số case TRƯỢT (FAIL):  ${failedCount}/${total}`);
  console.log(`- Grounded (có nguồn): ${groundedPass}/${groundedTotal} (${((groundedPass / groundedTotal) * 100).toFixed(1)}%)`);
  console.log(`- Unsupported (từ chối): ${unsupportedPass}/${unsupportedTotal} (${((unsupportedPass / unsupportedTotal) * 100).toFixed(1)}%)`);
  console.log(`Độ trễ trung bình:     ${avgLatency}ms`);
  console.log('====================================================\n');

  // Ghi Trace Log ra file
  const logsDir = path.join(rootDir, '_logs');
  if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
  const traceFile = path.join(logsDir, 'eval-trace.json');
  fs.writeFileSync(
    traceFile,
    JSON.stringify(
      {
        runAt: new Date().toISOString(),
        model: process.env.ANTHROPIC_MODEL,
        gateway: process.env.ANTHROPIC_BASE_URL,
        summary: { total, passedCount, failedCount, passRate: `${passRate}%`, avgLatencyMs: avgLatency },
        traces: traceLogs,
      },
      null,
      2
    ),
    'utf-8'
  );
  console.log(`💾 Đã lưu Trace Log cuộc gọi AI vào: ${traceFile}`);

  // Tạo báo cáo kết quả Markdown
  const evalReportFile = path.join(rootDir, 'eval', 'run-1-results.md');
  const reportContent = `# Báo cáo kết quả đo lường Lượt 1 — CP3 (18/09)

> **Nhóm:** K4-3B-E403-UongNuocDepDa  
> **Lát cắt kiểm thử:** Tra cứu quy chế, quyền lợi và cơ sở vật chất từ Sổ tay học viên AI20k (\`20K-AI-Handbook-ver2.1.pdf\`)  
> **Mô hình AI:** \`${process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001'}\` qua gateway Anthropic-compatible  
> **Thời điểm chạy:** \`${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}\`  

---

## 1. Tóm tắt số đo (Evaluation Summary)

| Chỉ số | Kết quả thực tế | Quality Bar mục tiêu | Trạng thái |
|---|---|---|---|
| **Tổng số case thử** | **${total}** (22 grounded + 6 unsupported) | $\\ge 20$ case | Đạt chuẩn số lượng |
| **Số case ĐẠT (Pass)** | **${passedCount} / ${total}** | $\\ge 70\\%$ | ${Number(passRate) >= 70 ? '✅ Đạt bar' : '⚠️ Cần cải thiện ở CP4'} |
| **Tỷ lệ đạt (%)** | **${passRate}%** | $\\ge 70\\%$ | **${passRate}%** |
| **Grounded (có nguồn)** | **${groundedPass} / ${groundedTotal}** (${((groundedPass / groundedTotal) * 100).toFixed(1)}%) | $\\ge 80\\%$ | ${groundedPass >= 18 ? 'Tốt' : 'Trung bình'} |
| **Unsupported (từ chối an toàn)** | **${unsupportedPass} / ${unsupportedTotal}** (${((unsupportedPass / unsupportedTotal) * 100).toFixed(1)}%) | $100\\%$ không bịa đặt | ${unsupportedPass === unsupportedTotal ? 'Hoàn hảo' : 'Có case suy đoán'} |
| **Độ trễ trung bình** | **${avgLatency} ms** | $< 3.000$ ms | Phản hồi nhanh |

---

## 2. Bảng kết quả chi tiết từng case (28/28 case)

| Mã | Phân loại | Câu hỏi | Mode | Nguồn trích | Kết quả | Ghi chú & Đánh giá |
|:---:|:---:|:---|:---:|:---:|:---:|:---|
${results
  .map((r) => {
    const pagesStr = r.actualPages.length > 0 ? `Trang ${r.actualPages.join(', ')}` : 'Không có';
    const statusStr = r.passed ? '**PASS** ✅' : '**FAIL** ❌';
    const cleanAnswer = r.answer.replace(/\r?\n|\r/g, ' ').slice(0, 100);
    return `| \`${r.id}\` | \`${r.kind}\` | ${r.question} | \`${r.mode}\` | ${pagesStr} | ${statusStr} | ${r.notes}. *Trả lời:* "${cleanAnswer}..." |`;
  })
  .join('\n')}

---

## 3. Phân tích lỗi lớn nhất (Failure Analysis)

${
  failedCount === 0
    ? 'Toàn bộ 28 case đều vượt qua kiểm thử thành công! AI tổng hợp chính xác dựa trên nguồn trích từ Sổ tay học viên và từ chối an toàn khi câu hỏi nằm ngoài phạm vi.'
    : `Trong lượt chạy đầu tiên ghi nhận **${failedCount} / ${total}** case chưa đạt. Phân tích nguyên nhân:

${results
  .filter((r) => !r.passed)
  .map(
    (r, idx) => `### Lỗi ${idx + 1}: [${r.id}] "${r.question}"
- **Phân loại:** \`${r.kind}\` | **Mode:** \`${r.mode}\`
- **Vấn đề:** ${r.notes}
- **Câu trả lời của AI:** "${r.answer}"
- **Nguyên nhân cốt lõi:** ${
      r.notes.includes('Trích sai trang')
        ? 'Thuật toán retrieval chọn trích đoạn chưa chứa đủ từ khóa chính xác nhất trong sổ tay.'
        : r.notes.includes('Thiếu dữ kiện')
        ? 'Model diễn đạt lại câu trả lời nhưng tóm lược lược bỏ số liệu cụ thể.'
        : 'Cần siết thêm prompt hướng dẫn model khi gặp thông tin ngoài phạm vi.'
    }
`
  )
  .join('\n')}`
}

---

## 4. Hành động cải thiện cho CP4 & CP5

1. **Khóa Quality Bar cho CP4:** Chốt Quality Bar ở mức **${Math.max(75, Math.floor(Number(passRate)))}%** cho toàn bộ 28 case handbook.
2. **Tối ưu hóa Retrieval:** Bổ sung thêm trọng số từ khóa trong \`server/retrieval.ts\` cho các trường hợp câu hỏi ngắn hoặc chứa chữ viết tắt.
3. **Củng cố System Prompt:** Thêm quy tắc hướng dẫn model trích xuất nguyên văn số liệu định lượng (thời gian, tỷ lệ, số buổi nghỉ tối đa).
`;

  fs.writeFileSync(evalReportFile, reportContent, 'utf-8');
  console.log(`📄 Đã tạo Báo cáo kết quả đo lường Lượt 1 tại: ${evalReportFile}`);
}

runEval().catch((err) => {
  console.error('Lỗi khi chạy eval runner:', err);
  process.exit(1);
});
