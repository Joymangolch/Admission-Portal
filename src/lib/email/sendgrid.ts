import sgMail from "@sendgrid/mail";

const apiKey = process.env.SENDGRID_API_KEY;
const isPlaceholder = apiKey === "SG.your_api_key";

if (apiKey && !isPlaceholder) {
  sgMail.setApiKey(apiKey);
}

type EmailAttachment = {
  content: string;
  filename: string;
  type?: string;
  disposition?: string;
};

export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html: string,
  options?: { attachments?: EmailAttachment[] }
) => {
  if (!apiKey || isPlaceholder) {
    console.warn("⚠️ SendGrid Skip: SENDGRID_API_KEY is missing or a placeholder in .env.local");
    return { 
      success: false, 
      error: "Email service not configured. Please set a valid SENDGRID_API_KEY." 
    };
  }

  const from = process.env.SENDGRID_FROM_EMAIL;
  if (!from || from === "admissions@university.edu") {
    console.warn("⚠️ SendGrid Skip: SENDGRID_FROM_EMAIL is missing or a placeholder in .env.local");
    return { 
      success: false, 
      error: "Verified sender email not configured." 
    };
  }

  const msg = {
    to,
    from,
    subject,
    text,
    html,
    ...(options?.attachments?.length ? { attachments: options.attachments } : {}),
  };

  try {
    await sgMail.send(msg);
    return { success: true };
  } catch (error: any) {
    const errorMessage = error.response?.body || error.message;
    console.error("❌ SendGrid error:", errorMessage);
    return { success: false, error: error.message };
  }
};
