import { Member, Payment } from '@/lib/definitions';
import fs from 'fs/promises';
import path from 'path';

const membersPath = path.join(process.cwd(), 'src', 'data', 'members.json');
const paymentsPath = path.join(process.cwd(), 'src', 'data', 'payments.json');

async function readData<T>(filePath: string): Promise<T[]> {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data) as T[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return []; // Return empty array if file doesn't exist
    }
    console.error(`Error reading data from ${filePath}:`, error);
    throw new Error(`Could not read data from ${filePath}.`);
  }
}

export async function getMembers(): Promise<Member[]> {
  return readData<Member>(membersPath);
}

export async function getMemberById(id: string): Promise<Member | undefined> {
  const members = await getMembers();
  return members.find(m => m.id === id);
}

export async function getPayments(): Promise<Payment[]> {
  const payments = await readData<Payment>(paymentsPath);
  return payments.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export async function getPaymentById(id: string): Promise<Payment | undefined> {
    const payments = await getPayments();
    return payments.find(p => p.id === id);
}

export async function getPaymentsByMemberId(memberId: string): Promise<Payment[]> {
    const payments = await getPayments();
    return payments.filter(p => p.memberId === memberId);
}

export async function getDashboardData() {
    const [payments, members] = await Promise.all([getPayments(), getMembers()]);
    
    const completedPayments = payments.filter(payment => payment.status === 'Completed');

    const totalPayments = completedPayments.reduce((sum, payment) => sum + payment.amount, 0);
      
    const recentTransactions = payments.slice(0, 5);
    
    return {
        totalPayments,
        totalMembers: members.length,
        recentTransactions,
        allPayments: payments,
        allMembers: members,
        totalTransactions: completedPayments.length,
    };
}
