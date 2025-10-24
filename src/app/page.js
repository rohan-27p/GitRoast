'use client';

import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { TypeAnimation } from 'react-type-animation';
import Image from "next/image";
import Link from "next/link";

// Navigation Component
function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-gray-800">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🔥</span>
            <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              GitRoast
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/gallery" className="text-gray-300 hover:text-white transition-colors">
              Gallery
            </Link>
          </div>

          <AuthButton />
        </div>
      </div>
    </nav>
  );
}

// Auth Button Component
function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="px-4 py-2 bg-gray-800 rounded-lg animate-pulse w-32 h-10" />
    );
  }

  if (session) {
    return (
      <div className="flex items-center space-x-4">
        <div className="hidden sm:flex items-center space-x-3">
          <Image
            src={session.user.image}
            alt={session.user.name}
            width={32}
            height={32}
            className="rounded-full ring-2 ring-gray-700"
          />
          <span className="text-sm text-gray-300">
            {session.user.name}
          </span>
        </div>
        <button
          onClick={() => signOut()}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn('github')}
      className="px-6 py-2 font-medium text-white bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 rounded-lg border border-gray-700 transition-all duration-200 flex items-center space-x-2"
    >
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
      </svg>
      <span>Sign in with GitHub</span>
    </button>
  );
}

// Footer Component
function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-20">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🔥</span>
              <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                GitRoast
              </span>
            </div>
            <p className="text-gray-400 text-sm max-w-md">
              The most brutally honest code reviewer on the internet. We roast your repos so you don&apos;t have to.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Features</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>AI-Powered Roasts</li>
              <li>Repository Analysis</li>
              <li>Share Your Roasts</li>
              <li>Roast Gallery</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link href="/gallery" className="hover:text-white transition-colors">Gallery</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-500">
          <p>&copy; 2025 GitRoast. Made with 💀 by Bro</p>
        </div>
      </div>
    </footer>
  );
}

