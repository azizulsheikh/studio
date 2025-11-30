import { z } from 'zod';

export type Member = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  joinDate: string;
};

export const MemberSchema = z.object({
  id: z.string(),
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  role: z.enum(['admin', 'member']),
  joinDate: z.string(),
});

export type Payment = {
  id: string;
  memberId: string;
  amount: number;
  timestamp: string;
  paymentMethod: 'Credit Card' | 'PayPal' | 'Bank Transfer';
  description: string;
  status: 'Completed' | 'Pending' | 'Failed';
};

export const PaymentSchema = z.object({
  id: z.string(),
  memberId: z.string().min(1, { message: 'Please select a member.' }),
  amount: z.coerce.number().positive({ message: 'Amount must be positive.' }),
  timestamp: z.string(),
  paymentMethod: z.enum(['Credit Card', 'PayPal', 'Bank Transfer']),
  description: z.string().optional(),
  status: z.enum(['Completed', 'Pending', 'Failed']),
});

export type PrioritizedPayment = Payment & {
  riskScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
};
