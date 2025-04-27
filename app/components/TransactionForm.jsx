// app/components/TransactionForm.jsx
import { useState } from 'react';
import { format } from 'date-fns';

export default function TransactionForm({ onAddTransaction, editingTransaction, onUpdateTransaction, onCancel }) {
  const isEditing = !!editingTransaction;
  
  const [formData, setFormData] = useState({
    amount: editingTransaction?.amount || '',
    description: editingTransaction?.description || '',
    date: editingTransaction?.date ? format(new Date(editingTransaction.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
    type: editingTransaction?.type || 'expense',
    category: editingTransaction?.category || 'Uncategorized',
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.amount) newErrors.amount = 'Amount is required';
    if (isNaN(Number(formData.amount))) newErrors.amount = 'Amount must be a number';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.date) newErrors.date = 'Date is required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const finalData = {
        ...formData,
        amount: Number(formData.amount) * (formData.type === 'expense' ? -1 : 1),
      };
      
      if (isEditing) {
        await onUpdateTransaction(editingTransaction._id, finalData);
      } else {
        await onAddTransaction(finalData);
      }
      
      // Reset form if not editing
      if (!isEditing) {
        setFormData({
          amount: '',
          description: '',
          date: format(new Date(), 'yyyy-MM-dd'),
          type: 'expense',
          category: 'Uncategorized',
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Transaction' : 'Add New Transaction'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            id="type"
            name="type"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={formData.type}
            onChange={handleChange}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
          <input
            type="number"
            id="amount"
            name="amount"
            className={`w-full p-2 border ${errors.amount ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            placeholder="Enter amount"
            value={formData.amount}
            onChange={handleChange}
            step="0.01"
          />
          {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            className={`w-full p-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            placeholder="Enter description"
            value={formData.description}
            onChange={handleChange}
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>
        
        <div className="mb-4">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            className={`w-full p-2 border ${errors.date ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            value={formData.date}
            onChange={handleChange}
          />
          {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
        </div>
        
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            id="category"
            name="category"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="Uncategorized">Uncategorized</option>
            <option value="Food">Food</option>
            <option value="Transportation">Transportation</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Utilities">Utilities</option>
            <option value="Housing">Housing</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Shopping">Shopping</option>
            <option value="Education">Education</option>
            <option value="Personal">Personal</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div className="flex justify-end space-x-2">
          {isEditing && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : isEditing ? 'Update' : 'Add'}
          </button>
        </div>
      </form>
    </div>
  );
}