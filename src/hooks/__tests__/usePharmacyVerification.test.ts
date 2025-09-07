
import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { usePharmacyVerification } from '@/hooks/usePharmacyVerification';
import * as pharmacistRoleUtils from '@/utils/pharmacistRoleUtils';

// Mock pharmacistRoleUtils
vi.mock('@/utils/pharmacistRoleUtils', () => ({
  requestPharmacyVerification: vi.fn()
}));

// Mock toast
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: vi.fn() })
}));

describe('usePharmacyVerification', () => {
  const userId = 'test-user-id';
  const loadUsers = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should request pharmacy verification successfully', async () => {
    vi.mocked(pharmacistRoleUtils.requestPharmacyVerification).mockResolvedValue(true);

    const { result } = renderHook(() => usePharmacyVerification(loadUsers));

    await act(async () => {
      await result.current.requestPharmacyVerification(userId);
    });

    expect(pharmacistRoleUtils.requestPharmacyVerification).toHaveBeenCalledWith(userId);
    expect(loadUsers).toHaveBeenCalled();
    expect(result.current.isProcessing).toBe(false);
  });

  it('should handle verification request failure', async () => {
    vi.mocked(pharmacistRoleUtils.requestPharmacyVerification).mockResolvedValue(false);

    const { result } = renderHook(() => usePharmacyVerification(loadUsers));

    await act(async () => {
      await expect(result.current.requestPharmacyVerification(userId)).rejects.toThrow();
    });

    expect(pharmacistRoleUtils.requestPharmacyVerification).toHaveBeenCalledWith(userId);
    expect(loadUsers).not.toHaveBeenCalled();
    expect(result.current.isProcessing).toBe(false);
  });

  it('should sanitize user ID input', async () => {
    vi.mocked(pharmacistRoleUtils.requestPharmacyVerification).mockResolvedValue(true);

    const { result } = renderHook(() => usePharmacyVerification(loadUsers));

    await act(async () => {
      await result.current.requestPharmacyVerification('  test-user-id  ');
    });

    expect(pharmacistRoleUtils.requestPharmacyVerification).toHaveBeenCalledWith('test-user-id');
    expect(loadUsers).toHaveBeenCalled();
  });

  it('should validate user ID input', async () => {
    const { result } = renderHook(() => usePharmacyVerification(loadUsers));

    await act(async () => {
      await expect(result.current.requestPharmacyVerification('')).rejects.toThrow('Ungültige Benutzer-ID');
    });

    expect(pharmacistRoleUtils.requestPharmacyVerification).not.toHaveBeenCalled();
  });

  it('should not allow concurrent verification requests', async () => {
    const delayedPromise = new Promise<boolean>(resolve => setTimeout(() => resolve(true), 100));
    vi.mocked(pharmacistRoleUtils.requestPharmacyVerification).mockReturnValue(delayedPromise);

    const { result } = renderHook(() => usePharmacyVerification(loadUsers));

    // Start first request
    const firstRequest = act(async () => {
      await result.current.requestPharmacyVerification(userId);
    });

    // Try second request while first is processing
    const secondRequest = act(async () => {
      await result.current.requestPharmacyVerification('another-id');
    });

    await firstRequest;
    await secondRequest;

    // Should only have called once
    expect(pharmacistRoleUtils.requestPharmacyVerification).toHaveBeenCalledTimes(1);
    expect(pharmacistRoleUtils.requestPharmacyVerification).toHaveBeenCalledWith(userId);
  });
});
