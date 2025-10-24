'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

// Navigation Component
function DashboardNavbar({ session }) {
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
            <Link href="/dashboard" className="text-white font-medium">
              Dashboard
            </Link>
            <Link href="/gallery" className="text-gray-300 hover:text-white transition-colors">
              Gallery
            </Link>
          </div>

          {session && (
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
          )}
        </div>
      </div>
    </nav>
  );
}

// Stats Card Component
function StatsCard({ title, value, icon, color = "text-white" }) {
  return (
    <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className={`text-2xl font-bold ${color} mt-1`}>{value}</p>
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
    </div>
  );
}

// Repository Card Component
function RepoCard({ repo, onRoast }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-mono font-semibold text-white truncate group-hover:text-orange-400 transition-colors">
            {repo.name}
          </h3>
          <p className="text-sm text-gray-400 mt-1">{repo.full_name}</p>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <span className="text-yellow-400">⭐</span>
          <span className="text-sm text-gray-300">{repo.stargazers_count}</span>
        </div>
      </div>

      {repo.description && (
        <p className="text-gray-300 text-sm mb-4 line-clamp-2">{repo.description}</p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-xs text-gray-400">
          {repo.language && (
            <span className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>{repo.language}</span>
            </span>
          )}
          <span>Updated {formatDate(repo.updated_at)}</span>
        </div>

        <button
          onClick={() => onRoast(repo)}
          className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 rounded-lg transition-all duration-200 transform hover:scale-105"
        >
          🔥 Roast it!
        </button>
      </div>
    </div>
  );
}

// Roast History Card Component
function RoastCard({ roast }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const shareRoast = async () => {
    try {
      const shareUrl = `${window.location.origin}/share/${roast.shareId || 'temp'}`;
      await navigator.clipboard.writeText(shareUrl);
      // You could add a toast notification here
      alert('Share link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy share link:', err);
    }
  };

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <h3 className="font-mono font-semibold text-white">{roast.repoName}</h3>
          <div className="flex items-center space-x-2">
            <span className="text-yellow-400">⭐</span>
            <span className="text-sm text-gray-300">{roast.stars || 0}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {roast.isAIRoast && (
            <span className="text-xs font-medium text-purple-400 bg-purple-900/50 px-3 py-1 rounded-full border border-purple-600">
              🤖 AI Roast
            </span>
          )}
          <button
            onClick={shareRoast}
            className="text-blue-400 hover:text-blue-300 transition-colors p-1"
            title="Share roast"
          >
            📤
          </button>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {roast.roastLines.map((line, index) => (
          <p key={index} className="text-orange-300 text-sm font-mono">
            🔥 {line}
          </p>
        ))}
      </div>

      <p className="text-xs text-gray-500 text-right">
        {formatDate(roast.createdAt)}
      </p>
    </div>
  );
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [repos, setRepos] = useState([]);
  const [roasts, setRoasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('repos');

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      router.push('/');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
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
  }, [status, router]);

  const handleRoastRepo = (repo) => {
    navigator.clipboard.writeText(repo.html_url || repo.url);
    router.push('/');
  };

  // Loading state
  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <DashboardNavbar session={session} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-white font-mono">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <DashboardNavbar session={session} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-6xl mb-4">💥</div>
            <h2 className="text-2xl font-bold text-white mb-2">Oops! Something went wrong</h2>
            <p className="text-red-400 font-mono">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
  const totalRoasts = roasts.length;
  const aiRoasts = roasts.filter(roast => roast.isAIRoast).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <DashboardNavbar session={session} />

      <main className="pt-24 pb-12">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold mb-4">
              <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                Your Dashboard
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Track your repositories, roast history, and coding carnage all in one place.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <StatsCard
              title="Total Repositories"
              value={repos.length}
              icon="📁"
              color="text-blue-400"
            />
            <StatsCard
              title="Total Stars"
              value={totalStars}
              icon="⭐"
              color="text-yellow-400"
            />
            <StatsCard
              title="Roasts Created"
              value={totalRoasts}
              icon="🔥"
              color="text-orange-400"
            />
            <StatsCard
              title="AI Roasts"
              value={aiRoasts}
              icon="🤖"
              color="text-purple-400"
            />
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-xl p-1">
              <button
                onClick={() => setActiveTab('repos')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${activeTab === 'repos'
                    ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                  }`}
              >
                📁 My Repositories ({repos.length})
              </button>
              <button
                onClick={() => setActiveTab('roasts')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${activeTab === 'roasts'
                    ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                  }`}
              >
                🔥 Roast History ({roasts.length})
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-6xl mx-auto">
            {activeTab === 'repos' && (
              <div>
                {repos.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">📁</div>
                    <h3 className="text-2xl font-bold text-white mb-2">No repositories found</h3>
                    <p className="text-gray-400 mb-6">
                      We couldn't find any public repositories on your GitHub account.
                    </p>
                    <Link
                      href="/"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-medium rounded-lg transition-all duration-200"
                    >
                      🔥 Start Roasting
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {repos.map((repo) => (
                      <RepoCard
                        key={repo.id}
                        repo={repo}
                        onRoast={handleRoastRepo}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'roasts' && (
              <div>
                {roasts.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">🔥</div>
                    <h3 className="text-2xl font-bold text-white mb-2">No roasts yet</h3>
                    <p className="text-gray-400 mb-6">
                      You haven't roasted any repositories yet. Time to start the carnage!
                    </p>
                    <Link
                      href="/"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-medium rounded-lg transition-all duration-200"
                    >
                      🔥 Roast Your First Repo
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {roasts.map((roast) => (
                      <RoastCard key={roast._id} roast={roast} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}