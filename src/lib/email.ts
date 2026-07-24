import { BrevoClient } from "@getbrevo/brevo";

const client = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY!,
});

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  try {
    const response = await client.transactionalEmails.sendTransacEmail({
      sender: {
        email: "team@vhsmo.com",
        name: "VHSMO",
      },
      to: [
        {
          email: to,
        },
      ],
      subject: subject,
      htmlContent: html,
    });

    console.log("Success:", response);
  } catch (err) {
    console.error("Brevo Error:", err);
  }
}
