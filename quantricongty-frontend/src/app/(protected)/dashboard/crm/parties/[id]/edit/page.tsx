import { PartyFormPage } from '@/features/crm/party-form-page';

export default async function EditPartyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PartyFormPage mode="edit" id={id} />;
}
