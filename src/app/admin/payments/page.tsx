import { getPayments, getMembers } from '@/lib/data';
import PaymentsTable from '@/components/admin/payments-table';
import PageHeader from '@/components/page-header';

export const dynamic = 'force-dynamic';

export default async function AdminPaymentsPage() {
  const [payments, members] = await Promise.all([getPayments(), getMembers()]);
  
  return (
    <>
      <PageHeader title="Payments" description="Create, view, and manage all payment records." />
      <PaymentsTable payments={payments} members={members} />
    </>
  );
}
