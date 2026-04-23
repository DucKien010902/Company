import { BranchFormPage } from '@/features/org/branch-form-page';

export default async function EditBranchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <BranchFormPage mode="edit" id={id} />;
}
