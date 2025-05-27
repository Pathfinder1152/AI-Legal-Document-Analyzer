import React, { useState, useRef, useEffect } from 'react';
import { Document, Annotation } from '@/lib/api';

interface DocumentViewerProps {
  document?: Document | null;
  onAnnotationClick?: (annotation: Annotation) => void;
  searchText?: string | null;
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
  onAnnotationClick,
  searchText
}) => {
  const [activeAnnotation, setActiveAnnotation] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [searchHighlights, setSearchHighlights] = useState<{start: number, end: number}[]>([]);
  
  // Effect to find and highlight search text when it changes
  useEffect(() => {
    if (!searchText || !document?.content) {
      setSearchHighlights([]);
      return;
    }
    
    // Find all occurrences of the search text in the document content
    const searchLower = searchText.toLowerCase();
    const contentLower = document.content.toLowerCase();
    const highlights: {start: number, end: number}[] = [];
    
    let idx = 0;
    while (idx < contentLower.length) {
      const foundIdx = contentLower.indexOf(searchLower, idx);
      if (foundIdx === -1) break;
      
      highlights.push({
        start: foundIdx,
        end: foundIdx + searchText.length
      });
      
      idx = foundIdx + 1; // Move past this occurrence
    }
    
    setSearchHighlights(highlights);
    
    // Scroll to the first match if any
    if (highlights.length > 0 && contentRef.current) {
      setTimeout(() => {
        const firstHighlightEl = contentRef.current?.querySelector('.search-highlight');
        if (firstHighlightEl) {
          firstHighlightEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, [searchText, document?.content]);

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
  // If no annotations, just render the content (but still apply search highlighting)
  if (!document.annotations || document.annotations.length === 0) {
    // If no search text, render plain content
    if (!searchText || searchHighlights.length === 0) {
      return (
        <div className="p-4 border border-gray-200 rounded-lg bg-white dark:bg-gray-950 dark:border-gray-800">
          <h3 className="text-lg font-semibold mb-2">{document.name}</h3>
          <div ref={contentRef} className="whitespace-pre-wrap text-sm">{document.content}</div>
        </div>
      );
    }
    
    // If search text exists, highlight it
    const segments = [];
    let lastIndex = 0;
    
    // Sort search highlights by start position
    const sortedHighlights = [...searchHighlights].sort((a, b) => a.start - b.start);
    
    for (const highlight of sortedHighlights) {
      // Add text before the highlight
      if (highlight.start > lastIndex) {
        segments.push(
          <span key={`text-${lastIndex}`}>
            {document.content.substring(lastIndex, highlight.start)}
          </span>
        );
      }
      
      // Add the highlighted text
      segments.push(
        <span
          key={`search-${highlight.start}`}
          className="search-highlight bg-amber-300/70 dark:bg-amber-600/50 px-0.5 rounded"
        >
          {document.content.substring(highlight.start, highlight.end)}
        </span>
      );
      
      lastIndex = highlight.end;
    }
    
    // Add remaining text
    if (lastIndex < document.content.length) {
      segments.push(
        <span key={`text-end`}>
          {document.content.substring(lastIndex)}
        </span>
      );
    }
    
    return (
      <div className="p-4 border border-gray-200 rounded-lg bg-white dark:bg-gray-950 dark:border-gray-800">
        <h3 className="text-lg font-semibold mb-2">{document.name}</h3>
        <div ref={contentRef} className="whitespace-pre-wrap text-sm">{segments}</div>
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
    }    // Add the highlighted annotation
    const isActive = activeAnnotation === annotation.id;
      // Create custom tooltip component for better formatting
    const tooltipContent = (
      <div className="tooltip-content">
        <div>{annotation.description || annotation.category}</div>
        {annotation.clause_type && annotation.clause_type !== 'unknown' && (
          <div className="mt-1 pt-1 border-t border-gray-600">
            <span className="font-medium">Clause Type:</span>{" "}
            {annotation.clause_type.replace('_', ' ')}
            {annotation.clause_confidence && (
              <span className="ml-1 opacity-75">
                ({Math.round(annotation.clause_confidence * 100)}%)
              </span>
            )}
          </div>
        )}
      </div>
    );
    
    // For browsers/environments that don't support JSX in title, fallback to plain text
    let tooltipText = annotation.description || annotation.category;
    if (annotation.clause_type && annotation.clause_type !== 'unknown') {
      const confidencePercent = annotation.clause_confidence 
        ? Math.round(annotation.clause_confidence * 100)
        : null;
      
      tooltipText = `${tooltipText}\nClause Type: ${annotation.clause_type.replace('_', ' ')}` + 
        (confidencePercent ? ` (${confidencePercent}%)` : '');
    }
      segments.push(
      <span
        key={`annotation-${annotation.id}`}
        className={`${getAnnotationColor(annotation.category)} cursor-pointer transition-colors px-0.5 rounded relative group ${
          isActive ? 'ring-2 ring-offset-1 ring-blue-500' : ''
        } ${annotation.clause_type && annotation.clause_type !== 'unknown' ? 'border-b border-dotted border-blue-500' : ''}`}
        title={tooltipText}
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
  // Combine annotation segments with search highlights
  if (searchText && searchHighlights.length > 0) {
    // Clone segments and add class to any that contain the search text
    const highlightedSegments = segments.map((segment, index) => {
      if (segment.props.children && typeof segment.props.children === 'string') {
        const text = segment.props.children;
        const lowerText = text.toLowerCase();
        const searchLower = searchText.toLowerCase();
        
        if (lowerText.includes(searchLower)) {
          // This segment contains search text, so highlight it
          const parts = [];
          let lastIdx = 0;
          let currentIdx = 0;
          
          while (currentIdx < text.length) {
            const foundIdx = lowerText.indexOf(searchLower, currentIdx);
            if (foundIdx === -1) break;
            
            // Add text before match
            if (foundIdx > lastIdx) {
              parts.push(
                <span key={`pre-${index}-${lastIdx}`}>
                  {text.substring(lastIdx, foundIdx)}
                </span>
              );
            }
            
            // Add highlighted match
            parts.push(
              <span
                key={`highlight-${index}-${foundIdx}`}
                className="search-highlight bg-amber-300/70 dark:bg-amber-600/50 px-0.5 rounded"
              >
                {text.substring(foundIdx, foundIdx + searchText.length)}
              </span>
            );
            
            lastIdx = foundIdx + searchText.length;
            currentIdx = lastIdx;
          }
          
          // Add remaining text
          if (lastIdx < text.length) {
            parts.push(
              <span key={`post-${index}-${lastIdx}`}>
                {text.substring(lastIdx)}
              </span>
            );
          }
          
          // Return a new segment with the same props but highlighted content
          return React.cloneElement(
            segment,
            { ...segment.props, key: `highlighted-${index}` },
            parts
          );
        }
      }
      
      // Return original segment unchanged
      return segment;
    });
    
    return (
      <div className="p-4 border border-gray-200 rounded-lg bg-white dark:bg-gray-950 dark:border-gray-800">
        <h3 className="text-lg font-semibold mb-2">{document.name}</h3>
        <div ref={contentRef} className="document-content text-sm whitespace-pre-wrap">
          {highlightedSegments}
        </div>
      </div>
    );
  }
  
  // Regular rendering without search highlighting
  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-white dark:bg-gray-950 dark:border-gray-800">
      <h3 className="text-lg font-semibold mb-2">{document.name}</h3>
      <div ref={contentRef} className="document-content text-sm whitespace-pre-wrap">
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