// Main Home Component
export default function Home() {
  const { data: session } = useSession();
  const [repoUrl, setRepoUrl] = useState('');
  const [roastHistory, setRoastHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentError, setCurrentError] = useState(null);
  const [isAiRoast, setIsAiRoast] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setCurrentError(null);

    const endpoint = isAiRoast ? '/api/roast-ai' : '/api/roast';
    const currentRepoUrl = repoUrl;
    const currentIsAi = isAiRoast;

    // Add the command to history immediately
    const commandEntry = {
      id: Date.now(),
      type: 'command',
      repoUrl: currentRepoUrl,
      timestamp: new Date(),
      isAiRoast: currentIsAi
    };

    setRoastHistory(prev => [...prev, commandEntry]);

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl: currentRepoUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      // Add the successful roast result to history
      const roastEntry = {
        id: Date.now() + 1,
        type: 'roast',
        ...data,
        isAIRoast: currentIsAi,
        timestamp: new Date(),
        repoUrl: currentRepoUrl
      };

      setRoastHistory(prev => [...prev, roastEntry]);

    } catch (err) {
      let errorMessage = err.message;
      if (err.message.includes("Not Authorized")) {
        errorMessage = "You must be logged in to use the AI Roaster.";
      }

      // Add error to history
      const errorEntry = {
        id: Date.now() + 2,
        type: 'error',
        message: errorMessage,
        timestamp: new Date(),
        repoUrl: currentRepoUrl
      };

      setRoastHistory(prev => [...prev, errorEntry]);
      setCurrentError(errorMessage);
    } finally {
      setIsLoading(false);
      setRepoUrl(''); // Clear the input after submission
    }
  };

  const shareRoast = async (roastData) => {
    if (!roastData) return;

    try {
      const shareUrl = `${window.location.origin}/share/${roastData.shareId || 'temp'}`;
      await navigator.clipboard.writeText(shareUrl);
      alert('Share link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy share link:', err);
    }
  };

  const clearTerminal = () => {
    setRoastHistory([]);
    setCurrentError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Navbar />

      {/* Hero Section */}
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-7xl font-extrabold mb-6">
              <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                Your Code&apos;s
              </span>
              <br />
              <span className="text-white">Worst Critic</span>
            </h1>

            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Paste a public GitHub repo URL and prepare for the most brutally honest code review of your life.
              We don&apos;t sugarcoat anything.
            </p>

            {/* Roast Form */}
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <input
                    type="text"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/owner/repo"
                    className="w-full p-4 text-lg bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm"
                    required
                  />
                </div>

                {/* AI Toggle */}
                <div className="flex items-center justify-center">
                  <label className="relative inline-flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={isAiRoast}
                      onChange={() => setIsAiRoast(!isAiRoast)}
                      disabled={!session}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-7 bg-gray-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-purple-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-600 peer-checked:to-pink-600 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
                    <span className="ml-4 text-gray-300 font-medium group-hover:text-white transition-colors">
                      🤖 AI-Powered Roast {!session && "(Login Required)"}
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !repoUrl.trim()}
                  className={`w-full p-4 text-lg font-bold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${isAiRoast
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                    : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white'
                    } shadow-lg hover:shadow-xl transform hover:scale-[1.02]`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>{isAiRoast ? 'AI is Roasting...' : 'Roasting...'}</span>
                    </div>
                  ) : (
                    `🔥 Roast This Repo!`
                  )}
                </button>
              </form>
            </div>

            {/* Results Terminal */}
            <div className="max-w-4xl mx-auto mt-12">
              <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between px-4 py-3 bg-gray-800/50 border-b border-gray-700">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-400 font-mono">roast-terminal</span>
                  <div className="flex items-center space-x-2">
                    {roastHistory.length > 0 && (
                      <button
                        onClick={clearTerminal}
                        className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
                        title="Clear terminal"
                      >
                        🗑️ Clear
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-6 font-mono text-left min-h-[400px] max-h-[600px] overflow-y-auto">
                  {/* Welcome message when terminal is empty */}
                  {roastHistory.length === 0 && !isLoading && (
                    <div className="space-y-2">
                      <div className="flex items-center mb-4">
                        <span className="text-green-400">➜</span>
                        <span className="text-blue-400 ml-2">~</span>
                        <span className="text-gray-400 ml-2">Welcome to GitRoast Terminal</span>
                      </div>
                      <div className="text-gray-500 text-sm">
                        <p>🔥 Ready to roast some repositories!</p>
                        <p>📝 Enter a GitHub repo URL above and hit that roast button.</p>

                      </div>
                    </div>
                  )}

                  {/* Render roast history */}
                  {roastHistory.map((entry) => (
                    <div key={entry.id} className="mb-6 border-b border-gray-800 pb-4 last:border-b-0">
                      {entry.type === 'command' && (
                        <div className="flex items-center mb-2">
                          <span className="text-green-400">➜</span>
                          <span className="text-blue-400 ml-2">~</span>
                          <span className="text-gray-400 ml-2">
                            git roast {entry.repoUrl}
                            {entry.isAiRoast && <span className="text-purple-400 ml-2">[AI-MODE]</span>}
                          </span>
                          <span className="text-gray-600 ml-4 text-xs">
                            {entry.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      )}

                      {entry.type === 'error' && (
                        <div className="mt-2 p-3 bg-red-900/30 border border-red-700 rounded-lg">
                          <span className="text-red-400">❌ Error: {entry.message}</span>
                        </div>
                      )}

                      {entry.type === 'roast' && (
                        <div className="mt-2 space-y-3">
                          <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <span className="text-green-400">✅ Roast Complete</span>
                              <span className="text-gray-400">|</span>
                              <span className="text-blue-400">{entry.repoName}</span>
                              <span className="text-yellow-400">⭐ {entry.stars}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {entry.isAIRoast && (
                                <span className="text-xs font-medium text-purple-400 bg-purple-900/50 px-3 py-1 rounded-full border border-purple-600">
                                  🤖 AI Roast
                                </span>
                              )}
                              <button
                                onClick={() => shareRoast(entry)}
                                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                                title="Share this roast"
                              >
                                📤
                              </button>
                            </div>
                          </div>

                          <div className="space-y-1 pl-4">
                            {entry.roastLines.map((roast, index) => {
                              // Calculate delay: each line waits for previous ones to finish
                              // Assuming ~1.5 seconds per line (animation + pause)
                              const delay = index * 2000;

                              return (
                                <TypeAnimation
                                  key={`${entry.id}-${index}`}
                                  sequence={[
                                    delay, // Wait for previous lines
                                    `🔥 ${roast}`,
                                    1000 // Pause after this line
                                  ]}
                                  wrapper="div"
                                  speed={60}
                                  className="text-orange-300 text-sm"
                                  cursor={false}
                                  repeat={0}
                                />
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Current loading state */}
                  {isLoading && (
                    <div className="mb-6">
                      <div className="flex items-center mb-2">
                        <span className="text-green-400">➜</span>
                        <span className="text-blue-400 ml-2">~</span>
                        <span className="text-gray-400 ml-2">
                          git roast {repoUrl}
                          {isAiRoast && <span className="text-purple-400 ml-2">[AI-MODE]</span>}
                        </span>
                      </div>
                      <div className="mt-4">
                        <TypeAnimation
                          sequence={
                            isAiRoast
                              ? [
                                'Initializing AI roast engine...', 1000,
                                'Consulting the digital demons...', 1500,
                                'Calibrating sarcasm levels to maximum...', 1200,
                                'Preparing devastating critique...', 1000
                              ]
                              : [
                                'Connecting to GitHub API...', 800,
                                'Analyzing repository structure...', 1000,
                                'Scanning for embarrassing code...', 1200,
                                'Loading roast ammunition...', 900,
                                'Preparing brutal honesty...', 1100
                              ]
                          }
                          wrapper="div"
                          speed={50}
                          repeat={Infinity}
                          className="text-yellow-400"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}