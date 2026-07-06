import React from 'react';
import { ArrowDownToLine } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface BulkImportDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BulkImportDialog({ isOpen, onOpenChange }: BulkImportDialogProps) {
  const handleUpload = () => {
    onOpenChange(false);
    alert('Bulk Import Successful! (Mocked response)');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-zinc-900 dark:text-zinc-50">Bulk Import Questions</DialogTitle>
          <DialogDescription>
            Upload questions using CSV/Excel spreadsheet sheets containing tags, type parameters, and markdown contents.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100/50 transition-colors cursor-pointer select-none">
          <ArrowDownToLine className="h-8 w-8 text-zinc-400 mb-2" />
          <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Drag & Drop your spreadsheet here
          </span>
          <span className="text-xs text-muted-foreground mt-1">
            Supports .csv, .xlsx (Max 5MB)
          </span>
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleUpload}
            className="bg-primary text-white hover:bg-primary/95"
          >
            Upload & Parse
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
