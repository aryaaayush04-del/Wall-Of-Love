"use client";

import { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function CopyCollectionLink({ userId }: { userId: string }) {
  const [isCopied, setIsCopied] = useState(false);
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const link = `${origin}/submit/${userId}`;

  const handleCopy = async () => {
    if (!origin) return;
    
    try {
      await navigator.clipboard.writeText(link);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="mb-3">
        <Label className="text-base font-semibold text-gray-900 dark:text-white">Your Collection Link</Label>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Share this public link with your customers to collect new reviews.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Input 
          readOnly 
          value={origin ? link : ''} 
          className="bg-gray-50 dark:bg-gray-900/50 flex-1 font-mono text-sm text-gray-600 dark:text-gray-300"
          placeholder="Loading link..."
        />
        <Button 
          onClick={handleCopy} 
          variant="secondary"
          className="gap-2 min-w-[120px]"
        >
          {isCopied ? (
            <>
              <Check className="h-4 w-4 text-green-600 dark:text-green-500" />
              <span className="text-green-600 dark:text-green-500">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              <span>Copy Link</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
