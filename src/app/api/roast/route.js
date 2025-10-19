import { anonymousRoastLimiter } from "@/app/lib/rateLimit";
import { NextResponse } from "next/server";
import {headers} from "next/headers";

export async function POST(request){
    //get user IP
    const ip = headers().get("x-forwarded-for") || "127.0.0.1";
    //check ratelimit
    const {success,limit,remaining,reset} = await anonymousRoastLimiter.limit(ip);
    //bhai login karo   
    if(!success){
        return new NextResponse(
            JSON.stringify({message: "You can roast only once. Why not login and roast more?"
               , rateLimit :{limit, remaining, reset}

            }),
            {status:429, headers:{"Content-Type":"application/json"}}

        )
    }
    try{
        const body = await request.json();
        const {repoUrl} = body;

        if(!repoUrl){
            return NextResponse.json({message: "Repository URL is required"}, {status:400});
        }
        //fking hell, logic to be written here and im lazy and its 4 45 am so imma just return a dummy response
        return NextResponse.json({message: "this repo is shit"}, {status:200});
    }catch (e){
        return NextResponse.json({message:"Internal Server Error"}, {status:500});
    }
}
