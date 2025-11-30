import { getMemberById, getPaymentsByMemberId } from '@/lib/data';
import ProfileCard from '@/components/member/profile-card';
import PaymentHistoryTable from '@/components/member/payment-history-table';
import PageHeader from '@/components/page-header';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function MemberProfilePage({ params }: { params: { id: string } }) {
  const memberId = params.id;
  const member = await getMemberById(memberId);

  if (!member) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
            <h1 className="text-2xl font-bold">Member Not Found</h1>
            <p className="text-muted-foreground">Could not find data for member ID: {memberId}</p>
            <Button asChild variant="link" className="mt-4">
                <Link href="/admin/members">Return to Members List</Link>
            </Button>
        </div>
      </div>
    );
  }

  const personalPayments = await getPaymentsByMemberId(memberId);
  const totalPayment = personalPayments.reduce((acc, payment) => acc + payment.amount, 0);

  return (
    <>
      <PageHeader title={member.name} description={`An overview of ${member.name}'s profile and payment activity.`}>
        <Button asChild variant="outline">
          <Link href="/admin/members">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Members
          </Link>
        </Button>
      </PageHeader>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-8">
          <ProfileCard member={member} />
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Billed</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">৳{totalPayment.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Total amount billed to this member.
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
            <PaymentHistoryTable payments={personalPayments} />
        </div>
      </div>
    </>
  );
}
