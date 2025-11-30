'use client'

import { getMembers as getMembersAction, getPayments as getPaymentsAction } from "./actions";
import { Member, Payment } from "./definitions";


// These are client-side safe versions of the data fetching functions
export async function getMembers(): Promise<Member[]> {
    return getMembersAction();
}

export async function getPayments(): Promise<Payment[]> {
    return getPaymentsAction();
}
