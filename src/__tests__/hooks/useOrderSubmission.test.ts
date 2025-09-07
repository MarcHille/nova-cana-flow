
import { renderHook, act } from '@testing-library/react';
import { useOrderSubmission } from '@/hooks/useOrderSubmission';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockAuthState } from '../helpers/mockSupabase';

// Mock dependencies
vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn()
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn()
    },
    from: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    single: vi.fn(),
    maybeSingle: vi.fn()
  }
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

vi.mock('@/utils/orderValidation', () => ({
  validateCartHasProducts: vi.fn().mockReturnValue(true),
  validateOrderFormFields: vi.fn().mockReturnValue(true),
  validateUserCanCheckout: vi.fn().mockReturnValue(true)
}));

vi.mock('@/hooks/useOrderForm', () => ({
  useOrderForm: () => ({
    formData: {
      shippingName: "Test Pharmacy",
      shippingStreet: "Test Street 123",
      shippingCity: "Test City",
      shippingPostalCode: "12345",
      shippingCountry: "DE",
      billingName: "Test Pharmacy",
      billingStreet: "Test Street 123",
      billingCity: "Test City",
      billingPostalCode: "12345",
      billingCountry: "DE",
      paymentMethod: "invoice",
      notes: ""
    },
    handleInputChange: vi.fn(),
    handleSelectChange: vi.fn(),
    copyShippingToBilling: vi.fn()
  })
}));

vi.mock('@/hooks/useOrderCalculation', () => ({
  useOrderCalculation: () => ({
    calculateSubtotal: vi.fn().mockReturnValue(39.98)
  })
}));

describe('useOrderSubmission', () => {
  const mockCartItems = [
    { productId: '1', quantity: 2 }
  ];
  
  // Updated to provide all required Product interface properties
  const mockProducts = [
    { 
      id: '1', 
      name: 'Product 1', 
      price: 19.99,
      description: 'Test product description',
      shortDescription: 'Short description',
      imageUrl: '/placeholder.svg',
      category: 'test',
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  
  const mockClearCart = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup useToast mock
    (useToast as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      toast: vi.fn()
    });
  });
  
  it('should initialize with correct values', () => {
    const { result } = renderHook(() => 
      useOrderSubmission(mockCartItems, mockProducts, mockClearCart, mockNavigate)
    );
    
    expect(result.current.isLoading).toBe(false);
    expect(typeof result.current.handleSubmit).toBe('function');
    expect(typeof result.current.formatPrice).toBe('function');
  });
  
  it('should format price correctly', () => {
    const { result } = renderHook(() => 
      useOrderSubmission(mockCartItems, mockProducts, mockClearCart, mockNavigate)
    );
    
    const formattedPrice = result.current.formatPrice(19.99);
    expect(formattedPrice).toBe('19,99 €');
  });
  
  it('should handle form submission', async () => {
    const { result } = renderHook(() => 
      useOrderSubmission(mockCartItems, mockProducts, mockClearCart, mockNavigate)
    );
    
    const mockEvent = { preventDefault: vi.fn() };
    
    await act(async () => {
      await result.current.handleSubmit(mockEvent as unknown as React.FormEvent);
    });
    
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockClearCart).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith(expect.stringMatching(/^\/orders\/.+$/));
  });
});
