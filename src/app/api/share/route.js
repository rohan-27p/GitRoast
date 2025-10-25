import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { nanoid } from 'nanoid';
import mongoose from 'mongoose';

// Define the SharedRoast schema
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

export async function POST(request) {
  try {
    const { roastData } = await request.json();
    
    if (!roastData) {
      return NextResponse.json({ error: 'Roast data is required' }, { status: 400 });
    }

    await connectDB();
    
    // Generate a unique share ID
    const shareId = nanoid(10);
    
    // Create shareable roast document
    const shareableRoast = new SharedRoast({
      shareId,
      repoName: roastData.repoName,
      repoUrl: roastData.repoUrl || roastData.url,
      stars: roastData.stars,
      roastLines: roastData.roastLines,
      isAIRoast: roastData.isAIRoast || false,
      isPublic: true, // Make it visible in gallery
      views: 0
    });

    await shareableRoast.save();

    return NextResponse.json({ 
      shareId,
      shareUrl: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/share/${shareId}`
    });

  } catch (error) {
    console.error('Share creation error:', error);
    return NextResponse.json({ error: 'Failed to create share link' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const shareId = searchParams.get('id');
    
    if (!shareId) {
      return NextResponse.json({ error: 'Share ID is required' }, { status: 400 });
    }

    await connectDB();
    
    const sharedRoast = await SharedRoast.findOne({ shareId });
    
    if (!sharedRoast) {
      return NextResponse.json({ error: 'Shared roast not found' }, { status: 404 });
    }

    // Increment view count
    await SharedRoast.updateOne(
      { shareId },
      { $inc: { views: 1 } }
    );

    return NextResponse.json(sharedRoast);

  } catch (error) {
    console.error('Share fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch shared roast' }, { status: 500 });
  }
}