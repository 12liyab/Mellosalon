import { useState, useEffect } from 'react';
import { ref, push, onValue, remove, update } from 'firebase/database';
import { database } from '../firebase';
import { SalesRecord, ExpenseRecord, DailySummary } from '../types';
import { DollarSign, TrendingUp, TrendingDown, PlusCircle, Calendar } from 'lucide-react';
import SalesForm from './SalesForm';
import ExpenseForm from './ExpenseForm';
import RecordsList from './RecordsList';

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState<'sales' | 'expenses' | 'records'>('sales');
  const [salesRecords, setSalesRecords] = useState<SalesRecord[]>([]);
  const [expenseRecords, setExpenseRecords] = useState<ExpenseRecord[]>([]);
  const [summary, setSummary] = useState<DailySummary>({
    totalSales: 0,
    totalExpenses: 0,
    netProfit: 0,
  });

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

  useEffect(() => {
    const totalSales = salesRecords.reduce((sum, record) => sum + record.totalSales, 0);
    const totalExpenses = expenseRecords.reduce((sum, record) => sum + record.amount, 0);
    setSummary({
      totalSales,
      totalExpenses,
      netProfit: totalSales - totalExpenses,
    });
  }, [salesRecords, expenseRecords]);

  const handleAddSales = async (record: Omit<SalesRecord, 'id'>) => {
    try {
      console.log('Adding sales record:', record);
      const salesRef = ref(database, 'sales');
      const result = await push(salesRef, record);
      console.log('Sales record added successfully:', result.key);
    } catch (error) {
      console.error('Error adding sales record:', error);
      throw error;
    }
  };

  const handleAddExpense = async (record: Omit<ExpenseRecord, 'id'>) => {
    try {
      console.log('Adding expense record:', record);
      const expensesRef = ref(database, 'expenses');
      const result = await push(expensesRef, record);
      console.log('Expense record added successfully:', result.key);
    } catch (error) {
      console.error('Error adding expense record:', error);
      throw error;
    }
  };

  const handleDeleteRecord = async (id: string, type: 'sales' | 'expenses') => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      const recordRef = ref(database, `${type}/${id}`);
      await remove(recordRef);
    }
  };

  const handleUpdateRecord = async (
    id: string,
    type: 'sales' | 'expenses',
    data: Partial<SalesRecord | ExpenseRecord>
  ) => {
    const recordRef = ref(database, `${type}/${id}`);
    await update(recordRef, data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white shadow-lg border-b-4 border-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
            <img
                src="/Adobe Express - file.png"
                alt="Mello Cuts Logo"
                className="h-16 w-16"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mello Cuts</h1>
                <p className="text-sm text-gray-600">Your beauty is our concern</p>
              </div>
            </div>
           
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sales</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ₵{summary.totalSales.toFixed(2)}
                </p>
              </div>
              <TrendingUp className="text-green-500" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ₵{summary.totalExpenses.toFixed(2)}
                </p>
              </div>
              <TrendingDown className="text-red-500" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Net Profit</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ₵{summary.netProfit.toFixed(2)}
                </p>
              </div>
              <DollarSign className="text-blue-500" size={40} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('sales')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'sales'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <PlusCircle size={20} />
                  Add Sales
                </div>
              </button>
              <button
                onClick={() => setActiveTab('expenses')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'expenses'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <TrendingDown size={20} />
                  Add Expenses
                </div>
              </button>
              <button
                onClick={() => setActiveTab('records')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'records'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Calendar size={20} />
                  View Records
                </div>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'sales' && <SalesForm onSubmit={handleAddSales} />}
            {activeTab === 'expenses' && <ExpenseForm onSubmit={handleAddExpense} />}
            {activeTab === 'records' && (
              <RecordsList
                salesRecords={salesRecords}
                expenseRecords={expenseRecords}
                onDelete={handleDeleteRecord}
                onUpdate={handleUpdateRecord}
                isAdmin={false}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
