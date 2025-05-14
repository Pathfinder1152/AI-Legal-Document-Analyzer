import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Document, Annotation, getDocument } from '@/lib/api';
import { DocumentViewer } from '@/components/document/DocumentViewer';

export default function DocumentViewPage() {
  const router = useRouter();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnnotation, setSelectedAnnotation] = useState<Annotation | null>(null);

  // In a real implementation, you would get the document ID from the URL
  const documentId = typeof window !== 'undefined' ? 
    new URLSearchParams(window.location.search).get('id') : null;

  useEffect(() => {
    async function loadDocument() {
      if (!documentId) {
        setError('No document ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const doc = await getDocument(documentId);
        setDocument(doc);
        setError(null);
      } catch (err) {
        console.error('Error loading document:', err);
        setError('Failed to load document');
      } finally {
        setLoading(false);
      }
    }

    loadDocument();
  }, [documentId]);

  const handleAnnotationClick = (annotation: Annotation) => {
    setSelectedAnnotation(prevAnnotation => 
      prevAnnotation?.id === annotation.id ? null : annotation
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Document Viewer</h1>
      
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}
      
      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <DocumentViewer 
              document={document} 
              onAnnotationClick={handleAnnotationClick} 
            />
          </div>
          
          <div className="lg:col-span-1">
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 bg-white dark:bg-gray-950">
              <h3 className="text-lg font-semibold mb-4">Annotation Details</h3>
              
              {selectedAnnotation ? (
                <div>
                  <p className="text-sm mb-2">
                    <span className="font-medium">Type:</span> {selectedAnnotation.category}
                  </p>
                  <p className="text-sm mb-2">
                    <span className="font-medium">Text:</span> {selectedAnnotation.text}
                  </p>
                  {selectedAnnotation.description && (
                    <p className="text-sm">
                      <span className="font-medium">Description:</span> {selectedAnnotation.description}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Click on a highlighted section in the document to view details.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
