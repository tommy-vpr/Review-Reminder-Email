export async function enqueueReviewReminder(orderId: string) {
  await fetch(
    "https://qstash.upstash.io/v1/publish/https://teevong.com/api/queue/send-review-email",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.QSTASH_TOKEN}`,
        "Upstash-Delay": "60s", // 14 days in seconds
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderId }),
    }
  );
}
