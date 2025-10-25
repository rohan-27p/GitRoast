'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { TypeAnimation } from 'react-type-animation';

export default function SharedRoast() {
  const { shareId } = useParams();
  const [roast, setRoast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSharedRoast = async () => {
      try {
        const res = await fetch(`/api/share?id=${shareId}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch shared roast');
        }

        setRoast(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (shareId) {
      fetchSharedRoast();
    }
  }, [shareId]);

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Share link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-white font-mono">Loading shared roast...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="text-6xl mb-4">💀</div>
          <h1 className="text-3xl font-bold text-white mb-4">Roast Not Found</h1>
          <p className="text-gray-400 mb-6">
            This roast has vanished into the digital void. Maybe it was too savage for the internet to handle.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-medium rounded-lg transition-all duration-200"
          >
            🔥 Create Your Own Roast
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-black/50 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">🔥</span>
              <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                GitRoast
              </span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={copyShareLink}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                📤 Copy Link
              </button>
              <Link
                href="/gallery"
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                🖼️ Gallery
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                Shared Roast
              </span>
            </h1>
            <p className="text-gray-400 text-lg">
              Someone thought this roast was worth sharing. Prepare for digital carnage.
            </p>
          </div>

          {/* Roast Terminal */}
          <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-800/50 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-sm text-gray-400 font-mono">shared-roast-terminal</span>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>👁️ {roast.views} views</span>
              </div>
            </div>
            
            <div className="p-6 font-mono text-left">
              {/* Command */}
              <div className="flex items-center mb-4">
                <span className="text-green-400">➜</span>
                <span className="text-blue-400 ml-2">~</span>
                <span className="text-gray-400 ml-2">
                  git roast {roast.repoUrl || roast.repoName}
                  {roast.isAIRoast && <span className="text-purple-400 ml-2">[AI-MODE]</span>}
                </span>
              </div>

              {/* Roast Result */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-green-400">✅ Roast Complete</span>
                    <span className="text-gray-400">|</span>
                    <span className="text-blue-400">{roast.repoName}</span>
                    <span className="text-yellow-400">⭐ {roast.stars}</span>
                  </div>
                  {roast.isAIRoast && (
                    <span className="text-xs font-medium text-purple-400 bg-purple-900/50 px-3 py-1 rounded-full border border-purple-600">
                      🤖 AI Roast
                    </span>
                  )}
                </div>
                
                <div className="space-y-2 pl-4">
                  {roast.roastLines.map((line, index) => (
                    <TypeAnimation
                      key={index}
                      sequence={[
                        index * 2000, // Delay for sequential animation
                        `🔥 ${line}`,
                        1000
                      ]}
                      wrapper="div"
                      speed={60}
                      className="text-orange-300 text-sm"
                      cursor={false}
                      repeat={0}
                    />
                  ))}
                </div>
              </div>

              {/* Share Actions */}
              <div className="mt-8 pt-4 border-t border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="text-gray-500 text-sm">
                    Roasted on {new Date(roast.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center space-x-4">
                    <Link
                      href="/"
                      className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 rounded-lg transition-all duration-200"
                    >
                      🔥 Roast Your Own Repo
                    </Link>
                    <Link
                      href="/gallery"
                      className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg transition-colors"
                    >
                      🖼️ View Gallery
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}