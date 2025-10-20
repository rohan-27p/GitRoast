import { NextResponse } from "next/server";
import {headers} from "next/headers";
import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

import { anonymousRoastLimiter } from "@/lib/rateLimit";
import { generateRoast } from "@/lib/roastEngine";
import Roast from "@/model/roast";
import User from "@/model/user";
import connectDB from "@/lib/mongodb";


function parseRepoUrl(url){
    try{
        const pathname  = new URL(url).pathname;
        const parts = pathname.split(/^\/([^\/]+)\/([^\/]+)/); //regex to match /owner/repo (bro is elliot)
        if(parts && parts[1] && parts[2]){
            return {owner: parts[1], repo: parts[2]}
        }
    }catch(e){
        return null;
    }
}

//github api
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const gh = axios.create({
    baseURL: "https://api.github.com",
    headers:{
        Authorization : `Bearer ${GITHUB_TOKEN}`,
        "X-GitHub-Api-Version": "2022-11-28"
    }
})
export async function POST(request){
    const session = await getServerSession(authOptions);
    let userId = null;
    //check if user is logged in
    if(session){
        await connectDB();
        const user = await User.findOne({githubId : session.user.id});
        if(user){
            userId = user._id;
        }
    }
    else{
        //get user IP
        const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
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
    }
    const body = await request.json()
    const repoUrl = body.repoUrl;
    const parsed = parseRepoUrl(repoUrl);

    if(!parsed) return NextResponse.json({message:"invalid url"},{status:400})

    const {owner, repo} = parsed;
    try{
       const [repoRes,langRes,readmeRes,envRes,apiKeyRes,pullsRes,branchesRes ] = await Promise.all([
        gh.get(`/repos/${owner}/${repo}`),
        gh.get(`/repos/${owner}/${repo}/languages`),
        gh.get(`/repos/${owner}/${repo}/readme`).catch(err => err.response),
        gh.get(`/search/code?q=filename:.env+repo:${owner}/${repo}`),
        gh.get(`/search/code?q="api_key"+repo:${owner}/${repo}`),
        gh.get(`/repos/${owner}/${repo}/pulls?state=open`), 
        gh.get(`/repos/${owner}/${repo}/branches`), 
    ]);
        const languageData = langRes.data
        const totalBytes = Object.values(languageData).reduce((a,b)=>a+b,0)

        const apiData ={
            repo:repoRes.data,
            languages:{...languageData,Total :totalBytes},
            readme : readmeRes.status ===200 ? readmeRes.data : null,
            pullRequests: pullsRes.data, 
            branches: branchesRes.data,
            security :{
                foundEnvFile : envRes.data.total_count>0,
                foundAPIKey : apiKeyRes.data.total_count>0,

            }
        }

        const genRoastLines = generateRoast(apiData);

        if(userId){
            await connectDB()
            await Roast.create({
                userId : userId,
                repoName : `${owner}/${repo}`,
                roastLines : genRoastLines,
                isAIRoast : false
            })

        }
        return NextResponse.json({
            repoName : apiData.repo.full_name,
            stars : apiData.repo.stargazers_count,
            roastLines : genRoastLines

        })
    }catch (e){
        if (error.response && error.response.status === 404) {
            return NextResponse.json({ message: "Repository not found. Check the URL and make sure it's public." }, { status: 404 });
        }
        console.error(error);
        return NextResponse.json({ message: "An error occurred while fetching data from GitHub." }, { status: 500 });
    }
    
    // try{
    //     const body = await request.json();
    //     const {repoUrl} = body;

    //     if(!repoUrl){
    //         return NextResponse.json({message: "Repository URL is required"}, {status:400});
    //     }
    //     //fking hell, logic to be written here and im lazy and its 4 45 am so imma just return a dummy response
    //     return NextResponse.json({message: "this repo is shit"}, {status:200});
    // }catch (e){
    //     return NextResponse.json({message:"Internal Server Error"}, {status:500});
    // }
}
