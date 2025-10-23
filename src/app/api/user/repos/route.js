import {NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import axios from "axios"

export async function GET(request){
    try{
        const session = await getServerSession(authOptions);
        if(!session || !session.accessToken){
            return NextResponse.json({message : "Unauthorized"},{status : 401});
        }
        const userToken = session.accessToken;
        const response = await axios.get(`https://api.github.com/user/repos`,{
            headers : {
                //need to use the user's token not the app's token
                Authorization : `Bearer ${userToken}`,
                "X-GitHub-Api-Version": "2022-11-28"
            },
            params : {
                type : "public",
                sort : "updated",
                per_page : 20
            }
        });
        const repos = response.data.map((repo)=>({
            id : repo.id,
            name : repo.name,
            full_name : repo.full_name,
            url : repo.html_url
        }))
        return NextResponse.json(repos);
    }catch (e){
        return NextResponse.json({message :"Internal Server Error"},{status : 500});    
    }
}
