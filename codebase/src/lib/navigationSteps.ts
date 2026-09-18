export type NavigationProgress = { index: number; complete: boolean };

export function nextProgress(index: number, total: number): NavigationProgress {
  if (total <= 0) return { index: 0, complete: false };
  if (index >= total - 1) return { index: total - 1, complete: true };
  return { index: Math.max(0, index + 1), complete: false };
}

export function previousProgress(index: number, total: number): NavigationProgress {
  if (total <= 0) return { index: 0, complete: false };
  return { index: Math.min(total - 1, Math.max(0, index - 1)), complete: false };
}
