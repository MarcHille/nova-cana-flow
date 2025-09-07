
export interface UserManagementOptions {
  initialLoad?: boolean;
  onError?: (error: string | null) => void;
  maxRetries?: number;
  showToasts?: boolean;
}
