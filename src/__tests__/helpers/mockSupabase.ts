
import { Session, User, AuthError } from "@supabase/supabase-js";
import { createMockUser, createMockSession, createMockAuthError } from "./mockHelpers";
import { vi } from "vitest";

/**
 * Creates a mock Supabase client with methods that can be easily mocked
 */
export const createMockSupabaseClient = () => {
  return {
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: { session: createMockSession() },
        error: null
      }),
      getUser: vi.fn().mockResolvedValue({
        data: { user: createMockUser() },
        error: null
      }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } }))
    },
    from: vi.fn().mockImplementation((table) => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      is: vi.fn().mockReturnThis(),
      match: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: {}, error: null }),
      maybeSingle: vi.fn().mockResolvedValue({ data: {}, error: null }),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      range: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
      returns: vi.fn().mockResolvedValue({ data: [], error: null }),
      data: [],
      error: null
    })),
    storage: {
      from: vi.fn().mockImplementation((bucket) => ({
        upload: vi.fn().mockResolvedValue({ data: { Key: 'test-file' }, error: null }),
        download: vi.fn().mockResolvedValue({ data: new Blob(), error: null }),
        getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'https://example.com/test-file' } })
      }))
    }
  };
};

/**
 * Helper to mock the Auth state for testing
 */
export const mockAuthState = (
  isAuthenticated: boolean = true, 
  isAdmin: boolean = false, 
  isPharmacist: boolean = false,
  isVerified: boolean = false
) => {
  if (isAuthenticated) {
    return {
      auth: {
        getSession: vi.fn().mockResolvedValue({
          data: { 
            session: createMockSession({
              user: createMockUser({
                email: isAdmin ? 'admin@example.com' : 
                      isPharmacist ? 'pharmacist@example.com' : 'user@example.com'
              })
            }) 
          },
          error: null
        })
      },
      from: vi.fn().mockImplementation((table) => {
        if (table === 'user_roles') {
          let roles = [];
          if (isAdmin) roles.push({ role: 'admin' });
          if (isPharmacist) roles.push({ role: 'pharmacist' });
          
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            returns: vi.fn().mockResolvedValue({ 
              data: roles,
              error: null 
            }),
            maybeSingle: vi.fn().mockResolvedValue({
              data: isPharmacist ? { role: 'pharmacist' } : (isAdmin ? { role: 'admin' } : null),
              error: null
            })
          };
        }
        
        if (table === 'pharmacy_verification') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({
              data: isVerified ? { verification_status: 'approved' } : null,
              error: null
            })
          };
        }
        
        return createMockSupabaseClient().from(table);
      })
    };
  } else {
    return {
      auth: {
        getSession: vi.fn().mockResolvedValue({
          data: { session: null },
          error: createMockAuthError('User is not authenticated')
        })
      }
    };
  }
};
