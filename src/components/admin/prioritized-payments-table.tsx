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
import { Badge } from '@/components/ui/badge';
import { Payment } from '@/lib/definitions';
import { cn } from '@/lib/utils';

function getRiskLevel(index: number, total: number): 'High' | 'Medium' | 'Low' {
    const percentile = (total - index) / total;
    if (percentile > 0.8) return 'High';
    if (percentile > 0.5) return 'Medium';
    return 'Low';
}

export default function PrioritizedPaymentsTable({ payments }: { payments: Payment[] }) {
  const totalPayments = payments.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fraudulent Payment Prioritization</CardTitle>
        <CardDescription>
          Payments automatically prioritized by AI for fraud risk review.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Risk</TableHead>
              <TableHead>Member ID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.slice(0, 5).map((payment, index) => {
              const riskLevel = getRiskLevel(index, totalPayments);
              return (
                <TableRow key={payment.id} className={riskLevel === 'High' ? 'bg-destructive/10' : ''}>
                  <TableCell>
                    <Badge
                      variant={riskLevel === 'High' ? 'destructive' : riskLevel === 'Medium' ? 'secondary' : 'outline'}
                      className={cn(riskLevel === 'Medium' && 'bg-yellow-200/50 text-yellow-800 border-yellow-300 dark:bg-yellow-800/30 dark:text-yellow-300 dark:border-yellow-700')}
                    >
                      {riskLevel}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{payment.memberId}</TableCell>
                  <TableCell>${payment.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    {new Date(payment.timestamp).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
