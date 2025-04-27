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

      // Try API first, then fall back to localStorage if needed
      let apiSuccess = true;

      try {
        // Add transactions via API
        for (const transaction of transactions) {
          try {
            const response = await fetch('/api/transactions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(transaction),
            });

            if (!response.ok) {
              const errorData = await response.text();
              console.error(`Transaction API error: ${response.status} - ${errorData}`);
              apiSuccess = false;
              break; // Stop trying API if one fails
            }
          } catch (error) {
            console.error('Transaction fetch error:', error);
            apiSuccess = false;
            break; // Stop trying API if one fails
          }
        }

        // If transactions succeeded, try budgets via API
        if (apiSuccess) {
          for (const budget of budgets) {
            try {
              const response = await fetch('/api/budgets', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(budget),
              });

              if (!response.ok) {
                const errorData = await response.text();
                console.error(`Budget API error: ${response.status} - ${errorData}`);
                apiSuccess = false;
                break; // Stop trying API if one fails
              }
            } catch (error) {
              console.error('Budget fetch error:', error);
              apiSuccess = false;
              break; // Stop trying API if one fails
            }
          }
        }

        // If API failed, use localStorage as fallback
        if (!apiSuccess) {
          console.log('API failed, using localStorage fallback');

          // Add IDs and timestamps to transactions
          const transactionsWithIds = transactions.map(transaction => ({
            ...transaction,
            _id: `local_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }));

          // Store transactions in localStorage
          const existingTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
          const newTransactions = [...existingTransactions, ...transactionsWithIds];
          localStorage.setItem('transactions', JSON.stringify(newTransactions));

          // Add IDs to budgets
          const budgetsWithIds = budgets.map(budget => ({
            ...budget,
            _id: `local_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }));

          // Store budgets in localStorage
          const existingBudgets = JSON.parse(localStorage.getItem('budgets') || '[]');
          const newBudgets = [...existingBudgets, ...budgetsWithIds];
          localStorage.setItem('budgets', JSON.stringify(newBudgets));

          console.log('Test data added to localStorage');
        } else {
          console.log('Test data added via API successfully');
        }
      } catch (error) {
        console.error('Error in test data process:', error);

        // Final fallback - try localStorage if everything else fails
        try {
          console.log('Final fallback to localStorage');

          // Add IDs and timestamps to transactions
          const transactionsWithIds = transactions.map(transaction => ({
            ...transaction,
            _id: `local_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }));

          // Store transactions in localStorage
          const existingTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
          const newTransactions = [...existingTransactions, ...transactionsWithIds];
          localStorage.setItem('transactions', JSON.stringify(newTransactions));

          // Add IDs to budgets
          const budgetsWithIds = budgets.map(budget => ({
            ...budget,
            _id: `local_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }));

          // Store budgets in localStorage
          const existingBudgets = JSON.parse(localStorage.getItem('budgets') || '[]');
          const newBudgets = [...existingBudgets, ...budgetsWithIds];
          localStorage.setItem('budgets', JSON.stringify(newBudgets));

          console.log('Test data added to localStorage (final fallback)');
        } catch (localError) {
          console.error('Error storing data in localStorage:', localError);
          throw localError;
        }
      }

      alert('Test data added successfully!');
      if (onDataAdded) onDataAdded();
    } catch (error) {
      console.error('Error adding test data:', error);
      alert(`Failed to add test data: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={addTestData}
      disabled={isLoading}
      className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:shadow-md disabled:opacity-70 flex items-center"
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Adding Data...
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
            <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
            <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
          </svg>
          Add Test Data
        </>
      )}
    </button>
  );
}
