
'use client';

import { useState } from 'react';
import { useToast } from './use-toast';

export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copy = async (text: string) => {
    if (typeof window === 'undefined' || !navigator.clipboard?.writeText) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Clipboard API is not available in this browser.',
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: 'Copied to clipboard!',
      });
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to copy text.',
      });
      console.error('Failed to copy text: ', err);
    }
  };

  return { copied, copy };
}
