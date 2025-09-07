
import { AuthError, Session, User } from "@supabase/supabase-js";
import { vi } from "vitest";

/**
 * Creates a mock Supabase User object with required properties
 */
export const createMockUser = (overrides?: Partial<User>): User => ({
  id: 'test-user-id',
  email: 'test@example.com',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: '2023-01-01T00:00:00.000Z',
  updated_at: null,
  phone: null,
  confirmed_at: null,
  email_confirmed_at: null,
  phone_confirmed_at: null,
  last_sign_in_at: null,
  role: null,
  factors: null,
  identities: [],
  ...overrides
});

/**
 * Creates a mock Supabase Session object with required properties
 */
export const createMockSession = (overrides?: Partial<Session>): Session => ({
  access_token: 'test-access-token',
  refresh_token: 'test-refresh-token',
  expires_in: 3600,
  token_type: 'bearer',
  user: createMockUser(),
  ...overrides
});

/**
 * Creates a mock AuthError that follows the Supabase AuthError structure
 */
export const createMockAuthError = (message: string = 'Authentication error', status: number = 400): AuthError => {
  // This is a workaround since we cannot directly instantiate AuthError
  const error = new Error(message) as any;
  error.name = 'AuthError';
  error.status = status;
  error.code = 'generic_error';
  
  // Create a private property that matches the signature
  Object.defineProperty(error, '__isAuthError', {
    value: true,
    writable: false,
    configurable: false,
    enumerable: false
  });
  
  return error as AuthError;
};

/**
 * Creates a mock admin.listUsers response with pagination properties
 */
export const createMockListUsersResponse = (users: User[], aud: string = 'authenticated') => ({
  users,
  aud,
  // Add the required pagination properties
  nextPage: null,
  lastPage: 1,
  total: users.length
});
