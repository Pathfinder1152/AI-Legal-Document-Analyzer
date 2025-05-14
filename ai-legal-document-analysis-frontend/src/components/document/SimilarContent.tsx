import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleScrollArea } from "@/components/ui/simple-scroll-area";
import { TextChunkViewer } from './TextChunkViewer';

interface SimilarContentProps {
  relatedChunks: Array<{
    text: string;
    score: number;
    chunkIndex?: number;
  }>;
  isLoading?: boolean;
  onChunkClick?: (text: string) => void;
  title?: string;
  emptyMessage?: string;
}

export const SimilarContent: React.FC<SimilarContentProps> = ({
  relatedChunks,
  isLoading = false,
  onChunkClick,
  title = "Similar Content",
  emptyMessage = "No similar content found"
}) => {
  const [viewerOpen, setViewerOpen] = useState<boolean>(false);
  const [selectedChunk, setSelectedChunk] = useState<{text: string; score: number; chunkIndex?: number} | null>(null);
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>
          Semantically similar content from this document
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : relatedChunks.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            {emptyMessage}
          </div>
        ) : (
          <SimpleScrollArea className="max-h-[500px]">
            <div className="space-y-3">
              {relatedChunks.map((chunk, index) => (                <div 
                  key={index}
                  className="p-3 border rounded-md hover:bg-accent/50 cursor-pointer transition-colors"
                  onClick={() => {
                    // Show the full text in the dialog
                    setSelectedChunk(chunk);
                    setViewerOpen(true);
                    // Also highlight in the document if needed
                    onChunkClick?.(chunk.text);
                  }}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-medium text-muted-foreground">
                      {chunk.chunkIndex !== undefined ? `Chunk #${chunk.chunkIndex}` : `Match #${index + 1}`}
                    </span>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {Math.round(chunk.score * 100)}% match
                    </span>
                  </div>
                  <p className="text-sm line-clamp-3">{chunk.text}</p>
                </div>
              ))}
            </div>
          </SimpleScrollArea>
        )}      </CardContent>
      
      {/* Dialog to view full text chunk */}
      {selectedChunk && (
        <TextChunkViewer
          isOpen={viewerOpen}
          onOpenChange={setViewerOpen}
          title={`Document Chunk ${selectedChunk.chunkIndex !== undefined ? '#' + selectedChunk.chunkIndex : ''}`}
          text={selectedChunk.text}
          score={selectedChunk.score}
        />
      )}
    </Card>
  );
};
