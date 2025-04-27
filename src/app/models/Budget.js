// src/app/models/Budget.js
import mongoose from 'mongoose';

const BudgetSchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, 'Please specify a category'],
    trim: true,
  },
  amount: {
    type: Number,
    required: [true, 'Please specify a budget amount'],
    min: [0, 'Budget amount must be positive'],
  },
  month: {
    type: String,
    required: [true, 'Please specify a month'],
    // Format: YYYY-MM
    match: [/^\d{4}-\d{2}$/, 'Month must be in YYYY-MM format'],
  },
}, {
  timestamps: true,
});

// Compound index to ensure unique category-month combinations
BudgetSchema.index({ category: 1, month: 1 }, { unique: true });

export default mongoose.models.Budget || mongoose.model('Budget', BudgetSchema);
