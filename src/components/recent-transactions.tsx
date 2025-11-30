'use client';

import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Member, Payment } from '@/lib/definitions';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import PageHeader from './page-header';

type RecentTransaction = Payment & { memberName: string; memberImage: string; memberImageHint: string; };

export default function RecentTransactions({ payments, members }: { payments: Payment[]; members: Member[] }) {
  const memberMap = new Map(members.map((m) => [m.id, m]));
  const memberImages = PlaceHolderImages.filter(p => p.id.startsWith('member-'));

  const transactions: RecentTransaction[] = payments.slice(0, 5).map(payment => {
    const member = memberMap.get(payment.memberId);
    const avatar = memberImages.find(img => img.id === payment.memberId) ?? PlaceHolderImages.find(p => p.id === 'new-member-avatar');
    return {
        ...payment,
        memberName: member?.name || 'Unknown Member',
        memberImage: avatar?.imageUrl || 'https://placehold.co/40x40',
        memberImageHint: avatar?.imageHint || 'placeholder'
    }
  });


  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <PageHeader 
            title="Recent Transactions"
            description="A list of the most recent payments."
            className="mb-4"
        />
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Image
                      alt="Member avatar"
                      className="aspect-square rounded-full object-cover"
                      height="40"
                      src={transaction.memberImage}
                      width="40"
                      data-ai-hint={transaction.memberImageHint}
                    />
                    <div>
                      <div className="font-medium">{transaction.memberName}</div>
                      <div className="text-sm text-muted-foreground">{transaction.memberId}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                <TableCell>{transaction.paymentMethod}</TableCell>
                <TableCell>
                  {new Date(transaction.timestamp).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      transaction.status === 'Completed'
                        ? 'default'
                        : transaction.status === 'Failed'
                        ? 'destructive'
                        : 'secondary'
                    }
                    className={cn(
                        transaction.status === 'Completed' && 'bg-primary text-primary-foreground',
                        transaction.status === 'Pending' && 'bg-gray-200 text-gray-800',
                    )}
                  >
                    {transaction.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
