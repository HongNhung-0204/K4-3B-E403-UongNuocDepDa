import { Bell, CircleHelp, GraduationCap, UserRound } from 'lucide-react';

export default function ProfilePage() {
  return <main className="page simple-page"><div className="page-heading"><span className="eyebrow">TÀI KHOẢN DEMO</span><h1>Cá nhân</h1></div><section className="profile-card"><div className="profile-card__avatar"><UserRound size={34} aria-hidden="true" /></div><div><h2>Sinh viên VinUni</h2><p>Hồ sơ minh họa · không cần đăng nhập</p></div></section><div className="profile-list"><div><GraduationCap size={20} aria-hidden="true" /><span>Ngành học</span><strong>Chưa thiết lập</strong></div><div><Bell size={20} aria-hidden="true" /><span>Thông báo</span><strong>Trong ứng dụng</strong></div><div><CircleHelp size={20} aria-hidden="true" /><span>Thông tin</span><strong>Phiên bản demo</strong></div></div></main>;
}
