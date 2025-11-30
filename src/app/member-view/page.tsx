import { getMemberById, getPaymentsByMemberId, getPayments } from '@/lib/data';
import ProfileCard from '@/components/member/profile-card';
import PaymentHistoryTable from '@/components/member/payment-history-table';
import AllPaymentsTable from '@/components/member/all-payments-table';
import PageHeader from '@/components/page-header';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import Logo from '@/components/logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

// We'll hardcode the member ID for this demonstration view
const MEMBER_ID = 'member-1';

export default async function MemberViewPage() {
  const member = await getMemberById(MEMBER_ID);
  
  if (!member) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
            <h1 className="text-2xl font-bold">Member Not Found</h1>
            <p className="text-muted-foreground">Could not find data for member ID: {MEMBER_ID}</p>
            <Button asChild variant="link" className="mt-4">
                <Link href="/">Return Home</Link>
            </Button>
        </div>
      </div>
    );
  }

  const [personalPayments, allPayments] = await Promise.all([
    getPaymentsByMemberId(MEMBER_ID),
    getPayments()
  ]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="flex items-center justify-between mb-8">
            <Logo />
            <Button asChild variant="outline">
                <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Exit Member View
                </Link>
            </Button>
        </header>

      <PageHeader title={`Welcome, ${member.name}!`} description="Here's a summary of your account and payments." />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ProfileCard member={member} />
        </div>
        <div className="lg:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>My Payment History</CardTitle>
                    <CardDescription>A record of all your payments.</CardDescription>
                </CardHeader>
                <CardContent>
                    <PaymentHistoryTable payments={personalPayments} />
                </CardContent>
            </Card>
            <AllPaymentsTable payments={allPayments} />
        </div>
      </div>
    </div>
  );
}
