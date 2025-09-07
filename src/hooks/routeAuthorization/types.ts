
import { Session, User } from "@supabase/supabase-js";

export interface RouteAuthorizationOptions {
  adminOnly?: boolean;
  pharmacistOnly?: boolean;
  verifiedPharmacistOnly?: boolean;
}

export interface RouteAuthorizationState {
  loading: boolean;
  checkedStatus: 'loading' | 'complete';
  isAdmin: boolean;
  isPharmacist: boolean;
  isVerifiedPharmacist: boolean;
  session: Session | null;
  user: User | null;
  hasAccess: boolean;
  showAccessDeniedToast: (message: string) => void;
}
