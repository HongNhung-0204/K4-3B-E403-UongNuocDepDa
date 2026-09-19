import { useEffect, useRef, useState } from 'react';
import { Bot, RotateCcw, SendHorizontal, Sparkles } from 'lucide-react';
import ConfidenceBadge from '../components/ConfidenceBadge';
import SourceCard from '../components/SourceCard';
import LocationCard from '../components/LocationCard';
import type { ChatResponse } from '../types/chat';

type UserMessage = { id: string; role: 'user'; content: string };
type AssistantMessage = { id: string; role: 'assistant'; content: string; response: ChatResponse };
type Message = UserMessage | AssistantMessage;
const suggestions = ['Thư viện mở đến mấy giờ và ở đâu?', 'CECS Lab ở tòa nào?', 'Tìm đường đến thư viện'];

function isChatResponse(value: unknown): value is ChatResponse {
  if (!value || typeof value !== 'object') return false;
  const response = value as Partial<ChatResponse>;
  return typeof response.answer === 'string' &&
    Boolean(response.confidence && ['high', 'medium', 'low'].includes(response.confidence.level) && typeof response.confidence.label === 'string') &&
    Array.isArray(response.sources) &&
    (response.locationId === null || typeof response.locationId === 'string') &&
    ['live', 'retrieval-fallback', 'offline-demo', 'extractive'].includes(response.mode ?? '');
}

function locationText(locationId: string): { title: string; subtitle: string } {
  const locations: Record<string, { title: string; subtitle: string }> = {
    'library-c': { title: 'Thư viện Trung tâm', subtitle: 'Building C · bản đồ demo' },
    'building-b': { title: 'CECS Lab', subtitle: 'Building B · bản đồ demo' },
    'building-d': { title: 'Ký túc xá', subtitle: 'Building D · bản đồ demo' },
    'building-a': { title: 'Nhà ăn sinh viên', subtitle: 'Building A · bản đồ demo' },
    'central-plaza': { title: 'Quảng trường trung tâm', subtitle: 'Điểm bắt đầu tuyến demo' },
  };
  return locations[locationId] ?? { title: 'Địa điểm trên campus', subtitle: 'Xem trên bản đồ demo' };
}

export default function ChatPage() {
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const inFlight = useRef(false);
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    bottom.current?.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'end' });
  }, [messages, status]);

  async function requestAnswer(history: Message[]) {
    if (inFlight.current) return;
    inFlight.current = true;
    setStatus('loading');
    setErrorMessage('');
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 90_000);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history.slice(-12).map(({ role, content }) => ({ role, content })) }),
        signal: controller.signal,
      });
      const body: unknown = await response.json();
      if (!response.ok) {
        const text = body && typeof body === 'object' && 'error' in body && typeof body.error === 'string' ? body.error : 'Không thể nhận câu trả lời.';
        throw new Error(text);
      }
      if (!isChatResponse(body)) throw new Error('Phản hồi từ máy chủ không hợp lệ.');
      setMessages((current) => [...current, { id: crypto.randomUUID(), role: 'assistant', content: body.answer, response: body }]);
      setStatus('idle');
    } catch (error) {
      setErrorMessage(error instanceof DOMException && error.name === 'AbortError' ? 'Yêu cầu quá thời gian. Vui lòng thử lại.' : error instanceof Error ? error.message : 'Không thể kết nối. Vui lòng thử lại.');
      setStatus('error');
    } finally {
      window.clearTimeout(timeout);
      inFlight.current = false;
    }
  }

  function send(value: string) {
    const question = value.trim();
    if (!question || inFlight.current) return;
    const next: Message[] = [...messages, { id: crypto.randomUUID(), role: 'user', content: question }];
    setMessages(next);
    setDraft('');
    void requestAnswer(next);
  }

  return (
    <main className="page chat-page">
      <header className="chat-header">
        <div className="chat-header__avatar"><Bot size={24} aria-hidden="true" /></div>
        <div><h1>MyVinUni AI</h1><span><i className="online-dot" /> Đang hoạt động</span></div>
        <span className="chat-header__spark"><Sparkles size={19} aria-hidden="true" /></span>
      </header>
      <div className="chat-content" aria-live="polite">
        <div className="welcome-message"><span className="welcome-message__icon"><Sparkles size={18} aria-hidden="true" /></span><div><strong>Chào bạn! 👋</strong><p>Mình có thể giúp bạn tìm thông tin campus và vị trí các tòa nhà. Bạn muốn hỏi gì?</p></div></div>
        {messages.length === 0 && <section className="suggestions" aria-label="Câu hỏi gợi ý"><h2>Gợi ý câu hỏi</h2>{suggestions.map((item) => <button type="button" key={item} onClick={() => send(item)}>{item}<span aria-hidden="true">↗</span></button>)}</section>}
        {messages.map((message) => message.role === 'user'
          ? <div className="user-message" key={message.id}>{message.content}</div>
          : <article className="answer-card" key={message.id}>
            <ConfidenceBadge confidence={message.response.confidence} />
            <p className="answer-card__text">{message.content}</p>
            {message.response.mode === 'offline-demo' && <span className="answer-card__mode">Demo fallback mode · AI chưa phản hồi</span>}
            {message.response.mode === 'extractive' && <span className="answer-card__mode">Trích từ tài liệu · AI chưa phản hồi</span>}
            {message.response.sources.length > 0 && <div className="answer-card__sources"><span className="overline">NGUỒN THAM KHẢO</span>{message.response.sources.map((source) => <SourceCard key={source.id} source={source} />)}</div>}
            {message.response.locationId && <LocationCard locationId={message.response.locationId} {...locationText(message.response.locationId)} />}
          </article>)}
        {status === 'loading' && <div className="typing-indicator" role="status"><span /><span /><span /><span className="sr-only">Đang trả lời</span></div>}
        {status === 'error' && <div className="chat-error" role="alert">{errorMessage}<button type="button" onClick={() => void requestAnswer(messages)}><RotateCcw size={15} aria-hidden="true" /> Thử lại</button></div>}
        <div ref={bottom} />
      </div>
      <form className="chat-composer" onSubmit={(event) => { event.preventDefault(); send(draft); }}>
        <label className="sr-only" htmlFor="chat-input">Nhập câu hỏi</label>
        <textarea id="chat-input" rows={1} value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); send(draft); } }} placeholder="Hỏi MyViUni AI..." maxLength={2000} />
        <button type="submit" disabled={!draft.trim() || status === 'loading'} aria-label="Gửi câu hỏi"><SendHorizontal size={19} aria-hidden="true" /></button>
      </form>
    </main>
  );
}
