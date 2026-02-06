# Mini ERP Frontend

A modern, responsive, and performance-optimized frontend for the Mini ERP system, built with **Next.js** and **Tailwind CSS**.

## 🚀 Key Features

- **Multi-Tenant Dashboard**: Personalized experience per tenant.
- **Accounting Module**: 
  - Manage **Chart of Accounts** with strict type validation.
  - Record **Journal Entries** with real-time balance validation.
  - View **Trial Balance** reports with optimized loading.
- **Invoicing & Payments**:
  - Full lifecycle for invoices and payments.
  - Smart status tracking (Unpaid to Paid).
  - Validation to prevent overpayment on invoices.
- **Performance Optimized**:
  - **Skeleton Loaders**: Modern loading states for better UX.
  - **Memoization**: Uses `useMemo` to ensure smooth UI interactions.
  - **Responsive Design**: Mobile-first approach with full-width desktop capabilities.

## 🛠 Tech Stack

- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State & UI**: React Hooks, Lucide Icons, Sonner (Toasts)
- **Networking**: Axios-based API client with automatic token handling.

## 🌍 Language Support

- **Arabic Integration**: Full user guide provided in Arabic.
- See [USER_GUIDE_AR.md](./USER_GUIDE_AR.md) for detailed Arabic instructions.

## ⚙️ Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Open the App**:
   Navigate to [http://localhost:3000](http://localhost:3000).

## 📂 Project Structure

- `app/`: Next.js App Router pages and layouts.
- `components/ui/`: Reusable primitive UI components (Button, Card, Input, etc.).
- `lib/api.js`: Centralized API client for backend communication.
- `public/`: Static assets.
