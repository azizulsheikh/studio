'use server';

import { getPayments, getMembers } from '@/lib/data';
import PageHeader from '@/components/page-header';
import AllPaymentsClient from './all-payments-client';
import { Member, Payment } from '@/lib/definitions';

type AllPaymentsDashboardProps = {
    initialPayments: Payment[];
    initialMembers: Member[];
};

export default async function AllPaymentsDashboard({ initialMembers, initialPayments }: AllPaymentsDashboardProps) {

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <PageHeader 
            title="All Payments"
            description="An overview of all member payments. Click a member to see their profile."
            className="mb-4"
        />
        <AllPaymentsClient initialPayments={initialPayments} initialMembers={initialMembers} />
    </section>
  );
}
