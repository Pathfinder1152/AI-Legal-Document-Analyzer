import axios from 'axios';
import { getCookie } from '@/utils/cookies';

/**
 * API client for the Legal Document Analyzer backend
 */

// Base URL for API requests
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Log API calls in development
const logApiCall = (url: string, method: string) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`API ${method} ${url}`);
  }
};

// Get CSRF token from cookies
function getCsrfToken(): string {
  const token = getCookie('csrftoken');
  return token || '';
}

// Add default headers for all requests
const defaultHeaders = {
  'Content-Type': 'application/json',
};

// Default fetch options with credentials
const defaultFetchOptions: RequestInit = {
  credentials: 'include', // Always send cookies
  headers: defaultHeaders,
};

// Add CSRF token to fetch options for POST requests
function addCsrfToken(options: RequestInit): RequestInit {
  const token = getCsrfToken();
  const headers = {
    ...options.headers,
    'X-CSRFToken': token,
  };
  
  return {
    ...options,
    headers,
  };
}

// Helper function to handle API errors
async function handleApiError(response: Response, errorContext: string): Promise<never> {
  const errorText = await response.text();
  console.error(`${errorContext} error response:`, errorText);
  
  // Handle authentication errors
  if (response.status === 401) {
    // Handle authentication error - redirect to login
    window.location.href = '/auth/login?returnUrl=' + encodeURIComponent(window.location.pathname);
    throw new Error('Authentication required');
  }
  
  // Handle CSRF errors
  if (response.status === 403 && errorText.includes('CSRF')) {
    console.error('CSRF token error - will attempt to refresh the page to get a new token');
    // Optional: refresh the page to get a new CSRF token
    // window.location.reload();
    throw new Error('CSRF verification failed. Please try again.');
  }
  
  try {
    const errorData = JSON.parse(errorText);
    throw new Error(errorData.error || `Failed: ${errorContext}`);
  } catch (e) {
    throw new Error(`Server error: ${errorText}`);
  }
}

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: defaultHeaders,
  withCredentials: true, // Important for cookies/auth
});

// Types
export interface UploadResponse {
  documentId: string;
  message: string;
}

export interface DocumentStatus {
  documentId: string;
  status: 'uploading' | 'processing' | 'analyzed' | 'error';
}

export interface Annotation {
  id: string;
  text: string;
  category: 'legal_term' | 'date' | 'party' | 'obligation' | 'condition' | 'other';
  startIndex: number;
  endIndex: number;
  description?: string;
  clause_type?: string;
  clause_confidence?: number;
}

export interface Document {
  id: string;
  name: string;
  status: 'uploading' | 'processing' | 'analyzed' | 'error';
  content?: string;
  annotations?: Annotation[];
  user_id?: string;
  upload_date?: string;
  file_type?: string;
  file_size?: number;
}

export interface StoredChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  selected_text?: string;
  sources?: ChatSource[];
  timestamp: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  selectedText?: string;
  sources?: ChatSource[];
}

export interface ChatSource {
  title: string;
  url: string;
  snippet: string;
}

export interface ChatResponse {
  response: string;
  sources: ChatSource[];
}

export interface SimilarChunk {
  score: number;
  text: string;
  document_id: string;
  document_name: string;
  chunk_index: number;
}

export interface SearchResponse {
  results: SimilarChunk[];
}

export interface EmbeddingStatus {
  documentId: string;
  isEmbedded: boolean;
}

// API functions
export async function uploadDocument(file: File): Promise<UploadResponse> {
  const url = `${API_BASE_URL}/upload/`;
  logApiCall(url, 'POST');

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(url, addCsrfToken({
      method: 'POST',
      body: formData,
      credentials: 'include', // Include authentication cookies
    }));

    if (!response.ok) {
      await handleApiError(response, 'Upload document');
    }

    return response.json();
  } catch (error) {
    console.error('Upload document error:', error);
    throw error;
  }
}

