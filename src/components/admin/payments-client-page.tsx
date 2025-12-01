'use client';

import * as React from 'react';
import { getPayments, getMembers } from '@/lib/data-client';
import PaymentsTable from '@/components/admin/payments-table';
import { Member, Payment } from '@/lib/definitions';
import { Skeleton } from '@/components/ui/skeleton';

type EnrichedPayment = Payment & { memberName: string; totalPaid: number };

type PaymentsClientPageProps = {
    initialPayments: Payment[];
    initialMembers: Member[];
};

export default function PaymentsClientPage({ initialPayments, initialMembers }: PaymentsClientPageProps) {
  const [payments, setPayments] = React.useState<EnrichedPayment[]>([]);
  const [members, setMembers] = React.useState<Member[]>(initialMembers);
  const [loading, setLoading] = React.useState(true);

  const processData = React.useCallback((allPayments: Payment[], allMembers: Member[]): EnrichedPayment[] => {
    const memberMap = new Map(allMembers.map(m => [m.id, m]));
    const memberTotals: Record<string, number> = {};

    for (const member of allMembers) {
      memberTotals[member.id] = allPayments
        .filter(p => p.memberId === member.id && p.status === 'Completed')
        .reduce((sum, p) => sum + p.amount, 0);
    }

    return allPayments.map(p => ({
      ...p,
      memberName: memberMap.get(p.memberId)?.name || 'Unknown',
      totalPaid: memberTotals[p.memberId] || 0,
    }));
  }, []);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    const [rawPayments, allMembers] = await Promise.all([getPayments(), getMembers()]);
    const processedPayments = processData(rawPayments, allMembers);
    setPayments(processedPayments);
    setMembers(allMembers);
    setLoading(false);
  }, [processData]);

  React.useEffect(() => {
    const processed = processData(initialPayments, initialMembers);
    setPayments(processed);
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
    <PaymentsTable payments={payments} members={members} onDataChange={fetchData} />
  );
}
