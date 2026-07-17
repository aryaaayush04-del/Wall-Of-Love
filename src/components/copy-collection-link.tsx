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
    <div className="mb-8 p-6 bg-paper rounded-[10px] border border-fade/20 shadow-sm">
      <div className="mb-3">
        <Label className="text-[16px] font-medium text-ledger">Your Collection Link</Label>
        <p className="text-[14px] text-fade mt-1">
          Share this public link with your customers to collect new reviews.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Input 
          readOnly 
          value={origin ? link : ''} 
          className="bg-paper border-fade/30 flex-1 font-mono text-[14px] text-ledger placeholder-fade/50 focus:border-brass focus:ring-brass"
          placeholder="Loading link..."
        />
        <Button 
          onClick={handleCopy} 
          variant="outline"
          className="gap-2 min-w-[120px] border-fade/30 text-ledger hover:bg-fade/10"
        >
          {isCopied ? (
            <>
              <Check className="h-4 w-4 text-moss" />
              <span className="text-moss">Copied!</span>
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
