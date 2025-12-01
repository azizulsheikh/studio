'use client';

import * as React from 'react';
import { getPayments, getMembers } from '@/lib/data-client';
import PaymentsTable from '@/components/admin/payments-table';
import { Member, Payment } from '@/lib/definitions';
import { Skeleton } from '@/components/ui/skeleton';

export type MemberPaymentSummary = {
  memberId: string;
  memberName: string;
  imageUrl?: string;
  monthlyAmount: number;
  totalPayment: number;
  lastMethod: string;
  lastStatus: 'Completed' | 'Pending' | 'Failed' | 'N/A';
  lastPaymentDate: string;
  latestPayment: Payment | null;
};

type PaymentsClientPageProps = {
    initialPayments: Payment[];
    initialMembers: Member[];
};

export default function PaymentsClientPage({ initialPayments, initialMembers }: PaymentsClientPageProps) {
  const [summaries, setSummaries] = React.useState<MemberPaymentSummary[]>([]);
  const [allPayments, setAllPayments] = React.useState<Payment[]>(initialPayments);
  const [members, setMembers] = React.useState<Member[]>(initialMembers);
  const [loading, setLoading] = React.useState(true);

  const processData = React.useCallback((payments: Payment[], allMembers: Member[]): MemberPaymentSummary[] => {
    return allMembers.map(member => {
      const paymentsForMember = payments
        .filter(p => p.memberId === member.id)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      const totalPayment = paymentsForMember
        .filter(p => p.status === 'Completed')
        .reduce((sum, p) => sum + p.amount, 0);
      
      const latestPayment = paymentsForMember[0] || null;

      return {
        memberId: member.id,
        memberName: member.name,
        imageUrl: member.imageUrl,
        monthlyAmount: latestPayment?.amount || 0,
        totalPayment: totalPayment,
        lastMethod: latestPayment?.paymentMethod || 'N/A',
        lastStatus: latestPayment?.status || 'N/A',
        lastPaymentDate: latestPayment ? new Date(latestPayment.timestamp).toLocaleDateString() : 'N/A',
        latestPayment: latestPayment
      };
    }).sort((a, b) => {
        if (!a.latestPayment) return 1;
        if (!b.latestPayment) return -1;
        return new Date(b.latestPayment.timestamp).getTime() - new Date(a.latestPayment.timestamp).getTime()
    });
  }, []);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    const [rawPayments, allMembers] = await Promise.all([getPayments(), getMembers()]);
    const processedSummaries = processData(rawPayments, allMembers);
    setSummaries(processedSummaries);
    setAllPayments(rawPayments);
    setMembers(allMembers);
    setLoading(false);
  }, [processData]);

  React.useEffect(() => {
    const processed = processData(initialPayments, initialMembers);
    setSummaries(processed);
    setAllPayments(initialPayments);
    setMembers(initialMembers);
    setLoading(false);
  }, [initialPayments, initialMembers, processData]);

  if (loading) {
    return (
        <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
        </div>
    )
  }

  return (
    <PaymentsTable summaries={summaries} members={members} allPayments={allPayments} onDataChange={fetchData} />
  );
}
