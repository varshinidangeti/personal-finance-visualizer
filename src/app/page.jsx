// src/app/page.jsx
'use client';

import { useState, useEffect } from 'react';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import ExpenseChart from './components/ExpenseChart';
import Dashboard from './components/Dashboard';
import TestDataButton from './components/TestDataButton';

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' or 'transactions'

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/transactions');
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch transactions');
      }

      setTransactions(result.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to load transactions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Load transactions on component mount
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Add new transaction
  const handleAddTransaction = async (transactionData) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to add transaction');
      }

      // Refresh the transactions list
      fetchTransactions();
      return true;
    } catch (err) {
      console.error('Error adding transaction:', err);
      setError('Failed to add transaction. Please try again.');
      return false;
    }
  };

  // Update existing transaction
  const handleUpdateTransaction = async (id, transactionData) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update transaction');
      }

      // Refresh the transactions list and reset editing state
      fetchTransactions();
      setEditingTransaction(null);
      return true;
    } catch (err) {
      console.error('Error updating transaction:', err);
      setError('Failed to update transaction. Please try again.');
      return false;
    }
  };

  // Delete transaction
  const handleDeleteTransaction = async (id) => {
    if (!confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete transaction');
      }

      // Refresh the transactions list
      fetchTransactions();
    } catch (err) {
      console.error('Error deleting transaction:', err);
      setError('Failed to delete transaction. Please try again.');
    }
  };

  // Set transaction for editing
  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setActiveTab('transactions'); // Switch to transactions tab
    // Scroll to the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingTransaction(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Personal Finance Tracker</h1>
          <TestDataButton onDataAdded={fetchTransactions} />
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
            <p>{error}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'dashboard' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'transactions' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('transactions')}
          >
            Transactions
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'dashboard' ? (
          /* Dashboard View */
          loading ? (
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center">
              <p className="text-gray-500">Loading dashboard data...</p>
            </div>
          ) : (
            <Dashboard transactions={transactions} />
          )
        ) : (
          /* Transactions View */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Transaction Form */}
            <div className="md:col-span-1">
              <TransactionForm
                onAddTransaction={handleAddTransaction}
                editingTransaction={editingTransaction}
                onUpdateTransaction={handleUpdateTransaction}
                onCancel={handleCancelEdit}
              />
            </div>

            {/* Charts and Transactions */}
            <div className="md:col-span-2 space-y-6">
              {/* Chart */}
              {loading ? (
                <div className="bg-white p-6 rounded-lg shadow-md h-64 flex items-center justify-center">
                  <p className="text-gray-500">Loading chart data...</p>
                </div>
              ) : (
                <ExpenseChart transactions={transactions} />
              )}

              {/* Transaction List */}
              {loading ? (
                <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center">
                  <p className="text-gray-500">Loading transactions...</p>
                </div>
              ) : (
                <TransactionList
                  transactions={transactions}
                  onEdit={handleEditTransaction}
                  onDelete={handleDeleteTransaction}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
