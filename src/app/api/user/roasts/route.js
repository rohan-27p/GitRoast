import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Roast from "@/model/roast";
// 1. We no longer need the User model here, so you can delete this.
// import User from "@/model/user"; 

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.githubId) {
      return NextResponse.json({ message: "Not Authorized" }, { status: 401 });
    }

    await connectDB();

    // 2. DELETE all of this. We already have the user's ID.
    // const user = await User.findOne({ githubId: session.githubId });
    // if (!user) {
    //   return NextResponse.json({ message: "User not found" }, { status: 404 });
    // }

    // 3. Find roasts using session.githubId directly.
    // This ID *is* the `userId` from our Roast model.
    const roasts = await Roast.find({ userId: session.githubId })
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json(roasts);

  } catch (error) {
    console.error("Failed to fetch user roasts:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}