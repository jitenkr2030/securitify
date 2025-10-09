// Mock for next-auth
module.exports = {
  default: jest.fn(),
  getServerSession: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
  useSession: jest.fn(),
  getSession: jest.fn(),
  providers: [],
};