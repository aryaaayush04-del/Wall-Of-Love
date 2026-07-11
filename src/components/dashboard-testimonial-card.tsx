"use client";

import { useState } from 'react';
import { Star, User, MessageSquare, Trash2, Edit, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { deleteTestimonial, updateTestimonial, approveTestimonial, rejectTestimonial } from '@/app/actions';
import { sanitizeUrl } from '@/lib/sanitize';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export function DashboardTestimonialCard({ t }: { t: any }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editRating, setEditRating] = useState(t.rating || 5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    setIsDeleting(true);
    await deleteTestimonial(t.id);
    setIsDeleting(false);
  };

  const handleApprove = async () => {
    setIsApproving(true);
    const result = await approveTestimonial(t.id);
    setIsApproving(false);
    if (result?.error) {
      alert("Error: " + result.error);
    }
  };

  const handleReject = async () => {
    setIsRejecting(true);
    const result = await rejectTestimonial(t.id);
    setIsRejecting(false);
    if (result?.error) {
      alert("Error: " + result.error);
    }
  };

  const handleEditSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    const data = {
      name: formData.get("name") as string,
      handle: formData.get("handle") as string,
      platform: formData.get("platform") as string,
      original_date: formData.get("original_date") as string,
      post_url: formData.get("post_url") as string,
      text: formData.get("text") as string,
      rating: editRating,
    };
    
    const result = await updateTestimonial(t.id, data);
    setIsSubmitting(false);

    if (result?.error) {
      alert("Error: " + result.error);
    } else {
      setIsEditOpen(false);
    }
  };

  // Format date
  let formattedDate = null;
  if (t.original_date) {
    try {
      const date = new Date(t.original_date);
      const timeZone = t.original_date.includes('T') ? undefined : 'UTC';
      formattedDate = date.toLocaleDateString('en-US', { timeZone, month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {}
  }

  // Determine platform icon
  let IconComponent: any = MessageSquare;
  if (t.platform === 'X/Twitter') IconComponent = TwitterIcon;
  if (t.platform === 'LinkedIn') IconComponent = LinkedinIcon;

  const showPlatform = t.platform || t.post_url;
  const iconElement = <IconComponent className="h-4 w-4 text-gray-400" />;

  const dateValue = t.original_date ? t.original_date.split('T')[0] : '';

  const isApproved = t.is_approved === true;
  const isPending = t.is_approved === false || t.is_approved === null || t.is_approved === undefined;

  return (
    <>
      <div className={`bg-white dark:bg-gray-800 p-5 rounded-xl border shadow-sm flex flex-col gap-3 transition-shadow hover:shadow-md relative ${isPending ? 'border-amber-300 dark:border-amber-600' : 'border-gray-200 dark:border-gray-700'}`}>
        {/* Approval Status Badge */}
        {isPending ? (
          <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2.5 py-1 rounded-full w-fit border border-amber-200 dark:border-amber-700">
            <Clock className="h-3 w-3" />
            Pending Approval
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 rounded-full w-fit border border-emerald-200 dark:border-emerald-700">
            <CheckCircle2 className="h-3 w-3" />
            Approved
          </div>
        )}

        {/* View Post Button placed absolutely in top right */}
        {t.post_url && sanitizeUrl(t.post_url) !== '#' && (
          <a 
            href={sanitizeUrl(t.post_url)} 
            target="_blank" 
            rel="noreferrer" 
            className="absolute top-5 right-5 flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 px-2.5 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 group"
          >
            <span className="group-hover:text-gray-900 dark:group-hover:text-white">{iconElement}</span>
            View Post
          </a>
        )}
        
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
            <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </div>
          <div className="flex flex-col flex-1 min-w-0 pr-24">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 dark:text-white truncate">{t.name}</span>
              {/* If no URL but platform is set, just show icon next to name */}
              {showPlatform && !t.post_url && (
                <span title={t.platform || 'Platform'}>{iconElement}</span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 truncate">
              {t.handle && <span className="truncate">{t.handle}</span>}
              {t.handle && formattedDate && <span>•</span>}
              {formattedDate && <span>{formattedDate}</span>}
            </div>
          </div>
        </div>
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`h-4 w-4 ${i < t.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
          ))}
        </div>
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{t.text}</p>
        
        <div className="mt-2 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between gap-1">
          {/* Approval Actions — left side */}
          <div className="flex items-center gap-1">
            {isPending ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                onClick={handleApprove}
                disabled={isApproving}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                {isApproving ? "..." : "Approve"}
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                onClick={handleReject}
                disabled={isRejecting}
              >
                <XCircle className="h-3.5 w-3.5" />
                {isRejecting ? "..." : "Unapprove"}
              </Button>
            )}
          </div>

          {/* Edit & Delete — right side */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-gray-500 dark:text-gray-400" onClick={() => setIsEditOpen(true)}>
              <Edit className="h-3.5 w-3.5" />
              Edit
            </Button>
            <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-red-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={handleDelete} disabled={isDeleting}>
              <Trash2 className="h-3.5 w-3.5" />
              {isDeleting ? "..." : "Delete"}
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form action={handleEditSubmit}>
            <DialogHeader>
              <DialogTitle>Edit Testimonial</DialogTitle>
              <DialogDescription>
                Make changes to this testimonial below. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor={`name-${t.id}`}>Customer Name</Label>
                  <Input id={`name-${t.id}`} name="name" defaultValue={t.name} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`handle-${t.id}`}>Customer Handle (optional)</Label>
                  <Input id={`handle-${t.id}`} name="handle" defaultValue={t.handle || ''} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor={`platform-${t.id}`}>Platform</Label>
                  <Select name="platform" defaultValue={t.platform || undefined}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="X/Twitter">X/Twitter</SelectItem>
                      <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                      <SelectItem value="Reddit">Reddit</SelectItem>
                      <SelectItem value="Product Hunt">Product Hunt</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`original_date-${t.id}`}>Date</Label>
                  <Input type="date" id={`original_date-${t.id}`} name="original_date" defaultValue={dateValue} />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor={`post_url-${t.id}`}>Link to Post</Label>
                <Input type="url" id={`post_url-${t.id}`} name="post_url" defaultValue={t.post_url || ''} placeholder="https://..." />
              </div>

              <div className="grid gap-2">
                <Label htmlFor={`text-${t.id}`}>Testimonial</Label>
                <Textarea id={`text-${t.id}`} name="text" defaultValue={t.text} rows={3} required />
              </div>
              
              <div className="grid gap-2">
                <Label>Rating</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setEditRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star className={`h-6 w-6 ${star <= editRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
