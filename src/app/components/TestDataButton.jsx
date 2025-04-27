'use client';

import { useState } from 'react';

export default function TestDataButton({ onDataAdded }) {
  const [isLoading, setIsLoading] = useState(false);

  const addTestData = async () => {
    setIsLoading(true);
    try {
      // Current month in YYYY-MM format
      const currentMonth = new Date().toISOString().slice(0, 7);
      
      // Sample transactions
      const transactions = [
        {
          amount: -50,
          description: 'Grocery shopping',
          date: new Date().toISOString(),
          category: 'Food',
          type: 'expense'
        },
        {
          amount: -30,
          description: 'Gas station',
          date: new Date().toISOString(),
          category: 'Transportation',
          type: 'expense'
        },
        {
          amount: -100,
          description: 'Movie and dinner',
          date: new Date().toISOString(),
          category: 'Entertainment',
          type: 'expense'
        },
        {
          amount: -75,
          description: 'Electric bill',
          date: new Date().toISOString(),
          category: 'Utilities',
          type: 'expense'
        },
        {
          amount: 1000,
          description: 'Salary',
          date: new Date().toISOString(),
          category: 'Income',
          type: 'income'
        }
      ];

      // Sample budgets
      const budgets = [
        {
          category: 'Food',
          amount: 200,
          month: currentMonth
        },
        {
          category: 'Transportation',
          amount: 100,
          month: currentMonth
        },
        {
          category: 'Entertainment',
          amount: 150,
          month: currentMonth
        },
        {
          category: 'Utilities',
          amount: 200,
          month: currentMonth
        }
      ];

      // Add transactions
      for (const transaction of transactions) {
        await fetch('/api/transactions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(transaction),
        });
      }

      // Add budgets
      for (const budget of budgets) {
        await fetch('/api/budgets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(budget),
        });
      }

      alert('Test data added successfully!');
      if (onDataAdded) onDataAdded();
    } catch (error) {
      console.error('Error adding test data:', error);
      alert('Failed to add test data. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={addTestData}
      disabled={isLoading}
      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-green-300"
    >
      {isLoading ? 'Adding Test Data...' : 'Add Test Data'}
    </button>
  );
}
