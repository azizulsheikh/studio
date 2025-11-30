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
  
  export default function PaymentHistoryTable({ payments }: { payments: Payment[] }) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Payment History</CardTitle>
          <CardDescription>A record of all your payments.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
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
                  <TableCell className="font-medium">{payment.description}</TableCell>
                  <TableCell>{payment.paymentMethod}</TableCell>
                  <TableCell className="text-right">${payment.amount.toFixed(2)}</TableCell>
                </TableRow>
              )) : (
                <TableRow>
                    <TableCell colSpan={4} className="text-center">No payments found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }
  