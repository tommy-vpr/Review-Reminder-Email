"use client";
import { useState } from "react";

export default function SendTestEmail() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const sendEmail = async () => {
    setStatus("Sending...");
    const res = await fetch("/api/test-email", {
      method: "POST",
      body: JSON.stringify({ to: email }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    setStatus(data.success ? "✅ Email sent!" : "❌ Failed to send.");
  };

  return (
    <div className="p-4 space-y-3">
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded w-full max-w-md"
      />
      <button
        onClick={sendEmail}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Send Test Email
      </button>
      {status && <p>{status}</p>}
    </div>
  );
}
