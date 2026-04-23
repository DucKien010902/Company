import { ColorOrbitLoader } from '@/components/loading/color-orbit-loader';

export default function Loading() {
  return (
    <div className="centered-page">
      <ColorOrbitLoader className="loading-screen-spinner" label="Đang chuyển trang" />
    </div>
  );
}
