import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface SubmitConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function SubmitConfirmDialog({
  isOpen,
  onOpenChange,
  onConfirm,
}: SubmitConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)}>
        <DialogHeader>
          <DialogTitle className="text-zinc-900 dark:text-zinc-50">Submit Examination</DialogTitle>
          <DialogDescription>
            Are you sure you want to end your exam session and submit all answers for grading? 
            Once submitted, you will not be able to log back in or modify your code responses.
          </DialogDescription>
        </DialogHeader>

        {/* Brief breakdown info */}
        <div className="bg-amber-50 rounded-lg p-4 flex gap-3 text-amber-800 text-xs my-4 dark:bg-amber-950/20 dark:text-amber-400">
          <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <span className="font-bold select-none block mb-0.5">Attention Candidate</span>
            <span>You have completed 9 of 45 questions. 36 questions are still unvisited or unanswered.</span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Return to Exam
          </Button>
          <Button
            size="sm"
            onClick={onConfirm}
            className="bg-[#510047] text-white hover:bg-[#6c1d5f] border-transparent"
          >
            Confirm Submission
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
