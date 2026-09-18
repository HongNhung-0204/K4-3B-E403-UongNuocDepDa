import { BadgeCheck, CircleHelp } from 'lucide-react';
import type { Confidence } from '../types/chat';

export default function ConfidenceBadge({ confidence }: { confidence: Confidence }) {
  const Icon = confidence.level === 'low' ? CircleHelp : BadgeCheck;
  return (
    <span className={`confidence-badge confidence-badge--${confidence.level}`}>
      <Icon size={15} aria-hidden="true" /> {confidence.label}
    </span>
  );
}
