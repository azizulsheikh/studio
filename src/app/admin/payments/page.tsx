'use server';

import { getPayments, getMembers } from '@/lib/data';
import PaymentsClientPage from '@/components/admin/payments-client-page';
import PageHeader from '@/components/page-header';

export default async function AdminPaymentsPage() {
  const [rawPayments, allMembers] = await Promise.all([getPayments(), getMembers()]);

  return (
    <>
      <PageHeader title="Payments" description="Create, view, and manage all payment records." />
      <PaymentsClientPage initialPayments={rawPayments} initialMembers={allMembers} />
    </>
  );
}
