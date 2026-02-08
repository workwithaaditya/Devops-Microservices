const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    username: string;
  };
}

export interface Post {
  id: string;
  content: string;
  userId: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export const authService = {
  async signup(email: string, username: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Signup failed');
    }

    return response.json();
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    return response.json();
  },
};

export const postService = {
  async createPost(content: string, token: string): Promise<{ post: Post }> {
    const response = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create post');
    }

    return response.json();
  },

  async getPosts(): Promise<{ posts: Post[] }> {
    const response = await fetch(`${API_URL}/posts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch posts');
    }

    return response.json();
  },
};

// Auth utilities
export const auth = {
  setToken(token: string) {
    localStorage.setItem('token', token);
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  removeToken() {
    localStorage.removeItem('token');
  },

  setUser(user: { id: string; email: string; username: string }) {
    localStorage.setItem('user', JSON.stringify(user));
  },

  getUser(): { id: string; email: string; username: string } | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  removeUser() {
    localStorage.removeItem('user');
  },

  logout() {
    this.removeToken();
    this.removeUser();
  },
};
