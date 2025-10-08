// Mock for next-auth/react
module.exports = {
  useSession: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
  getSession: jest.fn(),
  getCsrfToken: jest.fn(),
  getProviders: jest.fn(),
};