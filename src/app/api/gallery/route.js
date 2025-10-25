import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

// Define the SharedRoast schema (same as in share route)
const SharedRoastSchema = new mongoose.Schema({
  shareId: { type: String, required: true, unique: true },
  repoName: { type: String, required: true },
  repoUrl: String,
  stars: { type: Number, default: 0 },
  roastLines: [String],
  isAIRoast: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  isPublic: { type: Boolean, default: true },
  views: { type: Number, default: 0 }
});

const SharedRoast = mongoose.models.SharedRoast || mongoose.model('SharedRoast', SharedRoastSchema);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    await connectDB();
    
    // Get public roasts sorted by creation date (newest first)
    const roasts = await SharedRoast
      .find({ isPublic: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalCount = await SharedRoast.countDocuments({ isPublic: true });
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      roasts,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Gallery fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery roasts' }, { status: 500 });
  }
}