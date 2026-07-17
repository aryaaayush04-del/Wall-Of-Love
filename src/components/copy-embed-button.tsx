"use client";

import { Code } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CopyEmbedButton({ userId }: { userId?: string }) {
  const handleCopyEmbed = () => {
    const code = `<iframe src="${window.location.origin}/embed/my-wall${userId ? `?user=${userId}` : ''}" width="100%" height="600" frameBorder="0" allowtransparency="true"></iframe>`;
    navigator.clipboard.writeText(code);
    alert("Embed code copied to clipboard!");
  };

  return (
    <Button variant="outline" size="sm" className="gap-2 border-fade/30 text-ledger hover:bg-fade/10" onClick={handleCopyEmbed}>
      <Code className="h-4 w-4" />
      Embed Code
    </Button>
  );
}
