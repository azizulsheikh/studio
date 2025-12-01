'use client';

import * as React from 'react';
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
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { Member, Payment } from '@/lib/definitions';
import { useToast } from '@/hooks/use-toast';
import { PaymentForm } from './payment-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { MemberPaymentSummary } from './payments-client-page';
import PaymentHistoryTable from '../member/payment-history-table';

export default function PaymentsTable({ summaries, members, allPayments, onDataChange }: { summaries: MemberPaymentSummary[]; members: Member[], allPayments: Payment[], onDataChange: () => void }) {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = React.useState(false);
  const [selectedPayment, setSelectedPayment] = React.useState<Payment | null>(null);
  const [selectedMemberPayments, setSelectedMemberPayments] = React.useState<Payment[]>([]);
  const [selectedMemberName, setSelectedMemberName] = React.useState<string>('');


  const handleFinished = () => {
    setDialogOpen(false);
    onDataChange();
  };

  const openEditDialog = (payment: Payment | null) => {
     setSelectedPayment(payment);
     setDialogOpen(true);
  };

  const openHistoryDialog = (memberId: string, memberName: string) => {
    const memberPayments = allPayments.filter(p => p.memberId === memberId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    setSelectedMemberPayments(memberPayments);
    setSelectedMemberName(memberName);
    setHistoryDialogOpen(true);
  };

  const openCreateDialog = () => {
    setSelectedPayment(null);
    setDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>All Payments</CardTitle>
        <Button size="sm" className="gap-1" onClick={openCreateDialog}>
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Payment
            </span>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Monthly Amount</TableHead>
              <TableHead>Total Payment</TableHead>
              <TableHead>Last Method</TableHead>
              <TableHead>Last Status</TableHead>
              <TableHead>Last Payment Date</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {summaries.map((summary) => (
              <TableRow key={summary.memberId}>
                <TableCell className="font-medium">{summary.memberName}</TableCell>
                <TableCell>৳{summary.monthlyAmount.toFixed(2)}</TableCell>
                <TableCell>৳{summary.totalPayment.toFixed(2)}</TableCell>
                <TableCell>{summary.lastMethod}</TableCell>
                <TableCell>
                  <Badge
                      variant={
                        summary.lastStatus === 'Completed'
                          ? 'default'
                          : summary.lastStatus === 'Failed'
                          ? 'destructive'
                          : 'secondary'
                      }
                      className={cn(
                          summary.lastStatus === 'Completed' && 'bg-primary text-primary-foreground',
                          summary.lastStatus === 'Pending' && 'bg-gray-200 text-gray-800',
                      )}
                    >
                      {summary.lastStatus}
                    </Badge>
                </TableCell>
                <TableCell>
                  {summary.lastPaymentDate}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onSelect={() => openHistoryDialog(summary.memberId, summary.memberName)}>View Details</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => openEditDialog(summary.latestPayment)}>Edit Last Payment</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedPayment ? 'Edit Payment' : 'Add New Payment'}</DialogTitle>
          </DialogHeader>
          <PaymentForm payment={selectedPayment} members={members} onFinished={handleFinished} />
        </DialogContent>
      </Dialog>
      <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Payment History for {selectedMemberName}</DialogTitle>
            <DialogDescription>
              Here is a complete list of all payments made by {selectedMemberName}.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <PaymentHistoryTable payments={selectedMemberPayments} onDataChange={onDataChange} />
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
