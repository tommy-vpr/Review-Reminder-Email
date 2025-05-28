export async function enqueueReviewReminder(orderId: string) {
  await fetch(
    "https://qstash.upstash.io/v1/publish/https://cultivated-reviews.vercel.app/api/queue/send-review-email",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.QSTASH_TOKEN}`,
        "Upstash-Delay": "1209600s", // 14 days in seconds
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderId }),
    }
  );
}
