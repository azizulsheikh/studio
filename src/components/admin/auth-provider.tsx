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
    }
  }, []);
  
  useEffect(() => {
    // On initial load, check if user is already authenticated in this session
    const sessionAuth = sessionStorage.getItem('admin-authenticated');
    if (sessionAuth === 'true') {
        setIsAuthenticated(true);
        setShowPasswordDialog(false);
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
      sessionStorage.setItem('admin-authenticated', 'true');
      toast({
        title: 'Password Set',
        description: 'You can now access the admin panel.',
      });
    } else {
      const storedPassword = localStorage.getItem('admin-password');
      if (password === storedPassword) {
        setIsAuthenticated(true);
        setShowPasswordDialog(false);
        sessionStorage.setItem('admin-authenticated', 'true');
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
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-[425px]">
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
              type="password"
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
