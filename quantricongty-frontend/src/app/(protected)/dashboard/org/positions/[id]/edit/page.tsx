import { PositionFormPage } from '@/features/org/position-form-page';

export default async function EditPositionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PositionFormPage mode="edit" id={id} />;
}
