'use client';

import * as React from 'react';
import { getPayments, getMembers } from '@/lib/data-client';
import PaymentsTable from '@/components/admin/payments-table';
import { Member, Payment } from '@/lib/definitions';
import { Skeleton } from '@/components/ui/skeleton';

type PaymentsClientPageProps = {
    initialPayments: Payment[];
    initialMembers: Member[];
};

export default function PaymentsClientPage({ initialPayments, initialMembers }: PaymentsClientPageProps) {
  const [payments, setPayments] = React.useState<Payment[]>(initialPayments);
  const [members, setMembers] = React.useState<Member[]>(initialMembers);
  const [loading, setLoading] = React.useState(true);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    const [rawPayments, allMembers] = await Promise.all([getPayments(), getMembers()]);
    setPayments(rawPayments);
    setMembers(allMembers);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    setPayments(initialPayments);
    setMembers(initialMembers);
    setLoading(false);
  }, [initialPayments, initialMembers]);

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
