'use client';

import * as React from 'react';
import { getPayments, getMembers } from '@/lib/data-client';
import PaymentsTable from '@/components/admin/payments-table';
import { Member, Payment } from '@/lib/definitions';
import { Skeleton } from '@/components/ui/skeleton';

type EnrichedPayment = Payment & {
  totalPayment: number;
};

type PaymentsClientPageProps = {
    initialPayments: Payment[];
    initialMembers: Member[];
};

export default function PaymentsClientPage({ initialPayments, initialMembers }: PaymentsClientPageProps) {
  const [payments, setPayments] = React.useState<EnrichedPayment[]>([]);
  const [members, setMembers] = React.useState<Member[]>([]);
  const [loading, setLoading] = React.useState(true);

  const processData = React.useCallback((allPayments: Payment[], allMembers: Member[]): EnrichedPayment[] => {
    const memberTotalPayments = allMembers.reduce((acc, member) => {
      const total = allPayments
        .filter(p => p.memberId === member.id && p.status === 'Completed')
        .reduce((sum, p) => sum + p.amount, 0);
      acc[member.id] = total;
      return acc;
    }, {} as Record<string, number>);

    const latestPayments = new Map<string, Payment>();
    for (const payment of allPayments) {
      const existing = latestPayments.get(payment.memberId);
      if (!existing || new Date(payment.timestamp) > new Date(existing.timestamp)) {
        latestPayments.set(payment.memberId, payment);
      }
    }
    
    const enrichedLatestPayments = Array.from(latestPayments.values()).map(payment => ({
      ...payment,
      totalPayment: memberTotalPayments[payment.memberId] || 0,
    }));

    return enrichedLatestPayments.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, []);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    const [rawPayments, allMembers] = await Promise.all([getPayments(), getMembers()]);
    const processed = processData(rawPayments, allMembers);
    setPayments(processed);
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
