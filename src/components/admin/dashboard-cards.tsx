import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DollarSign, Users, CreditCard } from 'lucide-react';

type DashboardCardsProps = {
  totalPayments: number;
  totalMembers: number;
  totalTransactions: number;
};

export default function DashboardCards({ totalPayments, totalMembers, totalTransactions }: DashboardCardsProps) {
    const formattedTotalPayments = new Intl.NumberFormat('en-BD', {
        style: 'currency',
        currency: 'BDT',
      }).format(totalPayments);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formattedTotalPayments}</div>
          <p className="text-xs text-muted-foreground">
            Total amount processed
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Members</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalMembers}</div>
          <p className="text-xs text-muted-foreground">
            Total active members
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalTransactions}</div>
          <p className="text-xs text-muted-foreground">
            Total payments recorded
          </p>
        </CardContent>
      </Card>
    </>
  );
}
