import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Document, Annotation, getDocument, searchSimilarContent, SimilarChunk } from '@/lib/api';
import { DocumentViewer } from '@/components/document/DocumentViewer';
import { SimilarContent } from '@/components/document/SimilarContent';
import { EmbeddingProvider } from '@/components/document/EmbeddingProvider';
import { Loader } from '@/components/ui/loader';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SemanticSearch } from '@/components/document/SemanticSearch';

export default function DocumentViewPage() {
  const router = useRouter();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnnotation, setSelectedAnnotation] = useState<Annotation | null>(null);
  const [similarContent, setSimilarContent] = useState<Array<SimilarChunk>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState<string>('');
  const [highlightText, setHighlightText] = useState<string | null>(null);

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
  
  const searchForSimilarContent = async (text: string, isEmbedded: boolean) => {
    if (!documentId || !text || !isEmbedded) return;
    
    try {
      setIsSearching(true);
      setSearchText(text);
      const response = await searchSimilarContent(documentId, text);
      setSimilarContent(response.results);
    } catch (err) {
      console.error('Error searching similar content:', err);
      setSimilarContent([]);
    } finally {
      setIsSearching(false);
    }
  };
    const handleChunkClick = (text: string, isEmbedded: boolean) => {
    // Highlight the text and scroll to it in the document
    setHighlightText(text);
    
    // Clear the highlight after a few seconds
    setTimeout(() => {
      setHighlightText(null);
    }, 5000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Document Viewer</h1>
      
      {loading && (
        <div className="flex justify-center items-center h-64">
          <Loader size="lg" />
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}
      
      {!loading && !error && document && (
        <EmbeddingProvider documentId={documentId}>
          {({ isEmbedded, isEmbedding, triggerEmbedding, error: embedError }) => (
            <>
              {!isEmbedded && document.status === 'analyzed' && (
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex flex-col sm:flex-row items-center justify-between">
                    <p className="text-sm text-blue-700 dark:text-blue-300 mb-3 sm:mb-0">
                      Enable semantic search to find similar content within this document
                    </p>
                    <Button 
                      onClick={triggerEmbedding}
                      disabled={isEmbedding}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isEmbedding ? (
                        <>
                          <Loader size="sm" className="mr-2" />
                          Processing...
                        </>
                      ) : 'Enable Semantic Search'}
                    </Button>
                  </div>
                  
                  {embedError && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      Error: {embedError}
                    </p>
                  )}
                </div>
              )}
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">                  <DocumentViewer 
                    document={document}
                    searchText={highlightText}
                    onAnnotationClick={(annotation) => {
                      handleAnnotationClick(annotation);
                      if (isEmbedded) {
                        searchForSimilarContent(annotation.text, isEmbedded);
                      }
                    }} 
                  />
                </div>
                  <div className="lg:col-span-1 space-y-6">
                  <Tabs defaultValue="annotations" className="w-full">
                    <TabsList className="w-full">
                      <TabsTrigger value="annotations" className="flex-1">Annotations</TabsTrigger>
                      <TabsTrigger value="search" className="flex-1">Semantic Search</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="annotations" className="pt-4">
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
                              <p className="text-sm mb-2">
                                <span className="font-medium">Description:</span> {selectedAnnotation.description}
                              </p>
                            )}
                            {selectedAnnotation.clause_type && selectedAnnotation.clause_type !== 'unknown' && (
                              <div className="text-sm mb-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-100 dark:border-blue-800">
                                <p className="font-medium text-blue-700 dark:text-blue-300">Clause Classification:</p>
                                <p className="mt-1">{selectedAnnotation.clause_type.replace('_', ' ')}</p>
                                {selectedAnnotation.clause_confidence && (
                                  <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                    <div 
                                      className="bg-blue-600 h-2.5 rounded-full" 
                                      style={{ width: `${Math.round(selectedAnnotation.clause_confidence * 100)}%` }}
                                    ></div>
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {!isEmbedded && (
                              <Button
                                size="sm"
                                onClick={triggerEmbedding}
                                disabled={isEmbedding}
                                className="mt-4 w-full"
                              >
                                {isEmbedding ? (
                                  <>
                                    <Loader size="sm" className="mr-2" />
                                    Processing...
                                  </>
                                ) : 'Find Similar Content'}
                              </Button>
                            )}
                          </div>
                        ) : (
                          <p className="text-gray-500 dark:text-gray-400 text-sm">
                            Click on a highlighted section in the document to view details.
                          </p>
                        )}
                      </div>
                      
                      {isEmbedded && selectedAnnotation && (
                        <div className="mt-6">
                          <SimilarContent
                            relatedChunks={similarContent.map(chunk => ({
                              text: chunk.text,
                              score: chunk.score,
                              chunkIndex: chunk.chunk_index
                            }))}
                            isLoading={isSearching}
                            onChunkClick={(text) => handleChunkClick(text, isEmbedded)}
                            title="Similar Content"
                            emptyMessage={searchText ? "No similar content found" : "Select text to find similar content"}
                          />
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="search" className="pt-4">
                      {/* Semantic Search Component */}
                      <SemanticSearch 
                        documentId={documentId}
                        isEmbedded={isEmbedded}
                        onResultClick={(text) => handleChunkClick(text, isEmbedded)}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </>
          )}
        </EmbeddingProvider>
      )}
    </div>
  );
}
