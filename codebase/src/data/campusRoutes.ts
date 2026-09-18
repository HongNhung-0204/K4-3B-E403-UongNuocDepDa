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

/** Demo routes covering all locations from Central Plaza. */
export const CAMPUS_ROUTES: CampusRoute[] = [
  // 1. Đến Thư viện Trung tâm (Building C)
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

  // 2. Đến CECS Lab (Building B)
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
      { distanceMeters: 30, instruction: 'Bạn đã đến Building B (CECS Lab).' },
    ],
  },

  // 3. Đến Nhà ăn sinh viên (Building A)
  {
    id: 'plaza-to-building-a',
    from: 'central-plaza',
    to: 'building-a',
    distanceMeters: 155,
    durationMinutes: 3,
    path: [
      [516, 529],
      [660, 480],
      [780, 410],
      [910, 339],
    ],
    steps: [
      { distanceMeters: 60, instruction: 'Từ Quảng trường trung tâm đi về hướng đông bắc.' },
      { distanceMeters: 55, instruction: 'Đi qua trục sân chung giữa các tòa nhà học thuật.' },
      { distanceMeters: 40, instruction: 'Bạn đã đến sảnh Building A (Nhà ăn sinh viên).' },
    ],
  },

  // 4. Đến Ký túc xá (Building D)
  {
    id: 'plaza-to-building-d',
    from: 'central-plaza',
    to: 'building-d',
    distanceMeters: 130,
    durationMinutes: 2,
    path: [
      [516, 529],
      [530, 440],
      [545, 360],
      [560, 291],
    ],
    steps: [
      { distanceMeters: 45, instruction: 'Đi thẳng theo lối đi bộ phía bắc của Quảng trường.' },
      { distanceMeters: 50, instruction: 'Tiến về phía khu nhà ở sinh viên.' },
      { distanceMeters: 35, instruction: 'Bạn đã đến lối vào Ký túc xá (Building D).' },
    ],
  },

  // 5. Đến Building E
  {
    id: 'plaza-to-building-e',
    from: 'central-plaza',
    to: 'building-e',
    distanceMeters: 135,
    durationMinutes: 2,
    path: [
      [516, 529],
      [650, 500],
      [780, 450],
      [912, 412],
    ],
    steps: [
      { distanceMeters: 55, instruction: 'Đi từ Quảng trường theo trục đường nhánh phía đông.' },
      { distanceMeters: 50, instruction: 'Đi dọc theo hành lang kết nối giữa các khối nhà.' },
      { distanceMeters: 30, instruction: 'Bạn đã đến sảnh Building E.' },
    ],
  },

  // 6. Đến Building F
  {
    id: 'plaza-to-building-f',
    from: 'central-plaza',
    to: 'building-f',
    distanceMeters: 140,
    durationMinutes: 2,
    path: [
      [516, 529],
      [650, 532],
      [780, 533],
      [908, 533],
    ],
    steps: [
      { distanceMeters: 50, instruction: 'Đi theo lối đi dạo phía đông nam Quảng trường.' },
      { distanceMeters: 60, instruction: 'Tiếp tục đi thẳng qua sân cảnh quan nội khu.' },
      { distanceMeters: 30, instruction: 'Bạn đã đến sảnh chính Building F.' },
    ],
  },

  // 7. Đến Building G
  {
    id: 'plaza-to-building-g',
    from: 'central-plaza',
    to: 'building-g',
    distanceMeters: 160,
    durationMinutes: 3,
    path: [
      [516, 529],
      [670, 450],
      [820, 360],
      [942, 285],
    ],
    steps: [
      { distanceMeters: 65, instruction: 'Đi về hướng cụm nhà học thuật phía đông bắc.' },
      { distanceMeters: 60, instruction: 'Tiếp tục đi qua phía sau khối nhà A.' },
      { distanceMeters: 35, instruction: 'Bạn đã đến sảnh Building G.' },
    ],
  },

  // 8. Đến Building H
  {
    id: 'plaza-to-building-h',
    from: 'central-plaza',
    to: 'building-h',
    distanceMeters: 175,
    durationMinutes: 3,
    path: [
      [516, 529],
      [670, 420],
      [780, 310],
      [878, 225],
    ],
    steps: [
      { distanceMeters: 70, instruction: 'Đi theo trục trung tâm hướng về phía bắc.' },
      { distanceMeters: 65, instruction: 'Đi qua khu vực tiếp giáp giữa Building C và G.' },
      { distanceMeters: 40, instruction: 'Bạn đã đến sảnh Building H.' },
    ],
  },

  // 9. Đến Building I (Phòng Y tế)
  {
    id: 'plaza-to-building-i',
    from: 'central-plaza',
    to: 'building-i',
    distanceMeters: 120,
    durationMinutes: 2,
    path: [
      [516, 529],
      [620, 460],
      [700, 400],
      [780, 348],
    ],
    steps: [
      { distanceMeters: 50, instruction: 'Đi từ Quảng trường theo lối chính hướng đông bắc.' },
      { distanceMeters: 45, instruction: 'Tiến vào trục hành lang kết nối của Building I.' },
      { distanceMeters: 25, instruction: 'Bạn đã đến Building I (Khu vực có Phòng Y tế).' },
    ],
  },

  // 10. Đến Building J
  {
    id: 'plaza-to-building-j',
    from: 'central-plaza',
    to: 'building-j',
    distanceMeters: 300,
    durationMinutes: 5,
    path: [
      [516, 529],
      [800, 520],
      [1100, 500],
      [1350, 495],
      [1550, 490],
    ],
    steps: [
      { distanceMeters: 100, instruction: 'Đi qua toàn bộ trục đông của Quảng trường.' },
      { distanceMeters: 120, instruction: 'Tiếp tục đi thẳng theo đại lộ nội khu hướng đông.' },
      { distanceMeters: 80, instruction: 'Bạn đã đến phân khu Building J.' },
    ],
  },

  // 11. Đến Building K
  {
    id: 'plaza-to-building-k',
    from: 'central-plaza',
    to: 'building-k',
    distanceMeters: 240,
    durationMinutes: 4,
    path: [
      [516, 529],
      [800, 480],
      [1050, 440],
      [1200, 415],
      [1342, 394],
    ],
    steps: [
      { distanceMeters: 90, instruction: 'Đi về hướng đông bắc qua khu vực giảng đường B.' },
      { distanceMeters: 100, instruction: 'Đi dọc lối đi kết nối sang khối nhà K.' },
      { distanceMeters: 50, instruction: 'Bạn đã đến sảnh Building K.' },
    ],
  },

  // 12. Đến Khu liên hợp Thể thao (Building L)
  {
    id: 'plaza-to-building-l',
    from: 'central-plaza',
    to: 'building-l',
    distanceMeters: 220,
    durationMinutes: 4,
    path: [
      [516, 529],
      [750, 420],
      [950, 330],
      [1070, 285],
      [1167, 254],
    ],
    steps: [
      { distanceMeters: 85, instruction: 'Đi qua trục trung tâm hướng về cụm đông bắc.' },
      { distanceMeters: 80, instruction: 'Đi tiếp qua các tòa nhà học thuật hướng ra khu sân tập.' },
      { distanceMeters: 55, instruction: 'Bạn đã đến Khu liên hợp Thể thao (Building L).' },
    ],
  },

  // 13. Đến Cổng chính
  {
    id: 'plaza-to-main-entrance',
    from: 'central-plaza',
    to: 'main-entrance',
    distanceMeters: 180,
    durationMinutes: 3,
    path: [
      [516, 529],
      [380, 600],
      [250, 670],
      [117, 739],
    ],
    steps: [
      { distanceMeters: 60, instruction: 'Đi theo lối đi bộ về hướng tây nam Quảng trường.' },
      { distanceMeters: 70, instruction: 'Tiếp tục theo đại lộ dẫn ra khu vực đón tiếp.' },
      { distanceMeters: 50, instruction: 'Bạn đã đến Cổng chính VinUniversity.' },
    ],
  },

  // 14. Đến Vườn campus
  {
    id: 'plaza-to-campus-garden',
    from: 'central-plaza',
    to: 'campus-garden',
    distanceMeters: 130,
    durationMinutes: 2,
    path: [
      [516, 529],
      [400, 500],
      [300, 480],
      [211, 469],
    ],
    steps: [
      { distanceMeters: 50, instruction: 'Đi từ Quảng trường về lối dạo bộ hướng tây.' },
      { distanceMeters: 55, instruction: 'Đi vào khuôn viên cây xanh và hồ cảnh quan.' },
      { distanceMeters: 25, instruction: 'Bạn đã đến khu vực Vườn campus.' },
    ],
  },

  // 15. Đến Đài phun nước
  {
    id: 'plaza-to-fountain',
    from: 'central-plaza',
    to: 'fountain',
    distanceMeters: 95,
    durationMinutes: 2,
    path: [
      [516, 529],
      [450, 580],
      [400, 620],
      [354, 649],
    ],
    steps: [
      { distanceMeters: 40, instruction: 'Đi xuôi về phía nam của Quảng trường.' },
      { distanceMeters: 35, instruction: 'Tiến lại gần cụm công trình cảnh quan nước.' },
      { distanceMeters: 20, instruction: 'Bạn đã đến khu vực Đài phun nước trung tâm.' },
    ],
  },
];
