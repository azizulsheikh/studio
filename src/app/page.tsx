import Link from 'next/link';
import { ArrowRight, ShieldCheck, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/components/logo';
import { getPayments, getMembers } from '@/lib/data';
import AllPaymentsDashboard from '@/components/home/all-payments-dashboard';

export default async function Home() {
  const [payments, members] = await Promise.all([getPayments(), getMembers()]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Logo />
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
                  <p className="max-w-[600px] text-muted-foreground mx-auto md:text-xl">
                    The easiest way to manage your beef business.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">Admin Dashboard</CardTitle>
                <ShieldCheck className="w-6 h-6 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage members, oversee all payments, and review transactions prioritized for fraud detection.
                </p>
                <Button asChild>
                  <Link href="/admin">
                    Go to Admin View <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">Member View</CardTitle>
                <Users className="w-6 h-6 text-accent" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  View your profile, payment history, and access the shared payment dashboard.
                </p>
                <Button asChild variant="outline">
                  <Link href="/member-view">
                    Go to Member View <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
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
