
import { Session, User } from "@supabase/supabase-js";

export interface AuthenticationOptions {
  adminRequired?: boolean;
  pharmacistRequired?: boolean;
  verifiedPharmacistRequired?: boolean;
}

export interface AuthenticationState {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isPharmacist: boolean;
  isVerifiedPharmacist: boolean;
  loading: boolean;
  authChecked: boolean;
  checkedStatus: 'loading' | 'complete';
}
