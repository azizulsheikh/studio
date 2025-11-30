'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Member, Payment } from '@/lib/definitions';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type EnrichedPayment = Payment & { totalPayment: number };

type PaymentsClientPageProps = {
    initialPayments: Payment[];
    initialMembers: Member[];
};

export default function AllPaymentsClient({ initialPayments, initialMembers }: PaymentsClientPageProps) {
  const [payments, setPayments] = React.useState<EnrichedPayment[]>([]);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();
  
  const memberMap = React.useMemo(() => new Map(initialMembers.map((m) => [m.id, m])), [initialMembers]);
  const memberImages = PlaceHolderImages.filter(p => p.id.startsWith('member-'));
  const newMemberImage = PlaceHolderImages.find(p => p.id === 'new-member-avatar');

  const processData = React.useCallback((allPayments: Payment[]): EnrichedPayment[] => {
    const memberTotalPayments = initialMembers.reduce((acc, member) => {
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

    const membersWithPayments = new Set(enrichedLatestPayments.map(p => p.memberId));
    initialMembers.forEach(member => {
      if (!membersWithPayments.has(member.id)) {
        const dummyPayment: EnrichedPayment = {
          id: `dummy-${member.id}`,
          memberId: member.id,
          amount: 0,
          timestamp: new Date(0).toISOString(),
          paymentMethod: 'N/A' as any,
          status: 'N/A' as any,
          totalPayment: 0,
        };
        enrichedLatestPayments.push(dummyPayment);
      }
    });

    return enrichedLatestPayments.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [initialMembers]);


  React.useEffect(() => {
    const processed = processData(initialPayments);
    setPayments(processed);
    setLoading(false);
  }, [initialPayments, processData]);

  const handleMemberClick = (memberId: string) => {
    router.push(`/admin/members/${memberId}`);
  };

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
    <>
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>Member</TableHead>
              <TableHead>Monthly Amount</TableHead>
              <TableHead>Total Payment</TableHead>
              <TableHead>Last Method</TableHead>
              <TableHead>Last Status</TableHead>
              <TableHead className="hidden md:table-cell">Last Payment Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => {
              const member = memberMap.get(payment.memberId);
              if (!member) return null;

              const avatarFromPlaceholders = memberImages.find(img => img.id === member.id);
              const avatarUrl = member.imageUrl || avatarFromPlaceholders?.imageUrl || newMemberImage?.imageUrl;
              const avatarHint = avatarFromPlaceholders?.imageHint || newMemberImage?.imageHint || 'member avatar';

              return (
              <TableRow key={payment.memberId} onClick={() => handleMemberClick(payment.memberId)} className="cursor-pointer">
                 <TableCell className="hidden sm:table-cell">
                    {avatarUrl && 
                        <Image
                            alt="Member avatar"
                            className="aspect-square rounded-full object-cover"
                            height="40"
                            src={avatarUrl}
                            width="40"
                            data-ai-hint={avatarHint}
                        />
                    }
                </TableCell>
                <TableCell className="font-medium">{member.name || 'Unknown'}</TableCell>
                <TableCell>৳{payment.id.startsWith('dummy-') ? '0.00' : payment.amount.toFixed(2)}</TableCell>
                <TableCell>৳{(payment.totalPayment || 0).toFixed(2)}</TableCell>
                <TableCell>{payment.id.startsWith('dummy-') ? 'N/A' : payment.paymentMethod}</TableCell>
                <TableCell>
                {!payment.id.startsWith('dummy-') ? (
                  <Badge
                      variant={
                        payment.status === 'Completed'
                          ? 'default'
                          : payment.status === 'Failed'
                          ? 'destructive'
                          : 'secondary'
                      }
                      className={cn(
                          payment.status === 'Completed' && 'bg-primary text-primary-foreground',
                          payment.status === 'Pending' && 'bg-gray-200 text-gray-800',
                      )}
                    >
                      {payment.status}
                    </Badge>
                ) : 'N/A'}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {payment.id.startsWith('dummy-') ? 'N/A' : new Date(payment.timestamp).toLocaleDateString()}
                </TableCell>
              </TableRow>
            )})}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
    </>
  );
}
