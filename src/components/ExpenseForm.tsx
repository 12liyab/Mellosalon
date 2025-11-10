import { useState } from 'react';
import { ExpenseRecord } from '../types';
import { Save } from 'lucide-react';

interface ExpenseFormProps {
  onSubmit: (record: Omit<ExpenseRecord, 'id'>) => Promise<void>;
}

export default function ExpenseForm({ onSubmit }: ExpenseFormProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (parseFloat(amount) <= 0) {
      alert('Please enter a valid expense amount.');
      return;
    }

    const record: Omit<ExpenseRecord, 'id'> = {
      date,
      amount: parseFloat(amount),
      notes,
      timestamp: Date.now(),
    };

    try {
      console.log('Submitting expense record:', record);
      await onSubmit(record);
      console.log('Expense record submitted successfully');
      setAmount('');
      setNotes('');
      setDate(new Date().toISOString().split('T')[0]);
      alert('Expense record added successfully!');
    } catch (error) {
      console.error('Error submitting expense record:', error);
      alert('Failed to save expense record. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount (₵)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="0.00"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes / Category
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
          placeholder="e.g., Supplies, Utilities, Rent, Equipment, etc."
          required
        />
      </div>

      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
      >
        <Save size={20} />
        Save Expense Record
      </button>
    </form>
  );
}
