// app/components/BudgetForm.jsx
import { useState } from 'react';
import { format } from 'date-fns';

const CATEGORIES = [
  'Food', 'Transportation', 'Entertainment', 'Utilities', 
  'Housing', 'Healthcare', 'Shopping', 'Education', 
  'Personal', 'Other', 'Uncategorized'
];

export default function BudgetForm({ onSaveBudget, existingBudgets = [] }) {
  const currentMonth = format(new Date(), 'yyyy-MM');
  
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    month: currentMonth,
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.amount) newErrors.amount = 'Amount is required';
    if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }
    if (!formData.month) newErrors.month = 'Month is required';
    
    // Check if budget already exists for this category and month
    const existingBudget = existingBudgets.find(
      budget => budget.category === formData.category && budget.month === formData.month
    );
    
    if (existingBudget) {
      newErrors.category = `Budget for ${formData.category} in ${formData.month} already exists`;
    }
    
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
      await onSaveBudget({
        ...formData,
        amount: Number(formData.amount)
      });
      
      // Reset form
      setFormData({
        category: '',
        amount: '',
        month: currentMonth,
      });
    } catch (error) {
      console.error('Error saving budget:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Set Monthly Budget</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-1">Month</label>
          <input
            type="month"
            id="month"
            name="month"
            className={`w-full p-2 border ${errors.month ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            value={formData.month}
            onChange={handleChange}
          />
          {errors.month && <p className="text-red-500 text-xs mt-1">{errors.month}</p>}
        </div>
        
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            id="category"
            name="category"
            className={`w-full p-2 border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Select a category</option>
            {CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
        </div>
        
        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Budget Amount</label>
          <input
            type="number"
            id="amount"
            name="amount"
            className={`w-full p-2 border ${errors.amount ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            placeholder="Enter amount"
            value={formData.amount}
            onChange={handleChange}
            step="0.01"
            min="0"
          />
          {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Set Budget'}
          </button>
        </div>
      </form>
    </div>
  );
}