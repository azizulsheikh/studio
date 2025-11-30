import { cn } from '@/lib/utils';
import { ShieldCheck } from 'lucide-react';

const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn('flex items-center gap-2 text-xl font-bold text-primary', className)}>
      <ShieldCheck className="h-6 w-6" />
      <span>ClarityPay</span>
    </div>
  );
};

export default Logo;
