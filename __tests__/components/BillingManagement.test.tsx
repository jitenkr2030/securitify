import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BillingManagement from '@/components/BillingManagement';
import { useSession } from 'next-auth/react';

// Mock next-auth/react
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
  getSession: jest.fn(),
  getCsrfToken: jest.fn(),
  getProviders: jest.fn(),
}));

// Mock jose and openid-client to avoid ES module issues
jest.mock('jose', () => ({
  compactDecrypt: jest.fn(),
}));
jest.mock('openid-client', () => ({
  Issuer: {
    discover: jest.fn(),
  },
}));
jest.mock('@panva/hkdf', () => ({
  derive: jest.fn(),
}));
jest.mock('preact', () => ({
  render: jest.fn(),
  renderToStaticMarkup: jest.fn(),
  renderToString: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

describe('BillingManagement', () => {
  const mockSession = {
    data: {
      user: {
        tenantId: 'tenant_test123',
        name: 'Test User',
        email: 'test@example.com',
      },
      expires: '2024-12-31T23:59:59.999Z',
    },
    status: 'authenticated',
  };

  const mockSubscription = {
    id: 'sub_test123',
    status: 'active',
    plan: 'professional',
    currentPeriodStart: new Date().toISOString(),
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    cancelAtPeriodEnd: false,
    amount: 99,
    currency: 'usd',
  };

  const mockUsage = {
    guards: {
      current: 15,
      limit: 50,
      percentage: 30,
    },
    posts: {
      current: 8,
      limit: 20,
      percentage: 40,
    },
    apiCalls: {
      current: 500,
      limit: 5000,
      percentage: 10,
    },
  };

  const mockInvoices = [
    {
      id: 'inv_test123',
      amount: 99,
      currency: 'usd',
      status: 'paid',
      created: new Date().toISOString(),
      pdfUrl: 'https://stripe.com/invoice/pdf',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useSession as jest.Mock).mockReturnValue(mockSession);
    
    // Reset fetch mock
    (fetch as jest.Mock).mockClear();
  });

  it('should render loading state initially', () => {
    (fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));

    render(<BillingManagement />);

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should render subscription details when loaded', async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSubscription),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockInvoices),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockUsage),
      });

    render(<BillingManagement />);

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Current Subscription')).toBeInTheDocument();
    expect(screen.getByText('professional')).toBeInTheDocument();
    expect(screen.getByText('$99 USD')).toBeInTheDocument();
  });

  it('should render usage overview when loaded', async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSubscription),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockInvoices),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockUsage),
      });

    render(<BillingManagement />);

    await waitFor(() => {
      expect(screen.getByText('Usage Overview')).toBeInTheDocument();
    });

    expect(screen.getByText('Guards')).toBeInTheDocument();
    expect(screen.getByText('Posts')).toBeInTheDocument();
    expect(screen.getByText('API Calls')).toBeInTheDocument();
  });

  it('should render no subscription state when no subscription exists', async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(null),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(null),
      });

    render(<BillingManagement />);

    await waitFor(() => {
      expect(screen.getByText('No Active Subscription')).toBeInTheDocument();
    });

    expect(screen.getByText('You need an active subscription to use all features')).toBeInTheDocument();
    expect(screen.getByText('Subscribe Now')).toBeInTheDocument();
  });

  it('should handle manage billing click', async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSubscription),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockInvoices),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockUsage),
      });

    // Mock portal session creation
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ url: 'https://billing.stripe.com/test' }),
    });

    // Mock window.open
    const mockOpen = jest.fn();
    window.open = mockOpen;

    render(<BillingManagement />);

    await waitFor(() => {
      expect(screen.getByText('Manage Billing')).toBeInTheDocument();
    });

    const manageButton = screen.getByText('Manage Billing');
    fireEvent.click(manageButton);

    await waitFor(() => {
      expect(mockOpen).toHaveBeenCalledWith('https://billing.stripe.com/test', '_blank');
    });
  });

  it('should handle upgrade plan click', async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSubscription),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockInvoices),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockUsage),
      });

    // Mock checkout session creation
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ url: 'https://checkout.stripe.com/test' }),
    });

    // Mock window.location.href
    const originalLocation = window.location;
    delete (window as any).location;
    (window as any).location = { href: '' };

    render(<BillingManagement />);

    await waitFor(() => {
      expect(screen.getByText('Upgrade Plan')).toBeInTheDocument();
    });

    // Click on upgrade plan tab
    const upgradeTab = screen.getByText('Upgrade Plan');
    fireEvent.click(upgradeTab);

    await waitFor(() => {
      expect(screen.getByText('Basic')).toBeInTheDocument();
    });

    // Click on basic plan upgrade button
    const upgradeButton = screen.getAllByText('Basic')[1]; // Second occurrence is the button
    fireEvent.click(upgradeButton);

    await waitFor(() => {
      expect(window.location.href).toBe('https://checkout.stripe.com/test');
    });

    // Restore original location
    (window as any).location = originalLocation;
  });

  it('should display cancellation warning when subscription cancels at period end', async () => {
    const cancellingSubscription = {
      ...mockSubscription,
      cancelAtPeriodEnd: true,
    };

    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(cancellingSubscription),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockInvoices),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockUsage),
      });

    render(<BillingManagement />);

    await waitFor(() => {
      expect(screen.getByText('Cancels at period end')).toBeInTheDocument();
    });

    expect(screen.getByText(/Your subscription will be cancelled at the end of the current billing period/)).toBeInTheDocument();
  });

  it('should render invoices list', async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSubscription),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockInvoices),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockUsage),
      });

    render(<BillingManagement />);

    await waitFor(() => {
      expect(screen.getByText('Billing History')).toBeInTheDocument();
    });

    expect(screen.getByText('$99 USD')).toBeInTheDocument();
    expect(screen.getByText('paid')).toBeInTheDocument();
  });

  it('should display no invoices when empty', async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSubscription),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockUsage),
      });

    render(<BillingManagement />);

    await waitFor(() => {
      expect(screen.getByText('No invoices found')).toBeInTheDocument();
    });
  });
});