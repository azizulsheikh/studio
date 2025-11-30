import { getPayments, getMembers } from '@/lib/data';
import PaymentsTable from '@/components/admin/payments-table';
import PageHeader from '@/components/page-header';

export const dynamic = 'force-dynamic';

export default async function AdminPaymentsPage() {
  const [rawPayments, members] = await Promise.all([getPayments(), getMembers()]);

  const payments = rawPayments.map(payment => ({
    ...payment,
    formattedDate: new Date(payment.timestamp).toLocaleDateString(),
  }));
  
  const memberTotalPayments = members.reduce((acc, member) => {
    const total = rawPayments
      .filter(p => p.memberId === member.id && p.status === 'Completed')
      .reduce((sum, p) => sum + p.amount, 0);
    acc[member.id] = total;
    return acc;
  }, {} as Record<string, number>);

  return (
    <>
      <PageHeader title="Payments" description="Create, view, and manage all payment records." />
      <PaymentsTable payments={payments} members={members} memberTotalPayments={memberTotalPayments} />
    </>
  );
}
