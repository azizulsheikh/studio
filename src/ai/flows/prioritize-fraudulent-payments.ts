'use server';

/**
 * @fileOverview This file defines a Genkit flow to prioritize potentially fraudulent payments.
 *
 * The flow uses an LLM to analyze payment records and determine a risk score for each payment.
 * The payments are then sorted based on the risk score, with the highest risk payments appearing first.
 *
 * @exported prioritizeFraudulentPayments - A function that takes a list of payment records and returns a prioritized list based on fraud risk.
 * @exported PrioritizeFraudulentPaymentsInput - The input type for the prioritizeFraudulentPayments function.
 * @exported PrioritizeFraudulentPaymentsOutput - The output type for the prioritizeFraudulentPayments function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PaymentRecordSchema = z.object({
  id: z.string().describe('The unique identifier of the payment.'),
  memberId: z.string().describe('The ID of the member making the payment.'),
  amount: z.number().describe('The amount of the payment.'),
  timestamp: z.string().describe('The timestamp of the payment.'),
  paymentMethod: z.string().describe('The payment method used.'),
});

export type PaymentRecord = z.infer<typeof PaymentRecordSchema>;

const PrioritizeFraudulentPaymentsInputSchema = z.array(
  PaymentRecordSchema
);
export type PrioritizeFraudulentPaymentsInput =
  z.infer<typeof PrioritizeFraudulentPaymentsInputSchema>;

const PrioritizeFraudulentPaymentsOutputSchema = z.array(
  PaymentRecordSchema
);
export type PrioritizeFraudulentPaymentsOutput =
  z.infer<typeof PrioritizeFraudulentPaymentsOutputSchema>;

export async function prioritizeFraudulentPayments(
  input: PrioritizeFraudulentPaymentsInput
): Promise<PrioritizeFraudulentPaymentsOutput> {
  return prioritizeFraudulentPaymentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'prioritizeFraudulentPaymentsPrompt',
  input: {schema: PrioritizeFraudulentPaymentsInputSchema},
  output: {schema: PrioritizeFraudulentPaymentsOutputSchema},
  prompt: `You are an expert in fraud detection for payment processing systems.

  Analyze the following payment records and prioritize them based on the likelihood of fraud.
  Return the payment records sorted from highest to lowest risk of fraud.

  Payment Records:
  {{#each this}}
  - ID: {{id}}, Member ID: {{memberId}}, Amount: {{amount}}, Timestamp: {{timestamp}}, Payment Method: {{paymentMethod}}
  {{/each}}
  `,
});

const prioritizeFraudulentPaymentsFlow = ai.defineFlow(
  {
    name: 'prioritizeFraudulentPaymentsFlow',
    inputSchema: PrioritizeFraudulentPaymentsInputSchema,
    outputSchema: PrioritizeFraudulentPaymentsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
