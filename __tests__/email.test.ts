import { EmailService } from '@/lib/email/service';

// Mock modules first
jest.mock('@/lib/monitoring', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('nodemailer', () => ({
  createTransporter: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue({
      messageId: 'test-message-id',
    }),
  }),
}));

jest.mock('@/lib/production-config', () => ({
  productionConfig: {
    app: {
      name: 'Securitify',
      url: 'http://localhost:3000',
      env: 'test' as const,
      version: '1.0.0',
    },
    email: {
      smtp: {
        host: 'smtp.test.com',
        port: 587,
        secure: false,
        auth: {
          user: 'test@test.com',
          pass: 'testpass',
        },
      },
      from: 'test@test.com',
    },
    security: {
      cors: {
        origins: ['http://localhost:3000'],
        credentials: true,
      },
      rateLimit: {
        windowMs: 900000,
        max: 100,
      },
      headers: {
        csp: "default-src 'self'",
        permissionsPolicy: 'camera=(), microphone=(), geolocation=()',
      },
    },
    database: {
      pool: {
        min: 2,
        max: 10,
      },
      logging: false,
    },
    payment: {
      stripe: {
        publishableKey: 'pk_test',
        secretKey: 'sk_test',
        webhookSecret: 'whsec_test',
      },
    },
    storage: {
      provider: 'local' as const,
    },
    monitoring: {
      enabled: false,
      serviceName: 'securityguard-pro',
      version: '1.0.0',
    },
  },
}));

describe('EmailService', () => {
  let emailService: EmailService;

  beforeEach(() => {
    emailService = new EmailService();
    jest.clearAllMocks();
    
    // Reset the mock to always resolve successfully
    const nodemailer = require('nodemailer');
    nodemailer.createTransporter.mockReturnValue({
      sendMail: jest.fn().mockResolvedValue({
        messageId: 'test-message-id',
      }),
    });
  });

  describe('sendEmail', () => {
    it('should send email successfully', async () => {
      const emailOptions = {
        to: 'test@example.com',
        subject: 'Test Subject',
        html: '<p>Test Content</p>',
      };

      await emailService.sendEmail(emailOptions);

      expect(emailService['transporter'].sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'test@test.com',
          to: 'test@example.com',
          subject: 'Test Subject',
          html: '<p>Test Content</p>',
        })
      );
    });

    it('should handle email sending failure', async () => {
      const emailOptions = {
        to: 'test@example.com',
        subject: 'Test Subject',
        html: '<p>Test Content</p>',
      };

      // Mock sendMail to throw an error
      emailService['transporter'].sendMail = jest.fn().mockRejectedValue(new Error('Send failed'));

      await expect(emailService.sendEmail(emailOptions)).rejects.toThrow('Failed to send email');
    });

    it('should skip sending if SMTP not configured', async () => {
      // Import the mocked config
      const { productionConfig } = require('@/lib/production-config');
      
      // Override the config for this test
      const originalConfig = productionConfig.email.smtp.host;
      productionConfig.email.smtp.host = '';

      const emailOptions = {
        to: 'test@example.com',
        subject: 'Test Subject',
        html: '<p>Test Content</p>',
      };

      await emailService.sendEmail(emailOptions);

      expect(emailService['transporter'].sendMail).not.toHaveBeenCalled();

      // Restore config
      productionConfig.email.smtp.host = originalConfig;
    });
  });

  describe('sendWelcomeEmail', () => {
    it('should send welcome email with correct template', async () => {
      await emailService.sendWelcomeEmail(
        'Test Company',
        'admin@test.com',
        'John Doe'
      );

      expect(emailService['transporter'].sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'admin@test.com',
          subject: 'Welcome to Securitify - Your Account is Ready!',
          html: expect.stringContaining('Welcome to Securitify!'),
        })
      );
    });
  });

  describe('sendSubscriptionConfirmation', () => {
    it('should send subscription confirmation email', async () => {
      const nextBillingDate = new Date('2024-02-01');

      await emailService.sendSubscriptionConfirmation(
        'Test Company',
        'admin@test.com',
        'Professional',
        99,
        nextBillingDate
      );

      expect(emailService['transporter'].sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'admin@test.com',
          subject: 'Subscription Confirmed - Professional Plan Activated',
          html: expect.stringContaining('Professional'),
        })
      );
    });
  });

  describe('sendPaymentFailedEmail', () => {
    it('should send payment failed email', async () => {
      const retryDate = new Date('2024-02-01');

      await emailService.sendPaymentFailedEmail(
        'Test Company',
        'admin@test.com',
        99,
        retryDate
      );

      expect(emailService['transporter'].sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'admin@test.com',
          subject: 'Payment Failed - Action Required for Test Company',
          html: expect.stringContaining('Payment Failed'),
        })
      );
    });
  });

  describe('sendAlertEmail', () => {
    it('should send alert email with high severity', async () => {
      await emailService.sendAlertEmail(
        'admin@test.com',
        'John Doe',
        'Geofence Breach',
        'Guard has left the designated area',
        'Jane Smith',
        'high'
      );

      expect(emailService['transporter'].sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'admin@test.com',
          subject: 'Security Alert - Geofence Breach (HIGH)',
          html: expect.stringContaining('HIGH'),
        })
      );
    });

    it('should send alert email without guard name', async () => {
      await emailService.sendAlertEmail(
        'admin@test.com',
        'John Doe',
        'System Alert',
        'System maintenance scheduled',
        undefined,
        'medium'
      );

      expect(emailService['transporter'].sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'admin@test.com',
          subject: 'Security Alert - System Alert (MEDIUM)',
          html: expect.stringContaining('System Alert'),
        })
      );
    });
  });

  describe('sendLeaveApprovalEmail', () => {
    it('should send approved leave email', async () => {
      const startDate = new Date('2024-02-01');
      const endDate = new Date('2024-02-05');

      await emailService.sendLeaveApprovalEmail(
        'Jane Smith',
        'jane@test.com',
        'Vacation',
        startDate,
        endDate,
        true
      );

      expect(emailService['transporter'].sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'jane@test.com',
          subject: 'Leave Request Approved - Vacation',
          html: expect.stringContaining('Your leave request has been approved'),
        })
      );
    });

    it('should send rejected leave email with reason', async () => {
      const startDate = new Date('2024-02-01');
      const endDate = new Date('2024-02-05');

      await emailService.sendLeaveApprovalEmail(
        'Jane Smith',
        'jane@test.com',
        'Vacation',
        startDate,
        endDate,
        false,
        'Insufficient coverage'
      );

      expect(emailService['transporter'].sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'jane@test.com',
          subject: 'Leave Request Rejected - Vacation',
          html: expect.stringContaining('Insufficient coverage'),
        })
      );
    });
  });

  describe('sendMonthlyReportEmail', () => {
    it('should send monthly report email', async () => {
      const reportData = {
        totalGuards: 25,
        activePosts: 12,
        totalShifts: 450,
        attendanceRate: 95,
        alertsCount: 8,
      };

      await emailService.sendMonthlyReportEmail(
        'Test Company',
        'admin@test.com',
        'January',
        2024,
        reportData
      );

      expect(emailService['transporter'].sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'admin@test.com',
          subject: 'Monthly Security Report - January 2024',
          html: expect.stringContaining('95% attendance rate'),
        })
      );
    });
  });
});