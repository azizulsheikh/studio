import Link from 'next/link';
import { ArrowRight, ShieldCheck, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/logo';
import { getPayments, getMembers } from '@/lib/data';
import AllPaymentsDashboard from '@/components/home/all-payments-dashboard';

export default async function Home() {
  const [payments, members] = await Promise.all([getPayments(), getMembers()]);

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
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-foreground">
                    The easiest way to manage your beef business
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground mx-auto md:text-xl">
                    The easiest way to manage your beef business.
                  </p>
                </div>
              </div>
            </div>
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
