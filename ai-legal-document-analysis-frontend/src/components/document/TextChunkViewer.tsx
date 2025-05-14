import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { SimpleScrollArea } from '@/components/ui/simple-scroll-area';

interface TextChunkViewerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  text: string;
  score?: number;
}

export const TextChunkViewer: React.FC<TextChunkViewerProps> = ({
  isOpen,
  onOpenChange,
  title = 'Document Chunk',
  text,
  score
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {score !== undefined && (
            <DialogDescription>
              Similarity Score: {Math.round(score * 100)}%
            </DialogDescription>
          )}
        </DialogHeader>
        
        <SimpleScrollArea className="max-h-[50vh] my-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-sm whitespace-pre-wrap">
            {text}
          </div>
        </SimpleScrollArea>
        
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
