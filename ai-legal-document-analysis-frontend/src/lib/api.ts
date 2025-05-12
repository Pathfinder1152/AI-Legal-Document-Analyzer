/**
 * API client for the Legal Document Analyzer backend
 */

// API base URL - adjust based on your environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// For debugging
const logApiCall = (url: string, method: string) => {
  console.log(`API ${method} call to: ${url}`);
};

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
}

export interface Document {
  id: string;
  name: string;
  status: 'uploading' | 'processing' | 'analyzed' | 'error';
  content?: string;
  annotations?: Annotation[];
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

// API functions
export async function uploadDocument(file: File): Promise<UploadResponse> {
  const url = `${API_BASE_URL}/upload/`;
  logApiCall(url, 'POST');

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Upload error response:', errorText);
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.error || 'Failed to upload document');
      } catch (e) {
        // If it's not valid JSON, return the text
        throw new Error(`Server error: ${errorText}`);
      }
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
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Status error response:', errorText);
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.error || 'Failed to get document status');
      } catch (e) {
        // If it's not valid JSON, return the text
        throw new Error(`Server error: ${errorText}`);
      }
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
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Get document error response:', errorText);
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.error || 'Failed to get document');
      } catch (e) {
        // If it's not valid JSON, return the text
        throw new Error(`Server error: ${errorText}`);
      }
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
    const response = await fetch(url, {
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
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Chat error response:', errorText);
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.error || 'Failed to get chat response');
      } catch (e) {
        // If it's not valid JSON, return the text
        throw new Error(`Server error: ${errorText}`);
      }
    }

    return response.json();
  } catch (error) {
    console.error('Send chat message error:', error);
    throw error;
  }
} 