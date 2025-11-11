import { useState, useEffect } from 'react';
import { ref, onValue, remove } from 'firebase/database';
// import { signOut } from 'firebase/auth';
import { database,  } from '../firebase';
import { SalesRecord, ExpenseRecord } from '../types';
import {
  Download,
  Trash2,
  LogOut,
  TrendingUp,
  TrendingDown,
  DollarSign,
  
} from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [salesRecords, setSalesRecords] = useState<SalesRecord[]>([]);
  const [expenseRecords, setExpenseRecords] = useState<ExpenseRecord[]>([]);
  const [filterDate, setFilterDate] = useState('');
  const [filterMonth, setFilterMonth] = useState('');

  useEffect(() => {
    const salesRef = ref(database, 'sales');
    const expensesRef = ref(database, 'expenses');

    const unsubscribeSales = onValue(salesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const records = Object.entries(data).map(([id, value]: [string, any]) => ({
          id,
          ...value,
        }));
        setSalesRecords(records);
      } else {
        setSalesRecords([]);
      }
    });

    const unsubscribeExpenses = onValue(expensesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const records = Object.entries(data).map(([id, value]: [string, any]) => ({
          id,
          ...value,
        }));
        setExpenseRecords(records);
      } else {
        setExpenseRecords([]);
      }
    });

    return () => {
      unsubscribeSales();
      unsubscribeExpenses();
    };
  }, []);

  const getFilteredRecords = () => {
    let filteredSales = [...salesRecords];
    let filteredExpenses = [...expenseRecords];

    if (filterDate) {
      filteredSales = filteredSales.filter((r) => r.date === filterDate);
      filteredExpenses = filteredExpenses.filter((r) => r.date === filterDate);
    } else if (filterMonth) {
      filteredSales = filteredSales.filter((r) => r.date.startsWith(filterMonth));
      filteredExpenses = filteredExpenses.filter((r) => r.date.startsWith(filterMonth));
    }

    return { filteredSales, filteredExpenses };
  };

  const { filteredSales, filteredExpenses } = getFilteredRecords();

  const totalSales = filteredSales.reduce((sum, r) => sum + r.totalSales, 0);
  const totalExpenses = filteredExpenses.reduce((sum, r) => sum + r.amount, 0);
  const netProfit = totalSales - totalExpenses;

  const handleClearAll = async () => {
    if (
      window.confirm(
        'Are you sure you want to delete ALL records? This action cannot be undone!'
      )
    ) {
      const secondConfirm = window.confirm(
        'This will permanently delete all sales and expense records. Are you absolutely sure?'
      );
      if (secondConfirm) {
        try {
          console.log('Clearing all records...');
          await remove(ref(database, 'sales'));
          await remove(ref(database, 'expenses'));
          console.log('All records cleared successfully');
          alert('All records have been cleared.');
        } catch (error) {
          console.error('Error clearing records:', error);
          alert('Error clearing records. Please try again.');
        }
      }
    }
  };

  const exportToPDF = () => {
    const printContent = document.getElementById('report-content');
    if (!printContent) return;

    const printWindow = window.open('', '', 'height=600,width=800');
    if (!printWindow) return;

    printWindow.document.write('<html><head><title>Stylish Cuts Report</title>');
    printWindow.document.write('<style>');
    printWindow.document.write(`
      body { font-family: Arial, sans-serif; padding: 20px; }
      .header { text-align: center; margin-bottom: 30px; }
      .logo { width: 100px; height: 100px; margin: 0 auto 20px; }
      h1 { color: #333; margin: 0; }
      .summary { display: flex; justify-content: space-around; margin: 30px 0; }
      .summary-box { text-align: center; padding: 15px; border: 2px solid #ddd; border-radius: 8px; }
      .summary-box h3 { margin: 0 0 10px 0; color: #666; }
      .summary-box p { font-size: 24px; font-weight: bold; margin: 0; }
      .green { color: #10b981; }
      .red { color: #ef4444; }
      .blue { color: #3b82f6; }
      table { width: 100%; border-collapse: collapse; margin: 20px 0; }
      th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
      th { background-color: #f3f4f6; font-weight: bold; }
      .section { margin: 30px 0; }
      .section h2 { color: #333; border-bottom: 2px solid #dc2626; padding-bottom: 10px; }
    `);
    printWindow.document.write('</style></head><body>');
    printWindow.document.write(printContent.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <nav className="bg-gray-800 shadow-lg border-b-4 border-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <img
                src="/Adobe Express - file.png"
                alt="Mello Cuts Logo"
                className="h-16 w-16"
              />
              <div>
                <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-sm text-gray-300">Mello Cut - Your beauty is our concern</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-gray-900">Filters</h2>
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Date
                </label>
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => {
                    setFilterDate(e.target.value);
                    setFilterMonth('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Month
                </label>
                <input
                  type="month"
                  value={filterMonth}
                  onChange={(e) => {
                    setFilterMonth(e.target.value);
                    setFilterDate('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              {(filterDate || filterMonth) && (
                <button
                  onClick={() => {
                    setFilterDate('');
                    setFilterMonth('');
                  }}
                  className="self-end px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90">Total Sales</p>
                <p className="text-3xl font-bold mt-2">₵{totalSales.toFixed(2)}</p>
                <p className="text-xs mt-1 opacity-75">
                  {filteredSales.length} transaction(s)
                </p>
              </div>
              <TrendingUp size={40} className="opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90">Total Expenses</p>
                <p className="text-3xl font-bold mt-2">₵{totalExpenses.toFixed(2)}</p>
                <p className="text-xs mt-1 opacity-75">
                  {filteredExpenses.length} expense(s)
                </p>
              </div>
              <TrendingDown size={40} className="opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90">Net Profit</p>
                <p className="text-3xl font-bold mt-2">₵{netProfit.toFixed(2)}</p>
                <p className="text-xs mt-1 opacity-75">
                  Sales - Expenses
                </p>
              </div>
              <DollarSign size={40} className="opacity-80" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={exportToPDF}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
          >
            <Download size={24} />
            Export Report (PDF)
          </button>
          <button
            onClick={handleClearAll}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-lg"
          >
            <Trash2 size={24} />
            Clear All Records
          </button>
        </div>

        <div id="report-content" className="bg-white rounded-xl shadow-lg p-8">
          <div className="header">
            <img
              src="/Adobe Express - file.png"
              alt="Mello Cuts Logo"
              className="logo"
              style={{ width: '100px', height: '100px', margin: '0 auto 20px' }}
            />
            <h1>Stylish Cuts - Icen Shop</h1>
            <p style={{ color: '#666', margin: '10px 0' }}>Financial Report</p>
            <p style={{ color: '#999', fontSize: '14px' }}>
              {filterDate
                ? `Date: ${new Date(filterDate).toLocaleDateString()}`
                : filterMonth
                ? `Month: ${filterMonth}`
                : 'All Time'}
            </p>
          </div>

          <div className="summary" style={{ display: 'flex', justifyContent: 'space-around', margin: '30px 0' }}>
            <div className="summary-box">
              <h3>Total Sales</h3>
              <p className="green">₵{totalSales.toFixed(2)}</p>
            </div>
            <div className="summary-box">
              <h3>Total Expenses</h3>
              <p className="red">₵{totalExpenses.toFixed(2)}</p>
            </div>
            <div className="summary-box">
              <h3>Net Profit</h3>
              <p className="blue">₵{netProfit.toFixed(2)}</p>
            </div>
          </div>

          <div className="section">
            <h2>Sales Records</h2>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Customers</th>
                  <th>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ textAlign: 'center', color: '#999' }}>
                      No sales records found
                    </td>
                  </tr>
                ) : (
                  filteredSales
                    .sort((a, b) => b.timestamp - a.timestamp)
                    .map((record) => (
                      <tr key={record.id}>
                        <td>{new Date(record.date).toLocaleDateString()}</td>
                        <td>
                          {record.customers.map((c, i) => (
                            <div key={i}>
                              {c.name} - {c.service} (₵{c.price.toFixed(2)})
                            </div>
                          ))}
                        </td>
                        <td style={{ fontWeight: 'bold', color: '#10b981' }}>
                          ₵{record.totalSales.toFixed(2)}
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>

          <div className="section">
            <h2>Expense Records</h2>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Notes</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ textAlign: 'center', color: '#999' }}>
                      No expense records found
                    </td>
                  </tr>
                ) : (
                  filteredExpenses
                    .sort((a, b) => b.timestamp - a.timestamp)
                    .map((record) => (
                      <tr key={record.id}>
                        <td>{new Date(record.date).toLocaleDateString()}</td>
                        <td>{record.notes}</td>
                        <td style={{ fontWeight: 'bold', color: '#ef4444' }}>
                          ₵{record.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
