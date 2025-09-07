
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { supabase } from '@/integrations/supabase/client';
import { checkIsAdmin, checkAdminExists, makeUserAdmin } from '@/utils/adminRoleUtils';
import { createMockUser, createMockListUsersResponse } from '@/__tests__/helpers/mockHelpers';

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
    insert: vi.fn().mockReturnThis(),
    auth: {
      admin: {
        listUsers: vi.fn()
      }
    }
  }
}));

describe('adminRoleUtils', () => {
  const userId = 'test-user-id';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('checkIsAdmin', () => {
    it('should return false when userId is not provided', async () => {
      const result = await checkIsAdmin('');
      expect(result).toBe(false);
    });

    it('should check admin status via edge function', async () => {
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

    it('should fall back to direct DB query if edge function fails', async () => {
      // Edge function fails
      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: null,
        error: new Error('Edge function failed')
      });

      // Direct query returns admin role
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
      
      expect(result).toBe(true);
    });

    it('should return false if both edge function and direct DB query fail', async () => {
      // Edge function fails
      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: null,
        error: new Error('Edge function failed')
      });

      // Direct query also fails
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              maybeSingle: vi.fn().mockResolvedValue({
                data: null,
                error: new Error('DB query failed')
              })
            })
          })
        })
      } as any);

      const result = await checkIsAdmin(userId);
      
      expect(result).toBe(false);
    });
  });

  describe('checkAdminExists', () => {
    it('should check if admin exists via edge function', async () => {
      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: { adminExists: true },
        error: null
      });

      const result = await checkAdminExists();
      
      expect(supabase.functions.invoke).toHaveBeenCalledWith('check-admin-exists');
      expect(result).toBe(true);
    });

    it('should fall back to direct DB query if edge function fails', async () => {
      // Edge function fails
      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: null,
        error: new Error('Edge function failed')
      });

      // Direct query shows admin exists
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            count: 2,
            error: null
          })
        })
      } as any);

      const result = await checkAdminExists();
      
      expect(result).toBe(true);
    });
  });

  describe('makeUserAdmin', () => {
    const testEmail = 'test@example.com';

    it('should make user admin via edge function', async () => {
      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: { success: true },
        error: null
      });

      const result = await makeUserAdmin(testEmail);
      
      expect(supabase.functions.invoke).toHaveBeenCalledWith('make-user-admin', {
        body: { email: testEmail }
      });
      expect(result).toBe(true);
    });

    it('should fall back to direct DB operations if edge function fails', async () => {
      // Edge function fails
      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: null,
        error: new Error('Edge function failed')
      });

      // Direct user lookup succeeds
      const mockUser = createMockUser({ id: userId, email: testEmail });
      
      // Use the updated helper function with pagination properties
      vi.mocked(supabase.auth.admin.listUsers).mockResolvedValueOnce({
        data: createMockListUsersResponse([mockUser]),
        error: null
      });

      // Role insertion succeeds
      vi.mocked(supabase.from).mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockResolvedValue({
            data: { user_id: userId, role: 'admin' },
            error: null
          })
        })
      } as any);

      const result = await makeUserAdmin(testEmail);
      
      expect(result).toBe(true);
    });
  });
});
