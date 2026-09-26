Act as an Expert Frontend & UI Developer (Next.js App Router, Tailwind CSS, Recharts, Lucide Icons, and TypeScript).

Build the EXACT Static UI for the "Dashboard / Financial Analytics" page based on the provided screenshots, along with Role-Based Authentication Guards.

### 1. Role-Based Auth Guard & Navigation Logic
- Implement Auth Check: Read current user role from Auth Context / Cookie.
- Access Control: Only 'superadmin' and 'admin' roles can access `/dashboard`. 
- Redirect Logic: If a user with role 'manager' or 'member' tries to access `/dashboard`, automatically redirect them to `/dashboard/member` or display a styled 403 Forbidden Access screen.

### 2. Layout & Top Header Components
- Sidebar:
  * Brand Logo & Title ("Friends Goal" with green icon).
  * Navigation Menu: Dashboard, Member, Operation (Due List, Collection, Money Adjustment, Expense, Investment Information, Income Disburs), Report (Financial Analytics, Manage, Modification History, Withdrawal Requests).
  * Logout Button at bottom.
- Header:
  * Page Title: "Financial Analytics" with subtitle "Overview of collections, profits and member performance".
  * Bell Notification Icon with unread badge counter (e.g., '4').
  * Clicking Bell toggles a styled Static Notification Popover showing recent activities (Withdrawal pending, Payment recorded, Interest rate changed) with a "View all notifications" link to `/notifications`.

### 3. Static Top Stats Grid (6 KPI Cards)
Render 6 clean KPI cards matching the screenshot design with exact formatting:
1. Total Amounts: $2.45M (Wallet Icon, Soft Green BG)
2. Profits: $840k (Trending Icon, Soft Green BG)
3. Members Received: $1.15M (Users Icon, Soft Green BG)
4. others Received: $1.15M (Group Icon, Soft Green BG)
5. Due Amounts: $2.45M (Alert Icon, Soft Red BG)
6. Expense Amounts: $2.45M (Receipt Icon, Soft Red BG)

### 4. Chart & List Section (Exact UI & Colors)
- Member Collection Bar Chart (Recharts Component):
  * Display 12 Months (Jan - Dec) bar chart.
  * Static Data Array with realistic values.
  * RUNNING MONTH HIGHLIGHT: The current month bar (e.g., 'Oct') must be styled with a vibrant solid green color (`#10B981`) and display a floating value badge (`495900`) on top of it.
  * All previous/other months should use a lighter/muted green tint (`#D1FAE5`).
- Performance Donut Chart:
  * Render a Donut Chart with center percentage text (`10%`).
  * Custom Legend: 
    - Recieve (76%) - Solid Dark Green
    - Profit (15%) - Light Green
    - Expense (9%) - Coral Red
- Member Due List Card:
  * Card Header with "Member Due List" and a top-right "Show More ->" link.
  * Static Table rendering ID, NAME (e.g., "MD. Yousuf Mozomder"), and DUE AMOUNT (e.g., "$45,200.00").

### 5. Code Quality & Requirements
- Use clean Tailwind CSS utility classes matching the pixel-perfect spacing, font sizes, border radius, and colors from the screenshots.
- Use static mock data arrays directly in the file for easy future replacement with React Query API fetching.
- Ensure all components are fully responsive and strictly typed with TypeScript.