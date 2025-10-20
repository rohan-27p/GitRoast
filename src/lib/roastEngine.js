
export function generateRoast(data){
    const roastArr = []
    //I will keep some rule based roasts lol
    //**gotta change the roast lines cus they're boring and given by autocomplete */
  
    //name roast
    if(data.repo.name.includes("-") || data.repo.name.includes("_")){
        roastArr.push("Kebab-case... or snake_case? Make up your mind, your repo name is a mess.")
    }
    //star roast
    if(data.repo.stargazers_count<5){
        roastArr.push(`Only ${data.repo.stargazers_count} stars? Even my grandma's cookie recipe has more stars than that.`)
    }else if(data.repo.stargazers_count>100){
        roastArr.push(`Wow, ${data.repo.stargazers_count} stars! Did you bribe everyone on GitHub to star your repo?`)
    }

    //readme roast
    if (!data.readme){
    roastArr.push("No README.Tf you expect people to read your mind? Or is the code just that 'self-explanatory'?");
   }else if (data.readme.size < 500){
    roastArr.push("Your README is shorter than a tweet. At least try to look professional.");
   } 

   //last commit roast
   const lastCommitDate = new Date(data.repo.pushed_at);
   const monthsAgo = (new Date()-lastCommitDate)/(30*24*60*60*1000)
   if(monthsAgo>3){
        roastArr.push(`your last commit was over ${Math.floor(monthsAgo)} months ago, this project is officially abandoned and an antique... just like your dreams.`);
   }
   
   //issues
   if(data.repo.open_issues_count>10){
    roastArr.push(`With ${data.repo.open_issues_count} open issues, your repo looks like a bug sanctuary. Ever heard of fixing things?`);
   }

   //pull requests
    if(data.pullRequests.length>5){
    roastArr.push(`Having ${data.pullRequests.length} open pull requests? Your repo is busier than a beehive, but are you actually merging any of them?`);
   }

   if(data.branches >2){
    roastArr.push(`${data.branches} branches? tf bro thinks hes bro... but infact he's not, just a scaredy cat to push this on main branch`)
   }

   //languages
   if (data.languages.JavaScript && data.languages.Total > 0) {
    const jsPercentage = (data.languages.JavaScript / data.languages.Total) * 100;
    if (jsPercentage > 90) {
      roastArr.push(`Over ${jsPercentage.toFixed(0)}% JavaScript... This isn't a project, it's a ` + "`node_modules`" + ` black hole.`);
    }
  }

  //security hack (bro is him)
  if(data.security.foundEnvFile){
    roastArr.push("You committed a `.env` file. You've basically posted your house keys on the internet. Genius.")
  }
  if(data.security.foundApiKey){
    roastArr.push("An API key hardcoded in the repo! Bold move. It's called 'public' key for a reason, right? ...Right?")
  }

  if (roastArr.length === 0) {
    roastArr.push("I've got nothing... this repo is so average it's unroastable. Congrats on being mediocre.");
  }

  return roastArr
}