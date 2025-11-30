import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import Logo from '@/components/logo';
import ExpensesHistoryTable from '@/components/public/expenses-history-table';
import PageHeader from '@/components/page-header';
import { getExpenses } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function ExpensesPage() {
    const expenses = await getExpenses();

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <header className="flex items-center justify-between mb-8">
                <Logo />
                <Button asChild variant="outline">
                    <Link href="/">
                        <Home className="mr-2 h-4 w-4" />
                        Back to Home
                    </Link>
                </Button>
            </header>
            <PageHeader title="Expense History" description="A read-only log of all recorded expenses." />
            <ExpensesHistoryTable expenses={expenses} />
        </div>
    );
}
