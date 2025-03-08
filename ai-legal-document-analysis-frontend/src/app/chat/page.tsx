"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  SimpleDialog, 
  SimpleDialogHeader, 
  SimpleDialogTitle 
} from "@/components/ui/simple-dialog";
import {
  SimpleTabs,
  SimpleTabsList,
  SimpleTabsTrigger,
  SimpleTabsContent
} from "@/components/ui/simple-tabs";
import { SimpleScrollArea } from "@/components/ui/simple-scroll-area";

type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
};

type Document = {
  id: string;
  name: string;
  size: string;
  type: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm your AI legal assistant. Upload documents or ask me questions about legal concepts.",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  
  const [inputValue, setInputValue] = useState("");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    // Create user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: "user",
      timestamp: new Date(),
    };
    
    // Update messages with user message
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsProcessing(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(inputValue, documents),
        role: "assistant",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiResponse]);
      setIsProcessing(false);
    }, 1500);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    
    // Process each file
    Array.from(files).forEach(file => {
      const newDocument: Document = {
        id: Date.now().toString(),
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type,
      };
      
      setDocuments((prev) => [...prev, newDocument]);
    });
    
    // Add a system message about the upload
    const fileNames = Array.from(files).map(file => file.name).join(", ");
    const uploadMessage: Message = {
      id: Date.now().toString(),
      content: `I've uploaded the following document(s): ${fileNames}. I'll analyze the content and incorporate it into our conversation.`,
      role: "assistant",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, uploadMessage]);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  // Simulate AI response based on input and documents
  const generateAIResponse = (input: string, docs: Document[]): string => {
    // Simple response generation logic - would be replaced with actual AI calls
    const input_lower = input.toLowerCase();
    
    if (input_lower.includes("hello") || input_lower.includes("hi")) {
      return "Hello! How can I help you with your legal documents today?";
    } else if (input_lower.includes("document") || input_lower.includes("upload")) {
      return "You can upload legal documents using the attachment button. I can analyze contracts, legal briefs, case law, and other legal texts.";
    } else if (input_lower.includes("summarize") || input_lower.includes("summary")) {
      return docs.length > 0 
        ? "I've analyzed your documents and can provide a summary. The key points include provisions for liability, term limits, and compensation structures. Would you like me to elaborate on any specific aspect?"
        : "I'd be happy to summarize legal documents for you. Please upload the documents you'd like me to analyze.";
    } else if (input_lower.includes("contract") || input_lower.includes("agreement")) {
      return "Contracts typically contain several key elements: parties, consideration, terms, obligations, and signatures. I can help identify potential issues or ambiguities in contract language.";
    } else {
      return "I understand your question about " + input + ". While analyzing legal concepts, I consider relevant case law, statutes, and legal principles. Can you provide more specific details about what you're looking for?";
    }
  };
  
  const removeDocument = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
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
              <CardContent className="p-4">
                <SimpleTabs defaultValue="documents">
                  <SimpleTabsList className="grid grid-cols-2 mb-4">
                    <SimpleTabsTrigger value="documents">Documents</SimpleTabsTrigger>
                    <SimpleTabsTrigger value="history">History</SimpleTabsTrigger>
                  </SimpleTabsList>
                  
                  <SimpleTabsContent value="documents" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-sm text-muted-foreground">UPLOADED DOCUMENTS</h3>
                      
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-blue-600"
                        onClick={() => setDialogOpen(true)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
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
                            />
                            <label 
                              htmlFor="file-upload" 
                              className="cursor-pointer flex flex-col items-center justify-center text-sm text-muted-foreground"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              <span className="font-medium text-blue-600">Click to upload</span>
                              <span>or drag and drop</span>
                              <span className="text-xs mt-1">PDF, DOC, DOCX, TXT (Max 20MB)</span>
                            </label>
                          </div>
                        </div>
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
                            <div key={doc.id} className="flex items-center justify-between p-3 bg-white dark:bg-card rounded-md border border-border">
                              <div className="flex items-center">
                                <div className="p-2 rounded bg-blue-100 dark:bg-blue-900/30 mr-3">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                </div>
                                <div className="text-sm">
                                  <p className="font-medium truncate max-w-[120px]">{doc.name}</p>
                                  <p className="text-xs text-muted-foreground">{doc.size}</p>
                                </div>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => removeDocument(doc.id)}
                                className="h-8 w-8 p-0 text-muted-foreground"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </Button>
                            </div>
                          ))}
                        </div>
                      </SimpleScrollArea>
                    )}
                  </SimpleTabsContent>
                  
                  <SimpleTabsContent value="history" className="h-[500px]">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-sm text-muted-foreground">CHAT HISTORY</h3>
                      <Button size="sm" variant="ghost" className="h-8">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Clear
                      </Button>
                    </div>
                    
                    <SimpleScrollArea className="h-[460px]">
                      <div className="space-y-2">
                        {["Contract Analysis", "Terms Review", "Legal Research", "Privacy Policy"].map((chat, index) => (
                          <Button 
                            key={index} 
                            variant="ghost" 
                            className="w-full justify-start text-left h-auto py-2"
                          >
                            <div>
                              <div className="font-medium text-sm">{chat}</div>
                              <div className="text-xs text-muted-foreground">{new Date().toLocaleDateString()}</div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </SimpleScrollArea>
                  </SimpleTabsContent>
                </SimpleTabs>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <Card className="h-full flex flex-col">
              <CardContent className="p-4 flex-grow flex flex-col">
                <div className="flex-grow overflow-auto mb-4">
                  <SimpleScrollArea className="h-[600px] pr-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div 
                          key={message.id} 
                          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div 
                            className={`max-w-[80%] rounded-lg p-4 ${
                              message.role === 'user' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-white dark:bg-card border border-border'
                            }`}
                          >
                            {message.role === 'assistant' && (
                              <div className="flex items-center mb-2">
                                <div className="h-6 w-6 rounded-full bg-blue-100 mr-2 flex items-center justify-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                                  </svg>
                                </div>
                                <span className="font-medium">LegalAI Assistant</span>
                              </div>
                            )}
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            <div className={`text-xs mt-2 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      ))}
                      {isProcessing && (
                        <div className="flex justify-start">
                          <div className="bg-white dark:bg-card border border-border rounded-lg p-4 max-w-[80%]">
                            <div className="flex items-center text-sm">
                              <div className="flex space-x-1">
                                <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                                <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                                <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "600ms" }}></div>
                              </div>
                              <span className="ml-3 text-muted-foreground">LegalAI is thinking...</span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </SimpleScrollArea>
                </div>
                
                <div className="relative">
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
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                      </div>
                      <input
                        type="file"
                        id="file-input"
                        className="hidden"
                        multiple
                        onChange={handleFileUpload}
                      />
                    </label>
                    
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isProcessing}
                      className={`h-8 w-8 flex items-center justify-center rounded-full 
                        ${inputValue.trim() && !isProcessing
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-gray-200 text-gray-400 dark:bg-gray-600'
                        } transition-colors`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
