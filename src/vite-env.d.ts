
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_RESEND_API_KEY?: string;
  readonly VITE_ALLOWED_EMAIL_DOMAINS?: string;
  readonly VITE_ADMIN_EMAIL?: string;
  readonly VITE_APP_ENV?: 'development' | 'production' | 'test';
  readonly VITE_ENABLE_SECURITY_FEATURES?: 'true' | 'false';
  readonly VITE_MAX_RATE_LIMIT_ATTEMPTS?: string;
  readonly VITE_RATE_LIMIT_WINDOW_MS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
