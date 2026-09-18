import { describe, expect, it } from 'vitest';
import { nextProgress, previousProgress } from '../src/lib/navigationSteps';

describe('navigation step bounds', () => {
  it('does not go below the first step', () => {
    expect(previousProgress(0, 4)).toEqual({ index: 0, complete: false });
  });
  it('completes after the last instruction without moving outside the array', () => {
    expect(nextProgress(3, 4)).toEqual({ index: 3, complete: true });
    expect(nextProgress(9, 4)).toEqual({ index: 3, complete: true });
  });
  it('advances a normal step', () => {
    expect(nextProgress(1, 4)).toEqual({ index: 2, complete: false });
  });
});
