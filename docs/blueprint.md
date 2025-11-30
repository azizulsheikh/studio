# **App Name**: ClarityPay

## Core Features:

- Member Profile CRUD: Admin users can create, read, update, and delete member profiles.
- Payment Record CRUD: Admin users can create, read, update, and delete payment records.
- Payment Dashboard: Display total payments, recent transactions, and a member list to admins.
- Fraudulent Payment Prioritization: Use an LLM tool to automatically prioritize displaying potentially fraudulent payments on the payment dashboard for admin review.
- Member Profile View: Members can securely view their profile details and payment history. read only process
- Shared Payment View: Members have read-only access to a shared dashboard displaying all payment records.
- Firestore Integration: Store members and payments data in Firestore.

## Style Guidelines:

- Primary color: Deep blue (#3F51B5) to convey trust and stability.
- Background color: Light gray (#F5F5F5), providing a clean and neutral backdrop.
- Accent color: Soft purple (#9575CD) for highlighting interactive elements.
- Body and headline font: 'Inter' (sans-serif) known for its clean and modern look.
- Use minimalist icons to represent actions, payment methods, and member roles. Ensure icons are easily understandable and consistent.
- Implement a responsive layout, ensuring seamless functionality across various devices. The admin panel will feature clear, distinct sections for easy navigation.
- Incorporate subtle transitions and animations for feedback, such as loading animations and action confirmation messages, enhancing user experience.