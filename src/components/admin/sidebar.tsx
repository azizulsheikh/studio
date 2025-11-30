'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Logo from '@/components/logo';
import { Home, Users, CreditCard, ArrowLeft, Receipt } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin', icon: Home, label: 'Dashboard' },
  { href: '/admin/members', icon: Users, label: 'Members' },
  { href: '/admin/payments', icon: CreditCard, label: 'Payments' },
  { href: '/admin/expenses', icon: Receipt, label: 'Expenses' },
];

export default function AdminSidebar({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname();

  const commonLinkClasses = "flex items-center justify-center rounded-lg transition-colors hover:text-primary";

  if (isMobile) {
    return (
        <>
            <Link
                href="/"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
                <ArrowLeft className="h-5 w-5" />
                Go to Homepage
            </Link>
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        "flex items-center gap-4 px-2.5",
                        pathname === item.href ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                    )}
                    >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                </Link>
            ))}
        </>
    )
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <TooltipProvider>
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link href="/">
            <Logo className="text-primary" />
            <span className="sr-only">Easy Beef</span>
          </Link>
          <Tooltip>
            <TooltipTrigger asChild>
                <Link
                    href="/"
                    className={cn(commonLinkClasses, "h-9 w-9 text-muted-foreground")}
                >
                    <ArrowLeft className="h-5 w-5" />
                    <span className="sr-only">Go to Homepage</span>
                </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Go to Homepage</TooltipContent>
          </Tooltip>
          {navItems.map((item) => (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(commonLinkClasses, "h-9 w-9", {
                    'bg-accent text-accent-foreground': pathname === item.href,
                    'text-muted-foreground': pathname !== item.href,
                  })}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="sr-only">{item.label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          ))}
        </nav>
      </TooltipProvider>
    </aside>
  );
}
