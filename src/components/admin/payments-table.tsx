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
  CardDescription,
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
import { MoreHorizontal, PlusCircle, ArrowLeft } from 'lucide-react';
import { Member, Payment } from '@/lib/definitions';
import { deletePayment, getPaymentsByMemberId } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { PaymentForm } from './payment-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import ProfileCard from '../member/profile-card';
import PaymentHistoryTable from '../member/payment-history-table';
import { ScrollArea } from '../ui/scroll-area';

type PaymentWithFormattedDate = Payment & { formattedDate: string };

export default function PaymentsTable({ payments, members }: { payments: PaymentWithFormattedDate[]; members: Member[] }) {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = React.useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = React.useState(false);
  const [selectedPayment, setSelectedPayment] = React.useState<Payment | null>(null);
  const [selectedMember, setSelectedMember] = React.useState<Member | null>(null);
  const [memberPayments, setMemberPayments] = React.useState<Payment[]>([]);

  const memberMap = new Map(members.map((m) => [m.id, m.name]));

  const handleDelete = async (id: string) => {
    const result = await deletePayment(id);
    toast({
      title: result.message,
    });
  };

  const handleViewDetails = async (payment: Payment) => {
    const member = members.find(m => m.id === payment.memberId);
    if (member) {
      setSelectedMember(member);
      const payments = await getPaymentsByMemberId(member.id);
      setMemberPayments(payments);
      setDetailsDialogOpen(true);
    }
  };

  const openEditDialog = (payment: Payment) => {
    setSelectedPayment(payment);
    setDialogOpen(true);
  };

  const openDeleteDialog = (payment: Payment) => {
    setSelectedPayment(payment);
    setAlertDialogOpen(true);
  };

  const openCreateDialog = () => {
    setSelectedPayment(null);
    setDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle>All Payments</CardTitle>
                <CardDescription>A list of all payments in the system.</CardDescription>
            </div>
            <Button size="sm" className="gap-1" onClick={openCreateDialog}>
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Payment
                </span>
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">{memberMap.get(payment.memberId) || 'Unknown'}</TableCell>
                <TableCell>${payment.amount.toFixed(2)}</TableCell>
                <TableCell>{payment.paymentMethod}</TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {payment.formattedDate}
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
                      <DropdownMenuItem onSelect={() => handleViewDetails(payment)}>View Details</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => openEditDialog(payment)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => openDeleteDialog(payment)} className="text-destructive">Delete</DropdownMenuItem>
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
          <PaymentForm payment={selectedPayment} members={members} onFinished={() => setDialogOpen(false)} />
        </DialogContent>
      </Dialog>
      <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this payment record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => selectedPayment && handleDelete(selectedPayment.id)}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
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
                            <ScrollArea className="h-96">
                                <PaymentHistoryTable payments={memberPayments} />
                            </ScrollArea>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDetailsDialogOpen(false)}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to All Payments
                        </Button>
                    </DialogFooter>
                </>
            )}
        </DialogContent>
    </Dialog>
    </Card>
  );
}
