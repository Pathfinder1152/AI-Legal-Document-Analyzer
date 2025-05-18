'use client';

import { useState, useEffect } from 'react';
import { getChatHistory, StoredChatMessage } from '@/lib/api';

interface UseChatHistoryProps {
  documentId: string | null;
  enabled?: boolean;
}

export function useChatHistory({ documentId, enabled = true }: UseChatHistoryProps) {
  const [history, setHistory] = useState<StoredChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to load chat history
  const loadChatHistory = async () => {
    if (!documentId || !enabled) return;
    
    try {
      setLoading(true);
      const chatHistory = await getChatHistory(documentId);
      setHistory(chatHistory);
      setError(null);
    } catch (err: any) {
      console.error('Error loading chat history:', err);
      setError(err.message || 'Failed to load chat history');
    } finally {
      setLoading(false);
    }
  };

  // Load chat history when document ID changes or enabled changes
  useEffect(() => {
    if (documentId && enabled) {
      loadChatHistory();
    }
  }, [documentId, enabled]);

  return {
    history,
    loading,
    error,
    refresh: loadChatHistory
  };
}
