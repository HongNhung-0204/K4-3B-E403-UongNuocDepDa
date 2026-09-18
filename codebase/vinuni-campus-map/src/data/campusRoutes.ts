export type CampusRoute = {
  id: string;
  from: string;
  to: string;
  distanceMeters: number;
  durationMinutes: number;
  /** Points on the 1600 × 925 calibrated map. */
  path: Array<[number, number]>;
  steps: Array<{ distanceMeters: number; instruction: string }>;
};

/** Demo routes. Replace distances/instructions after an on-site walk-through. */
export const CAMPUS_ROUTES: CampusRoute[] = [
  {
    id: 'plaza-to-library',
    from: 'central-plaza',
    to: 'library-c',
    distanceMeters: 120,
    durationMinutes: 2,
    path: [
      [516, 529],
      [590, 500],
      [646, 444],
      [676, 370],
      [721, 286],
    ],
    steps: [
      { distanceMeters: 35, instruction: 'Đi theo lối chính về phía cụm tòa nhà trung tâm.' },
      { distanceMeters: 40, instruction: 'Tiếp tục hướng về Building C.' },
      { distanceMeters: 25, instruction: 'Rẽ vào lối chính của Building C.' },
      { distanceMeters: 20, instruction: 'Bạn đã đến khu vực Thư viện Trung tâm.' },
    ],
  },
  {
    id: 'plaza-to-lab-b',
    from: 'central-plaza',
    to: 'building-b',
    distanceMeters: 165,
    durationMinutes: 3,
    path: [
      [516, 529],
      [650, 500],
      [780, 455],
      [900, 405],
      [1013, 367],
    ],
    steps: [
      { distanceMeters: 70, instruction: 'Đi qua quảng trường theo hướng đông.' },
      { distanceMeters: 65, instruction: 'Tiếp tục về phía Building B.' },
      { distanceMeters: 30, instruction: 'Bạn đã đến Building B.' },
    ],
  },
];

