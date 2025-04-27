// app/components/BudgetChart.jsx
import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function BudgetChart({ transactions, budgets }) {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    return format(new Date(), 'yyyy-MM');
  });
  
  // Get available months from budgets
  const availableMonths = [...new Set(budgets.map(budget => budget.month))].sort();
  
  // Filter transactions for the selected month
  const monthTransactions = transactions.filter(t => {
    const transactionMonth = format(new Date(t.date), 'yyyy-MM');
    return transactionMonth === selectedMonth && t.amount < 0; // Only expenses
  });
  
  // Calculate expenses by category for the selected month
  const expensesByCategory = monthTransactions.reduce((acc, t) => {
    const category = t.category || 'Uncategorized';
    if (!acc[category]) acc[category] = 0;
    acc[category] += Math.abs(t.amount);
    return acc;
  }, {});
  
  // Get budgets for selected month
  const monthBudgets = budgets.filter(b => b.month === selectedMonth);
  
  // Prepare data for chart
  const chartData = monthBudgets.map(budget => {
    const actual = expensesByCategory[budget.category] || 0;
    const percentUsed = budget.amount > 0 ? (actual / budget.amount) * 100 : 0;
    
    return {
      category: budget.category,
      Budget: budget.amount,
      Actual: parseFloat(actual.toFixed(2)),
      percentUsed: parseFloat(percentUsed.toFixed(1))
    };
  });
  
  // Show message if no data
  if (chartData.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Budget vs Actual</h2>
        <div className="mb-4">
          <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-1">Select Month</label>
          <select
            id="month"
            className="w-full md:w-64 p-2 border border-gray-300 rounded-md"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {availableMonths.map(month => (
              <option key={month} value={month}>
                {format(parseISO(`${month}-01`), 'MMMM yyyy')}
              </option>
            ))}
            {availableMonths.length === 0 && (
              <option value={selectedMonth}>
                {format(parseISO(`${selectedMonth}-01`), 'MMMM yyyy')}
              </option>
            )}
          </select>
        </div>
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">No budget data available for this month</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Budget vs Actual</h2>
      <div className="mb-4">
        <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-1">Select Month</label>
        <select
          id="month"
          className="w-full md:w-64 p-2 border border-gray-300 rounded-md"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {availableMonths.map(month => (
            <option key={month} value={month}>
              {format(parseISO(`${month}-01`), 'MMMM yyyy')}
            </option>
          ))}
        </select>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [`$${value}`, name]}
              labelFormatter={(value) => `Category: ${value}`}
            />
            <Legend />
            <Bar dataKey="Budget" fill="#8884d8" name="Budget" />
            <Bar dataKey="Actual" fill="#82ca9d" name="Actual" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Budget Usage Table */}
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Budget Usage</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spent</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {chartData.map((item) => {
                const remaining = item.Budget - item.Actual;
                const isOverBudget = remaining < 0;
                
                return (
                  <tr key={item.category}>
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{item.category}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">${item.Budget.toFixed(2)}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">${item.Actual.toFixed(2)}</td>
                    <td className={`px-3 py-2 whitespace-nowrap text-sm ${isOverBudget ? 'text-red-600 font-medium' : 'text-green-600'}`}>
                      ${remaining.toFixed(2)}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${isOverBudget ? 'bg-red-600' : 'bg-green-600'}`}
                            style={{ width: `${Math.min(item.percentUsed, 100)}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-xs font-medium text-gray-500">
                          {item.percentUsed}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}