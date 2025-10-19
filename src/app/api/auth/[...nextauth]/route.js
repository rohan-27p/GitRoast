import NextAuth from "next-auth";
import {MongooseAdapter} from "@next-auth/mongoose-adapter";
import GitHubProvider from "next-auth/providers/github";
import connectDB from "@/app/lib/mongodb";
import User from "@/app/model/user";

//https://next-auth.js.org/getting-started/example  wonderful docs

export const authOptions ={
    adapter: MongooseAdapter(connectDB().then(m => m.connection),{
        models :{
            User,
        },  
    }),
    providers : [
        GitHubProvider({
            clientId : process.env.GITHUB_ID,
            clientSecret : process.env.GITHUB_SECRET,
            //scope : we ask for read:user and public_repo scopes
            //public_repo needed to list their repos on dashboard
            authorization:{
                params :{
                    scope : "read:user user:email public_repo"
                },
            },
        }),
    ],

    callbacks:{
        async jwt({token,user,account}){
            //onsinin,save access token and githubid to the jwt (ik im smart)
            if(account && user){
                token.accessToken = account.access_token;
                token.githubId = user.id;
            }
            return token;
        },async session({session,token}){
            //make the access token and userid available oon the clientside session (again im smart)
            session.accessToken = token.accessToken;
            session.githubId = token.githubId;  
            return session;
        }
    },
    session:{strategy :"jwt"},
    secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions);
export {handler as GET,handler as POST}