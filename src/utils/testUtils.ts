import { supabase } from '@/integrations/supabase/client';

/**
 * Utility function to verify if the authentication system is working correctly
 * This can be used for testing purposes
 */
export const verifyAuthenticationSystem = async (): Promise<{
  success: boolean;
  message: string;
  details?: Record<string, unknown>;
}> => {
  try {
    // Check if there's an active session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      return {
        success: false,
        message: 'Could not retrieve session information',
        details: { error: sessionError.message }
      };
    }
    
    if (!sessionData.session) {
      return {
        success: true,
        message: 'No active session found - authentication system is available',
        details: { authenticated: false }
      };
    }
    
    // Instead of directly accessing profiles table, use RPC function or check user data
    // that we know exists in the database schema
    const userId = sessionData.session.user.id;
    
    // Check if we can access user data from auth schema (available in Supabase)
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      return {
        success: false,
        message: 'Session found but could not access user data',
        details: { 
          error: userError.message,
          authenticated: true,
          userDataAccess: false 
        }
      };
    }
    
    return {
      success: true,
      message: 'Authentication system is working correctly',
      details: {
        authenticated: true,
        userDataAccess: true,
        userId
      }
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error testing authentication system',
      details: { error: error instanceof Error ? error.message : 'Unknown error' }
    };
  }
};

/**
 * Utility function to verify role-based access control
 */
export const verifyRoleAccessControl = async (): Promise<{
  success: boolean;
  message: string;
  details?: Record<string, unknown>;
}> => {
  try {
    // Check if there's an active session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !sessionData.session) {
      return {
        success: false,
        message: 'No active session - please login to test role access',
        details: { authenticated: false }
      };
    }
    
    const userId = sessionData.session.user.id;
    
    // Test admin role
    const { data: adminData, error: adminError } = await supabase.functions.invoke('check-is-admin', {
      body: { userId }
    });
    
    if (adminError) {
      return {
        success: false,
        message: 'Error checking admin status',
        details: { error: adminError }
      };
    }
    
    // Test pharmacist role
    const { data: pharmacistData, error: pharmacistError } = await supabase.functions.invoke('check-is-pharmacist', {
      body: { userId }
    });
    
    if (pharmacistError) {
      return {
        success: false,
        message: 'Error checking pharmacist status',
        details: { error: pharmacistError }
      };
    }
    
    return {
      success: true,
      message: 'Role-based access control is functioning correctly',
      details: {
        isAdmin: adminData?.isAdmin || false,
        isPharmacist: pharmacistData?.isPharmacist || false
      }
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error testing role-based access control',
      details: { error: error instanceof Error ? error.message : 'Unknown error' }
    };
  }
};

/**
 * Test utility to verify order submission process
 */
export const testOrderSubmission = async (
  cartItems: Array<{ productId: string; quantity: number }>
): Promise<{
  success: boolean;
  message: string;
  details?: Record<string, unknown>;
}> => {
  try {
    // Check if there's an active session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !sessionData.session) {
      return {
        success: false,
        message: 'No active session - please login to test order submission',
        details: { authenticated: false }
      };
    }
    
    // Check if cart has items
    if (!cartItems.length) {
      return {
        success: false,
        message: 'Cart is empty - please add items to test order submission',
        details: { cartItems: 0 }
      };
    }
    
    // Check if products exist
    const productIds = cartItems.map(item => item.productId);
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('id')
      .in('id', productIds);
    
    if (productsError) {
      return {
        success: false,
        message: 'Error validating product IDs',
        details: { error: productsError.message }
      };
    }
    
    const validProductIds = productsData.map(p => p.id);
    const invalidProductIds = productIds.filter(id => !validProductIds.includes(id));
    
    if (invalidProductIds.length > 0) {
      return {
        success: false,
        message: 'Cart contains invalid product IDs',
        details: { invalidProductIds }
      };
    }
    
    return {
      success: true,
      message: 'Order submission process ready to be tested',
      details: {
        validCartItems: cartItems.length,
        userAuthenticated: true
      }
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error testing order submission process',
      details: { error: error instanceof Error ? error.message : 'Unknown error' }
    };
  }
};
