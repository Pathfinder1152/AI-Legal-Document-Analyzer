'use client';

import { useState, useEffect } from 'react';
import { Document, getUserDocuments } from '@/lib/api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

export function UserDocumentsList() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserDocuments() {
      try {
        setLoading(true);
        const userDocs = await getUserDocuments();
        setDocuments(userDocs);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching user documents:', err);
        setError(err.message || 'Failed to load documents');
      } finally {
        setLoading(false);
      }
    }

    fetchUserDocuments();
  }, []);

  // Helper function to format file size
  const formatFileSize = (bytes: number | undefined) => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Function to get the appropriate status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'analyzed':
        return 'bg-green-500';
      case 'processing':
        return 'bg-yellow-500';
      case 'uploading':
        return 'bg-blue-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4">
        <p className="text-red-700 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Your Documents</CardTitle>
          <CardDescription>Uploaded legal documents</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            You haven't uploaded any documents yet. Upload your first document to get started with AI-powered analysis.
          </p>
          <Link
            href="/document/upload"
            className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
          >
            Upload Document
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Your Documents</h2>
        <Link
          href="/document/upload"
          className="inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
        >
          Upload New
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <Card key={doc.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg truncate" title={doc.name}>
                    {doc.name}
                  </CardTitle>
                  <CardDescription>
                    {doc.upload_date ? formatDistanceToNow(new Date(doc.upload_date), { addSuffix: true }) : 'Unknown date'}
                  </CardDescription>
                </div>
                <Badge className={`${getStatusColor(doc.status)} text-white`}>{doc.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {doc.file_type || 'Unknown type'} • {formatFileSize(doc.file_size)}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <Link href={`/document?id=${doc.id}`}>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </Link>              <Link href={`/chat?documentId=${doc.id}`}>
                <Button size="sm">Chat</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
