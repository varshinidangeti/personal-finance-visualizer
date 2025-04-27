// app/api/transactions/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Transaction from '@/app/models/Transaction';

export async function GET() {
  try {
    const db = await connectDB();

    // If MongoDB is not available, return empty array with a message
    if (!db) {
      console.warn('MongoDB not available for GET /api/transactions');
      return NextResponse.json({
        success: true,
        data: [],
        message: 'MongoDB not available. Using localStorage fallback.'
      }, { status: 200 });
    }

    const transactions = await Transaction.find().sort({ date: -1 });
    return NextResponse.json({ success: true, data: transactions }, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/transactions:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'Error fetching transactions. Using localStorage fallback.'
    }, { status: 200 }); // Return 200 instead of 500 to allow client-side fallback
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const db = await connectDB();

    // If MongoDB is not available, return success with a message
    if (!db) {
      console.warn('MongoDB not available for POST /api/transactions');
      return NextResponse.json({
        success: true,
        data: body,
        message: 'MongoDB not available. Transaction saved to localStorage instead.'
      }, { status: 200 });
    }

    const transaction = await Transaction.create(body);
    return NextResponse.json({ success: true, data: transaction }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/transactions:', error);
    return NextResponse.json({
      success: true, // Return success to allow client-side fallback
      data: body,
      error: error.message,
      message: 'Error saving transaction to MongoDB. Saved to localStorage instead.'
    }, { status: 200 }); // Return 200 instead of 500 to allow client-side fallback
  }
}