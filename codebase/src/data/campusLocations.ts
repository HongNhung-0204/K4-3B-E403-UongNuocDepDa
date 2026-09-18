export type CampusCategory =
  | 'academic'
  | 'library'
  | 'lab'
  | 'dorm'
  | 'food'
  | 'sports'
  | 'landmark';

export type CampusLocation = {
  id: string;
  label: string;
  name: string;
  subtitle?: string;
  category: CampusCategory;
  /** Coordinates on the 1600 × 925 calibrated map. */
  x: number;
  y: number;
};

/**
 * Coordinates are calibrated for /public/maps/vinuni-campus.webp.
 * Keep that asset and this data together.
 */
export const CAMPUS_LOCATIONS: CampusLocation[] = [
  { id: 'building-a', label: 'A', name: 'Building A', subtitle: 'Nhà ăn sinh viên', category: 'food', x: 910, y: 339 },
  { id: 'building-b', label: 'B', name: 'Building B', subtitle: 'CECS Lab', category: 'lab', x: 1013, y: 367 },
  { id: 'library-c', label: 'C', name: 'Building C', subtitle: 'Thư viện Trung tâm', category: 'library', x: 721, y: 286 },
  { id: 'building-d', label: 'D', name: 'Building D', subtitle: 'Ký túc xá', category: 'dorm', x: 560, y: 291 },
  { id: 'building-e', label: 'E', name: 'Building E', category: 'academic', x: 912, y: 412 },
  { id: 'building-f', label: 'F', name: 'Building F', category: 'academic', x: 908, y: 533 },
  { id: 'building-g', label: 'G', name: 'Building G', category: 'academic', x: 942, y: 285 },
  { id: 'building-h', label: 'H', name: 'Building H', category: 'academic', x: 878, y: 225 },
  { id: 'building-i', label: 'I', name: 'Building I', category: 'academic', x: 780, y: 348 },
  { id: 'building-j', label: 'J', name: 'Building J', category: 'academic', x: 1550, y: 490 },
  { id: 'building-k', label: 'K', name: 'Building K', category: 'academic', x: 1342, y: 394 },
  { id: 'building-l', label: 'L', name: 'Building L', subtitle: 'Khu thể thao', category: 'sports', x: 1167, y: 254 },
  { id: 'central-plaza', label: '●', name: 'Quảng trường trung tâm', category: 'landmark', x: 516, y: 529 },
  { id: 'main-entrance', label: '01', name: 'Cổng chính', category: 'landmark', x: 117, y: 739 },
  { id: 'campus-garden', label: '02', name: 'Vườn campus', category: 'landmark', x: 211, y: 469 },
  { id: 'fountain', label: '04', name: 'Đài phun nước', category: 'landmark', x: 354, y: 649 },
];

