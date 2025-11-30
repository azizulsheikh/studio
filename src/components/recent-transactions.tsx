'use client';

import * as React from 'react';
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
import { getPaymentsByMemberId } from '@/lib/actions';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ProfileCard from './member/profile-card';
import PaymentHistoryTable from './member/payment-history-table';

type RecentTransaction = Payment & {
  memberName: string;
  memberImage: string;
  memberImageHint: string;
  formattedDate: string;
};

export default function RecentTransactions({ transactions, members }: { transactions: (Payment & {formattedDate: string})[]; members: Member[] }) {
  const [selectedMember, setSelectedMember] = React.useState<Member | null>(null);
  const [memberPayments, setMemberPayments] = React.useState<Payment[]>([]);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  
  const memberMap = new Map(members.map((m) => [m.id, m]));
  const memberImages = PlaceHolderImages.filter(p => p.id.startsWith('member-'));

  const processedTransactions: RecentTransaction[] = transactions.map(payment => {
    const member = memberMap.get(payment.memberId);
    const placeholderAvatar = memberImages.find(img => img.id === payment.memberId) ?? PlaceHolderImages.find(p => p.id === 'new-member-avatar');
    
    const imageUrl = member?.imageUrl || placeholderAvatar?.imageUrl || 'https://placehold.co/40x40';
    const imageHint = placeholderAvatar?.imageHint || 'member avatar';
    
    return {
        ...payment,
        memberName: member?.name || 'Unknown Member',
        memberImage: imageUrl,
        memberImageHint: imageHint,
        formattedDate: payment.formattedDate,
    }
  });

  const handleMemberClick = async (memberId: string) => {
    const member = memberMap.get(memberId);
    if (member) {
      setSelectedMember(member);
      const payments = await getPaymentsByMemberId(memberId);
      setMemberPayments(payments);
      setIsDialogOpen(true);
    }
  };


  return (
    <>
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <PageHeader 
            title="Recent Transactions"
            description="A list of the most recent payments. Click a member to see their profile."
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
            {processedTransactions.map((transaction) => (
              <TableRow key={transaction.id} onClick={() => handleMemberClick(transaction.memberId)} className="cursor-pointer">
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
                <TableCell>৳{transaction.amount.toFixed(2)}</TableCell>
                <TableCell>{transaction.paymentMethod}</TableCell>
                <TableCell>
                  {transaction.formattedDate}
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

    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-4xl">
            {selectedMember && (
                <>
                    <DialogHeader>
                        <DialogTitle>{selectedMember.name}'s Profile</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-8 lg:grid-cols-3 py-4">
                        <div className="lg:col-span-1">
                            <ProfileCard member={selectedMember} />
                        </div>
                        <div className="lg:col-span-2">
                            <PaymentHistoryTable payments={memberPayments} />
                        </div>
                    </div>
                </>
            )}
        </DialogContent>
    </Dialog>
    </>
  );
}
