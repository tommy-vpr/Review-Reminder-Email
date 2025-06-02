"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define schema
const emailSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

// Type from schema
type EmailForm = z.infer<typeof emailSchema>;

export default function SendTestEmail() {
  const [status, setStatus] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
  });

  const onSubmit = async (data: EmailForm) => {
    setStatus("Scheduling...");

    try {
      const res = await fetch("/api/queue/test-queue", {
        method: "POST",
        body: JSON.stringify({ to: data.email }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await res.json();
      setStatus(
        result.success ? "✅ Email scheduled!" : "❌ Failed to schedule."
      );
      reset();
    } catch (error) {
      console.error(error);
      setStatus("❌ Something went wrong.");
    }
  };

  return (
    <div className="w-[400px] p-6 rounded-md border border-gray-200">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <input
          type="email"
          placeholder="Enter your email"
          {...register("email")}
          className="border p-2 rounded w-full"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 transition duration-200"
        >
          {isSubmitting && (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}
          {isSubmitting ? "Sending..." : "Send Test Email"}
        </button>
      </form>

      {status && <p className="mt-3 text-sm text-gray-700">{status}</p>}
    </div>
  );
}
