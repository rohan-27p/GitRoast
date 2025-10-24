
export function generateRoast(data) {
    const roastArr = [];
    
    // Repository name roasts
    if (data.repo.name.includes("-") || data.repo.name.includes("_")) {
        const nameRoasts = [
            "Kebab-case or snake_case? Pick a lane, your naming convention has commitment issues.",
            "Your repo name looks like it fell down the stairs and hit every hyphen on the way down.",
            "Did you name this repo with a random word generator? Because it shows."
        ];
        roastArr.push(nameRoasts[Math.floor(Math.random() * nameRoasts.length)]);
    }
    
    if (data.repo.name.length > 30) {
        roastArr.push("Your repo name is longer than most people's attention spans. Ever heard of brevity?");
    }
    
    if (data.repo.name.toLowerCase().includes("test") || data.repo.name.toLowerCase().includes("demo")) {
        roastArr.push("'Test' or 'Demo' in the name? How original. Let me guess, next you'll call it 'MyAwesomeProject'.");
    }

    // Star roasts with more variety
    if (data.repo.stargazers_count === 0) {
        const zeroStarRoasts = [
            "Zero stars? Even black holes have more gravitational pull than your repo.",
            "No stars? Your code is so bad it's creating negative space in the universe.",
            "Congratulations! You've achieved the impossible - making something less popular than a root canal."
        ];
        roastArr.push(zeroStarRoasts[Math.floor(Math.random() * zeroStarRoasts.length)]);
    } else if (data.repo.stargazers_count < 5) {
        const lowStarRoasts = [
            `${data.repo.stargazers_count} stars? I've seen more enthusiasm at a tax audit.`,
            `Only ${data.repo.stargazers_count} stars? Your mom's Facebook posts get more engagement.`,
            `${data.repo.stargazers_count} stars... Did you star it yourself from different accounts?`
        ];
        roastArr.push(lowStarRoasts[Math.floor(Math.random() * lowStarRoasts.length)]);
    } else if (data.repo.stargazers_count > 1000) {
        roastArr.push(`${data.repo.stargazers_count} stars? Either you're actually good at this, or you've mastered the art of clickbait repo names.`);
    }

    // README roasts
    if (!data.readme) {
        const noReadmeRoasts = [
            "No README? What do you expect people to do, decode your intentions through interpretive dance?",
            "Missing README detected. Your code documentation strategy: 'Figure it out yourself, peasant.'",
            "No README? Bold strategy. Let's see if 'mysterious and unhelpful' pays off."
        ];
        roastArr.push(noReadmeRoasts[Math.floor(Math.random() * noReadmeRoasts.length)]);
    } else if (data.readme.size < 500) {
        const shortReadmeRoasts = [
            "Your README is shorter than a TikTok video. At least TikToks are entertaining.",
            "README so short, it makes Twitter's character limit look generous.",
            "Your README has fewer words than this roast. That's... concerning."
        ];
        roastArr.push(shortReadmeRoasts[Math.floor(Math.random() * shortReadmeRoasts.length)]);
    }

    // Last commit roasts
    const lastCommitDate = new Date(data.repo.pushed_at);
    const monthsAgo = (new Date() - lastCommitDate) / (30 * 24 * 60 * 60 * 1000);
    
    if (monthsAgo > 12) {
        roastArr.push(`Last commit was ${Math.floor(monthsAgo)} months ago. This repo is more abandoned than a Blockbuster store.`);
    } else if (monthsAgo > 6) {
        roastArr.push(`${Math.floor(monthsAgo)} months since last commit? Your repo has entered hibernation mode.`);
    } else if (monthsAgo > 3) {
        roastArr.push(`${Math.floor(monthsAgo)} months of silence. Did you forget your GitHub password?`);
    }

    // Issues roasts
    if (data.repo.open_issues_count > 50) {
        roastArr.push(`${data.repo.open_issues_count} open issues? Your repo isn't a project, it's a digital cry for help.`);
    } else if (data.repo.open_issues_count > 20) {
        roastArr.push(`${data.repo.open_issues_count} open issues. Your bug tracker has more problems than a soap opera.`);
    } else if (data.repo.open_issues_count > 10) {
        roastArr.push(`${data.repo.open_issues_count} open issues? Your code has more red flags than a communist parade.`);
    }

    // Pull requests roasts
    if (data.pullRequests && data.pullRequests.length > 10) {
        roastArr.push(`${data.pullRequests.length} open pull requests? Your merge button must be broken... or your standards are too high.`);
    } else if (data.pullRequests && data.pullRequests.length > 5) {
        roastArr.push(`${data.pullRequests.length} pending PRs. Decision paralysis or just enjoying the suspense?`);
    }

    // Branch roasts
    if (data.branches > 10) {
        roastArr.push(`${data.branches} branches? Your git tree looks like a family reunion - confusing and full of regret.`);
    } else if (data.branches > 5) {
        roastArr.push(`${data.branches} branches? Are you growing a git forest or just afraid of the main branch?`);
    }

    // Language-specific roasts
    if (data.languages && data.languages.JavaScript && data.languages.Total > 0) {
        const jsPercentage = (data.languages.JavaScript / data.languages.Total) * 100;
        if (jsPercentage > 95) {
            roastArr.push(`${jsPercentage.toFixed(0)}% JavaScript? Your repo is basically a ` + "`node_modules`" + ` graveyard with delusions of grandeur.`);
        } else if (jsPercentage > 80) {
            roastArr.push(`${jsPercentage.toFixed(0)}% JavaScript. Let me guess, you also think pineapple belongs on pizza.`);
        }
    }

    if (data.languages && data.languages.Python && data.languages.Total > 0) {
        const pyPercentage = (data.languages.Python / data.languages.Total) * 100;
        if (pyPercentage > 90) {
            roastArr.push(`${pyPercentage.toFixed(0)}% Python? Your code is more dependent on indentation than my self-esteem is on coffee.`);
        }
    }

    // Security roasts
    if (data.security && data.security.foundEnvFile) {
        const envRoasts = [
            "You committed a .env file? Congratulations, you've just doxxed your own database.",
            "Found a .env file in your repo. Security through obscurity? More like security through stupidity.",
            "Committing .env files? That's not version control, that's a public confession."
        ];
        roastArr.push(envRoasts[Math.floor(Math.random() * envRoasts.length)]);
    }
    
    if (data.security && data.security.foundApiKey) {
        roastArr.push("Hardcoded API keys detected. Your security strategy: 'What could possibly go wrong?'");
    }

    // Description roasts
    if (!data.repo.description || data.repo.description.trim() === "") {
        roastArr.push("No description? Let me guess - your code is 'self-documenting' and your repo is 'self-explanatory'.");
    }

    // Fork roasts
    if (data.repo.fork) {
        roastArr.push("This is a fork? At least you're honest about not having original ideas.");
    }

    // License roasts
    if (!data.repo.license) {
        roastArr.push("No license? Living dangerously in the legal gray area, I see. Lawyers love people like you.");
    }

    // Random savage roasts for variety
    const randomRoasts = [
        "Your code has the structural integrity of a house of cards in a hurricane.",
        "I've seen more organization in a toddler's toy box than in your codebase.",
        "Your commit messages read like a cry for help written in broken English.",
        "This repo has the same energy as a participation trophy - technically an achievement, but...",
        "Your code architecture has more holes than Swiss cheese and less flavor.",
        "I've seen more consistency in a teenager's mood swings than in your coding style."
    ];

    // Add a random roast 30% of the time for extra spice
    if (Math.random() < 0.3) {
        roastArr.push(randomRoasts[Math.floor(Math.random() * randomRoasts.length)]);
    }

    // Fallback roasts
    if (roastArr.length === 0) {
        const fallbackRoasts = [
            "Your repo is so perfectly mediocre, it's actually impressive. Like watching paint dry in 4K.",
            "I've got nothing... Your code is the digital equivalent of beige wallpaper.",
            "Congratulations! You've achieved the impossible - creating something completely unremarkable.",
            "Your repo is like a vanilla ice cream cone - technically fine, but why would anyone choose it?"
        ];
        roastArr.push(fallbackRoasts[Math.floor(Math.random() * fallbackRoasts.length)]);
    }

    return roastArr;
}