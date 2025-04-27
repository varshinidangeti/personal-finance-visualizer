// app/api/budgets/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Budget from '@/app/models/Budget';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');

    const db = await connectDB();

    // If MongoDB is not available, return empty array with a message
    if (!db) {
      console.warn('MongoDB not available for GET /api/budgets');
      return NextResponse.json({
        success: true,
        data: [],
        message: 'MongoDB not available. Using localStorage fallback.'
      }, { status: 200 });
    }

    let query = {};
    if (month) {
      query.month = month;
    }

    const budgets = await Budget.find(query).sort({ category: 1 });
    return NextResponse.json({ success: true, data: budgets }, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/budgets:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'Error fetching budgets. Using localStorage fallback.'
    }, { status: 200 }); // Return 200 instead of 500 to allow client-side fallback
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const db = await connectDB();

    // If MongoDB is not available, return success with a message
    if (!db) {
      console.warn('MongoDB not available for POST /api/budgets');
      return NextResponse.json({
        success: true,
        data: body,
        message: 'MongoDB not available. Budget saved to localStorage instead.'
      }, { status: 200 });
    }

    // Check if budget already exists for this category and month
    try {
      const existingBudget = await Budget.findOne({
        category: body.category,
        month: body.month
      });

      if (existingBudget) {
        // Update instead of create
        existingBudget.amount = body.amount;
        await existingBudget.save();
        return NextResponse.json({ success: true, data: existingBudget }, { status: 200 });
      }
    } catch (error) {
      console.error('Error checking for existing budget:', error);
      // Continue with creating a new budget
    }

    // Create new budget
    const budget = await Budget.create(body);
    return NextResponse.json({ success: true, data: budget }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/budgets:', error);
    return NextResponse.json({
      success: true, // Return success to allow client-side fallback
      data: body,
      error: error.message,
      message: 'Error saving budget to MongoDB. Saved to localStorage instead.'
    }, { status: 200 }); // Return 200 instead of 500 to allow client-side fallback
  }
}