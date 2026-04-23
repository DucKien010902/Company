import { LoginForm } from '@/features/auth/login-form';

export default function LoginPage() {
  return (
    <div className="auth-card">
      <div className="auth-hero">
        <div>
          <p>Nền tảng quản trị doanh nghiệp</p>
          <h1>Vận hành công ty, HRM và CRM trên một màn hình quản trị an toàn.</h1>
          <p>
            Frontend này được thiết kế để khớp với backend NestJS hiện tại, đồng thời sẵn sàng cho các module tương lai như sản phẩm, đơn hàng, tồn kho và phê duyệt.
          </p>
        </div>
        <div>
          <p>
            Có sẵn quản lý phiên an toàn, điều hướng theo quyền, các trang CRUD cơ bản và cấu trúc dễ mở rộng lâu dài.
          </p>
        </div>
      </div>
      <div className="auth-panel">
        <h2>Đăng nhập</h2>
        <p>Dùng tài khoản chủ hệ thống hoặc nhân viên để truy cập trang quản trị.</p>
        <LoginForm />
      </div>
    </div>
  );
}
