// app/budgets/page.jsx
'use client';

import { useState, useEffect } from 'react';
import BudgetForm from '../components/BudgetForm';
import BudgetList from '../components/BudgetList';
import BudgetChart from '../components/BudgetChart';
import SpendingInsights from '../components/SpendingInsights';
import { format } from 'date-fns';

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingBudget, setEditingBudget] = useState(null);

  // Fetch budgets and transactions
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch budgets
      const budgetsResponse = await fetch('/api/budgets');
      const budgetsResult = await budgetsResponse.json();
      
      if (!budgetsResponse.ok) {
        throw new Error(budgetsResult.error || 'Failed to fetch budgets');
      }
      
      // Fetch transactions
      const transactionsResponse = await fetch('/api/transactions');
      const transactionsResult = await transactionsResponse.json();
      
      if (!transactionsResponse.ok) {
        throw new Error(transactionsResult.error || 'Failed to fetch transactions');
      }
      
      setBudgets(budgetsResult.data);
      setTransactions(transactionsResult.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Save budget
  const handleSaveBudget = async (budgetData) => {
    try {
      // If editing, update existing budget
      if (editingBudget) {
        const response = await fetch(`/api/budgets/${editingBudget._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(budgetData),
        });
        
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to update budget');
        }
        
        setEditingBudget(null);
      } else {
        // Otherwise create new budget
        const response = await fetch('/api/budgets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(budgetData),
        });
        
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to add budget');
        }
      }
      
      // Refresh budgets
      fetchData();
      return true;
    } catch (err) {
      console.error('Error saving budget:', err);
      setError('Failed to save budget. Please try again.');
      return false;
    }
  };

  // Delete budget
  const handleDeleteBudget = async (id) => {
    if (!confirm('Are you sure you want to delete this budget?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/budgets/${id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete budget');
      }
      
      // Refresh budgets
      fetchData();
    } catch (err) {
      console.error('Error deleting budget:', err);
      setError('Failed to delete budget. Please try again.');
    }
  };

  // Set budget for editing
  const handleEditBudget = (budget) => {
    setEditingBudget(budget);
    // Scroll to the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Budget Management</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
            <p>{error}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Budget Form */}
          <div className="md:col-span-1">
            <BudgetForm 
              onSaveBudget={handleSaveBudget}
              existingBudgets={budgets.filter(b => !editingBudget || b._id !== editingBudget._id)}
            />
          </div>
          
          {/* Budget Charts and Lists */}
          <div className="md:col-span-2 space-y-6">
            {/* Budget vs Actual Chart */}
            {loading ? (
              <div className="bg-white p-6 rounded-lg shadow-md h-64 flex items-center justify-center">
                <p className="text-gray-500">Loading chart data...</p>
              </div>
            ) : (
              <BudgetChart transactions={transactions} budgets={budgets} />
            )}
            
            {/* Spending Insights */}
            {loading ? (
              <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center">
                <p className="text-gray-500">Loading insights...</p>
              </div>
            ) : (
              <SpendingInsights transactions={transactions} budgets={budgets} />
            )}
            
            {/* Budget List */}
            {loading ? (
              <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center">
                <p className="text-gray-500">Loading budgets...</p>
              </div>
            ) : (
              <BudgetList 
                budgets={budgets}
                onEdit={handleEditBudget}
                onDelete={handleDeleteBudget}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}