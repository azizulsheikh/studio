import { getDashboardData } from '@/lib/data';
import DashboardCards from '@/components/admin/dashboard-cards';
import PageHeader from '@/components/page-header';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const { totalPayments, totalMembers, totalTransactions } = await getDashboardData();

  return (
    <>
      <PageHeader title="Admin Dashboard" description="An overview of your payment ecosystem." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCards
          totalPayments={totalPayments}
          totalMembers={totalMembers}
          totalTransactions={totalTransactions}
        />
      </div>
    </>
  );
}
