
/**
 * Represents the status of a role check operation
 */
export type CheckStatus = 'loading' | 'complete';

/**
 * The result of a role check operation
 */
export interface RoleCheckResult {
  isAdmin: boolean;
  isPharmacist: boolean;
  isVerifiedPharmacist: boolean;
  checkedStatus: CheckStatus;
  hasAccess: boolean;
}

/**
 * Options for role-based access control
 */
export interface RoleCheckOptions {
  adminOnly?: boolean;
  pharmacistOnly?: boolean;
  verifiedPharmacistOnly?: boolean;
}
