'use client';
import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { TypeAnimation } from 'react-type-animation';
import Image from "next/image";

function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <Image
          src={session.user.image}
          alt={session.user.name}
          width={40} 
          height={40}
          className="w-10 h-10 rounded-full"
        />
        <span className="text-white">Welcome, {session.user.name}</span>
        <button
          onClick={() => signOut()}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
        >
          Sign Out
        </button>
        <a 
          href="/dashboard"
          className="px-4 py-2 text-sm font-medium text-black bg-white rounded-md hover:bg-gray-200"
        >
          Dashboard
        </a>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn('github')}
      className="px-4 py-2 font-medium text-white bg-gray-700 rounded-md hover:bg-gray-600"
    >
      Sign in with GitHub
    </button>
  );
}

// The main page component
export default function Home() {
  const [repoUrl, setRepoUrl] = useState('');
  const [roastResult, setRoastResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setRoastResult(null);

    try {
      const res = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setRoastResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-8 text-white bg-black">
      <nav className="self-stretch w-full">
        <div className="container flex items-center justify-between p-4 mx-auto">
          <h1 className="text-2xl font-bold font-mono">GitRoast 🔥</h1>
          <AuthButton />
        </div>
      </nav>

      <main className="flex flex-col items-center justify-center flex-1 w-full max-w-2xl px-4 text-center">
        <h2 className="text-5xl font-extrabold">Your Code&apos;s Worst Critic.</h2>
        <p className="mt-4 text-lg text-gray-400">
          Paste a public GitHub repo URL. We&apos;ll analyze it and tell you what we *really* think.
        </p>

        <form onSubmit={handleSubmit} className="w-full mt-10">
          <input
            type="text"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/owner/repo"
            className="w-full p-4 text-lg text-white bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full p-4 mt-4 text-lg font-bold text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-gray-500"
          >
            {isLoading ? 'Roasting...' : 'Roast Me!'}
          </button>
        </form>

        <div className="w-full p-4 mt-10 font-mono text-left bg-gray-900 border border-gray-700 rounded-md min-h-[200px]">
          <span className="text-gray-500">{'>'} </span>
          {isLoading && (
            <TypeAnimation
              sequence={[
                'Connecting to GitHub...', 1000,
                'Analyzing your... "code"...', 1000,
                'Looking for security flaws (should be easy)...', 1000,
                'Calibrating sarcasm levels...', 1500,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
              className="text-yellow-400"
            />
          )}
          {error && (
            <span className="text-red-500">Error: {error}</span>
          )}
          {roastResult && (
            <div>
              <p className="text-green-400">
                Successfully roasted {roastResult.repoName} ({roastResult.stars} stars)
              </p>
              <TypeAnimation
                sequence={
                  roastResult.roastLines
                    .map(roast => [`- ${roast}`, 1500])
                    .flat()
                }
                wrapper="div"
                speed={70}
                className="mt-2 space-y-2 whitespace-pre-line"
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}