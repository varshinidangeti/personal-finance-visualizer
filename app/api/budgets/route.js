// app/api/budgets/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Budget from '@/app/models/Budget';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    
    await connectDB();
    
    let query = {};
    if (month) {
      query.month = month;
    }
    
    const budgets = await Budget.find(query).sort({ category: 1 });
    return NextResponse.json({ success: true, data: budgets }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    await connectDB();
    
    // Check if budget already exists for this category and month
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
    
    // Create new budget
    const budget = await Budget.create(body);
    return NextResponse.json({ success: true, data: budget }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}