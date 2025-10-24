import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import connectDB from "@/lib/mongodb";
import Roast from "@/model/roast";


function parseRepoUrl(url) {
  try {
    const { pathname } = new URL(url);
    const parts = pathname.match(/^\/([^\/]+)\/([^\/]+)/);
    if (parts && parts[1] && parts[2]) {
      return { owner: parts[1], repo: parts[2] };
    }
  } catch (e) { 
    console.error("Error parsing repo URL:", e);
   }
  return null;
}

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const gh = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    "X-GitHub-Api-Version": "2022-11-28",
  },
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const aiModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });



export async function POST(request) {
  try {
    // 1. Check if the user is authenticated
    const session = await getServerSession(authOptions);

    if (!session || !session.githubId) {
      return NextResponse.json({ message: "Not Authorized. AI roasts are for logged-in users only." }, { status: 401 });
    }
    const userId = session.githubId;

    // 2. Get and parse the Repo URL
    const body = await request.json();
    const { repoUrl } = body;
    const parsed = parseRepoUrl(repoUrl);

    if (!parsed) {
      return NextResponse.json({ message: "Invalid GitHub Repository URL" }, { status: 400 });
    }
    const { owner, repo } = parsed;

    // 3. Fetch ALL GitHub data (same as the standard roast)
    const [
      repoRes,
      langRes,
      readmeRes,
      envRes,
      apiKeyRes,
      pullsRes,
      branchesRes
    ] = await Promise.all([
      gh.get(`/repos/${owner}/${repo}`),
      gh.get(`/repos/${owner}/${repo}/languages`),
      gh.get(`/repos/${owner}/${repo}/readme`).catch(e => e.response),
      gh.get(`/search/code?q=filename:.env+repo:${owner}/${repo}`),
      gh.get(`/search/code?q="api_key"+repo:${owner}/${repo}`),
      gh.get(`/repos/${owner}/${repo}/pulls?state=open`),
      gh.get(`/repos/${owner}/${repo}/branches`),
    ]);

    // 4. Assemble the data object
    const languageData = langRes.data;
    const totalBytes = Object.values(languageData).reduce((a, b) => a + b, 0);

    const apiData = {
      repoName: repoRes.data.full_name,
      stars: repoRes.data.stargazers_count,
      forks: repoRes.data.forks_count,
      openIssues: repoRes.data.open_issues_count,
      lastPush: new Date(repoRes.data.pushed_at).toDateString(),
      languages: { ...languageData, Total: totalBytes },
      hasReadme: readmeRes.status === 200,
      openPullRequests: pullsRes.data.length,
      branchCount: branchesRes.data.length,
      security: {
        foundEnvFile: envRes.data.total_count > 0,
        foundApiKey: apiKeyRes.data.total_count > 0,
      },
    };

    // 5. Create the "Master Prompt" for the AI
    const prompt = `
      You are "GitRoast," a witty, deeply sarcastic, and expert code reviewer.
      Your job is to roast a GitHub project based on this JSON data.
      Be funny, brutal, and insightful. Do not be a generic AI.
      NEVER mention you are an AI. You are a critic.
      
      Here is the data:
      ${JSON.stringify(apiData, null, 2)}

      Please provide a savage roast in 4-5 bullet points.
      Start each bullet point with '- '.
    `;

    // 6. Call the Gemini API
    const result = await aiModel.generateContent(prompt);
    const response = await result.response;
    const aiRoastText = response.text();

    // 7. Clean up the AI's response
    const roastLines = aiRoastText.split('\n')
      .map(line => line.replace(/^- /g, '').trim()) // Remove the "- " prefix
      .filter(line => line.length > 0); // Remove empty lines

    // 8. Save the AI roast to the database
    await connectDB();
    await Roast.create({
      userId: userId,
      repoName: apiData.repoName,
      roastLines: roastLines,
      isAIRoast: true, // Set the AI flag to true
    });

    // 9. Send the AI roast back to the client
    return NextResponse.json({
      repoName: apiData.repoName,
      stars: apiData.stars,
      roastLines: roastLines,
    });

  } catch (error) {
    console.error("AI Roast Error:", error);
    if (error.response && error.response.status === 404) {
      return NextResponse.json({ message: "Repository not found." }, { status: 404 });
    }
    return NextResponse.json({ message: "An error occurred with the AI roaster." }, { status: 500 });
  }
}