# 🔥 GitRoast

> *Your code's worst critic. We don't sugarcoat anything.*

The most brutally honest code reviewer on the internet. GitRoast analyzes your GitHub repositories and delivers savage, sarcastic roasts that'll make you question your life choices. Because sometimes your code needs a reality check.

## 🎯 What Does This Thing Do?

GitRoast takes your precious GitHub repository and absolutely **destroys** it with surgical precision. We analyze everything from your commit messages to your star count, then serve up a fresh batch of digital humiliation that would make Gordon Ramsay proud.

### 🔥 Features That'll Burn Your Feelings

- **🤖 AI-Powered Roasts**: Our AI has been trained on years of developer frustration and Stack Overflow rage
- **📊 Repository Analysis**: We judge everything - stars, commits, README quality, naming conventions
- **🎭 Streaming Terminal**: Watch your roasts appear line by line like a typewriter of doom
- **📚 Roast History**: Keep track of all your digital humiliations in one convenient dashboard
- **🔗 Share Your Pain**: Share your roasts with friends (or enemies)
- **🚦 Rate Limiting**: Anonymous users get limited roasts (sign in or suffer the consequences)
- **🎨 Beautiful UI**: At least the interface looks good while destroying your self-esteem

### 🎪 The Roasting Categories

Our roast engine judges you on:
- **Repository Names**: Kebab-case? Snake_case? Pick a lane!
- **Star Count**: Zero stars? Even black holes have more gravitational pull
- **README Quality**: No README? Bold strategy, let's see how that works out
- **Commit History**: Last commit 6 months ago? Your repo is more abandoned than a Blockbuster store
- **Issues & PRs**: 50+ open issues? Your bug tracker has more problems than a soap opera
- **Language Usage**: 95% JavaScript? Your repo is basically a `node_modules` graveyard
- **Security**: Committed a .env file? Congratulations, you've doxxed your own database

## 🚀 Tech Stack (The Good Stuff)

Built with technologies that actually work (unlike your code):

- **⚡ Next.js 15** - React framework that doesn't hate you
- **🎨 Tailwind CSS** - Because writing CSS is already painful enough
- **🔐 NextAuth.js** - GitHub OAuth (we need to see your repos to roast them)
- **🌐 GitHub API** - Where we fetch your digital shame
- **💾 MongoDB** - Storing your roasts for posterity (and blackmail)
- **🚦 Upstash Rate Limiting** - Keeping freeloaders in check (no login = limited roasts)
- **🎯 Vercel** - Deployment that actually works

## 🛠️ Getting Started (If You Dare)

### Prerequisites
- Node.js (preferably a version from this decade)
- A GitHub account with repos worth roasting
- Thick skin and a sense of humor
- MongoDB database (for storing the carnage)

### Installation

1. **Clone this masterpiece:**
   ```bash
   git clone https://github.com/yourusername/GitRoast.git
   cd GitRoast
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or if you're feeling fancy
   yarn install
   ```

3. **Set up your environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your secrets (and try not to commit them this time):
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-here
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   MONGODB_URI=your-mongodb-connection-string
   GEMINI_API_KEY=your-gemini-api-key-for-ai-roasts
   UPSTASH_REDIS_REST_URL=your-upstash-redis-url
   UPSTASH_REDIS_REST_TOKEN=your-upstash-redis-token
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser and prepare for emotional damage:**
   ```
   http://localhost:3000
   ```

### 🐔 Too Lazy to Clone? (The Coward's Way Out)

If you can't be bothered to clone and run this masterpiece locally, just use the damn live site like the lazy developer you are:

**🌐 [GitRoast](https://git-roast-nine.vercel.app)** *(or whatever domain we end up with)*

Perfect for:
- 🤡 Roasting yourself if you're feeling particularly masochistic
- 😈 Roasting others if you have no friends (and no life)
- 🏃‍♂️ Quick drive-by roastings without the commitment
- 💻 Developers who think setting up a local environment is "too much work"

*No judgment here... actually, that's a lie. We're judging you hard.*

## 🎮 How to Use

1. **Sign in with GitHub** (we promise we won't judge... much)
2. **Paste a public repository URL** in the input field
3. **Choose your poison:**
   - 🔥 Standard Roast: Classic algorithmic brutality
   - 🤖 AI Roast: Artificial intelligence with real attitude (requires login)
4. **Hit the roast button** and watch the magic happen
5. **Cry softly** as each line streams in
6. **Share your pain** with the world (optional but recommended)

## 🏗️ Project Structure

```
GitRoast/
├── src/
│   ├── app/
│   │   ├── api/          # API routes for roasting
│   │   ├── dashboard/    # User dashboard (hall of shame)
│   │   └── page.js       # Main roasting interface
│   ├── lib/
│   │   └── roastEngine.js # The heart of darkness
│   └── components/       # Reusable UI components
├── public/               # Static assets
└── README.md            # You are here
```

## 🤝 Contributing

Found a bug? Want to add more savage roasts? Contributions are welcome! Just remember:

1. Fork the repo (like you fork everything else)
2. Create a feature branch (`git checkout -b feature/more-savage-roasts`)
3. Commit your changes (`git commit -m 'Add devastating new roasts'`)
4. Push to the branch (`git push origin feature/more-savage-roasts`)
5. Open a Pull Request and prepare to be roasted yourself

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. Use it, abuse it, just don't blame us when your feelings get hurt.

## ⚠️ Disclaimer

GitRoast is intended for entertainment purposes only. We are not responsible for:
- Hurt feelings
- Existential crises
- Sudden urges to rewrite your entire codebase
- Loss of confidence in your programming abilities
- Spontaneous combustion of your repositories

*(Although idgaf, get a life)*

## 🙏 Acknowledgments

- **GitHub API** - For making our digital stalking legal
- **Google Gemini** - For creating AI that's sassier than a teenager
- **Every developer** who's ever written terrible code (so... everyone)
- **Stack Overflow** - For teaching us what NOT to do
- **Coffee** - The real MVP behind this project

---

<div align="center">

**Made with 💀 and a lot of sarcasm**

*Remember: If you can't handle the roast, stay out of the kitchen... or GitHub.*

</div>
