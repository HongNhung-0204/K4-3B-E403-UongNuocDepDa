import { BookOpenText } from 'lucide-react';
import type { Source } from '../types/chat';

export default function SourceCard({ source }: { source: Source }) {
  return (
    <div className="source-card">
      <div className="source-card__icon"><BookOpenText size={18} aria-hidden="true" /></div>
      <div>
        <strong>{source.title}</strong>
        <p>{source.url ? <a href={source.url} target="_blank" rel="noopener noreferrer">{source.source}</a> : source.source}{source.section ? ` · ${source.section}` : ''}{source.page ? ` · trang ${source.page}` : ''}</p>
        <span className={source.verified ? 'source-card__verified' : 'source-card__demo'}>
          {source.verified ? 'Đã xác minh' : 'Chưa xác minh'}
        </span>
      </div>
    </div>
  );
}
