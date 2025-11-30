'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const AuthContext = createContext<{ isAuthenticated: boolean }>({
  isAuthenticated: false,
});

export const useAdminAuth = () => useContext(AuthContext);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(true);
  const [isSettingPassword, setIsSettingPassword] = useState(false);
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const storedPassword = localStorage.getItem('admin-password');
    if (!storedPassword) {
      setIsSettingPassword(true);
    } else {
      setIsSettingPassword(false);
    }
  }, []);

  const handlePasswordSubmit = () => {
    if (isSettingPassword) {
      if (password.length < 4) {
        toast({
            variant: 'destructive',
            title: 'Password too short',
            description: 'Please choose a password with at least 4 characters.',
        });
        return;
      }
      localStorage.setItem('admin-password', password);
      setIsAuthenticated(true);
      setShowPasswordDialog(false);
      toast({
        title: 'Password Set',
        description: 'You can now access the admin panel.',
      });
    } else {
      const storedPassword = localStorage.getItem('admin-password');
      if (password === storedPassword) {
        setIsAuthenticated(true);
        setShowPasswordDialog(false);
      } else {
        toast({
          variant: 'destructive',
          title: 'Incorrect Password',
          description: 'Please try again.',
        });
      }
    }
    setPassword('');
  };

  if (!isAuthenticated) {
    return (
      <Dialog open={showPasswordDialog} onOpenChange={() => {
        // Prevent closing the dialog by clicking outside or pressing Escape
      }}>
        <DialogContent className="sm:max-w-[425px]" hideCloseButton={true}>
          <DialogHeader>
            <DialogTitle>
              {isSettingPassword ? 'Set Admin Password' : 'Admin Access'}
            </DialogTitle>
            <DialogDescription>
              {isSettingPassword
                ? 'Please set a password to protect the admin dashboard.'
                : 'Please enter the password to access the admin dashboard.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              id="password"
              type="text"
              placeholder="Enter password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
            />
          </div>
          <DialogFooter>
            <Button onClick={handlePasswordSubmit}>
              {isSettingPassword ? 'Set Password' : 'Login'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
