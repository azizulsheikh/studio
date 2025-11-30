import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
  import { Payment } from '@/lib/definitions';
  
  export default function PaymentHistoryTable({ payments }: { payments: Payment[] }) {
    return (
        <Table>
        <TableHeader>
            <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Method</TableHead>
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
                <TableCell className="text-right">৳{payment.amount.toFixed(2)}</TableCell>
            </TableRow>
            )) : (
            <TableRow>
                <TableCell colSpan={3} className="text-center">No payments found.</TableCell>
            </TableRow>
            )}
        </TableBody>
        </Table>
    );
  }
  