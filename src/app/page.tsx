import Link from 'next/link';
import { ArrowRight, ShieldCheck, Users, DollarSign, MinusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/logo';
import { getPayments, getMembers, getDashboardData } from '@/lib/data';
import AllPaymentsDashboard from '@/components/home/all-payments-dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function Home() {
  const [payments, members, dashboardData] = await Promise.all([getPayments(), getMembers(), getDashboardData()]);
  const { totalPayments, totalExpenses } = dashboardData;

  const formattedTotalPayments = new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
  }).format(totalPayments);
  const formattedTotalExpenses = new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
  }).format(totalExpenses);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Logo />
        <Button asChild>
          <Link href="/admin">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Admin View
          </Link>
        </Button>
      </header>
      <main className="flex-grow">
        <section className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 items-center">
              <div className="flex flex-col justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                    Welcome to Easy Beef
                  </h1>
                  <p className="max-w-[600px] text-primary mx-auto md:text-xl">
                    The easiest way to manage beef for EID festival
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formattedTotalPayments}</div>
                        <p className="text-xs text-muted-foreground">
                        Total amount collected from members
                        </p>
                    </CardContent>
                </Card>
                <Link href="/expenses">
                  <Card className="hover:bg-muted/50 cursor-pointer">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                          <MinusCircle className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                          <div className="text-2xl font-bold">{formattedTotalExpenses}</div>
                          <p className="text-xs text-muted-foreground">
                          Click to view expense history
                          </p>
                      </CardContent>
                  </Card>
                </Link>
            </div>
        </section>

        <AllPaymentsDashboard initialMembers={members} initialPayments={payments} />

      </main>

      <footer className="text-center py-8 text-sm text-muted-foreground">
        © {new Date().getFullYear()} Easy Beef. All rights reserved.
      </footer>
    </div>
  );
}
