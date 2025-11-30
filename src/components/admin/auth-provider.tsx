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
import { Label } from '../ui/label';

const AuthContext = createContext<{ isAuthenticated: boolean }>({
  isAuthenticated: false,
});

export const useAdminAuth = () => useContext(AuthContext);

const ADMIN_PASSWORD_KEY = 'admin-password';
const DEFAULT_ADMIN_PASSWORD = 'admin123';

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showLoginDialog, setShowLoginDialog] = useState(true);
  
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const { toast } = useToast();

  const getStoredPassword = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(ADMIN_PASSWORD_KEY) || DEFAULT_ADMIN_PASSWORD;
    }
    return DEFAULT_ADMIN_PASSWORD;
  };

  const handlePasswordSubmit = () => {
    const storedPassword = getStoredPassword();
    if (password === storedPassword) {
      setIsAuthenticated(true);
      setShowLoginDialog(false);
      toast({
        title: 'Login Successful',
        description: 'Welcome to the admin dashboard.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Incorrect Password',
        description: 'Please try again.',
      });
    }
    setPassword('');
  };
  
  const handleChangePassword = () => {
    const storedPassword = getStoredPassword();
    if (currentPassword !== storedPassword) {
      toast({
        variant: 'destructive',
        title: 'Incorrect Current Password',
        description: 'Please enter your current password correctly.',
      });
      return;
    }
    if (newPassword.length < 6) {
        toast({
            variant: 'destructive',
            title: 'Password too short',
            description: 'New password must be at least 6 characters long.',
        });
        return;
    }
    if (newPassword !== confirmNewPassword) {
      toast({
        variant: 'destructive',
        title: 'Passwords do not match',
        description: 'The new password and confirmation do not match.',
      });
      return;
    }

    if (typeof window !== 'undefined') {
        localStorage.setItem(ADMIN_PASSWORD_KEY, newPassword);
    }
    toast({
      title: 'Password Changed',
      description: 'Your password has been updated successfully.',
    });
    setShowChangePasswordDialog(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };


  if (!isAuthenticated) {
    return (
      <Dialog open={showLoginDialog} onOpenChange={() => {
        // Prevent closing the dialog
      }}>
        <DialogContent className="sm:max-w-[425px]" hideCloseButton={true}>
          <DialogHeader>
            <DialogTitle>Admin Access</DialogTitle>
            <DialogDescription>
              Please enter the password to access the admin dashboard.
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
              Login
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50">
        <Button onClick={() => setShowChangePasswordDialog(true)}>Change Password</Button>
      </div>

      <Dialog open={showChangePasswordDialog} onOpenChange={setShowChangePasswordDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Admin Password</DialogTitle>
            <DialogDescription>
              Enter your current password and a new password.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-new-password">Confirm New Password</Label>
              <Input
                id="confirm-new-password"
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowChangePasswordDialog(false)}>Cancel</Button>
            <Button onClick={handleChangePassword}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </AuthContext.Provider>
  );
}
