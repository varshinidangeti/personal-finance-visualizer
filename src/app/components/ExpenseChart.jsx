// src/app/components/ExpenseChart.jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

export default function ExpenseChart({ transactions }) {
  // Calculate monthly data for the past 6 months
  const getMonthlyData = () => {
    const currentDate = new Date();
    const monthlyData = [];
    
    // Generate last 6 months
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(currentDate, i);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);
      const monthLabel = format(monthDate, 'MMM yyyy');
      
      // Filter transactions for this month
      const monthTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= monthStart && transactionDate <= monthEnd;
      });
      
      // Calculate totals
      const expenses = monthTransactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        
      const incomes = monthTransactions
        .filter(t => t.amount >= 0)
        .reduce((sum, t) => sum + t.amount, 0);
      
      monthlyData.push({
        name: monthLabel,
        Expenses: parseFloat(expenses.toFixed(2)),
        Income: parseFloat(incomes.toFixed(2))
      });
    }
    
    return monthlyData;
  };

  const data = getMonthlyData();
  
  if (transactions.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center h-64 flex items-center justify-center">
        <p className="text-gray-500">No transactions data available for chart.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Monthly Overview</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => [`$${value}`, undefined]} />
            <Legend />
            <Bar dataKey="Expenses" fill="#f87171" name="Expenses" />
            <Bar dataKey="Income" fill="#34d399" name="Income" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
