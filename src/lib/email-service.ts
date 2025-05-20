import sgMail from '@sendgrid/mail';

// Initialize SendGrid with API key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

/**
 * Send an email using SendGrid
 */
export async function sendEmail(options: EmailOptions) {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('SENDGRID_API_KEY is not set. Email will not be sent.');
    return;
  }

  const msg = {
    to: options.to,
    from: process.env.SENDGRID_FROM_EMAIL || 'no-reply@aireach.com',
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  try {
    await sgMail.send(msg);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

/**
 * Send a webinar registration confirmation email
 */
export async function sendWebinarRegistrationEmail(
  email: string,
  webinarTitle: string,
  webinarDate: string,
  joinLink: string
) {
  const subject = `You're Registered: ${webinarTitle}`;
  
  const text = `
    Thank you for registering for "${webinarTitle}" on ${webinarDate}.
    
    Please use this link to join the webinar: ${joinLink}
    
    We look forward to seeing you there!
    
    - The Aireach Team
  `;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>You're Registered!</h2>
      <p>Thank you for registering for <strong>${webinarTitle}</strong> on <strong>${webinarDate}</strong>.</p>
      
      <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
        <p><strong>Join Link:</strong> <a href="${joinLink}" style="color: #4f46e5;">${joinLink}</a></p>
      </div>
      
      <p>We look forward to seeing you there!</p>
      
      <p style="margin-top: 40px; color: #666;">- The Aireach Team</p>
    </div>
  `;
  
  return sendEmail({
    to: email,
    subject,
    text,
    html,
  });
}

/**
 * Send a webinar reminder email
 */
export async function sendWebinarReminderEmail(
  email: string,
  webinarTitle: string,
  webinarDate: string,
  webinarTime: string,
  joinLink: string
) {
  const subject = `Reminder: ${webinarTitle} starts soon`;
  
  const text = `
    This is a reminder that "${webinarTitle}" is scheduled for ${webinarDate} at ${webinarTime}.
    
    Please use this link to join the webinar: ${joinLink}
    
    We look forward to seeing you there!
    
    - The Aireach Team
  `;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Your Webinar Starts Soon!</h2>
      <p>This is a reminder that <strong>${webinarTitle}</strong> is scheduled for <strong>${webinarDate}</strong> at <strong>${webinarTime}</strong>.</p>
      
      <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
        <p><strong>Join Link:</strong> <a href="${joinLink}" style="color: #4f46e5;">${joinLink}</a></p>
      </div>
      
      <p>We look forward to seeing you there!</p>
      
      <p style="margin-top: 40px; color: #666;">- The Aireach Team</p>
    </div>
  `;
  
  return sendEmail({
    to: email,
    subject,
    text,
    html,
  });
}

/**
 * Send a webinar follow-up email
 */
export async function sendWebinarFollowUpEmail(
  email: string,
  webinarTitle: string,
  replayLink?: string
) {
  const subject = `Thank you for attending: ${webinarTitle}`;
  
  const text = `
    Thank you for attending "${webinarTitle}".
    
    ${replayLink ? `You can watch the replay here: ${replayLink}` : ''}
    
    We hope you found the session valuable. If you have any questions, please don't hesitate to reach out.
    
    - The Aireach Team
  `;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Thank You for Attending!</h2>
      <p>Thank you for attending <strong>${webinarTitle}</strong>.</p>
      
      ${replayLink ? `
      <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
        <p><strong>Watch the Replay:</strong> <a href="${replayLink}" style="color: #4f46e5;">${replayLink}</a></p>
      </div>
      ` : ''}
      
      <p>We hope you found the session valuable. If you have any questions, please don't hesitate to reach out.</p>
      
      <p style="margin-top: 40px; color: #666;">- The Aireach Team</p>
    </div>
  `;
  
  return sendEmail({
    to: email,
    subject,
    text,
    html,
  });
} 