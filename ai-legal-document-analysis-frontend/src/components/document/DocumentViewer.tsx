import React, { useState } from 'react';
import { Document, Annotation } from '@/lib/api';

interface DocumentViewerProps {
  document?: Document | null;
  onAnnotationClick?: (annotation: Annotation) => void;
}

/**
 * Handles overlapping annotations to prevent duplicate highlighting
 * @param annotations The list of annotations to process
 * @returns A filtered list of annotations with overlaps resolved
 */
function handleOverlappingAnnotations(annotations: Annotation[]): Annotation[] {
  // First sort by start position and then by length (shortest first)
  const sorted = [...annotations].sort((a, b) => {
    if (a.startIndex === b.startIndex) {
      return (a.endIndex - a.startIndex) - (b.endIndex - b.startIndex);
    }
    return a.startIndex - b.startIndex;
  });
  
  // Keep track of processed ranges
  const processed: Annotation[] = [];
  const occupiedRanges: {start: number, end: number}[] = [];
  
  for (const annotation of sorted) {
    // Check if this annotation overlaps with any already processed one
    const isOverlapping = occupiedRanges.some(range => 
      (annotation.startIndex < range.end && annotation.endIndex > range.start)
    );
    
    if (!isOverlapping) {
      processed.push(annotation);
      occupiedRanges.push({
        start: annotation.startIndex,
        end: annotation.endIndex
      });
    }
  }
  
  return processed;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ 
  document, 
  onAnnotationClick 
}) => {
  const [activeAnnotation, setActiveAnnotation] = useState<string | null>(null);

  if (!document) {
    return (
      <div className="flex items-center justify-center h-64 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-800">
        <p className="text-gray-500 dark:text-gray-400">No document loaded</p>
      </div>
    );
  }

  if (document.status === 'uploading' || document.status === 'processing') {
    return (
      <div className="flex flex-col items-center justify-center h-64 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="mt-4 text-gray-500 dark:text-gray-400">
          {document.status === 'uploading' ? 'Uploading document...' : 'Analyzing document...'}
        </p>
      </div>
    );
  }

  if (document.status === 'error') {
    return (
      <div className="flex items-center justify-center h-64 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20 dark:border-red-800/30">
        <p className="text-red-500 dark:text-red-400">Error loading document</p>
      </div>
    );
  }

  // If no content, show message
  if (!document.content) {
    return (
      <div className="flex items-center justify-center h-64 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-800">
        <p className="text-gray-500 dark:text-gray-400">Document has no content</p>
      </div>
    );
  }

  // If no annotations, just render the content
  if (!document.annotations || document.annotations.length === 0) {
    return (
      <div className="p-4 border border-gray-200 rounded-lg bg-white dark:bg-gray-950 dark:border-gray-800">
        <h3 className="text-lg font-semibold mb-2">{document.name}</h3>
        <div className="whitespace-pre-wrap text-sm">{document.content}</div>
      </div>
    );
  }
  // Prevent overlapping annotations by merging or filtering them
  const processedAnnotations = handleOverlappingAnnotations([...document.annotations]);
  
  // Sort annotations by startIndex to process in order
  const sortedAnnotations = processedAnnotations.sort((a, b) => a.startIndex - b.startIndex);

  // Build the highlighted content
  const segments = [];
  let lastIndex = 0;

  for (const annotation of sortedAnnotations) {
    // Skip invalid annotations
    if (annotation.startIndex >= annotation.endIndex || 
        annotation.startIndex < 0 || 
        annotation.endIndex > document.content.length) {
      continue;
    }
    
    // Skip annotations that start before the last processed position
    if (annotation.startIndex < lastIndex) {
      continue;
    }

    if (annotation.startIndex > lastIndex) {
      // Add text before the annotation
      segments.push(
        <span key={`text-${lastIndex}`}>
          {document.content.substring(lastIndex, annotation.startIndex)}
        </span>
      );
    }

    // Add the highlighted annotation
    const isActive = activeAnnotation === annotation.id;
    segments.push(
      <span
        key={`annotation-${annotation.id}`}
        className={`${getAnnotationColor(annotation.category)} cursor-pointer transition-colors px-0.5 rounded ${
          isActive ? 'ring-2 ring-offset-1 ring-blue-500' : ''
        }`}
        title={annotation.description || annotation.category}
        onClick={() => {
          setActiveAnnotation(isActive ? null : annotation.id);
          onAnnotationClick?.(annotation);
        }}
        onMouseEnter={() => setActiveAnnotation(annotation.id)}
        onMouseLeave={() => setActiveAnnotation(null)}
      >
        {document.content.substring(annotation.startIndex, annotation.endIndex)}
      </span>
    );

    lastIndex = annotation.endIndex;
  }

  // Add any remaining content
  if (lastIndex < document.content.length) {
    segments.push(
      <span key={`text-${lastIndex}`}>
        {document.content.substring(lastIndex)}
      </span>
    );
  }

  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-white dark:bg-gray-950 dark:border-gray-800">
      <h3 className="text-lg font-semibold mb-2">{document.name}</h3>
      <div className="document-content text-sm whitespace-pre-wrap">
        {segments}
      </div>
    </div>
  );
};

// Helper function to get color based on annotation category
function getAnnotationColor(category: string): string {
  switch (category) {
    case 'legal_term':
      return 'bg-yellow-100 dark:bg-yellow-900/30 hover:bg-yellow-200 dark:hover:bg-yellow-800/40';
    case 'date':
      return 'bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-800/40';
    case 'party':
      return 'bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-800/40';
    case 'obligation':
      return 'bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-800/40';
    case 'condition':
      return 'bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-800/40';
    default:
      return 'bg-gray-100 dark:bg-gray-800/40 hover:bg-gray-200 dark:hover:bg-gray-700/50';
  }
}
