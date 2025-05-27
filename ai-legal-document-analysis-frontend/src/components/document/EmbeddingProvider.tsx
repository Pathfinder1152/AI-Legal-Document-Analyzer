import React, { useState, useEffect } from 'react';
import { embedDocument, checkEmbeddingStatus } from '@/lib/api';

interface EmbeddingProviderProps {
  documentId: string | null;
  children: (props: {
    isEmbedded: boolean;
    isEmbedding: boolean;
    triggerEmbedding: () => Promise<void>;
    error: string | null;
  }) => React.ReactNode;
}

/**
 * A component that manages document embedding status and provides
 * embedding functionality to its children
 */
export const EmbeddingProvider: React.FC<EmbeddingProviderProps> = ({
  documentId,
  children
}) => {
  const [isEmbedded, setIsEmbedded] = useState(false);
  const [isEmbedding, setIsEmbedding] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Check embedding status on mount
  useEffect(() => {
    async function checkStatus() {
      if (!documentId) {
        setIsCheckingStatus(false);
        return;
      }
      
      try {
        setIsCheckingStatus(true);
        const status = await checkEmbeddingStatus(documentId);
        setIsEmbedded(status.isEmbedded);
      } catch (err) {
        console.error('Error checking embedding status:', err);
        // If we can't check, assume not embedded
        setIsEmbedded(false);
      } finally {
        setIsCheckingStatus(false);
      }
    }
    
    checkStatus();
  }, [documentId]);
  
  const triggerEmbedding = async () => {
    if (!documentId || isEmbedding) return;
    
    try {
      setIsEmbedding(true);
      setError(null);
      
      const response = await embedDocument(documentId);
      console.log('Document embedded:', response);
      
      setIsEmbedded(true);
      
      // Could save to localStorage to remember embedding status
      // localStorage.setItem(`doc-embedded-${documentId}`, 'true');
      
    } catch (err) {
      console.error('Error embedding document:', err);
      setError(err instanceof Error ? err.message : 'Failed to embed document');
    } finally {
      setIsEmbedding(false);
    }
  };
    return <>{children({
    isEmbedded,
    isEmbedding: isEmbedding || isCheckingStatus,
    triggerEmbedding,
    error
  })}</>;
};
