
import { renderHook, act } from '@testing-library/react';
import { useOrderForm } from '@/hooks/useOrderForm';
import { describe, it, expect } from 'vitest';

describe('useOrderForm', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useOrderForm());
    
    expect(result.current.formData).toEqual({
      shippingName: "",
      shippingStreet: "",
      shippingCity: "",
      shippingPostalCode: "",
      shippingCountry: "Germany",
      billingName: "",
      billingStreet: "",
      billingCity: "",
      billingPostalCode: "",
      billingCountry: "Germany",
      paymentMethod: "invoice",
      notes: "",
    });
  });

  it('should update input fields correctly', () => {
    const { result } = renderHook(() => useOrderForm());
    
    act(() => {
      result.current.handleInputChange({
        target: { name: 'shippingName', value: 'John Doe' }
      } as React.ChangeEvent<HTMLInputElement>);
    });
    
    expect(result.current.formData.shippingName).toBe('John Doe');
  });

  it('should update select fields correctly', () => {
    const { result } = renderHook(() => useOrderForm());
    
    act(() => {
      result.current.handleSelectChange('paymentMethod')('credit_card');
    });
    
    expect(result.current.formData.paymentMethod).toBe('credit_card');
  });

  it('should copy shipping to billing information', () => {
    const { result } = renderHook(() => useOrderForm());
    
    // Set shipping information
    act(() => {
      result.current.handleInputChange({
        target: { name: 'shippingName', value: 'John Doe' }
      } as React.ChangeEvent<HTMLInputElement>);
      
      result.current.handleInputChange({
        target: { name: 'shippingStreet', value: '123 Main St' }
      } as React.ChangeEvent<HTMLInputElement>);
      
      result.current.handleInputChange({
        target: { name: 'shippingCity', value: 'Berlin' }
      } as React.ChangeEvent<HTMLInputElement>);
      
      result.current.handleInputChange({
        target: { name: 'shippingPostalCode', value: '10115' }
      } as React.ChangeEvent<HTMLInputElement>);
    });
    
    // Copy shipping to billing
    act(() => {
      result.current.copyShippingToBilling();
    });
    
    // Verify billing information matches shipping
    expect(result.current.formData.billingName).toBe('John Doe');
    expect(result.current.formData.billingStreet).toBe('123 Main St');
    expect(result.current.formData.billingCity).toBe('Berlin');
    expect(result.current.formData.billingPostalCode).toBe('10115');
    expect(result.current.formData.billingCountry).toBe('Germany');
  });
});
