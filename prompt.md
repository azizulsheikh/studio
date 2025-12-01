## App Name: Easy Beef

### Core Features:

1.  **Admin Section (Password Protected: `tuhin1302`)**
    *   **Admin Dashboard:**
        *   Display summary cards for "Total Payments" (sum of all completed payments), "Total Members", "Total Transactions" (count of completed payments), and "Total Expenses".
        *   Display an "All Payments" table summarizing payments by member.
        *   Each row should represent a member and show their latest payment details.
        *   Columns: Member (with avatar), Monthly Amount (last payment amount), Total Payment (sum of their completed payments), Last Method, Last Status, and Last Payment Date.
        *   A 3-dot action menu on each row with:
            *   **View Details:** Opens a dialog showing the complete payment history for that member, with an option to delete individual payments.
            *   **Delete Member:** Deletes the member and all associated payments after a confirmation.
        *   An "Add Payment" button to open a form in a dialog to create a new payment record.

    *   **Admin Members Page (`/admin/members`):**
        *   Display a table of all members with columns: Image, Name, Email, Role, and Join Date.
        *   An "Add Member" button to open a form in a dialog for creating new members.
        *   An action menu for each member to "View Profile", "Edit", and "Delete".

    *   **Admin Expenses Page (`/admin/expenses`):**
        *   Display a table of all expenses with columns: Description, Amount, and Date.
        *   An "Add Expense" button to open a form in a dialog.
        *   An action menu for each expense to "Delete" it.

2.  **Public/Homepage (`/`)**
    *   Display a header with the app logo and an "Admin View" button.
    *   Display summary cards for "Total Payments", "Total Expenses", and "Remaining Balance". The "Total Expenses" card should be a link to the `/expenses` page.
    *   Display a public-facing, read-only "All Payments" table that shows the latest payment information for each member, similar to the admin dashboard but without the action menu. Rows should be clickable and navigate to a member's public profile page (`/members/[id]`).

3.  **Public Expense History Page (`/expenses`)**
    *   A read-only table displaying all expenses.

4.  **Public Member Profile Page (`/members/[id]`)**
    *   Display the member's profile details (avatar, name, role, join date, email).
    *   Display a card showing their total payment amount.
    *   Display a table with their personal payment history.

### Data Structure (JSON files):

*   **`members.json`:** `id`, `name`, `email`, `role`, `joinDate`, `imageUrl` (optional).
*   **`payments.json`:** `id`, `memberId`, `amount`, `timestamp`, `paymentMethod`, `status`.
*   **`expenses.json`:** `id`, `description`, `amount`, `date`.

### Style Guidelines:

*   **Layout:** Use a sidebar navigation for the admin section and a clean, card-based layout for dashboards and public pages.
*   **Components:** Use ShadCN UI components (Card, Table, Dialog, Button, Badge, etc.).
*   **Icons:** Use `lucide-react`.
*   **Colour Scheme:** Implement a light theme with a white background and a blue primary color for buttons and highlights. Status badges should be color-coded: "Completed" (primary/blue), "Pending" (gray), "Failed" (destructive/red).
*   **Responsiveness:** The app should be fully responsive for mobile and desktop devices.
