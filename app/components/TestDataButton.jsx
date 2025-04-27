'use client';

import { useState } from 'react';

export default function TestDataButton({ onDataAdded }) {
  const [isLoading, setIsLoading] = useState(false);

  const addTestData = async () => {
    setIsLoading(true);
    try {
      // Current month in YYYY-MM format
      const currentMonth = new Date().toISOString().slice(0, 7);

      // Sample transactions with IDs
      const transactions = [
        {
          _id: `local_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          amount: -50,
          description: 'Grocery shopping',
          date: new Date().toISOString(),
          category: 'Food',
          type: 'expense',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: `local_${Date.now()+1}_${Math.random().toString(36).substring(2, 9)}`,
          amount: -30,
          description: 'Gas station',
          date: new Date().toISOString(),
          category: 'Transportation',
          type: 'expense',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: `local_${Date.now()+2}_${Math.random().toString(36).substring(2, 9)}`,
          amount: -100,
          description: 'Movie and dinner',
          date: new Date().toISOString(),
          category: 'Entertainment',
          type: 'expense',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: `local_${Date.now()+3}_${Math.random().toString(36).substring(2, 9)}`,
          amount: -75,
          description: 'Electric bill',
          date: new Date().toISOString(),
          category: 'Utilities',
          type: 'expense',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: `local_${Date.now()+4}_${Math.random().toString(36).substring(2, 9)}`,
          amount: 1000,
          description: 'Salary',
          date: new Date().toISOString(),
          category: 'Income',
          type: 'income',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];

      // Sample budgets with IDs
      const budgets = [
        {
          _id: `local_${Date.now()+5}_${Math.random().toString(36).substring(2, 9)}`,
          category: 'Food',
          amount: 200,
          month: currentMonth,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: `local_${Date.now()+6}_${Math.random().toString(36).substring(2, 9)}`,
          category: 'Transportation',
          amount: 100,
          month: currentMonth,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: `local_${Date.now()+7}_${Math.random().toString(36).substring(2, 9)}`,
          category: 'Entertainment',
          amount: 150,
          month: currentMonth,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: `local_${Date.now()+8}_${Math.random().toString(36).substring(2, 9)}`,
          category: 'Utilities',
          amount: 200,
          month: currentMonth,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];

      // Skip API and directly use localStorage for simplicity and reliability
      console.log('Adding test data directly to localStorage');

      // Store transactions in localStorage
      try {
        // Get existing transactions or initialize empty array
        let existingTransactions = [];
        try {
          const stored = localStorage.getItem('transactions');
          existingTransactions = stored ? JSON.parse(stored) : [];
        } catch (e) {
          console.warn('Could not parse existing transactions, starting fresh', e);
        }

        // Add new transactions
        const newTransactions = [...existingTransactions, ...transactions];
        localStorage.setItem('transactions', JSON.stringify(newTransactions));
        console.log('Transactions saved to localStorage:', newTransactions.length);

        // Get existing budgets or initialize empty array
        let existingBudgets = [];
        try {
          const stored = localStorage.getItem('budgets');
          existingBudgets = stored ? JSON.parse(stored) : [];
        } catch (e) {
          console.warn('Could not parse existing budgets, starting fresh', e);
        }

        // Add new budgets
        const newBudgets = [...existingBudgets, ...budgets];
        localStorage.setItem('budgets', JSON.stringify(newBudgets));
        console.log('Budgets saved to localStorage:', newBudgets.length);

        // Force a refresh of the data
        if (onDataAdded) {
          console.log('Calling onDataAdded to refresh UI');
          onDataAdded();
        }

        alert('Test data added successfully! The page will now refresh to show the new data.');
        window.location.reload(); // Force a page refresh to ensure data is displayed
      } catch (error) {
        console.error('Error saving to localStorage:', error);
        throw new Error(`Failed to save to localStorage: ${error.message}`);
      }
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
