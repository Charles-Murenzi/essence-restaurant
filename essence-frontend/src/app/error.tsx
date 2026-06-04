"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 text-foreground">
      <h2 className="text-2xl font-bold text-primary">Something went wrong</h2>
      <p className="text-muted-foreground text-sm">{error.message}</p>
      <button onClick={reset} className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold hover:bg-accent transition-colors">
        Try again
      </button>
    </div>
  );
}
