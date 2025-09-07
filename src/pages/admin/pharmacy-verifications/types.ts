
import { Json } from "@/integrations/supabase/types";

export interface PharmacyVerification {
  id: string;
  user_id: string;
  verification_status: string;
  license_id: string;
  business_documents: string[];
  contact_details: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
    contactPerson?: string;
    email?: string;
  };
  submitted_at: string;
  reviewed_at: string | null;
  reviewer_id: string | null;
  rejection_reason: string | null;
  user_email: string | null;
  notification_shown?: boolean;
}
