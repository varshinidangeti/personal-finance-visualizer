// app/page.jsx
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
      console.log('Fetching transactions...');

      // Skip API and go directly to localStorage for simplicity
      try {
        const localData = localStorage.getItem('transactions');
        if (localData) {
          const parsedData = JSON.parse(localData);
          console.log('Transactions loaded from localStorage:', parsedData.length);
          setTransactions(parsedData);
          setError(null);
        } else {
          console.log('No transactions found in localStorage');
          setTransactions([]);
        }
      } catch (localError) {
        console.error('Error reading from localStorage:', localError);
        setTransactions([]);
        setError('Failed to load transactions from localStorage.');
      }
    } catch (err) {
      console.error('Error in fetchTransactions:', err);
      setError('Failed to load transactions. Please try again later.');
      setTransactions([]);
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
      console.log('Adding new transaction:', transactionData);

      // Skip API and directly use localStorage
      try {
        const existingTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        // Add ID and timestamp to the transaction
        const newTransaction = {
          ...transactionData,
          _id: `local_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        const updatedTransactions = [...existingTransactions, newTransaction];
        localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
        console.log('Transaction added to localStorage:', newTransaction);

        // Refresh the transactions list
        fetchTransactions();
        return true;
      } catch (localError) {
        console.error('Error saving to localStorage:', localError);
        throw new Error('Failed to save transaction to localStorage');
      }
    } catch (err) {
      console.error('Error adding transaction:', err);
      setError('Failed to add transaction. Please try again.');
      return false;
    }
  };

  // Update existing transaction
  const handleUpdateTransaction = async (id, transactionData) => {
    try {
      console.log('Updating transaction:', id, transactionData);

      // Update in localStorage
      try {
        const existingTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        const updatedTransactions = existingTransactions.map(t =>
          t._id === id ? { ...t, ...transactionData, updatedAt: new Date().toISOString() } : t
        );

        localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
        console.log('Transaction updated in localStorage:', id);

        // Refresh the transactions list and reset editing state
        fetchTransactions();
        setEditingTransaction(null);
        return true;
      } catch (localError) {
        console.error('Error updating in localStorage:', localError);
        throw new Error('Failed to update transaction in localStorage');
      }
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
      console.log('Deleting transaction:', id);

      // Delete from localStorage
      try {
        const existingTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        const updatedTransactions = existingTransactions.filter(t => t._id !== id);

        localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
        console.log('Transaction deleted from localStorage:', id);

        // Refresh the transactions list
        fetchTransactions();
        return;
      } catch (localError) {
        console.error('Error deleting from localStorage:', localError);
        throw new Error('Failed to delete transaction from localStorage');
      }
    } catch (err) {
      console.error('Error deleting transaction:', err);
      setError('Failed to delete transaction. Please try again.');
    }
  };

  // Set transaction for editing
  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    // Switch to transactions tab if not already there
    setActiveTab('transactions');
    // Scroll to the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingTransaction(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">Personal Finance Tracker</h1>
            <p className="text-gray-500 mt-1">Track, analyze, and optimize your finances</p>
          </div>
          <TestDataButton onDataAdded={fetchTransactions} />
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 shadow-sm fade-in" role="alert">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8 pb-1">
          <button
            className={`py-3 px-6 font-medium text-sm transition-colors duration-200 relative ${
              activeTab === 'dashboard'
                ? 'text-indigo-600 font-semibold'
                : 'text-gray-600 hover:text-indigo-500'
            }`}
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
              </svg>
              Dashboard
            </div>
            {activeTab === 'dashboard' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-md"></span>
            )}
          </button>
          <button
            className={`py-3 px-6 font-medium text-sm transition-colors duration-200 relative ${
              activeTab === 'transactions'
                ? 'text-indigo-600 font-semibold'
                : 'text-gray-600 hover:text-indigo-500'
            }`}
            onClick={() => setActiveTab('transactions')}
          >
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Transactions
            </div>
            {activeTab === 'transactions' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-md"></span>
            )}
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'dashboard' ? (
          /* Dashboard View */
          loading ? (
            <div className="bg-white p-8 rounded-xl shadow-md flex items-center justify-center h-96 fade-in">
              <div className="text-center">
                <svg className="animate-spin h-10 w-10 text-indigo-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-500">Loading dashboard data...</p>
              </div>
            </div>
          ) : (
            <div className="fade-in">
              <Dashboard transactions={transactions} />
            </div>
          )
        ) : (
          /* Transactions View */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 fade-in">
            {/* Transaction Form */}
            <div className="md:col-span-1">
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
                </h2>
                <TransactionForm
                  onAddTransaction={handleAddTransaction}
                  editingTransaction={editingTransaction}
                  onUpdateTransaction={handleUpdateTransaction}
                  onCancel={handleCancelEdit}
                />
              </div>
            </div>

            {/* Charts and Transactions */}
            <div className="md:col-span-2 space-y-8">
              {/* Chart */}
              {loading ? (
                <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-center h-64">
                  <div className="text-center">
                    <svg className="animate-spin h-8 w-8 text-indigo-500 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-gray-500">Loading chart data...</p>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                    </svg>
                    Monthly Expenses
                  </h2>
                  <ExpenseChart transactions={transactions} />
                </div>
              )}

              {/* Transaction List */}
              {loading ? (
                <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-center h-64">
                  <div className="text-center">
                    <svg className="animate-spin h-8 w-8 text-indigo-500 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-gray-500">Loading transactions...</p>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                    </svg>
                    Transaction History
                  </h2>
                  <TransactionList
                    transactions={transactions}
                    onEdit={handleEditTransaction}
                    onDelete={handleDeleteTransaction}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}