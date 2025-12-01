
'use client';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
import { Payment } from '@/lib/definitions';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { MoreHorizontal } from 'lucide-react';
import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { deletePayment } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
  
  export default function PaymentHistoryTable({ payments, onDataChange }: { payments: Payment[], onDataChange?: () => void }) {
    const { toast } = useToast();
    const [alertDialogOpen, setAlertDialogOpen] = React.useState(false);
    const [selectedPayment, setSelectedPayment] = React.useState<Payment | null>(null);

    const openDeleteDialog = (payment: Payment) => {
        setSelectedPayment(payment);
        setAlertDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        const result = await deletePayment(id);
        toast({
          title: result.message,
        });
        setAlertDialogOpen(false);
        onDataChange?.();
      };

    return (
        <>
        <Table>
        <TableHeader>
            <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            {onDataChange && <TableHead><span className="sr-only">Actions</span></TableHead>}
            </TableRow>
        </TableHeader>
        <TableBody>
            {payments.length > 0 ? payments.map((payment) => (
            <TableRow key={payment.id}>
                <TableCell>
                {new Date(payment.timestamp).toLocaleDateString()}
                </TableCell>
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
                <TableCell className="text-right">৳{payment.amount.toFixed(2)}</TableCell>
                {onDataChange && (
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
                            <DropdownMenuItem onSelect={() => openDeleteDialog(payment)} className="text-destructive">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                )}
            </TableRow>
            )) : (
            <TableRow>
                <TableCell colSpan={onDataChange ? 5 : 4} className="text-center">No payments found.</TableCell>
            </TableRow>
            )}
        </TableBody>
        </Table>
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
        </>
    );
  }
  
