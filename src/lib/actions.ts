'use server';

import { z } from 'zod';
import { Member, MemberSchema, Payment, PaymentSchema } from './definitions';
import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { getPayments as getAllPayments, getMembers as getAllMembers } from './data';

const membersPath = path.join(process.cwd(), 'src', 'data', 'members.json');
const paymentsPath = path.join(process.cwd(), 'src', 'data', 'payments.json');

async function readData<T>(filePath: string): Promise<T[]> {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data) as T[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw error;
  }
}

async function writeData<T>(filePath: string, data: T[]): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getPaymentsByMemberId(memberId: string): Promise<Payment[]> {
    const payments = await getAllPayments();
    return payments.filter(p => p.memberId === memberId);
}

// Member Actions
const CreateMemberSchema = MemberSchema.omit({ id: true, joinDate: true });
const EditMemberSchema = MemberSchema.omit({ joinDate: true });

export async function createMember(formData: FormData) {
  const validatedFields = CreateMemberSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to create member.',
    };
  }
  
  const { name, email, role } = validatedFields.data;
  const members = await readData<Member>(membersPath);
  
  const newMember: Member = {
    id: `member-${Date.now()}`,
    name,
    email,
    role,
    joinDate: new Date().toISOString(),
  };

  members.push(newMember);
  await writeData(membersPath, members);
  
  revalidatePath('/admin/members');
  return { message: 'Member created successfully.' };
}

export async function updateMember(formData: FormData) {
  const validatedFields = EditMemberSchema.safeParse(Object.fromEntries(formData.entries()));
  
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to update member.',
    };
  }
  
  const { id, ...dataToUpdate } = validatedFields.data;
  let members = await readData<Member>(membersPath);
  
  members = members.map(m => m.id === id ? { ...m, ...dataToUpdate } : m);
  
  await writeData(membersPath, members);
  
  revalidatePath('/admin/members');
  revalidatePath(`/admin/members/${id}`);
  return { message: 'Member updated successfully.' };
}

export async function deleteMember(id: string) {
  let members = await readData<Member>(membersPath);
  members = members.filter(m => m.id !== id);
  await writeData(membersPath, members);
  revalidatePath('/admin/members');
  return { message: 'Member deleted successfully.' };
}

// Payment Actions
const CreatePaymentSchema = PaymentSchema.omit({ id: true, timestamp: true });
const EditPaymentSchema = PaymentSchema.omit({ timestamp: true });

export async function createPayment(formData: FormData) {
  const rawData: {[k: string]: any} = Object.fromEntries(formData.entries());
  const validatedFields = CreatePaymentSchema.safeParse(rawData);
  
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to create payment.',
    };
  }
  
  const data = validatedFields.data;
  const payments = await readData<Payment>(paymentsPath);

  // Find the latest payment for the member
  const memberPayments = payments.filter(p => p.memberId === data.memberId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const latestPayment = memberPayments[0];

  if (latestPayment) {
    // If a payment exists, update the latest one
    const updatedPayment = {
      ...latestPayment,
      amount: latestPayment.amount + data.amount,
      timestamp: new Date().toISOString(),
      paymentMethod: data.paymentMethod,
      status: data.status,
    };
    const updatedPayments = payments.map(p => p.id === latestPayment.id ? updatedPayment : p);
    await writeData(paymentsPath, updatedPayments);
  } else {
    // If no payment exists, create a new one
    const newPayment: Payment = {
      ...data,
      id: `payment-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    payments.push(newPayment);
    await writeData(paymentsPath, payments);
  }
  
  revalidatePath('/');
  revalidatePath('/admin/payments');
  revalidatePath('/admin');
  revalidatePath('/member-view');
  return { message: 'Payment processed successfully.' };
}

export async function updatePayment(formData: FormData) {
  const rawData: {[k: string]: any} = Object.fromEntries(formData.entries());
  const validatedFields = EditPaymentSchema.safeParse(rawData);
  
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to update payment.',
    };
  }
  
  const { id, ...dataToUpdate } = validatedFields.data;
  let payments = await readData<Payment>(paymentsPath);
  
  payments = payments.map(p => p.id === id ? { ...p, ...dataToUpdate, timestamp: new Date().toISOString() } : p);
  
  await writeData(paymentsPath, payments);
  
  revalidatePath('/');
  revalidatePath('/admin/payments');
  revalidatePath('/admin');
  revalidatePath('/member-view');
  return { message: 'Payment updated successfully.' };
}

export async function deletePayment(id: string) {
  let payments = await readData<Payment>(paymentsPath);
  payments = payments.filter(p => p.id !== id);
  await writeData(paymentsPath, payments);
  revalidatePath('/');
  revalidatePath('/admin/payments');
  revalidatePath('/admin');
  revalidatePath('/member-view');
  return { message: 'Payment deleted successfully.' };
}
