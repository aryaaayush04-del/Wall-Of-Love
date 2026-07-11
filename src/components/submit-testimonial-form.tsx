"use client";

import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitPublicTestimonial } from '@/app/actions';

export function SubmitTestimonialForm({ userId }: { userId: string }) {
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    formData.append("rating", rating.toString());
    
    const result = await submitPublicTestimonial(formData, userId);
    setIsSubmitting(false);
    
    if (result?.error) {
      alert("Error: " + result.error);
    } else {
      setIsSuccess(true);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-500 mb-6">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Thank you!</h2>
        <p className="text-gray-500 dark:text-gray-400">Your testimonial has been submitted successfully.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Honeypot — invisible to humans, irresistible to bots */}
      <input
        type="text"
        name="website_url"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute w-0 h-0 opacity-0 -z-50 pointer-events-none overflow-hidden"
      />
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Your Name</Label>
          <Input id="name" name="name" placeholder="Jane Doe" required />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="handle">Your Title / Handle (optional)</Label>
          <Input id="handle" name="handle" placeholder="CEO at Company, or @janedoe" />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="text">Your Testimonial</Label>
          <Textarea 
            id="text" 
            name="text" 
            placeholder="Write your review here..." 
            rows={5} 
            required 
          />
        </div>
        
        <div className="grid gap-2">
          <Label>Rating</Label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none transition-transform hover:scale-110 p-1 -ml-1"
              >
                <Star className={`h-8 w-8 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 dark:text-gray-700'}`} />
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Testimonial"}
      </Button>
    </form>
  );
}
