import { OrgUnitFormPage } from '@/features/org/org-unit-form-page';

export default async function EditOrgUnitPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OrgUnitFormPage mode="edit" id={id} />;
}
