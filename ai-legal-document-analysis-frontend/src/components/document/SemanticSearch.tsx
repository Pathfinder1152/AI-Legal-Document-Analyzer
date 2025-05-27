import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SimpleScrollArea } from '@/components/ui/simple-scroll-area';
import { Loader } from '@/components/ui/loader';
import { SimilarChunk, searchSimilarContent } from '@/lib/api';
import { TextChunkViewer } from './TextChunkViewer';

interface SemanticSearchProps {
  documentId: string | null;
  isEmbedded: boolean;
  onResultClick?: (text: string) => void;
}

export const SemanticSearch: React.FC<SemanticSearchProps> = ({
  documentId,
  isEmbedded,
  onResultClick
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SimilarChunk[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [viewerOpen, setViewerOpen] = useState<boolean>(false);
  const [selectedChunk, setSelectedChunk] = useState<SimilarChunk | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!documentId || !searchQuery.trim() || !isEmbedded) {
      return;
    }
    
    try {
      setIsSearching(true);
      setError(null);
      setHasSearched(true);
      
      const response = await searchSimilarContent(documentId, searchQuery.trim());
      setSearchResults(response.results);
      
      if (response.results.length === 0) {
        setError('No matching content found');
      }
      
    } catch (err) {
      console.error('Search error:', err);
      setError('Error performing search');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Semantic Search</CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSearch} className="mb-4">
          <div className="flex space-x-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for concepts in document..."
              className="flex-grow"
              disabled={!isEmbedded || isSearching}
            />
            <Button 
              type="submit" 
              disabled={!isEmbedded || isSearching || !searchQuery.trim()}
            >
              {isSearching ? <Loader size="sm" className="mr-2" /> : null}
              Search
            </Button>
          </div>
        </form>
        
        {!isEmbedded && (
          <div className="text-center py-6 text-muted-foreground">
            <p>Enable semantic search to use this feature</p>
          </div>
        )}
        
        {isEmbedded && !hasSearched && (
          <div className="text-center py-6 text-muted-foreground">
            <p>Enter a search query to find relevant content</p>
          </div>
        )}
        
        {isEmbedded && hasSearched && !isSearching && error && (
          <div className="text-center py-6 text-muted-foreground">
            <p>{error}</p>
          </div>
        )}
        
        {isEmbedded && (searchResults.length > 0 || isSearching) && (
          <SimpleScrollArea className="max-h-[400px]">
            <div className="space-y-3">
              {isSearching ? (
                <div className="flex justify-center items-center py-12">
                  <Loader size="md" />
                </div>
              ) : (
                searchResults.map((result, index) => (                <div 
                    key={index}
                    className="p-3 border rounded-md hover:bg-accent/50 cursor-pointer transition-colors"
                    onClick={() => {
                      // Show the full text in the dialog
                      setSelectedChunk(result);
                      setViewerOpen(true);
                      // Also highlight in the document if needed
                      onResultClick?.(result.text);
                    }}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-medium text-muted-foreground">
                        {result.chunk_index !== undefined ? `Chunk #${result.chunk_index}` : `Match #${index + 1}`}
                      </span>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        {Math.round(result.score * 100)}% match
                      </span>
                    </div>
                    <p className="text-sm line-clamp-3">{result.text}</p>
                  </div>
                ))
              )}
            </div>
          </SimpleScrollArea>
        )}      </CardContent>
      
      {/* Dialog to view full text chunk */}
      {selectedChunk && (
        <TextChunkViewer
          isOpen={viewerOpen}
          onOpenChange={setViewerOpen}
          title={`Document Chunk ${selectedChunk.chunk_index !== undefined ? '#' + selectedChunk.chunk_index : ''}`}
          text={selectedChunk.text}
          score={selectedChunk.score}
        />
      )}
    </Card>
  );
};
