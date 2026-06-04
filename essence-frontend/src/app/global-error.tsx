"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body style={{ background: "#050505", color: "#F5F5F5", fontFamily: "sans-serif", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", flexDirection: "column", gap: "16px" }}>
        <h2 style={{ color: "#D4AF37" }}>Something went wrong</h2>
        <button onClick={reset} style={{ background: "#D4AF37", color: "#000", padding: "10px 24px", borderRadius: "999px", border: "none", cursor: "pointer", fontWeight: "bold" }}>
          Try again
        </button>
      </body>
    </html>
  );
}
