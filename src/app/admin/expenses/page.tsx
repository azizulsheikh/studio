import { getExpenses } from '@/lib/data';
import ExpensesTable from '@/components/admin/expenses-table';
import PageHeader from '@/components/page-header';

export const dynamic = 'force-dynamic';

export default async function AdminExpensesPage() {
  const expenses = await getExpenses();

  return (
    <>
      <PageHeader title="Expenses" description="Create, view, and manage all expenses." />
      <ExpensesTable expenses={expenses} />
    </>
  );
}
