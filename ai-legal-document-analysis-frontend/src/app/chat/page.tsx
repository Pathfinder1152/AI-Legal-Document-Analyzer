"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  SimpleDialog,
  SimpleDialogHeader,
  SimpleDialogTitle,
  SimpleDialogFooter,
} from "@/components/ui/simple-dialog";
import {
  SimpleTabs,
  SimpleTabsList,
  SimpleTabsTrigger,
  SimpleTabsContent,
} from "@/components/ui/simple-tabs";
import { SimpleScrollArea } from "@/components/ui/simple-scroll-area";
// import { Progress } from "@/components/ui/progress";
// import { toast } from "@/components/ui/use-toast";
import { 
  uploadDocument, 
  getDocumentStatus, 
  getDocument, 
  sendChatMessage,
  checkEmbeddingStatus,
  embedDocument,
  searchSimilarContent,
  SimilarChunk
} from "@/lib/api";
import { TextChunkViewer } from "@/components/document/TextChunkViewer";

// Define types
type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  selectedText?: string;
  sources?: Source[];
};

type Source = {
  title: string;
  url: string;
  snippet: string;
};

type Document = {
  id: string;
  name: string;
  size: string;
  type: string;
  status: "uploading" | "processing" | "analyzed" | "error";
  progress?: number;
  annotations?: Annotation[];
  content?: string;
};

type Annotation = {
  id: string;
  text: string;
  category: "legal_term" | "date" | "party" | "obligation" | "condition" | "other";
  startIndex: number;
  endIndex: number;
  description?: string;
  clause_type?: string;
  clause_confidence?: number;
};

