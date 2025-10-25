'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

// Gallery Card Component
function RoastGalleryCard({ roast }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const shareRoast = async () => {
    try {
      const shareUrl = `${window.location.origin}/share/${roast.shareId}`;
      await navigator.clipboard.writeText(shareUrl);
      alert('Share link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy share link:', err);
    }
  };

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all duration-200 group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <h3 className="font-mono font-semibold text-white group-hover:text-orange-400 transition-colors">
            {roast.repoName}
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-yellow-400">⭐</span>
            <span className="text-sm text-gray-300">{roast.stars || 0}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {roast.isAIRoast && (
            <span className="text-xs font-medium text-purple-400 bg-purple-900/50 px-2 py-1 rounded-full border border-purple-600">
              🤖 AI
            </span>
          )}
          <span className="text-xs text-gray-500">👁️ {roast.views || 0}</span>
        </div>
      </div>
      
      <div className="space-y-2 mb-4 max-h-32 overflow-hidden">
        {roast.roastLines.slice(0, 3).map((line, index) => (
          <p key={index} className="text-orange-300 text-sm font-mono truncate">
            🔥 {line}
          </p>
        ))}
        {roast.roastLines.length > 3 && (
          <p className="text-gray-500 text-xs">
            +{roast.roastLines.length - 3} more roasts...
          </p>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {formatDate(roast.createdAt)}
        </span>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={shareRoast}
            className="text-blue-400 hover:text-blue-300 transition-colors p-1"
            title="Copy share link"
          >
            📤
          </button>
          <Link
            href={`/share/${roast.shareId}`}
            className="px-3 py-1 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 rounded-md transition-all duration-200"
          >
            View Roast
          </Link>
        </div>
      </div>
    </div>
  );
}

// Navigation Component
function GalleryNavbar() {
  const { data: session } = useSession();

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
            {session && (
              <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                Dashboard
              </Link>
            )}
            <Link href="/gallery" className="text-white font-medium">
              Gallery
            </Link>
          </div>

          <Link
            href="/"
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 rounded-lg transition-colors"
          >
            🔥 Create Roast
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default function Gallery() {
  const [roasts, setRoasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const fetchGalleryRoasts = async (page = 1) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/gallery?page=${page}&limit=12`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch gallery roasts');
      }

      setRoasts(data.roasts);
      setPagination(data.pagination);
      setCurrentPage(page);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryRoasts(1);
  }, []);

  const handlePageChange = (page) => {
    fetchGalleryRoasts(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && roasts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <GalleryNavbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-white font-mono">Loading gallery of digital carnage...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <GalleryNavbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-6xl mb-4">💥</div>
            <h2 className="text-2xl font-bold text-white mb-2">Gallery Exploded</h2>
            <p className="text-red-400 font-mono">{error}</p>
            <button
              onClick={() => fetchGalleryRoasts(1)}
              className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <GalleryNavbar />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
              <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                Roast Gallery
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              A curated collection of the most savage repository roasts. Witness the digital carnage.
            </p>
          </div>

          {/* Stats */}
          {pagination.totalCount > 0 && (
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-4 bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-xl px-6 py-3">
                <span className="text-gray-400">🔥 Total Roasts:</span>
                <span className="text-white font-bold">{pagination.totalCount}</span>
              </div>
            </div>
          )}

          {/* Gallery Grid */}
          {roasts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🖼️</div>
              <h3 className="text-2xl font-bold text-white mb-2">No roasts in the gallery yet</h3>
              <p className="text-gray-400 mb-6">
                Be the first to share a roast and start the digital carnage!
              </p>
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-medium rounded-lg transition-all duration-200"
              >
                🔥 Create First Roast
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {roasts.map((roast) => (
                  <RoastGalleryCard key={roast.shareId} roast={roast} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!pagination.hasPrev || loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    ← Previous
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          disabled={loading}
                          className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                            page === currentPage
                              ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white'
                              : 'text-gray-300 hover:text-white hover:bg-gray-800'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!pagination.hasNext || loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}