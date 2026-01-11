# Mello Cuts - Icen Shop Management System

A modern, responsive barbershop management application for tracking daily sales, expenses, and customer records.

## Features

### Client Dashboard (`/`)
- **Animated Welcome Screen**: Engaging introduction with shop logo and motto
- **Daily Sales Tracking**: Record sales with detailed customer information
  - Customer name, service type, and price
  - Multiple customers per transaction
  - Automatic total calculation
- **Expense Management**: Log daily expenses with notes
- **Real-time Summary**: View total sales, expenses, and net profit
- **Records Management**: View, edit, and delete all records
- **Date Filtering**: Search records by specific dates

### Admin Dashboard (`/admin`)
- **Secure Login**: Username/password authentication
- **Advanced Filtering**: Filter by date or month
- **Comprehensive Reports**: View detailed financial summaries
- **Export to PDF**: Generate printable reports
- **Bulk Actions**: Clear all records with confirmation
- **Session Management**: 30-minute auto-logout for security

## Default Admin Credentials
- **Username**: `admin`
- **Password**: `admin123`

## Technology Stack
- **Frontend**: React 18 + TypeScript
- **Database**: Firebase Realtime Database
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite

## Available Services
- Haircut
- Shave
- Hair Color
- Styling
- Beard Trim
- Hot Towel
- Other

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Navigation
- **Client View**: Access at `/` (root)
- **Admin Panel**: Access at `/admin`
- Switch between views using the navigation buttons

## Security Features
- Admin authentication required
- Session timeout after 30 minutes of inactivity
- Confirmation dialogs for destructive actions
- Data validation on all forms
