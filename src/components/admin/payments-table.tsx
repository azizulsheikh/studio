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
import { MoreHorizontal, PlusCircle, ArrowLeft, Edit } from 'lucide-react';
import { Member, Payment } from '@/lib/definitions';
import { deletePayment, updatePayment } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { PaymentForm } from './payment-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import ProfileCard from '../member/profile-card';
import PaymentHistoryTable from '../member/payment-history-table';
import { ScrollArea } from '../ui/scroll-area';
import { getPaymentsByMemberId } from '@/lib/actions';

type EnrichedPayment = Payment & { totalPayment: number };

export default function PaymentsTable({ payments, members, onDataChange }: { payments: EnrichedPayment[]; members: Member[], onDataChange: () => void }) {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = React.useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = React.useState(false);
  const [selectedPayment, setSelectedPayment] = React.useState<Payment | null>(null);
  const [selectedMember, setSelectedMember] = React.useState<Member | null>(null);
  const [memberPayments, setMemberPayments] = React.useState<Payment[]>([]);

  const memberMap = new Map(members.map((m) => [m.id, m]));

  const handleDelete = async (id: string) => {
    const result = await deletePayment(id);
    toast({
      title: result.message,
    });
    onDataChange();
  };

  const handleFinished = () => {
    setDialogOpen(false);
    onDataChange();
    if(detailsDialogOpen && selectedMember) {
      handleViewDetails(selectedMember);
    }
  };

  const handleViewDetails = async (memberOrPayment: Member | Payment) => {
    const member = 'memberId' in memberOrPayment 
        ? members.find(m => m.id === memberOrPayment.memberId) 
        : memberOrPayment;

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
              <TableHead>Monthly Amount</TableHead>
              <TableHead>Total Payment</TableHead>
              <TableHead>Last Method</TableHead>
              <TableHead>Last Status</TableHead>
              <TableHead className="hidden md:table-cell">Last Payment Date</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => {
                const member = memberMap.get(payment.memberId);
                if (!member) return null;

                return (
              <TableRow key={payment.memberId}>
                <TableCell className="font-medium">{member.name}</TableCell>
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
                      <DropdownMenuItem onSelect={() => openEditDialog(payment)}>Edit Last Payment</DropdownMenuItem>
                      {!payment.id.startsWith('dummy-') && (
                        <DropdownMenuItem onSelect={() => openDeleteDialog(payment)} className="text-destructive">Delete Last Payment</DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )})}
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
                          <Card>
                            <CardHeader>
                              <CardTitle>Payment History</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ScrollArea className="h-96">
                                  <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Method</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Amount</TableHead>
                                            <TableHead><span className="sr-only">Actions</span></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {memberPayments.map(payment => (
                                            <TableRow key={payment.id}>
                                                <TableCell>{new Date(payment.timestamp).toLocaleDateString()}</TableCell>
                                                <TableCell>{payment.paymentMethod}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={payment.status === 'Completed' ? 'default' : payment.status === 'Failed' ? 'destructive' : 'secondary'}
                                                        className={cn(payment.status === 'Completed' && 'bg-primary text-primary-foreground', payment.status === 'Pending' && 'bg-gray-200 text-gray-800')}
                                                    >
                                                        {payment.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">৳{payment.amount.toFixed(2)}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(payment)}>
                                                        <Edit className="h-4 w-4" />
                                                        <span className="sr-only">Edit</span>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                  </Table>
                              </ScrollArea>
                            </CardContent>
                          </Card>
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
