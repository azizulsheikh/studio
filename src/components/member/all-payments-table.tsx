import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
  } from '@/components/ui/card';
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
  import { Payment } from '@/lib/definitions';
  
  export default function AllPaymentsTable({ payments }: { payments: Payment[] }) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Shared Payment Ledger</CardTitle>
          <CardDescription>A read-only view of all payments in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Member ID</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                {payments.map((payment) => (
                    <TableRow key={payment.id}>
                    <TableCell>
                        {new Date(payment.timestamp).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium">{payment.memberId}</TableCell>
                    <TableCell className="text-right">৳{payment.amount.toFixed(2)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }
  