'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { postService, auth, Post } from '@/lib/api';
import Link from 'next/link';

export default function FeedPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<{ username: string } | null>(null);

  useEffect(() => {
    const token = auth.getToken();
    const currentUser = auth.getUser();

    if (!token) {
      router.push('/login');
      return;
    }

    setUser(currentUser);
    fetchPosts();
  }, [router]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postService.getPosts();
      setPosts(response.posts);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    auth.logout();
    router.push('/login');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <nav className="nav">
        <div className="nav-content">
          <h2>Social Media Feed</h2>
          <div className="nav-links">
            {user && <span>Welcome, {user.username}!</span>}
            <Link href="/create-post">Create Post</Link>
            <button onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container">
        {error && <div className="error">{error}</div>}

        {loading ? (
          <p>Loading posts...</p>
        ) : posts.length === 0 ? (
          <div className="empty">
            <p>No posts yet. Be the first to create one!</p>
            <Link href="/create-post">
              <button className="btn btn-primary" style={{ marginTop: '1rem' }}>
                Create Post
              </button>
            </Link>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="post">
              <div className="post-header">
                <span className="post-author">@{post.username}</span>
                <span className="post-date">{formatDate(post.createdAt)}</span>
              </div>
              <div className="post-content">{post.content}</div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
