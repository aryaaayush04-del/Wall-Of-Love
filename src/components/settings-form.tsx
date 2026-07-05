"use client";

import { useState, useTransition } from 'react';
import { updateProfile } from '@/app/actions';

interface ProfileData {
  full_name?: string | null;
  website?: string | null;
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
        <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          type="text"
          name="full_name"
          id="full_name"
          defaultValue={initialData?.full_name || ''}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 sm:text-sm"
          placeholder="Jane Doe"
        />
      </div>

      <div>
        <label htmlFor="website" className="block text-sm font-medium text-gray-700">
          Website
        </label>
        <input
          type="url"
          name="website"
          id="website"
          defaultValue={initialData?.website || ''}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 sm:text-sm"
          placeholder="https://example.com"
        />
      </div>

      <div className="flex items-center justify-end gap-4 pt-4">
        {message && (
          <p className="text-sm font-medium text-green-600">
            {message}
          </p>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex justify-center rounded-md border border-transparent bg-gray-900 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  );
}
