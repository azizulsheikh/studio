'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
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
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { Member, Payment } from '@/lib/definitions';
import { deletePayment } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { PaymentForm } from './payment-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

export default function PaymentsTable({ payments, members, onDataChange }: { payments: Payment[]; members: Member[], onDataChange: () => void }) {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = React.useState(false);
  const [selectedPayment, setSelectedPayment] = React.useState<Payment | null>(null);

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

  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const totalCompletedAmount = payments
    .filter(p => p.status === 'Completed')
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle>All Payments</CardTitle>
                <CardDescription>A list of all individual payment records.</CardDescription>
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
            {payments.map((payment) => {
                const member = memberMap.get(payment.memberId);
                if (!member) return null;

                return (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell>৳{payment.amount.toFixed(2)}</TableCell>
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
                  {new Date(payment.timestamp).toLocaleDateString()}
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
                      <DropdownMenuItem onSelect={() => openEditDialog(payment)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => openDeleteDialog(payment)} className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )})}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={1} className="font-bold">Total (All)</TableCell>
              <TableCell className="font-bold">৳{totalAmount.toFixed(2)}</TableCell>
              <TableCell colSpan={4}></TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={1} className="font-bold text-primary">Total (Completed)</TableCell>
              <TableCell className="font-bold text-primary">৳{totalCompletedAmount.toFixed(2)}</TableCell>
              <TableCell colSpan={4}></TableCell>
            </TableRow>
          </TableFooter>
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
    </Card>
  );
}
