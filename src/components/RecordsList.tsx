import { useState } from 'react';
import { SalesRecord, ExpenseRecord } from '../types';
import { Search, Trash2, Edit2, X, Check } from 'lucide-react';

interface RecordsListProps {
  salesRecords: SalesRecord[];
  expenseRecords: ExpenseRecord[];
  onDelete: (id: string, type: 'sales' | 'expenses') => Promise<void>;
  onUpdate: (id: string, type: 'sales' | 'expenses', data: any) => Promise<void>;
  isAdmin?: boolean;
}

export default function RecordsList({
  salesRecords,
  expenseRecords,
  onDelete,
  onUpdate,
  isAdmin = false,
}: RecordsListProps) {
  const [searchDate, setSearchDate] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingType, setEditingType] = useState<'sales' | 'expenses' | null>(null);
  const [editData, setEditData] = useState<any>(null);

  const filteredSales = searchDate
    ? salesRecords.filter((r) => r.date === searchDate)
    : salesRecords;

  const filteredExpenses = searchDate
    ? expenseRecords.filter((r) => r.date === searchDate)
    : expenseRecords;

  const startEdit = (id: string, type: 'sales' | 'expenses', record: any) => {
    setEditingId(id);
    setEditingType(type);
    setEditData({ ...record });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingType(null);
    setEditData(null);
  };

  const saveEdit = async () => {
    if (editingId && editingType && editData) {
      await onUpdate(editingId, editingType, editData);
      cancelEdit();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Search className="text-gray-400" size={20} />
        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          placeholder="Filter by date"
        />
        {searchDate && (
          <button
            onClick={() => setSearchDate('')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          Sales Records
          <span className="text-sm font-normal text-gray-500">
            ({filteredSales.length})
          </span>
        </h3>

        {filteredSales.length === 0 ? (
          <p className="text-gray-500 italic">No sales records found.</p>
        ) : (
          <div className="space-y-4">
            {filteredSales
              .sort((a, b) => b.timestamp - a.timestamp)
              .map((record) => (
                <div
                  key={record.id}
                  className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
                >
                  {editingId === record.id && editingType === 'sales' ? (
                    <div className="space-y-4">
                      <input
                        type="date"
                        value={editData.date}
                        onChange={(e) =>
                          setEditData({ ...editData, date: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />

                      <div className="space-y-2">
                        {editData.customers.map((customer: any, idx: number) => (
                          <div key={idx} className="grid grid-cols-3 gap-2">
                            <input
                              type="text"
                              value={customer.name}
                              onChange={(e) => {
                                const newCustomers = [...editData.customers];
                                newCustomers[idx].name = e.target.value;
                                setEditData({ ...editData, customers: newCustomers });
                              }}
                              className="px-3 py-2 border border-gray-300 rounded-lg"
                              placeholder="Name"
                            />
                            <input
                              type="text"
                              value={customer.service}
                              onChange={(e) => {
                                const newCustomers = [...editData.customers];
                                newCustomers[idx].service = e.target.value;
                                setEditData({ ...editData, customers: newCustomers });
                              }}
                              className="px-3 py-2 border border-gray-300 rounded-lg"
                              placeholder="Service"
                            />
                            <input
                              type="number"
                              step="0.01"
                              value={customer.price}
                              onChange={(e) => {
                                const newCustomers = [...editData.customers];
                                newCustomers[idx].price = parseFloat(e.target.value) || 0;
                                const newTotal = newCustomers.reduce(
                                  (sum, c) => sum + c.price,
                                  0
                                );
                                setEditData({
                                  ...editData,
                                  customers: newCustomers,
                                  totalSales: newTotal,
                                });
                              }}
                              className="px-3 py-2 border border-gray-300 rounded-lg"
                              placeholder="Price"
                            />
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={saveEdit}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          <Check size={16} />
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                        >
                          <X size={16} />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-sm text-gray-600">
                            Date: {new Date(record.date).toLocaleDateString()}
                          </p>
                          <p className="text-xl font-bold text-green-600 mt-1">
                            Total: ₵{record.totalSales.toFixed(2)}
                          </p>
                        </div>
                        {isAdmin && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEdit(record.id, 'sales', record)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => onDelete(record.id, 'sales')}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        {record.customers.map((customer, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded"
                          >
                            <div>
                              <span className="font-medium">{customer.name}</span>
                              <span className="text-gray-600 text-sm ml-2">
                                - {customer.service}
                              </span>
                            </div>
                            <span className="font-semibold text-gray-900">
                              ₵{customer.price.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>

      <div className="border-t pt-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          Expense Records
          <span className="text-sm font-normal text-gray-500">
            ({filteredExpenses.length})
          </span>
        </h3>

        {filteredExpenses.length === 0 ? (
          <p className="text-gray-500 italic">No expense records found.</p>
        ) : (
          <div className="space-y-4">
            {filteredExpenses
              .sort((a, b) => b.timestamp - a.timestamp)
              .map((record) => (
                <div
                  key={record.id}
                  className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
                >
                  {editingId === record.id && editingType === 'expenses' ? (
                    <div className="space-y-4">
                      <input
                        type="date"
                        value={editData.date}
                        onChange={(e) =>
                          setEditData({ ...editData, date: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <input
                        type="number"
                        step="0.01"
                        value={editData.amount}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            amount: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="Amount"
                      />
                      <textarea
                        value={editData.notes}
                        onChange={(e) =>
                          setEditData({ ...editData, notes: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        rows={3}
                        placeholder="Notes"
                      />

                      <div className="flex gap-2">
                        <button
                          onClick={saveEdit}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          <Check size={16} />
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                        >
                          <X size={16} />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm text-gray-600">
                            Date: {new Date(record.date).toLocaleDateString()}
                          </p>
                          <p className="text-xl font-bold text-red-600 mt-1">
                            ₵{record.amount.toFixed(2)}
                          </p>
                          <p className="text-gray-700 mt-2">{record.notes}</p>
                        </div>
                        {isAdmin && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEdit(record.id, 'expenses', record)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => onDelete(record.id, 'expenses')}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
