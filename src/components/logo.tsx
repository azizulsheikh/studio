import { cn } from '@/lib/utils';
import { CookingPot } from 'lucide-react';

const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn('flex items-center gap-2 text-xl font-bold text-primary', className)}>
      <CookingPot className="h-6 w-6" />
      <span>Easy Beef</span>
    </div>
  );
};

export default Logo;
