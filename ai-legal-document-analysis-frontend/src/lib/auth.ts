/**
 * Authentication-related API functions
 */

// API base URL - adjust based on your environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Authentication Types
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  csrftoken: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface SessionResponse {
  isAuthenticated: boolean;
  user?: User;
}

// Types for profile update
export interface ProfileUpdateData {
  first_name?: string;
  last_name?: string;
  email?: string;
  current_password?: string;
  new_password?: string;
}

// User registration 
export async function registerUser(
  username: string, 
  email: string,
  password: string,
  passwordConfirm: string,
  firstName: string,
  lastName: string
): Promise<RegisterResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/register/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Important for cookies
    body: JSON.stringify({
      username,
      email,
      password,
      password_confirm: passwordConfirm,
      first_name: firstName,
      last_name: lastName,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Registration failed');
  }

  return response.json();
}

// User login
export async function loginUser(
  username: string, 
  password: string
): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Important for cookie-based sessions
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Login failed');
  }

  return response.json();
}

// User logout
export async function logoutUser(): Promise<{ message: string }> {
  // First, refresh the CSRF token to ensure it's valid
  const csrfToken = await getCsrfToken();
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Logout failed' }));
      throw new Error(errorData.message || `Logout failed with status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}

// Get current user session
export async function getCurrentSession(): Promise<SessionResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/session/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    return { isAuthenticated: false };
  }

  return response.json();
}

// Get user details
export async function getUserDetails(): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/auth/user/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user details');
  }

  return response.json();
}

// Update user profile
export async function updateUserProfile(data: ProfileUpdateData): Promise<User> {
  const csrfToken = await getCsrfToken();
  
  const response = await fetch(`${API_BASE_URL}/auth/profile/update/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken,
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update profile');
  }

  return response.json();
}

// Get CSRF token
export async function getCsrfToken(): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/csrf/`, {
      method: 'GET',
      credentials: 'include', // Important for cookie-based CSRF
      cache: 'no-store', // Prevent caching of CSRF tokens
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch CSRF token: ${response.status}`);
    }

    const data = await response.json();
    return data.csrftoken;
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    throw error;
  }
}
