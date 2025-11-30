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
  
  export default function PaymentHistoryTable({ payments }: { payments: Payment[] }) {
    return (
        <Table>
        <TableHeader>
            <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
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
            </TableRow>
            )) : (
            <TableRow>
                <TableCell colSpan={4} className="text-center">No payments found.</TableCell>
            </TableRow>
            )}
        </TableBody>
        </Table>
    );
  }
  