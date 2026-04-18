/**
 * SendGrid Email Integration
 * Handle transactional emails
 */

import { ApiError, ErrorCodes, HttpStatus } from '../utils/response';

// Initialize SendGrid client in production
let sendgridClient: any = null;

/**
 * Initialize SendGrid
 */
export function initializeSendGrid() {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    console.warn('SendGrid API key not configured');
    return;
  }

  // In production:
  // const sgMail = require('@sendgrid/mail');
  // sgMail.setApiKey(apiKey);
  // sendgridClient = sgMail;
}

/**
 * Email templates
 */
export enum EmailTemplate {
  OTP_VERIFICATION = 'OTP_VERIFICATION',
  APPLICATION_SUBMITTED = 'APPLICATION_SUBMITTED',
  PAYMENT_SUCCESS = 'PAYMENT_SUCCESS',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  APPLICATION_APPROVED = 'APPLICATION_APPROVED',
  APPLICATION_REJECTED = 'APPLICATION_REJECTED',
  ADMIT_CARD_READY = 'ADMIT_CARD_READY',
  RESULT_PUBLISHED = 'RESULT_PUBLISHED',
  EXAM_SCHEDULED = 'EXAM_SCHEDULED',
}

/**
 * Send email via SendGrid
 */
export async function sendEmail(
  to: string,
  template: EmailTemplate,
  data: Record<string, any>
): Promise<{
  messageId: string;
  status: string;
}> {
  try {
    const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@admissions.mtu.ac.in';

    const emailContent = buildEmailContent(template, data);

    // In production:
    // const msg = {
    //   to,
    //   from: fromEmail,
    //   subject: emailContent.subject,
    //   html: emailContent.html,
    //   text: emailContent.text,
    // };
    // const result = await sendgridClient.send(msg);
    // return {
    //   messageId: result[0].headers['x-message-id'],
    //   status: 'sent',
    // };

    // For development
    console.log(`Email sent to ${to}:`, {
      subject: emailContent.subject,
      template,
      data,
    });

    return {
      messageId: `msg_${Date.now()}`,
      status: 'sent',
    };
  } catch (error: any) {
    console.error('Email send error:', error);
    throw new ApiError(
      HttpStatus.INTERNAL_ERROR,
      ErrorCodes.INTERNAL_SERVER_ERROR,
      'Failed to send email',
      { originalError: error.message }
    );
  }
}

/**
 * Build email content based on template
 */
function buildEmailContent(
  template: EmailTemplate,
  data: Record<string, any>
): { subject: string; html: string; text: string } {
  const templates: Record<EmailTemplate, any> = {
    [EmailTemplate.OTP_VERIFICATION]: {
      subject: 'Your OTP for MTU Admissions Portal',
      text: `Your OTP is: ${data.otp}. Valid for 10 minutes.`,
      html: `
        <h2>OTP Verification</h2>
        <p>Your OTP is: <strong>${data.otp}</strong></p>
        <p>This OTP is valid for 10 minutes.</p>
      `,
    },
    [EmailTemplate.APPLICATION_SUBMITTED]: {
      subject: 'Application Submitted Successfully',
      text: `Your application has been submitted. Application ID: ${data.applicationId}`,
      html: `
        <h2>Application Submitted</h2>
        <p>Your application has been submitted successfully.</p>
        <p><strong>Application ID:</strong> ${data.applicationId}</p>
        <p>You can track the status in your dashboard.</p>
      `,
    },
    [EmailTemplate.PAYMENT_SUCCESS]: {
      subject: 'Payment Successful',
      text: `Your payment of ₹${data.amount} has been received.`,
      html: `
        <h2>Payment Successful</h2>
        <p>Your payment of <strong>₹${data.amount}</strong> has been received.</p>
        <p><strong>Transaction ID:</strong> ${data.transactionId}</p>
      `,
    },
    [EmailTemplate.PAYMENT_FAILED]: {
      subject: 'Payment Failed',
      text: `Your payment of ₹${data.amount} failed. Please try again.`,
      html: `
        <h2>Payment Failed</h2>
        <p>Your payment of <strong>₹${data.amount}</strong> failed.</p>
        <p>Please try again or contact support.</p>
      `,
    },
    [EmailTemplate.APPLICATION_APPROVED]: {
      subject: 'Your Application Has Been Approved',
      text: `Congratulations! Your application has been approved.`,
      html: `
        <h2>Application Approved</h2>
        <p>Congratulations! Your application has been <strong>approved</strong>.</p>
        <p>You are eligible for the entrance exam.</p>
      `,
    },
    [EmailTemplate.APPLICATION_REJECTED]: {
      subject: 'Your Application Status',
      text: `Your application has been rejected. Reason: ${data.reason}`,
      html: `
        <h2>Application Rejected</h2>
        <p>Your application has been <strong>rejected</strong>.</p>
        <p><strong>Reason:</strong> ${data.reason}</p>
      `,
    },
    [EmailTemplate.ADMIT_CARD_READY]: {
      subject: 'Your Admit Card is Ready',
      text: `Your admit card for the exam is ready to download.`,
      html: `
        <h2>Admit Card Ready</h2>
        <p>Your admit card is ready to download.</p>
        <p><strong>Exam Date:</strong> ${data.examDate}</p>
        <p><strong>Exam Time:</strong> ${data.examTime}</p>
        <p><strong>Center:</strong> ${data.examCenter}</p>
      `,
    },
    [EmailTemplate.RESULT_PUBLISHED]: {
      subject: 'Your Exam Result is Published',
      text: `Your exam results have been published.`,
      html: `
        <h2>Result Published</h2>
        <p>Your exam results have been <strong>published</strong>.</p>
        <p><strong>Total Marks:</strong> ${data.totalMarks}</p>
        <p><strong>Status:</strong> ${data.status}</p>
      `,
    },
    [EmailTemplate.EXAM_SCHEDULED]: {
      subject: 'Your Exam is Scheduled',
      text: `Your exam has been scheduled for ${data.examDate}.`,
      html: `
        <h2>Exam Scheduled</h2>
        <p>Your exam has been scheduled.</p>
        <p><strong>Date:</strong> ${data.examDate}</p>
        <p><strong>Time:</strong> ${data.examTime}</p>
        <p><strong>Center:</strong> ${data.examCenter}</p>
      `,
    },
  };

  return (
    templates[template] || {
      subject: 'Notification from MTU Admissions',
      text: 'You have a notification',
      html: '<p>You have a notification</p>',
    }
  );
}

/**
 * Send bulk emails
 */
export async function sendBulkEmails(
  recipients: string[],
  template: EmailTemplate,
  dataList: Record<string, any>[]
): Promise<{
  sent: number;
  failed: number;
}> {
  let sent = 0;
  let failed = 0;

  for (let i = 0; i < recipients.length; i++) {
    try {
      await sendEmail(recipients[i], template, dataList[i] || {});
      sent++;
    } catch (error) {
      console.error(`Failed to send email to ${recipients[i]}`);
      failed++;
    }
  }

  return { sent, failed };
}
