'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { postService, auth } from '@/lib/api';
import Link from 'next/link';

export default function CreatePostPage() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = auth.getToken();
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = auth.getToken();
      if (!token) {
        router.push('/login');
        return;
      }

      await postService.createPost(content, token);
      router.push('/feed');
    } catch (err: any) {
      setError(err.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <nav className="nav">
        <div className="nav-content">
          <h2>Create Post</h2>
          <div className="nav-links">
            <Link href="/feed">Back to Feed</Link>
          </div>
        </div>
      </nav>

      <div className="container">
        <div className="card">
          <h1>Create a New Post</h1>
          {error && <div className="error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="content">What's on your mind?</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={6}
                maxLength={500}
                placeholder="Share your thoughts..."
              />
              <small style={{ color: '#666' }}>
                {content.length}/500 characters
              </small>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Posting...' : 'Post'}
              </button>
              <Link href="/feed">
                <button type="button" className="btn btn-secondary">
                  Cancel
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
