import nodemailer from 'nodemailer';
import { productionConfig } from '@/lib/production-config';
import { logger } from '@/lib/monitoring';

export interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
  cc?: string[];
  bcc?: string[];
}

export interface EmailAttachment {
  filename: string;
  content: Buffer | string;
  contentType?: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: productionConfig.email.smtp.host,
      port: productionConfig.email.smtp.port,
      secure: productionConfig.email.smtp.secure,
      auth: {
        user: productionConfig.email.smtp.auth.user,
        pass: productionConfig.email.smtp.auth.pass,
      },
    });
  }

  /**
   * Send an email
   */
  async sendEmail(options: EmailOptions, attachments?: EmailAttachment[]): Promise<void> {
    try {
      if (!productionConfig.email.smtp.host) {
        logger.warn('Email service not configured - skipping email send', { to: options.to, subject: options.subject });
        return;
      }

      const mailOptions: nodemailer.SendMailOptions = {
        from: options.from || productionConfig.email.from,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        cc: options.cc,
        bcc: options.bcc,
        attachments: attachments?.map(att => ({
          filename: att.filename,
          content: att.content,
          contentType: att.contentType,
        })),
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      logger.info('Email sent successfully', {
        to: options.to,
        subject: options.subject,
        messageId: result.messageId,
      });
    } catch (error) {
      logger.error('Failed to send email', {
        error: error instanceof Error ? error.message : 'Unknown error',
        to: options.to,
        subject: options.subject,
      });
      throw new Error('Failed to send email');
    }
  }

  /**
   * Send welcome email to new tenant
   */
  async sendWelcomeEmail(tenantName: string, userEmail: string, adminName: string): Promise<void> {
    const template = this.getWelcomeTemplate(tenantName, adminName);
    
    await this.sendEmail({
      to: userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  /**
   * Send subscription confirmation email
   */
  async sendSubscriptionConfirmation(
    tenantName: string,
    userEmail: string,
    planName: string,
    amount: number,
    nextBillingDate: Date
  ): Promise<void> {
    const template = this.getSubscriptionConfirmationTemplate(
      tenantName,
      planName,
      amount,
      nextBillingDate
    );
    
    await this.sendEmail({
      to: userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  /**
   * Send payment failed email
   */
  async sendPaymentFailedEmail(
    tenantName: string,
    userEmail: string,
    amount: number,
    retryDate?: Date
  ): Promise<void> {
    const template = this.getPaymentFailedTemplate(tenantName, amount, retryDate);
    
    await this.sendEmail({
      to: userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  /**
   * Send guard assignment notification
   */
  async sendGuardAssignmentEmail(
    guardName: string,
    guardEmail: string,
    postName: string,
    shiftStart: Date,
    shiftEnd: Date
  ): Promise<void> {
    const template = this.getGuardAssignmentTemplate(
      guardName,
      postName,
      shiftStart,
      shiftEnd
    );
    
    await this.sendEmail({
      to: guardEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  /**
   * Send attendance reminder email
   */
  async sendAttendanceReminderEmail(
    guardName: string,
    guardEmail: string,
    postName: string,
    shiftTime: Date
  ): Promise<void> {
    const template = this.getAttendanceReminderTemplate(
      guardName,
      postName,
      shiftTime
    );
    
    await this.sendEmail({
      to: guardEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  /**
   * Send alert notification email
   */
  async sendAlertEmail(
    recipientEmail: string,
    recipientName: string,
    alertType: string,
    alertMessage: string,
    guardName?: string,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ): Promise<void> {
    const template = this.getAlertTemplate(
      recipientName,
      alertType,
      alertMessage,
      guardName,
      severity
    );
    
    await this.sendEmail({
      to: recipientEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  /**
   * Send leave approval notification
   */
  async sendLeaveApprovalEmail(
    guardName: string,
    guardEmail: string,
    leaveType: string,
    startDate: Date,
    endDate: Date,
    approved: boolean,
    rejectionReason?: string
  ): Promise<void> {
    const template = this.getLeaveApprovalTemplate(
      guardName,
      leaveType,
      startDate,
      endDate,
      approved,
      rejectionReason
    );
    
    await this.sendEmail({
      to: guardEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  /**
   * Send monthly report email
   */
  async sendMonthlyReportEmail(
    tenantName: string,
    userEmail: string,
    month: string,
    year: number,
    reportData: {
      totalGuards: number;
      activePosts: number;
      totalShifts: number;
      attendanceRate: number;
      alertsCount: number;
    }
  ): Promise<void> {
    const template = this.getMonthlyReportTemplate(
      tenantName,
      month,
      year,
      reportData
    );
    
    await this.sendEmail({
      to: userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  // Email Templates
  private getWelcomeTemplate(tenantName: string, adminName: string): EmailTemplate {
    const appUrl = productionConfig.app.url;
    
    return {
      subject: `Welcome to ${productionConfig.app.name} - Your Account is Ready!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome to ${productionConfig.app.name}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to ${productionConfig.app.name}!</h1>
              <p>Your Security Management Platform</p>
            </div>
            <div class="content">
              <p>Hi ${adminName},</p>
              <p>Welcome to ${productionConfig.app.name}! We're excited to have <strong>${tenantName}</strong> on board.</p>
              <p>Your account has been successfully created and is ready to use. You can now start managing your security team with our comprehensive platform.</p>
              <p><a href="${appUrl}/auth/signin" class="button">Sign In to Your Account</a></p>
              <h3>What's Next?</h3>
              <ul>
                <li>✅ Sign in to your dashboard</li>
                <li>✅ Add your security guards</li>
                <li>✅ Set up your posts and locations</li>
                <li>✅ Configure geofences and alerts</li>
              </ul>
              <p>If you need any help getting started, check out our documentation or contact our support team.</p>
              <p>Best regards,<br>The ${productionConfig.app.name} Team</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 ${productionConfig.app.name}. All rights reserved.</p>
              <p>This email was sent to ${tenantName} administrators.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Welcome to ${productionConfig.app.name}!

Hi ${adminName},

Welcome to ${productionConfig.app.name}! We're excited to have ${tenantName} on board.

Your account has been successfully created and is ready to use. You can now start managing your security team with our comprehensive platform.

Sign in here: ${appUrl}/auth/signin

What's Next?
- Sign in to your dashboard
- Add your security guards
- Set up your posts and locations
- Configure geofences and alerts

If you need any help getting started, check out our documentation or contact our support team.

Best regards,
The ${productionConfig.app.name} Team`,
    };
  }

  private getSubscriptionConfirmationTemplate(
    tenantName: string,
    planName: string,
    amount: number,
    nextBillingDate: Date
  ): EmailTemplate {
    return {
      subject: `Subscription Confirmed - ${planName} Plan Activated`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Subscription Confirmed</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .plan-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .button { background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Subscription Confirmed!</h1>
              <p>Your ${planName} plan is now active</p>
            </div>
            <div class="content">
              <p>Hi ${tenantName} Team,</p>
              <p>Great news! Your subscription has been successfully confirmed and your ${planName} plan is now active.</p>
              
              <div class="plan-details">
                <h3>Subscription Details</h3>
                <p><strong>Plan:</strong> ${planName}</p>
                <p><strong>Amount:</strong> $${amount}/month</p>
                <p><strong>Next Billing Date:</strong> ${nextBillingDate.toLocaleDateString()}</p>
              </div>
              
              <p>You now have full access to all features included in your ${planName} plan. Start exploring your dashboard and make the most of our security management platform.</p>
              
              <p><a href="${productionConfig.app.url}/dashboard" class="button">Go to Dashboard</a></p>
              
              <p>Need help? Check out our documentation or contact our support team.</p>
              
              <p>Best regards,<br>The ${productionConfig.app.name} Team</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 ${productionConfig.app.name}. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Subscription Confirmed!

Hi ${tenantName} Team,

Great news! Your subscription has been successfully confirmed and your ${planName} plan is now active.

Subscription Details:
- Plan: ${planName}
- Amount: $${amount}/month
- Next Billing Date: ${nextBillingDate.toLocaleDateString()}

You now have full access to all features included in your ${planName} plan. Start exploring your dashboard and make the most of our security management platform.

Go to Dashboard: ${productionConfig.app.url}/dashboard

Need help? Check out our documentation or contact our support team.

Best regards,
The ${productionConfig.app.name} Team`,
    };
  }

  private getPaymentFailedTemplate(
    tenantName: string,
    amount: number,
    retryDate?: Date
  ): EmailTemplate {
    return {
      subject: `Payment Failed - Action Required for ${tenantName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Payment Failed</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .alert { background: #fed7d7; border: 1px solid #e53e3e; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .button { background: #e53e3e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚠️ Payment Failed</h1>
              <p>Action Required</p>
            </div>
            <div class="content">
              <p>Hi ${tenantName} Team,</p>
              
              <div class="alert">
                <strong>Important:</strong> We were unable to process your payment of $${amount} for your subscription.
              </div>
              
              <p><strong>What happened:</strong></p>
              <ul>
                <li>Your recent payment attempt failed</li>
                <li>Your subscription may be affected if payment is not updated</li>
                ${retryDate ? `<li>We will retry payment on ${retryDate.toLocaleDateString()}</li>` : ''}
              </ul>
              
              <p><strong>What you need to do:</strong></p>
              <ul>
                <li>Update your payment method in your billing settings</li>
                <li>Ensure your card has sufficient funds</li>
                <li>Contact your bank if there are any issues</li>
              </ul>
              
              <p><a href="${productionConfig.app.url}/dashboard/billing" class="button">Update Payment Method</a></p>
              
              <p>If you believe this is an error or need assistance, please contact our support team immediately.</p>
              
              <p>Best regards,<br>The ${productionConfig.app.name} Team</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 ${productionConfig.app.name}. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Payment Failed - Action Required

Hi ${tenantName} Team,

Important: We were unable to process your payment of $${amount} for your subscription.

What happened:
- Your recent payment attempt failed
- Your subscription may be affected if payment is not updated
${retryDate ? `- We will retry payment on ${retryDate.toLocaleDateString()}` : ''}

What you need to do:
- Update your payment method in your billing settings
- Ensure your card has sufficient funds
- Contact your bank if there are any issues

Update Payment Method: ${productionConfig.app.url}/dashboard/billing

If you believe this is an error or need assistance, please contact our support team immediately.

Best regards,
The ${productionConfig.app.name} Team`,
    };
  }

  private getGuardAssignmentTemplate(
    guardName: string,
    postName: string,
    shiftStart: Date,
    shiftEnd: Date
  ): EmailTemplate {
    return {
      subject: `New Assignment - ${postName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>New Assignment</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .assignment-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Assignment</h1>
              <p>You've been assigned to ${postName}</p>
            </div>
            <div class="content">
              <p>Hi ${guardName},</p>
              <p>You have been assigned to a new post. Please review the details below:</p>
              
              <div class="assignment-details">
                <h3>Assignment Details</h3>
                <p><strong>Post:</strong> ${postName}</p>
                <p><strong>Start Time:</strong> ${shiftStart.toLocaleString()}</p>
                <p><strong>End Time:</strong> ${shiftEnd.toLocaleString()}</p>
              </div>
              
              <p><strong>Important:</strong></p>
              <ul>
                <li>Arrive at least 15 minutes before your shift</li>
                <li>Check in using the mobile app when you arrive</li>
                <li>Keep your phone charged for GPS tracking</li>
                <li>Report any issues immediately</li>
              </ul>
              
              <p>If you have any questions about this assignment, please contact your supervisor.</p>
              
              <p>Best regards,<br>Your Security Team</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 ${productionConfig.app.name}. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `New Assignment - ${postName}

Hi ${guardName},

You have been assigned to a new post. Please review the details below:

Assignment Details:
- Post: ${postName}
- Start Time: ${shiftStart.toLocaleString()}
- End Time: ${shiftEnd.toLocaleString()}

Important:
- Arrive at least 15 minutes before your shift
- Check in using the mobile app when you arrive
- Keep your phone charged for GPS tracking
- Report any issues immediately

If you have any questions about this assignment, please contact your supervisor.

Best regards,
Your Security Team`,
    };
  }

  private getAttendanceReminderTemplate(
    guardName: string,
    postName: string,
    shiftTime: Date
  ): EmailTemplate {
    return {
      subject: `Shift Reminder - ${postName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Shift Reminder</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .reminder-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⏰ Shift Reminder</h1>
              <p>Your shift starts soon</p>
            </div>
            <div class="content">
              <p>Hi ${guardName},</p>
              <p>This is a reminder that your shift is starting soon. Please be prepared:</p>
              
              <div class="reminder-details">
                <h3>Shift Details</h3>
                <p><strong>Post:</strong> ${postName}</p>
                <p><strong>Start Time:</strong> ${shiftTime.toLocaleString()}</p>
              </div>
              
              <p><strong>Before your shift:</strong></p>
              <ul>
                <li>Ensure your phone is fully charged</li>
                <li>Download/open the mobile app</li>
                <li>Plan your route to arrive on time</li>
                <li>Have your uniform ready</li>
              </ul>
              
              <p>Remember to check in using the mobile app when you arrive at your post.</p>
              
              <p>Stay safe,<br>Your Security Team</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 ${productionConfig.app.name}. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Shift Reminder - ${postName}

Hi ${guardName},

This is a reminder that your shift is starting soon. Please be prepared:

Shift Details:
- Post: ${postName}
- Start Time: ${shiftTime.toLocaleString()}

Before your shift:
- Ensure your phone is fully charged
- Download/open the mobile app
- Plan your route to arrive on time
- Have your uniform ready

Remember to check in using the mobile app when you arrive at your post.

Stay safe,
Your Security Team`,
    };
  }

  private getAlertTemplate(
    recipientName: string,
    alertType: string,
    alertMessage: string,
    guardName?: string,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ): EmailTemplate {
    const severityColors = {
      low: '#48bb78',
      medium: '#ed8936',
      high: '#e53e3e',
      critical: '#742a2a'
    };

    return {
      subject: `Security Alert - ${alertType} (${severity.toUpperCase()})`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Security Alert</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, ${severityColors[severity]} 0%, ${severityColors[severity]}dd 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .alert-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${severityColors[severity]}; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚨 Security Alert</h1>
              <p>${alertType} - ${severity.toUpperCase()}</p>
            </div>
            <div class="content">
              <p>Hi ${recipientName},</p>
              
              <div class="alert-details">
                <h3>Alert Details</h3>
                <p><strong>Type:</strong> ${alertType}</p>
                <p><strong>Severity:</strong> ${severity.toUpperCase()}</p>
                ${guardName ? `<p><strong>Guard:</strong> ${guardName}</p>` : ''}
                <p><strong>Message:</strong> ${alertMessage}</p>
                <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
              </div>
              
              <p><strong>Recommended Actions:</strong></p>
              <ul>
                <li>Review the alert details in your dashboard</li>
                <li>Contact the guard if necessary</li>
                <li>Follow your company's protocol for this type of alert</li>
                <li>Document any actions taken</li>
              </ul>
              
              <p>Please check your dashboard for more details and to manage this alert.</p>
              
              <p>Best regards,<br>The ${productionConfig.app.name} Team</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 ${productionConfig.app.name}. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Security Alert - ${alertType} (${severity.toUpperCase()})

Hi ${recipientName},

Alert Details:
- Type: ${alertType}
- Severity: ${severity.toUpperCase()}
${guardName ? `- Guard: ${guardName}` : ''}
- Message: ${alertMessage}
- Time: ${new Date().toLocaleString()}

Recommended Actions:
- Review the alert details in your dashboard
- Contact the guard if necessary
- Follow your company's protocol for this type of alert
- Document any actions taken

Please check your dashboard for more details and to manage this alert.

Best regards,
The ${productionConfig.app.name} Team`,
    };
  }

  private getLeaveApprovalTemplate(
    guardName: string,
    leaveType: string,
    startDate: Date,
    endDate: Date,
    approved: boolean,
    rejectionReason?: string
  ): EmailTemplate {
    const status = approved ? 'Approved' : 'Rejected';
    const statusColor = approved ? '#48bb78' : '#e53e3e';

    return {
      subject: `Leave Request ${status} - ${leaveType}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Leave Request ${status}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, ${statusColor} 0%, ${statusColor}dd 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .leave-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Leave Request ${status}</h1>
              <p>Your ${leaveType} leave has been ${status.toLowerCase()}</p>
            </div>
            <div class="content">
              <p>Hi ${guardName},</p>
              
              <div class="leave-details">
                <h3>Leave Request Details</h3>
                <p><strong>Type:</strong> ${leaveType}</p>
                <p><strong>Start Date:</strong> ${startDate.toLocaleDateString()}</p>
                <p><strong>End Date:</strong> ${endDate.toLocaleDateString()}</p>
                <p><strong>Status:</strong> ${status}</p>
                ${rejectionReason ? `<p><strong>Reason:</strong> ${rejectionReason}</p>` : ''}
              </div>
              
              ${approved ? `
                <p><strong>✅ Your leave request has been approved!</strong></p>
                <p>Please ensure your duties are covered during your absence and coordinate with your team.</p>
              ` : `
                <p><strong>❌ Your leave request has been rejected.</strong></p>
                <p>${rejectionReason || 'Please review the reason above and contact your supervisor if you have any questions.'}</p>
              `}
              
              <p>If you have any questions about this decision, please contact your supervisor.</p>
              
              <p>Best regards,<br>Your Security Team</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 ${productionConfig.app.name}. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Leave Request ${status} - ${leaveType}

Hi ${guardName},

Leave Request Details:
- Type: ${leaveType}
- Start Date: ${startDate.toLocaleDateString()}
- End Date: ${endDate.toLocaleDateString()}
- Status: ${status}
${rejectionReason ? `- Reason: ${rejectionReason}` : ''}

${approved ? `
✅ Your leave request has been approved!
Please ensure your duties are covered during your absence and coordinate with your team.
` : `
❌ Your leave request has been rejected.
${rejectionReason || 'Please review the reason above and contact your supervisor if you have any questions.'}
`}

If you have any questions about this decision, please contact your supervisor.

Best regards,
Your Security Team`,
    };
  }

  private getMonthlyReportTemplate(
    tenantName: string,
    month: string,
    year: number,
    reportData: {
      totalGuards: number;
      activePosts: number;
      totalShifts: number;
      attendanceRate: number;
      alertsCount: number;
    }
  ): EmailTemplate {
    return {
      subject: `Monthly Security Report - ${month} ${year}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Monthly Security Report</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .metrics { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
            .metric { background: white; padding: 15px; border-radius: 8px; text-align: center; }
            .metric-value { font-size: 24px; font-weight: bold; color: #667eea; }
            .metric-label { font-size: 14px; color: #666; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Monthly Security Report</h1>
              <p>${month} ${year} - ${tenantName}</p>
            </div>
            <div class="content">
              <p>Hi ${tenantName} Team,</p>
              <p>Here's your monthly security report for ${month} ${year}:</p>
              
              <div class="metrics">
                <div class="metric">
                  <div class="metric-value">${reportData.totalGuards}</div>
                  <div class="metric-label">Total Guards</div>
                </div>
                <div class="metric">
                  <div class="metric-value">${reportData.activePosts}</div>
                  <div class="metric-label">Active Posts</div>
                </div>
                <div class="metric">
                  <div class="metric-value">${reportData.totalShifts}</div>
                  <div class="metric-label">Total Shifts</div>
                </div>
                <div class="metric">
                  <div class="metric-value">${reportData.attendanceRate}%</div>
                  <div class="metric-label">Attendance Rate</div>
                </div>
              </div>
              
              <div class="metric" style="grid-column: 1 / -1;">
                <div class="metric-value">${reportData.alertsCount}</div>
                <div class="metric-label">Total Alerts</div>
              </div>
              
              <h3>Key Insights</h3>
              <ul>
                <li>Your team maintained an impressive ${reportData.attendanceRate}% attendance rate</li>
                <li>${reportData.alertsCount} alerts were generated and managed this month</li>
                <li>${reportData.totalGuards} guards covered ${reportData.activePosts} active posts</li>
                <li>A total of ${reportData.totalShifts} shifts were completed successfully</li>
              </ul>
              
              <p>For detailed analytics and insights, please visit your dashboard.</p>
              
              <p>Best regards,<br>The ${productionConfig.app.name} Team</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 ${productionConfig.app.name}. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Monthly Security Report - ${month} ${year}

Hi ${tenantName} Team,

Here's your monthly security report for ${month} ${year}:

Key Metrics:
- Total Guards: ${reportData.totalGuards}
- Active Posts: ${reportData.activePosts}
- Total Shifts: ${reportData.totalShifts}
- Attendance Rate: ${reportData.attendanceRate}%
- Total Alerts: ${reportData.alertsCount}

Key Insights:
- Your team maintained an impressive ${reportData.attendanceRate}% attendance rate
- ${reportData.alertsCount} alerts were generated and managed this month
- ${reportData.totalGuards} guards covered ${reportData.activePosts} active posts
- A total of ${reportData.totalShifts} shifts were completed successfully

For detailed analytics and insights, please visit your dashboard.

Best regards,
The ${productionConfig.app.name} Team`,
    };
  }
}

// Export singleton instance
export const emailService = new EmailService();
export default EmailService;