export async function getDocumentStatus(documentId: string): Promise<DocumentStatus> {
  const url = `${API_BASE_URL}/documents/${documentId}/status/`;
  logApiCall(url, 'GET');

  try {
    const response = await fetch(url, defaultFetchOptions);

    if (!response.ok) {
      await handleApiError(response, 'Get document status');
    }

    return response.json();
  } catch (error) {
    console.error('Get document status error:', error);
    throw error;
  }
}

export async function getDocument(documentId: string): Promise<Document> {
  const url = `${API_BASE_URL}/documents/${documentId}/`;
  logApiCall(url, 'GET');

  try {
    const response = await fetch(url, defaultFetchOptions);

    if (!response.ok) {
      await handleApiError(response, 'Get document');
    }

    return response.json();
  } catch (error) {
    console.error('Get document error:', error);
    throw error;
  }
}

export async function sendChatMessage(
  message: string,
  documentId?: string,
  selectedText?: string,
  history: ChatMessage[] = []
): Promise<ChatResponse> {
  const url = `${API_BASE_URL}/chat/`;
  logApiCall(url, 'POST');

  try {
    const response = await fetch(url, addCsrfToken({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        documentId,
        selectedText,
        history,
      }),
      credentials: 'include', // Include authentication cookies
    }));

    if (!response.ok) {
      await handleApiError(response, 'Send chat message');
    }

    return response.json();
  } catch (error) {
    console.error('Send chat message error:', error);
    throw error;
  }
}

export async function embedDocument(documentId: string): Promise<{ success: boolean; message: string }> {
  const url = `${API_BASE_URL}/search/embed/${documentId}/`;
  logApiCall(url, 'POST');

  try {
    const response = await fetch(url, addCsrfToken({
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }));

    if (!response.ok) {
      await handleApiError(response, 'Embed document');
    }

    return await response.json();
  } catch (error) {
    console.error('Error embedding document:', error);
    throw error;
  }
}

export async function checkEmbeddingStatus(documentId: string): Promise<{ status: string; message: string; isEmbedded: boolean }> {
  const url = `${API_BASE_URL}/search/status/${documentId}/`;
  logApiCall(url, 'GET');

  try {
    const response = await fetch(url, defaultFetchOptions);

    if (!response.ok) {
      await handleApiError(response, 'Check embedding status');
    }

    const data = await response.json();
    return {
      ...data,
      isEmbedded: data.status === 'embedded' || data.status === 'complete'
    };
  } catch (error) {
    console.error('Error checking embedding status:', error);
    throw error;
  }
}

export async function searchSimilarContent(
  documentId: string,
  query: string
): Promise<{ results: SimilarChunk[] }> {
  // According to the server error message, the correct URL is '/api/search/search/<uuid:document_id>/'
  const url = `${API_BASE_URL}/search/search/${documentId}/`;
  logApiCall(url, 'POST');

  try {
    // Create a separate request options object - don't use addCsrfToken to avoid issues
    const csrfToken = getCsrfToken();
    const requestOptions: RequestInit = {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CSRFToken': csrfToken
      },
      body: JSON.stringify({ query })
    };
    
    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      await handleApiError(response, 'Search similar content');
    }

    return await response.json();
  } catch (error) {
    console.error('Error searching similar content:', error);
    throw error;
  }
}

export async function getUserDocuments(): Promise<Document[]> {
  const url = `${API_BASE_URL}/documents/user/`;
  logApiCall(url, 'GET');

  try {
    const response = await fetch(url, defaultFetchOptions);

    if (!response.ok) {
      await handleApiError(response, 'Get user documents');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user documents:', error);
    throw error;
  }
}

export async function getChatHistory(documentId: string): Promise<StoredChatMessage[]> {
  const url = `${API_BASE_URL}/documents/${documentId}/chat-history/`;
  logApiCall(url, 'GET');

  try {
    const response = await fetch(url, defaultFetchOptions);

    if (!response.ok) {
      await handleApiError(response, 'Get chat history');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching chat history:', error);
    throw error;
  }
}