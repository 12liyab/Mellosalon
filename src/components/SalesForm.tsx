import { useState } from 'react';
import { Customer, SalesRecord } from '../types';
import { Plus, Trash2, Save } from 'lucide-react';

interface SalesFormProps {
  onSubmit: (record: Omit<SalesRecord, 'id'>) => Promise<void>;
}

const SERVICES = ['Haircut', 'Shave', 'Hair Color', 'Styling', 'Beard Trim', 'Hot Towel', 'Other'];

export default function SalesForm({ onSubmit }: SalesFormProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [customers, setCustomers] = useState<Customer[]>([
    { name: '', service: 'Haircut', price: 0 },
  ]);

  const addCustomer = () => {
    setCustomers([...customers, { name: '', service: 'Haircut', price: 0 }]);
  };

  const removeCustomer = (index: number) => {
    if (customers.length > 1) {
      setCustomers(customers.filter((_, i) => i !== index));
    }
  };

  const updateCustomer = (index: number, field: keyof Customer, value: string | number) => {
    const updated = [...customers];
    updated[index] = { ...updated[index], [field]: value };
    setCustomers(updated);
  };

  const calculateTotal = () => {
    return customers.reduce((sum, customer) => sum + (Number(customer.price) || 0), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validCustomers = customers.filter((c) => c.name.trim() && c.price > 0);

    if (validCustomers.length === 0) {
      alert('Please add at least one customer with a valid name and price.');
      return;
    }

    const totalSales = calculateTotal();

    const record: Omit<SalesRecord, 'id'> = {
      date,
      totalSales,
      customers: validCustomers,
      timestamp: Date.now(),
    };

    try {
      console.log('Submitting sales record:', record);
      await onSubmit(record);
      console.log('Sales record submitted successfully');
      setCustomers([{ name: '', service: 'Haircut', price: 0 }]);
      setDate(new Date().toISOString().split('T')[0]);
      alert('Sales record added successfully!');
    } catch (error) {
      console.error('Error submitting sales record:', error);
      alert('Failed to save sales record. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Customer Details</h3>
          <button
            type="button"
            onClick={addCustomer}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus size={20} />
            Add Customer
          </button>
        </div>

        <div className="space-y-4">
          {customers.map((customer, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Customer {index + 1}
                </span>
                {customers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCustomer(index)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={customer.name}
                    onChange={(e) => updateCustomer(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Customer name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service
                  </label>
                  <select
                    value={customer.service}
                    onChange={(e) => updateCustomer(index, 'service', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    {SERVICES.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (₵)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={customer.price || ''}
                    onChange={(e) => updateCustomer(index, 'price', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-6">
          <span className="text-lg font-semibold text-gray-900">Total Sales:</span>
          <span className="text-2xl font-bold text-green-600">
            ₵{calculateTotal().toFixed(2)}
          </span>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
        >
          <Save size={20} />
          Save Sales Record
        </button>
      </div>
    </form>
  );
}
