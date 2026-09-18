# VinUni Campus Map — React drop-in bundle

Bộ này chuyển ảnh bản đồ campus thật thành bản đồ dùng được trong React:

- ảnh đã được chỉnh phối cảnh, cắt gọn và nén WebP;
- lớp SVG tương tác nằm trên ảnh thật;
- tìm/chọn Building A–L và một số landmark;
- route demo từ Quảng trường trung tâm đến Thư viện/Building B;
- zoom, responsive mobile và hỗ trợ bàn phím;
- không cần Google Maps, Mapbox hay API key.

## Cài vào dự án React + Vite

1. Copy `public/maps/vinuni-campus.webp` vào đúng thư mục `public/maps` của dự án.
2. Copy `src/components` và `src/data` vào `src`.
3. Dùng ví dụ trong `src/pages/CampusPage.example.tsx` hoặc import trực tiếp:

```tsx
import VinUniCampusMap from './components/VinUniCampusMap';

<VinUniCampusMap
  initialDestinationId="library-c"
  currentLocationId="central-plaza"
  onStartNavigation={(routeId) => navigate(`/navigation/${routeId}`)}
/>
```

Từ Chat AI, mở thẳng điểm đến bằng:

```ts
navigate('/campus?destination=library-c');
```

## IDs đã có

- `building-a` … `building-l`
- `library-c`
- `central-plaza`
- `main-entrance`
- `campus-garden`
- `fountain`

## Hiệu chỉnh dữ liệu

Tọa độ trong `campusLocations.ts` và `campusRoutes.ts` dùng hệ 1600 × 925, khớp chính xác với asset WebP trong bộ này. Nếu thay ảnh nền, cần hiệu chỉnh lại tọa độ.

Các tên phụ và tuyến đường hiện dùng dữ liệu demo từ prototype. Trước khi trình bày như thông tin chính thức, hãy kiểm tra tên địa điểm, khoảng cách và hướng dẫn bằng một lượt đi thực tế trong campus.

Để thêm điểm mới, click/xác định tọa độ tương ứng trên ảnh 1600 × 925 rồi thêm một object vào `CAMPUS_LOCATIONS`. Để điểm đó có route, thêm một object tương ứng vào `CAMPUS_ROUTES`.

