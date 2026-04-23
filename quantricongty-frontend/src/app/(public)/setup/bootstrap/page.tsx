import { BootstrapForm } from '@/features/auth/bootstrap-form';

export default function BootstrapPage() {
  return (
    <div className="card" style={{ width: 'min(1080px, 100%)' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Thiết lập hệ thống lần đầu</h1>
          <p className="page-description">
            Khởi tạo hồ sơ công ty và tạo tài khoản chủ sở hữu đầu tiên. Chỉ nên dùng một lần khi backend còn mới.
          </p>
        </div>
      </div>
      <BootstrapForm />
    </div>
  );
}
