import { ContactFormPage } from '@/features/crm/contact-form-page';

export default async function EditContactPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ContactFormPage mode="edit" id={id} />;
}
