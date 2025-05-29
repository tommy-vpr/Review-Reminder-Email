// lib/enqueueTestEmail.ts
export async function enqueueTestEmail(to: string) {
  await fetch(
    "https://qstash.upstash.io/v1/publish/https://www.teevong.com/api/test-email",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.QSTASH_TOKEN}`,
        "Upstash-Delay": "60s", // Delay by 1 minute
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to }),
    }
  );
}
