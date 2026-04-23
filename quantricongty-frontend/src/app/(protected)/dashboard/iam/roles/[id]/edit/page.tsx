import { RoleFormPage } from '@/features/roles/role-form-page';

export default async function EditRolePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RoleFormPage mode="edit" id={id} />;
}
