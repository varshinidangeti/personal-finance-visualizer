// src/app/components/SpendingInsights.jsx
import { useState, useEffect } from 'react';
import { format, parseISO, subMonths } from 'date-fns';

export default function SpendingInsights({ transactions = [], budgets = [] }) {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    return format(new Date(), 'yyyy-MM');
  });

  const [insights, setInsights] = useState([]);

  // Generate insights when transactions, budgets, or selected month changes
  useEffect(() => {
    generateInsights();
  }, [transactions, budgets, selectedMonth]);

  // Get available months from transactions
  const availableMonths = transactions && transactions.length > 0
    ? [...new Set(
        transactions.map(t => format(new Date(t.date), 'yyyy-MM'))
      )].sort()
    : [];

  const generateInsights = () => {
    const newInsights = [];

    // Skip if no transactions
    if (!transactions || transactions.length === 0) {
      setInsights([{ type: 'info', message: 'Add transactions to see spending insights.' }]);
      return;
    }

    // Filter transactions for the selected month
    const monthTransactions = transactions.filter(t => {
      try {
        const transactionMonth = format(new Date(t.date), 'yyyy-MM');
        return transactionMonth === selectedMonth;
      } catch (error) {
        console.error('Error formatting date:', error);
        return false;
      }
    });

    if (monthTransactions.length === 0) {
      setInsights([{ type: 'info', message: `No transactions found for ${format(parseISO(`${selectedMonth}-01`), 'MMMM yyyy')}.` }]);
      return;
    }

    // Calculate expenses by category for the selected month
    const expensesByCategory = monthTransactions
      .filter(t => t.amount < 0)
      .reduce((acc, t) => {
        const category = t.category || 'Uncategorized';
        if (!acc[category]) acc[category] = 0;
        acc[category] += Math.abs(t.amount);
        return acc;
      }, {});

    // Total expenses for the month
    const totalExpenses = Object.values(expensesByCategory).reduce((sum, amount) => sum + amount, 0);

    // Get budgets for the selected month
    const monthBudgets = budgets.filter(b => b.month === selectedMonth);

    // Top spending categories
    const topCategories = Object.entries(expensesByCategory)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    if (topCategories.length > 0) {
      newInsights.push({
        type: 'info',
        message: `Your top spending categories for ${format(parseISO(`${selectedMonth}-01`), 'MMMM yyyy')} are: ${
          topCategories.map(([category, amount]) => `${category} ($${amount.toFixed(2)})`).join(', ')
        }.`
      });
    }

    // Budget warnings
    for (const budget of monthBudgets) {
      const spent = expensesByCategory[budget.category] || 0;
      const percentUsed = (spent / budget.amount) * 100;

      if (percentUsed >= 100) {
        newInsights.push({
          type: 'warning',
          message: `You've exceeded your ${budget.category} budget by $${(spent - budget.amount).toFixed(2)}.`
        });
      } else if (percentUsed >= 80) {
        newInsights.push({
          type: 'warning',
          message: `You've used ${percentUsed.toFixed(1)}% of your ${budget.category} budget.`
        });
      }
    }

    // Month-over-month comparison
    const previousMonth = format(subMonths(parseISO(`${selectedMonth}-01`), 1), 'yyyy-MM');
    const previousMonthTransactions = transactions.filter(t => {
      const transactionMonth = format(new Date(t.date), 'yyyy-MM');
      return transactionMonth === previousMonth && t.amount < 0; // Only expenses
    });

    if (previousMonthTransactions.length > 0) {
      const previousMonthTotal = previousMonthTransactions
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      const percentChange = ((totalExpenses - previousMonthTotal) / previousMonthTotal) * 100;

      if (Math.abs(percentChange) >= 10) { // Only show significant changes
        newInsights.push({
          type: percentChange > 0 ? 'warning' : 'success',
          message: `Your spending ${percentChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(percentChange).toFixed(1)}% compared to last month.`
        });
      }
    }

    // Spending habits
    const dayOfWeekExpenses = monthTransactions
      .filter(t => t.amount < 0)
      .reduce((acc, t) => {
        const day = new Date(t.date).getDay();
        if (!acc[day]) acc[day] = 0;
        acc[day] += Math.abs(t.amount);
        return acc;
      }, {});

    if (Object.keys(dayOfWeekExpenses).length > 0) {
      const highestDay = Object.entries(dayOfWeekExpenses)
        .sort((a, b) => b[1] - a[1])[0];

      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

      newInsights.push({
        type: 'info',
        message: `You tend to spend the most on ${dayNames[highestDay[0]]}.`
      });
    }

    // If no insights were generated
    if (newInsights.length === 0) {
      newInsights.push({
        type: 'info',
        message: 'Keep tracking your expenses to see more personalized insights.'
      });
    }

    setInsights(newInsights);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Spending Insights</h2>

      <div className="mb-4">
        <label htmlFor="insight-month" className="block text-sm font-medium text-gray-700 mb-1">Select Month</label>
        <select
          id="insight-month"
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

      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`p-4 rounded-md ${
              insight.type === 'warning' ? 'bg-yellow-50 border border-yellow-300' :
              insight.type === 'success' ? 'bg-green-50 border border-green-300' :
              'bg-blue-50 border border-blue-300'
            }`}
          >
            <p className={`text-sm ${
              insight.type === 'warning' ? 'text-yellow-700' :
              insight.type === 'success' ? 'text-green-700' :
              'text-blue-700'
            }`}>
              {insight.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
