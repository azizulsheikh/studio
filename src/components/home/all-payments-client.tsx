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

  const processData = React.useCallback((allPayments: Payment[], allMembers: Member[]): EnrichedPayment[] => {
    const memberTotalPayments = allMembers.reduce((acc, member) => {
      const total = allPayments
        .filter(p => p.memberId === member.id && p.status === 'Completed')
        .reduce((sum, p) => sum + p.amount, 0);
      acc[member.id] = total;
      return acc;
    }, {} as Record<string, number>);
  
    const memberPayments = new Map<string, Payment[]>();
    for (const payment of allPayments) {
      if (!memberPayments.has(payment.memberId)) {
        memberPayments.set(payment.memberId, []);
      }
      memberPayments.get(payment.memberId)!.push(payment);
    }
  
    const enrichedPayments = allMembers.map(member => {
      const paymentsForMember = (memberPayments.get(member.id) || [])
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      const latestPayment = paymentsForMember[0];
      const totalPayment = memberTotalPayments[member.id] || 0;
  
      if (latestPayment) {
        return {
          ...latestPayment,
          totalPayment: totalPayment,
        };
      } else {
        // Create a dummy payment record for members with no payments
        return {
          id: `dummy-${member.id}`,
          memberId: member.id,
          amount: 0,
          timestamp: new Date().toISOString(),
          paymentMethod: 'Cash', // Or some default/N/A value
          status: 'Pending',   // Or some default/N/A value
          totalPayment: 0,
        } as EnrichedPayment;
      }
    });
  
    return enrichedPayments.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, []);


  React.useEffect(() => {
    const processed = processData(initialPayments, initialMembers);
    setPayments(processed);
    setLoading(false);
  }, [initialPayments, initialMembers, processData]);

  const handleMemberClick = (memberId: string) => {
    router.push(`/members/${memberId}`);
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
                <TableCell className="font-medium whitespace-nowrap">{member.name}</TableCell>
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
