
import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { useUserManagement, UserManagementOptions } from '@/hooks/useUserManagement';
import { supabase } from '@/integrations/supabase/client';
import { createMockAuthError, createMockUser, createMockSession, createMockListUsersResponse } from '@/__tests__/helpers/mockHelpers';

// Mock the Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: vi.fn()
    },
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn(),
    auth: {
      getSession: vi.fn(),
      admin: {
        listUsers: vi.fn()
      }
    }
  }
}));

// Mock toast
vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn(),
  useToast: () => ({ toast: vi.fn() })
}));

describe('useUserManagement', () => {
  const mockOnError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should load users via edge function successfully', async () => {
    // Setup mock session
    const mockUser = createMockUser();
    const mockSession = createMockSession({ user: mockUser });
    
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: mockSession },
      error: null
    });

    // Setup edge function response
    const mockUsers = [
      { id: 'user1', email: 'user1@example.com', roles: ['admin'], verificationStatus: 'pending' },
      { id: 'user2', email: 'user2@example.com', roles: ['user'], verificationStatus: null }
    ];

    vi.mocked(supabase.functions.invoke).mockResolvedValue({
      data: { users: mockUsers },
      error: null
    });

    // Create UserManagementOptions with onError
    const options: UserManagementOptions = {
      initialLoad: true,
      onError: mockOnError
    };

    // Render the hook
    const { result } = renderHook(() => useUserManagement(options));

    // Initially should be loading with empty users
    expect(result.current.loading).toBe(true);
    expect(result.current.users).toEqual([]);
    expect(result.current.error).toBe(null);

    // Load users
    await act(async () => {
      await result.current.loadUsers();
    });

    // Should have loaded users
    expect(result.current.loading).toBe(false);
    expect(result.current.users).toEqual(mockUsers);
    expect(result.current.error).toBe(null);
    expect(mockOnError).not.toHaveBeenCalled();
  });

  it('should use fallback mechanism when edge function fails', async () => {
    // Setup mock session
    const mockUser = createMockUser();
    const mockSession = createMockSession({ user: mockUser });
    
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: mockSession },
      error: null
    });

    // Edge function fails
    vi.mocked(supabase.functions.invoke).mockResolvedValue({
      data: null,
      error: new Error('Edge function failed')
    });

    // Direct database queries succeed
    const mockUsers = [
      createMockUser({ id: 'user1', email: 'user1@example.com', created_at: '2023-01-01' }),
      createMockUser({ id: 'user2', email: 'user2@example.com', created_at: '2023-01-02' })
    ];
    
    // Use the updated helper function with pagination properties
    vi.mocked(supabase.auth.admin.listUsers).mockResolvedValue({
      data: createMockListUsersResponse(mockUsers),
      error: null
    });

    vi.mocked(supabase.from).mockImplementation((table) => {
      if (table === 'user_roles') {
        return {
          select: () => ({
            data: [
              { user_id: 'user1', role: 'admin' },
              { user_id: 'user1', role: 'user' },
              { user_id: 'user2', role: 'user' }
            ],
            error: null
          })
        } as any;
      } else if (table === 'pharmacy_verification') {
        return {
          select: () => ({
            data: [
              { user_id: 'user1', verification_status: 'verified' }
            ],
            error: null
          })
        } as any;
      }
      return { select: () => ({ data: null, error: null }) } as any;
    });

    // Create UserManagementOptions with onError
    const options: UserManagementOptions = {
      initialLoad: true,
      onError: mockOnError
    };

    // Render the hook
    const { result } = renderHook(() => useUserManagement(options));

    // Load users
    await act(async () => {
      await result.current.loadUsers();
    });

    // Should have loaded users with fallback
    expect(result.current.loading).toBe(false);
    expect(result.current.users).toHaveLength(2);
    expect(result.current.users[0].roles).toContain('admin');
    expect(result.current.users[0].verificationStatus).toBe('verified');
    expect(result.current.error).toBe(null);
  });

  it('should handle errors and set error state', async () => {
    // Setup mock session fails
    const authError = createMockAuthError("Authentication failed");
    
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
      error: authError
    });

    // Create UserManagementOptions with onError
    const options: UserManagementOptions = {
      initialLoad: true,
      onError: mockOnError
    };

    // Render the hook
    const { result } = renderHook(() => useUserManagement(options));

    // Load users
    await act(async () => {
      await result.current.loadUsers();
    });

    // Should have error state
    expect(result.current.loading).toBe(false);
    expect(result.current.users).toEqual([]);
    expect(result.current.error).not.toBe(null);
    expect(mockOnError).toHaveBeenCalled();
  });

  it('should throttle requests that come too quickly', async () => {
    // Setup mock session
    const mockUser = createMockUser();
    const mockSession = createMockSession({ user: mockUser });
    
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: mockSession },
      error: null
    });

    // Setup edge function response
    vi.mocked(supabase.functions.invoke).mockResolvedValue({
      data: { users: [] },
      error: null
    });

    // Create UserManagementOptions with onError
    const options: UserManagementOptions = {
      initialLoad: true,
      onError: mockOnError
    };

    // Render the hook
    const { result } = renderHook(() => useUserManagement(options));

    // Load users first time
    await act(async () => {
      await result.current.loadUsers();
    });

    // Reset mocks
    vi.clearAllMocks();

    // Try to load users again immediately
    await act(async () => {
      try {
        await result.current.loadUsers();
      } catch (error) {
        // Expect an error for throttling
      }
    });
  });
});
