// /src/app/dashboard/page.js
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'; // Use next/navigation for App Router
import Link from 'next/link';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // State for our data
  const [repos, setRepos] = useState([]);
  const [roasts, setRoasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. Handle Authentication
    if (status === 'loading') {
      return; // Still checking, do nothing yet
    }

    if (status === 'unauthenticated') {
      // Not logged in, redirect to homepage
      router.push('/');
      return;
    }

    // 2. Fetch data if authenticated
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fire both requests at the same time
        const [repoRes, roastRes] = await Promise.all([
          fetch('/api/user/repos'),
          fetch('/api/user/roasts'),
        ]);

        if (!repoRes.ok || !roastRes.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const repoData = await repoRes.json();
        const roastData = await roastRes.json();

        setRepos(repoData);
        setRoasts(roastData);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

  }, [status, router]); // Re-run this effect when auth status changes

  // 3. Show Loading/Error states
  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white font-mono">
        Loading Dashboard...
      </div>
    );
  }

  // We should have been redirected, but this is a fallback
  if (status === 'unauthenticated') {
    return null;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-red-500 font-mono">
        Error: {error}
      </div>
    );
  }

  // 4. Render the full dashboard
  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <nav className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold font-mono">My Dashboard</h1>
        <Link href="/" className="px-4 py-2 text-sm font-medium text-black bg-white rounded-md hover:bg-gray-200">
          &larr; Back to Roast
        </Link>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Section 1: My Repositories */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">My Public Repositories</h2>
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 max-h-[60vh] overflow-y-auto">
            {repos.length === 0 ? (
              <p className="text-gray-400">No public repositories found on your GitHub.</p>
            ) : (
              <ul className="space-y-3">
                {repos.map((repo) => (
                  <li key={repo.id} className="flex justify-between items-center p-3 bg-gray-800 rounded-md">
                    <span className="font-mono truncate" title={repo.full_name}>{repo.full_name}</span>
                    <button
                      onClick={() => {
                        // Simple "Roast it!" copies the URL and sends you home
                        navigator.clipboard.writeText(repo.url);
                        router.push('/');
                      }}
                      className="text-red-500 hover:text-red-400 bg-transparent border-none p-0 ml-4 flex-shrink-0"
                    >
                      Roast it!
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Section 2: My Roast History */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">My Roast History</h2>
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 max-h-[60vh] overflow-y-auto">
            {roasts.length === 0 ? (
              <p className="text-gray-400">You haven&apos;t roasted any repos yet. Go roast one!</p>
            ) : (
              <ul className="space-y-4">
                {roasts.map((roast) => (
                  <li key={roast._id} className="p-4 bg-gray-800 rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold font-mono text-lg">{roast.repoName}</span>
                      <span className={`text-xs font-medium ${roast.isAIRoast ? 'text-purple-400' : 'text-gray-400'}`}>
                        {roast.isAIRoast ? 'AI Roast' : 'Std. Roast'}
                      </span>
                    </div>
                    <ul className="list-disc list-inside pl-2 space-y-1 text-sm text-gray-300">
                      {roast.roastLines.map((line, index) => (
                        <li key={index}>{line}</li>
                      ))}
                    </ul>
                    <p className="text-xs text-gray-500 mt-3 text-right">
                      {new Date(roast.createdAt).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}