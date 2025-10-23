
export interface EmailRequest {
  email: string;
  type: "signup" | "recovery" | "contact" | "pharmacy-verification" | "pharmacy-verification-request";
  name?: string;
  pharmacyName?: string;
  message?: string;
  attachments?: string[];
  verificationId?: string;
  status?: string;
  reason?: string;
  fromEmail?: string;
  toEmail?: string;
  redirectTo?: string;
}
