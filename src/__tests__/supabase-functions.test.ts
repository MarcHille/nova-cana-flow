
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { supabase } from '@/integrations/supabase/client';
import { checkIsAdmin } from '@/utils/adminRoleUtils';
import { checkIsPharmacist, requestPharmacyVerification } from '@/utils/pharmacistRoleUtils';
import { getUserRoles, addUserRole, removeUserRole } from '@/utils/userRoleUtils';
import { createMockUser, createMockSession } from './helpers/mockHelpers';

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
      getUser: vi.fn()
    },
    rpc: vi.fn()
  }
}));

// Mock toast
vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn(),
  useToast: () => ({ toast: vi.fn() })
}));

describe('Supabase Function Tests', () => {
  const userId = 'test-user-id';
  const mockUser = createMockUser({ id: userId });
  const mockSession = createMockSession({ user: mockUser });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('adminRoleUtils', () => {
    it('should check if user is admin using edge function', async () => {
      // Edge function returns true
      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: { isAdmin: true },
        error: null
      });

      const result = await checkIsAdmin(userId);
      
      expect(supabase.functions.invoke).toHaveBeenCalledWith('check-is-admin', {
        body: { userId }
      });
      expect(result).toBe(true);
    });

    it('should fall back to direct DB check if edge function fails', async () => {
      // Edge function fails
      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: null,
        error: new Error('Edge function failed')
      });

      // Direct DB check succeeds
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              maybeSingle: vi.fn().mockResolvedValue({
                data: { role: 'admin' },
                error: null
              })
            })
          })
        })
      } as any);

      const result = await checkIsAdmin(userId);
      
      expect(supabase.functions.invoke).toHaveBeenCalledWith('check-is-admin', {
        body: { userId }
      });
      expect(result).toBe(true);
    });
  });

  describe('pharmacistRoleUtils', () => {
    it('should check if user is pharmacist using edge function', async () => {
      // Edge function returns true
      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: { isPharmacist: true },
        error: null
      });

      const result = await checkIsPharmacist(userId);
      
      expect(supabase.functions.invoke).toHaveBeenCalledWith('check-is-pharmacist', {
        body: { userId }
      });
      expect(result).toBe(true);
    });

    it('should request pharmacy verification successfully', async () => {
      // Verification request succeeds
      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: { 
          success: true,
          message: "Verification request created successfully"
        },
        error: null
      });

      const result = await requestPharmacyVerification(userId);
      
      expect(supabase.functions.invoke).toHaveBeenCalledWith('request-pharmacy-verification', {
        body: { userId }
      });
      expect(result).toBe(true);
    });
  });

  describe('userRoleUtils', () => {
    it('should get user roles using edge function', async () => {
      const expectedRoles = ['admin', 'user'];
      
      // Edge function returns roles
      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: { roles: expectedRoles },
        error: null
      });

      const result = await getUserRoles(userId);
      
      expect(supabase.functions.invoke).toHaveBeenCalledWith('get-user-roles', {
        body: { userId }
      });
      expect(result).toEqual(expectedRoles);
    });

    it('should add user role successfully', async () => {
      // Role addition succeeds
      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: { 
          success: true,
          message: "Role added successfully"
        },
        error: null
      });

      const result = await addUserRole(userId, 'admin');
      
      expect(supabase.functions.invoke).toHaveBeenCalledWith('manage-user-roles', {
        body: { userId, role: 'admin', action: 'add' }
      });
      expect(result).toBe(true);
    });

    it('should remove user role successfully', async () => {
      // Role removal succeeds
      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: { 
          success: true,
          message: "Role removed successfully"
        },
        error: null
      });

      const result = await removeUserRole(userId, 'admin');
      
      expect(supabase.functions.invoke).toHaveBeenCalledWith('manage-user-roles', {
        body: { userId, role: 'admin', action: 'remove' }
      });
      expect(result).toBe(true);
    });
  });
});