export default function ChatPage() {  // State management
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content:
        "Hello! I'm your AI legal assistant. Upload documents or ask me questions about legal concepts.",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeDocument, setActiveDocument] = useState<Document | null>(null);
  const [selectedAnnotation, setSelectedAnnotation] = useState<Annotation | null>(null);
  const [viewMode, setViewMode] = useState<"chat" | "document">("chat");
  
  // Semantic search state
  const [isEmbedded, setIsEmbedded] = useState<boolean>(false);
  const [isEmbedding, setIsEmbedding] = useState<boolean>(false);
  const [embedError, setEmbedError] = useState<string | null>(null);
  const [semanticSearchQuery, setSemanticSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SimilarChunk[]>([]);  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [highlightText, setHighlightText] = useState<string | null>(null);
  const [viewerOpen, setViewerOpen] = useState<boolean>(false);
  const [selectedChunk, setSelectedChunk] = useState<SimilarChunk | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message to chatbot
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Create user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: "user",
      timestamp: new Date(),
      selectedText: selectedAnnotation?.text,
    };

    // Update messages with user message
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsProcessing(true);

    try {
      // Get the last 10 messages for context
      const recentMessages = messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content,
        selectedText: msg.selectedText
      }));

      // Call our API client to get AI response
      const data = await sendChatMessage(
        inputValue,
        activeDocument?.id,
        selectedAnnotation?.text,
        recentMessages
      );

      // Create AI response message
      const aiResponse: Message = {
        id: Date.now().toString(),
        content: data.response,
        role: "assistant",
        timestamp: new Date(),
        sources: data.sources || [],
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      // Add error message
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "I'm sorry, there was an error processing your request. Please try again.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
      setSelectedAnnotation(null); // Clear selected annotation after sending
    }
  };

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Close dialog
    setDialogOpen(false);

    // Process each file
    Array.from(files).forEach(async (file) => {
      console.log(`Uploading file: ${file.name}, type: ${file.type}, size: ${formatFileSize(file.size)}`);
      
      // Create document with uploading status
      const newDocument: Document = {
        id: Date.now().toString(),
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type,
        status: "uploading",
        progress: 0,
      };

      setDocuments((prev) => [...prev, newDocument]);

      try {
        // Upload document using our API client
        console.log(`Starting upload for ${file.name} to API endpoint...`);
        const uploadData = await uploadDocument(file);
        console.log(`Upload response:`, uploadData);

        // Update document status to processing
        setDocuments((prev) =>
          prev.map((doc) =>
            doc.id === newDocument.id
              ? {
                  ...doc,
                  id: uploadData.documentId,
                  status: "processing",
                  progress: 100,
                }
              : doc
          )
        );

        // Add upload message
        const uploadMessage: Message = {
          id: Date.now().toString(),
          content: `I'm now analyzing "${file.name}". This might take a few moments depending on the document size and complexity.`,
          role: "assistant",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, uploadMessage]);

        // Poll for document processing status
        const pollStatus = async () => {
          try {
            console.log(`Checking status for document ID: ${uploadData.documentId}`);
            const statusData = await getDocumentStatus(uploadData.documentId);
            console.log(`Status response:`, statusData);

            if (statusData.status === "analyzed") {
              // Get document with annotations
              console.log(`Document analyzed, fetching document data...`);
              const documentData = await getDocument(uploadData.documentId);
              console.log(`Document data:`, documentData);

              // Update document with annotations
              setDocuments((prev) =>
                prev.map((doc) =>
                  doc.id === uploadData.documentId
                    ? {
                        ...doc,
                        status: "analyzed",
                        annotations: documentData.annotations,
                        content: documentData.content,
                      }
                    : doc
                )
              );

              // Add system message about successful analysis
              const analysisMessage: Message = {
                id: Date.now().toString(),
                content: `I've analyzed "${file.name}" and found ${documentData.annotations?.length || 0} key elements that might be relevant to your legal questions. You can now view the document with annotations or ask me questions about it.`,
                role: "assistant",
                timestamp: new Date(),
              };

              setMessages((prev) => [...prev, analysisMessage]);
              return true; // Done polling
            } else if (statusData.status === "error") {
              // Update document status to error
              setDocuments((prev) =>
                prev.map((doc) =>
                  doc.id === uploadData.documentId
                    ? {
                        ...doc,
                        status: "error",
                      }
                    : doc
                )
              );

              // Add error message
              const errorMessage: Message = {
                id: Date.now().toString(),
                content: `I had trouble analyzing "${file.name}". The document may be too complex or in an unsupported format. Please try a different document or contact support.`,
                role: "assistant",
                timestamp: new Date(),
              };

              setMessages((prev) => [...prev, errorMessage]);
              return true; // Done polling
            }
            return false; // Continue polling
          } catch (error) {
            console.error("Error checking document status:", error);
            
            // Add error message to chat
            const errorMessage: Message = {
              id: Date.now().toString(),
              content: `There was an error checking the status of "${file.name}". Please try again or contact support if the problem persists.`,
              role: "assistant",
              timestamp: new Date(),
            };
            
            setMessages((prev) => [...prev, errorMessage]);
            
            // Update document status to error
            setDocuments((prev) =>
              prev.map((doc) =>
                doc.id === uploadData.documentId
                  ? {
                      ...doc,
                      status: "error",
                    }
                  : doc
              )
            );
            
            return true; // Stop polling on error
          }
        };

        // Poll every 3 seconds until done
        const poll = async () => {
          const isDone = await pollStatus();
          if (!isDone) {
            setTimeout(poll, 3000);
          }
        };

        poll();
      } catch (error) {
        console.error("Error uploading document:", error);
        
        // Update document status to error
        setDocuments((prev) =>
          prev.map((doc) =>
            doc.id === newDocument.id
              ? {
                  ...doc,
                  status: "error",
                }
              : doc
          )
        );

        // Add error message
        const errorMessage: Message = {
          id: Date.now().toString(),
          content: `I encountered an error uploading "${file.name}". Please try again or use a different file.`,
          role: "assistant",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, errorMessage]);
      }
    });
  };
  // Handle opening document to view
  const handleOpenDocument = async (document: Document) => {
    if (document.status !== "analyzed") {
      // toast({
      //   title: "Document not ready",
      //   description: "The document is still being processed. Please wait for analysis to complete.",
      //   variant: "destructive",
      // });
      return;
    }

    setActiveDocument(document);
    setViewMode("document");
    
    // Check if document is already embedded for semantic search
    try {
      setIsEmbedding(true);
      const status = await checkEmbeddingStatus(document.id);
      setIsEmbedded(status.isEmbedded);
    } catch (err) {
      console.error('Error checking embedding status:', err);
      setIsEmbedded(false);
    } finally {
      setIsEmbedding(false);
    }
  };

  // Handle selecting annotation
  const handleSelectAnnotation = (annotation: Annotation) => {
    setSelectedAnnotation(annotation);
    setViewMode("chat");
    
    // Pre-fill input with annotation text
    setInputValue(`Tell me more about "${annotation.text}" in this document.`);
  };

  // Handle keydown for sending message
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  // Remove document from list
  const removeDocument = (id: string) => {
    setDocuments(documents.filter((doc) => doc.id !== id));
    
    // If removing active document, reset view
    if (activeDocument?.id === id) {
      setActiveDocument(null);
      setViewMode("chat");
    }
  };

  // Render document view with annotations
  const renderDocumentView = () => {
    if (!activeDocument || !activeDocument.content) {
      return (
        <div className="h-full flex items-center justify-center">
          <p className="text-muted-foreground">Select a document to view</p>
        </div>
      );
    }

    // Get all annotations for the document
    const annotations = activeDocument.annotations || [];    // Create a highlighted version of the document content
    const renderHighlightedContent = () => {
      const content = activeDocument.content || "";
      
      // If no annotations, just show the plain text with possible semantic search highlighting
      if (annotations.length === 0) {
        // If there's no semantic search highlight, just return plain text
        if (!highlightText) {
          return content.split("\n").map((paragraph, idx) => (
            <p key={idx} className="leading-relaxed mb-4">
              {paragraph}
            </p>
          ));
        }
          // If there's a semantic search highlight, highlight all occurrences
        return content.split("\n").map((paragraph, paragraphIdx) => {
          if (!paragraph.toLowerCase().includes(highlightText.toLowerCase())) {
            return (
              <p key={paragraphIdx} className="leading-relaxed mb-4">
                {paragraph}
              </p>
            );
          }
          
          // Paragraph contains the highlight text - parse and highlight it
          const parts = [];
          const lowerParagraph = paragraph.toLowerCase();
          const lowerHighlight = highlightText.toLowerCase();
          let lastIdx = 0;
          
          let currentPos = 0;
          while (currentPos < lowerParagraph.length) {
            const foundIdx = lowerParagraph.indexOf(lowerHighlight, currentPos);
            if (foundIdx === -1) break;
            
            // Add text before match
            if (foundIdx > lastIdx) {
              parts.push(
                <span key={`pre-${paragraphIdx}-${lastIdx}`}>
                  {paragraph.substring(lastIdx, foundIdx)}
                </span>
              );
            }
            
            // Add highlighted match
            parts.push(
              <span
                key={`highlight-${paragraphIdx}-${foundIdx}`}
                className="bg-amber-300/70 dark:bg-amber-600/50 px-0.5 rounded"
              >
                {paragraph.substring(foundIdx, foundIdx + highlightText.length)}
              </span>
            );
            
            lastIdx = foundIdx + highlightText.length;
            currentPos = lastIdx;
          }
            // Add any remaining text
          if (lastIdx < paragraph.length) {
            parts.push(
              <span key={`post-${paragraphIdx}-${lastIdx}`}>
                {paragraph.substring(lastIdx)}
              </span>
            );
          }
          
          return (
            <p key={paragraphIdx} className="leading-relaxed mb-4">
              {parts}
            </p>
          );
        });
      }

      // Sort annotations by their position in the document
      const sortedAnnotations = [...annotations].sort((a, b) => a.startIndex - b.startIndex);
      
      // Split document into chunks with annotations highlighted
      const chunks = [];
      let lastIndex = 0;

      // Function to get class name for annotation category
      const getCategoryClass = (category: string) => {
        switch (category) {
          case "legal_term":
            return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 border-b-2 border-blue-500";
          case "date":
            return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200 border-b-2 border-green-500";
          case "party":
            return "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200 border-b-2 border-purple-500";
          case "obligation":
            return "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200 border-b-2 border-orange-500";
          case "condition":
            return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200 border-b-2 border-red-500";
          default:
            return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 border-b-2 border-gray-500";
        }
      };

      // Process each paragraph separately to maintain document structure
      const paragraphs = content.split("\n");
      let currentCharIndex = 0;

      return paragraphs.map((paragraph, paragraphIdx) => {
        if (!paragraph.trim()) {
          currentCharIndex += paragraph.length + 1; // +1 for the newline
          return <p key={`p-${paragraphIdx}`} className="mb-4">&nbsp;</p>;
        }

        const paragraphStart = currentCharIndex;
        const paragraphEnd = paragraphStart + paragraph.length;
        currentCharIndex = paragraphEnd + 1; // +1 for the newline

        // Find annotations that intersect with this paragraph
        const paragraphAnnotations = sortedAnnotations.filter(
          anno => 
            (anno.startIndex >= paragraphStart && anno.startIndex < paragraphEnd) || 
            (anno.endIndex > paragraphStart && anno.endIndex <= paragraphEnd) ||
            (anno.startIndex <= paragraphStart && anno.endIndex >= paragraphEnd)
        );

        if (paragraphAnnotations.length === 0) {
          // No annotations in this paragraph
          return (
            <p key={`p-${paragraphIdx}`} className="leading-relaxed mb-4">
              {paragraph}
            </p>
          );
        }

        // Build highlighted paragraph
        const paragraphChunks = [];
        let lastParagraphIndex = 0;

        // Sort paragraph annotations
        paragraphAnnotations.sort((a, b) => {
          const aStartInParagraph = Math.max(0, a.startIndex - paragraphStart);
          const bStartInParagraph = Math.max(0, b.startIndex - paragraphStart);
          return aStartInParagraph - bStartInParagraph;
        });

        for (const annotation of paragraphAnnotations) {
          // Calculate relative positions within the paragraph
          const annoStart = Math.max(0, annotation.startIndex - paragraphStart);
          const annoEnd = Math.min(paragraph.length, annotation.endIndex - paragraphStart);
          
          if (annoStart > lastParagraphIndex) {
            // Add non-highlighted text before this annotation
            paragraphChunks.push(
              <span key={`chunk-${paragraphIdx}-${lastParagraphIndex}`}>
                {paragraph.substring(lastParagraphIndex, annoStart)}
              </span>
            );
          }

          // Add highlighted annotation with tooltip
          if (annoStart < annoEnd) {
            paragraphChunks.push(              <span
                key={`anno-${annotation.id}`}
                className={`relative cursor-pointer group ${getCategoryClass(annotation.category)}`}
                onClick={() => handleSelectAnnotation(annotation)}
              >
                {paragraph.substring(annoStart, annoEnd)}
                <span className="hidden group-hover:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap z-50 pointer-events-none">
                  {annotation.category.replace("_", " ")}{annotation.description ? `: ${annotation.description}` : ""}
                  {annotation.clause_type && annotation.clause_type !== 'unknown' ? (
                    <span className="block mt-1 border-t border-gray-600 pt-1">
                      Clause Type: {annotation.clause_type.replace('_', ' ')}
                      {annotation.clause_confidence && ` (${Math.round(annotation.clause_confidence * 100)}%)`}
                    </span>
                  ) : null}
                </span>
              </span>
            );
          }

          lastParagraphIndex = annoEnd;
        }

        // Add any remaining text after the last annotation
        if (lastParagraphIndex < paragraph.length) {
          paragraphChunks.push(
            <span key={`chunk-${paragraphIdx}-end`}>
              {paragraph.substring(lastParagraphIndex)}
            </span>
          );
        }

        return (
          <p key={`p-${paragraphIdx}`} className="leading-relaxed mb-4">
            {paragraphChunks}
          </p>
        );
      });
    };

    return (      <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium">{activeDocument.name}</h2>
          <div className="flex space-x-3">
            {isEmbedded && (
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-xs text-green-600 dark:text-green-400">Semantic Search Enabled</span>
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode("chat")}
            >
              Back to Chat
            </Button>
          </div>
        </div>
        
        {!isEmbedded && activeDocument.status === 'analyzed' && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-500 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Enable semantic search to find similar content within this document
                </p>
              </div>
              <Button 
                size="sm"
                onClick={() => {
                  if (activeDocument) {
                    setIsEmbedding(true);
                    setEmbedError(null);
                    
                    embedDocument(activeDocument.id)
                      .then(() => {
                        setIsEmbedded(true);
                      })
                      .catch(err => {
                        console.error('Error embedding document:', err);
                        setEmbedError(err instanceof Error ? err.message : 'Failed to embed document');
                      })
                      .finally(() => {
                        setIsEmbedding(false);
                      });
                  }
                }}
                disabled={isEmbedding}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isEmbedding ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                    Processing...
                  </>
                ) : 'Enable'}
              </Button>
            </div>
            {embedError && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                Error: {embedError}
              </p>
            )}
          </div>
        )}
        
        <div className="flex flex-col md:flex-row gap-6 flex-grow">
          {/* Document content with highlighted annotations */}          <div className="md:w-2/3">
            <h3 className="font-medium text-sm text-muted-foreground uppercase mb-3">Document Content</h3>
            <SimpleScrollArea className="h-[520px] border rounded-md p-4 bg-white dark:bg-gray-800">
              <div className="p-4 space-y-1">
                {renderHighlightedContent()}
              </div>
            </SimpleScrollArea>
          </div>
          
          {/* Annotations panel */}
          <div className="md:w-1/3">
            <h3 className="text-lg font-medium mb-3">Extracted Elements</h3>
            <SimpleScrollArea className="h-[520px] border rounded-md bg-white dark:bg-gray-800">
              <div className="p-4 space-y-3">
                {annotations.length === 0 ? (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    No elements extracted from this document
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <div className="flex items-center text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                        Legal Term
                      </div>
                      <div className="flex items-center text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                        Date
                      </div>
                      <div className="flex items-center text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-1"></span>
                        Party
                      </div>
                      <div className="flex items-center text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 px-2 py-1 rounded">
                        <span className="w-2 h-2 bg-orange-500 rounded-full mr-1"></span>
                        Obligation
                      </div>
                      <div className="flex items-center text-xs bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 px-2 py-1 rounded">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                        Condition
                      </div>
                    </div>

                    {/* Group annotations by category */}
                    {["legal_term", "date", "party", "obligation", "condition", "other"].map((category) => {
                      const categoryAnnotations = annotations.filter(a => a.category === category);
                      if (categoryAnnotations.length === 0) return null;
                      
                      return (
                        <div key={category} className="mb-4">
                          <h4 className="font-medium text-sm mb-2 capitalize">
                            {category.replace("_", " ")}s
                          </h4>
                          <div className="space-y-2">
                            {categoryAnnotations.map((annotation) => (
                              <div
                                key={annotation.id}
                                className="p-3 border rounded-md cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                onClick={() => handleSelectAnnotation(annotation)}
                              >                                <div className="flex items-center">
                                  <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                    annotation.category === "legal_term" ? "bg-blue-500" :
                                    annotation.category === "date" ? "bg-green-500" :
                                    annotation.category === "party" ? "bg-purple-500" :
                                    annotation.category === "obligation" ? "bg-orange-500" :
                                    annotation.category === "condition" ? "bg-red-500" :
                                    "bg-gray-500"
                                  }`} />
                                  <span className="font-medium">{annotation.text}</span>
                                </div>
                                {annotation.description && (
                                  <p className="text-sm text-muted-foreground mt-1 ml-4">{annotation.description}</p>
                                )}
                                {annotation.clause_type && annotation.clause_type !== 'unknown' && (
                                  <div className="mt-2 ml-4 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded inline-flex items-center">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                                    {annotation.clause_type.replace('_', ' ')}
                                    {annotation.clause_confidence && (
                                      <span className="ml-1 opacity-75">
                                        ({Math.round(annotation.clause_confidence * 100)}%)
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </SimpleScrollArea>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-blue-50/30 dark:bg-blue-950/20 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="flex items-center mb-6">
          <div className="mr-3">
            <Image src="/logo-placeholder.svg" alt="LegalAI Logo" width={36} height={36} />
          </div>
          <h1 className="text-3xl font-serif font-bold text-primary">LegalAI Chat</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardContent className="p-4">                <SimpleTabs defaultValue="documents">                  <SimpleTabsList className="grid grid-cols-2 mb-4">
                    <SimpleTabsTrigger value="documents">Documents</SimpleTabsTrigger>
                    <SimpleTabsTrigger value="semantic">Semantic</SimpleTabsTrigger>
                  </SimpleTabsList>

                  <SimpleTabsContent value="documents" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-sm text-muted-foreground">
                        UPLOADED DOCUMENTS
                      </h3>

                      <Button
                        size="sm"
                        variant="outline"
                        className="text-blue-600"
                        onClick={() => setDialogOpen(true)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        New
                      </Button>

                      <SimpleDialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <SimpleDialogHeader>
                          <SimpleDialogTitle>Upload Documents</SimpleDialogTitle>
                        </SimpleDialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <input
                              type="file"
                              id="file-upload"
                              className="hidden"
                              multiple
                              onChange={handleFileUpload}
                              accept=".pdf,.doc,.docx,.txt"
                            />
                            <label
                              htmlFor="file-upload"
                              className="cursor-pointer flex flex-col items-center justify-center text-sm text-muted-foreground"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-10 w-10 text-gray-400 mb-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                              </svg>
                              <span className="font-medium text-blue-600">Click to upload</span>
                              <span>or drag and drop</span>
                              <span className="text-xs mt-1">
                                PDF, DOC, DOCX, TXT (Max 20MB)
                              </span>
                            </label>
                          </div>
                        </div>
                        <SimpleDialogFooter>
                          <Button variant="outline" onClick={() => setDialogOpen(false)}>
                            Cancel
                          </Button>
                        </SimpleDialogFooter>
                      </SimpleDialog>
                    </div>

                    {documents.length === 0 ? (
                      <div className="text-center py-8 text-sm text-muted-foreground">
                        No documents uploaded yet
                      </div>
                    ) : (
                      <SimpleScrollArea className="h-[500px]">
                        <div className="space-y-3">
                          {documents.map((doc) => (
                            <div
                              key={doc.id}
                              className="flex items-center justify-between p-3 bg-white dark:bg-card rounded-md border border-border"
                            >
                              <div 
                                className="flex items-center flex-grow cursor-pointer"
                                onClick={() => doc.status === "analyzed" && handleOpenDocument(doc)}
                              >
                                <div className="p-2 rounded bg-blue-100 dark:bg-blue-900/30 mr-3">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-blue-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                  </svg>
                                </div>
                                <div className="text-sm flex-grow">
                                  <p className="font-medium truncate max-w-[120px]">
                                    {doc.name}
                                  </p>
                                  <div className="flex items-center">
                                    <p className="text-xs text-muted-foreground">
                                      {doc.size}
                                    </p>
                                    {doc.status === "uploading" && (
                                      <span className="ml-2 text-xs text-blue-600">
                                        Uploading...
                                      </span>
                                    )}
                                    {doc.status === "processing" && (
                                      <span className="ml-2 text-xs text-orange-600">
                                        Processing...
                                      </span>
                                    )}
                                    {doc.status === "analyzed" && (
                                      <span className="ml-2 text-xs text-green-600">
                                        Analyzed
                                      </span>
                                    )}
                                    {doc.status === "error" && (
                                      <span className="ml-2 text-xs text-red-600">
                                        Error
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeDocument(doc.id)}
                                className="h-8 w-8 p-0 text-muted-foreground"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </Button>
                            </div>
                          ))}
                        </div>
                      </SimpleScrollArea>                    )}
                  </SimpleTabsContent>
                  
                  <SimpleTabsContent value="semantic" className="h-[500px]">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-sm text-muted-foreground">
                        SEMANTIC SEARCH
                      </h3>
                    </div>
                    
                    {activeDocument ? (
                      <>
                        {!isEmbedded ? (
                          <div className="flex flex-col items-center justify-center h-[400px] border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-12 w-12 text-gray-400 mb-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                              />
                            </svg>
                            <h4 className="text-lg font-medium mb-2">Enable Semantic Search</h4>
                            <p className="text-sm text-muted-foreground mb-4">
                              Process this document for advanced semantic search capabilities
                            </p>
                            <Button
                              onClick={() => {
                                if (activeDocument) {
                                  // Start embedding process
                                  setIsEmbedding(true);
                                  setEmbedError(null);
                                  
                                  embedDocument(activeDocument.id)
                                    .then(() => {
                                      setIsEmbedded(true);
                                    })
                                    .catch(err => {
                                      console.error('Error embedding document:', err);
                                      setEmbedError(err instanceof Error ? err.message : 'Failed to embed document');
                                    })
                                    .finally(() => {
                                      setIsEmbedding(false);
                                    });
                                }
                              }}
                              disabled={isEmbedding || !activeDocument}
                              className="mt-2"
                            >
                              {isEmbedding ? (
                                <>
                                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                                  Processing...
                                </>
                              ) : 'Enable Semantic Search'}
                            </Button>
                            {embedError && (
                              <p className="text-sm text-red-500 mt-2">{embedError}</p>
                            )}
                          </div>
                        ) : (                          <div className="space-y-4">                            <div className="flex flex-col space-y-2">                              <input
                                type="text"
                                value={semanticSearchQuery}
                                onChange={(e) => setSemanticSearchQuery(e.target.value)}
                                placeholder="Enter query..."
                                className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
                                disabled={isSearching}
                              />                              <div className="flex">
                                <Button 
                                  onClick={() => {
                                  if (activeDocument && semanticSearchQuery.trim()) {
                                    setIsSearching(true);
                                    searchSimilarContent(activeDocument.id, semanticSearchQuery.trim())
                                      .then(response => {
                                        setSearchResults(response.results);
                                      })
                                      .catch(err => {
                                        console.error('Search error:', err);
                                        setSearchResults([]);
                                      })
                                      .finally(() => {
                                        setIsSearching(false);
                                      });
                                  }
                                }}                                disabled={!semanticSearchQuery.trim() || isSearching}
                                className="min-w-[80px] whitespace-nowrap"
                              >
                                {isSearching ? (
                                  <>
                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                                    Searching...
                                  </>
                                ) : 'Search'}
                              </Button>
                              </div>
                            </div>
                            
                            <SimpleScrollArea className="h-[400px]">
                              {isSearching ? (
                                <div className="flex justify-center items-center py-12">
                                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                                </div>
                              ) : searchResults.length > 0 ? (
                                <div className="space-y-3">
                                  {searchResults.map((result, index) => (
                                    <div 
                                      key={index}
                                      className="p-3 border rounded-md hover:bg-accent/50 cursor-pointer transition-colors"                                      onClick={() => {
                                        // Show full text in viewer dialog
                                        setSelectedChunk(result);
                                        setViewerOpen(true);
                                        
                                        // Also highlight in document
                                        setHighlightText(result.text);
                                        // Switch to document view to see the highlight
                                        if (viewMode !== "document") {
                                          setViewMode("document");
                                        }
                                        // Clear highlight after a while
                                        setTimeout(() => {
                                          setHighlightText(null);
                                        }, 5000);
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
                                  ))}
                                </div>
                              ) : semanticSearchQuery ? (
                                <div className="text-center py-8 text-sm text-muted-foreground">
                                  No results found for your search
                                </div>
                              ) : (
                                <div className="text-center py-8 text-sm text-muted-foreground">
                                  Enter a search query to find semantically similar content
                                </div>
                              )}                            </SimpleScrollArea>
                            
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
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-[400px] border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 text-gray-400 mb-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <h4 className="text-lg font-medium mb-2">No Document Selected</h4>
                        <p className="text-sm text-muted-foreground">
                          Please select a document to enable semantic search
                        </p>
                      </div>                    )}
                  </SimpleTabsContent>
                </SimpleTabs>
              </CardContent>
            </Card>
          </div>

          {/* Main Area (Chat or Document View) */}
          <div className="lg:col-span-3">
            <Card className="h-full flex flex-col">
              <CardContent className="p-4 flex-grow flex flex-col">
                {viewMode === "chat" ? (
                  // Chat View
                  <>
                    <div className="flex-grow overflow-auto mb-4">
                      <SimpleScrollArea className="h-[600px] pr-4">
                        <div className="space-y-4">
                          {messages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${
                                message.role === "user" ? "justify-end" : "justify-start"
                              }`}
                            >
                              <div
                                className={`max-w-[80%] rounded-lg p-4 ${
                                  message.role === "user"
                                    ? "bg-blue-600 text-white"
                                    : "bg-white dark:bg-card border border-border"
                                }`}
                              >
                                {message.role === "assistant" && (
                                  <div className="flex items-center mb-2">
                                    <div className="h-6 w-6 rounded-full bg-blue-100 mr-2 flex items-center justify-center">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 text-blue-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                                        />
                                      </svg>
                                    </div>
                                    <span className="font-medium">LegalAI Assistant</span>
                                  </div>
                                )}
                                {message.selectedText && (
                                  <div className="mb-2 p-2 bg-blue-50 dark:bg-blue-900/10 rounded border-l-2 border-blue-300 dark:border-blue-700 text-sm">
                                    <span className="font-medium">Selected text: </span>
                                    {message.selectedText}
                                  </div>
                                )}
                                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                
                                {/* Display sources if available */}
                                {message.sources && message.sources.length > 0 && (
                                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <p className="text-xs font-medium mb-2">Sources:</p>
                                    <div className="space-y-2">
                                      {message.sources.map((source, idx) => (
                                        <div key={idx} className="text-xs p-2 bg-gray-50 dark:bg-gray-800 rounded">
                                          <a 
                                            href={source.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                                          >
                                            {source.title}
                                          </a>
                                          <p className="text-muted-foreground mt-1">{source.snippet}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                
                                <div
                                  className={`text-xs mt-2 ${
                                    message.role === "user" ? "text-blue-100" : "text-gray-400"
                                  }`}
                                >
                                  {message.timestamp.toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </div>
                              </div>
                            </div>
                          ))}
                          {isProcessing && (
                            <div className="flex justify-start">
                              <div className="bg-white dark:bg-card border border-border rounded-lg p-4 max-w-[80%]">
                                <div className="flex items-center text-sm">
                                  <div className="flex space-x-1">
                                    <div
                                      className="h-2 w-2 bg-blue-600 rounded-full animate-bounce"
                                      style={{ animationDelay: "0ms" }}
                                    ></div>
                                    <div
                                      className="h-2 w-2 bg-blue-600 rounded-full animate-bounce"
                                      style={{ animationDelay: "300ms" }}
                                    ></div>
                                    <div
                                      className="h-2 w-2 bg-blue-600 rounded-full animate-bounce"
                                      style={{ animationDelay: "600ms" }}
                                    ></div>
                                  </div>
                                  <span className="ml-3 text-muted-foreground">
                                    LegalAI is thinking...
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                          <div ref={messagesEndRef} />
                        </div>
                      </SimpleScrollArea>
                    </div>

                    <div className="relative">
                      {selectedAnnotation && (
                        <div className="mb-2 p-2 bg-blue-50 dark:bg-blue-900/10 rounded text-sm flex items-center">
                          <span className="font-medium mr-2">Selected: </span>
                          <span className="flex-grow">{selectedAnnotation.text}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedAnnotation(null)}
                            className="h-6 w-6 p-0"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </Button>
                        </div>
                      )}
                      <Textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask about your legal documents..."
                        className="min-h-[80px] pr-20 resize-none"
                      />

                      <div className="absolute bottom-3 right-3 flex space-x-2">
                        <label htmlFor="file-input" className="cursor-pointer">
                          <div className="h-8 w-8 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 hover:bg-blue-200 transition-colors">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                              />
                            </svg>
                          </div>
                          <input
                            type="file"
                            id="file-input"
                            className="hidden"
                            multiple
                            accept=".pdf,.doc,.docx,.txt"
                            onChange={handleFileUpload}
                          />
                        </label>

                        <button
                          onClick={handleSendMessage}
                          disabled={!inputValue.trim() || isProcessing}
                          className={`h-8 w-8 flex items-center justify-center rounded-full 
                            ${
                              inputValue.trim() && !isProcessing
                                ? "bg-blue-600 hover:bg-blue-700 text-white"
                                : "bg-gray-200 text-gray-400 dark:bg-gray-600"
                            } transition-colors`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  // Document View
                  renderDocumentView()
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}