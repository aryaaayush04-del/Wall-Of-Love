"use client";

import { useState, useTransition } from 'react';
import { updateProfile } from '@/app/actions';
import { Button } from '@/components/ui/button';

interface ProfileData {
  full_name?: string | null;
  website?: string | null;
  widget_title?: string | null;
}

export function SettingsForm({ initialData }: { initialData: ProfileData | null }) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      setMessage('');
      await updateProfile(formData);
      setMessage('Settings saved successfully!');
      
      // Clear the message after 3 seconds
      setTimeout(() => {
        setMessage('');
      }, 3000);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="full_name" className="block text-[14px] font-medium text-ledger mb-1.5">
          Full Name
        </label>
        <input
          type="text"
          name="full_name"
          id="full_name"
          defaultValue={initialData?.full_name || ''}
          className="block w-full rounded-sm border border-fade/30 bg-paper text-ledger px-3 py-2 shadow-sm focus:border-brass focus:outline-none focus:ring-1 focus:ring-brass text-[16px] placeholder-fade/50 transition-colors"
          placeholder="Jane Doe"
        />
      </div>

      <div>
        <label htmlFor="website" className="block text-[14px] font-medium text-ledger mb-1.5">
          Website
        </label>
        <input
          type="url"
          name="website"
          id="website"
          defaultValue={initialData?.website || ''}
          className="block w-full rounded-sm border border-fade/30 bg-paper text-ledger px-3 py-2 shadow-sm focus:border-brass focus:outline-none focus:ring-1 focus:ring-brass text-[16px] placeholder-fade/50 transition-colors"
          placeholder="https://example.com"
        />
      </div>

      <div>
        <label htmlFor="widget_title" className="block text-[14px] font-medium text-ledger mb-1.5">
          Widget Title
        </label>
        <input
          type="text"
          name="widget_title"
          id="widget_title"
          defaultValue={initialData?.widget_title || ''}
          className="block w-full rounded-sm border border-fade/30 bg-paper text-ledger px-3 py-2 shadow-sm focus:border-brass focus:outline-none focus:ring-1 focus:ring-brass text-[16px] placeholder-fade/50 transition-colors"
          placeholder="What people are saying"
        />
      </div>

      <div className="flex items-center justify-end gap-4 pt-4">
        {message && (
          <p className="text-[14px] font-medium text-moss">
            {message}
          </p>
        )}
        <Button
          type="submit"
          disabled={isPending}
          className="bg-ledger text-paper hover:bg-brass hover:text-ledger transition-colors duration-200 shadow-sm"
        >
          {isPending ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </form>
  );
}
