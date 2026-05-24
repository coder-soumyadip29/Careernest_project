/**
 * Shared validation utilities for auth forms.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 8;

/**
 * Individual password requirement checks (for real-time checklist UI).
 */
export const passwordRequirements = [
  { label: 'At least 8 characters', test: (pw: string) => pw.length >= PASSWORD_MIN_LENGTH },
  { label: 'One uppercase letter', test: (pw: string) => /[A-Z]/.test(pw) },
  { label: 'One lowercase letter', test: (pw: string) => /[a-z]/.test(pw) },
  { label: 'One number', test: (pw: string) => /\d/.test(pw) },
  { label: 'One special character (@$!%*?&#^())', test: (pw: string) => /[@$!%*?&#^()]/.test(pw) },
] as const;

/**
 * Validate email format.
 * @returns error string or null if valid.
 */
export function validateEmail(email: string): string | null {
  if (!email.trim()) return 'Email is required.';
  if (!EMAIL_REGEX.test(email)) return 'Please enter a valid email address.';
  return null;
}

/**
 * Validate password strength.
 * @returns error string or null if valid.
 */
export function validatePassword(password: string): string | null {
  if (!password) return 'Password is required.';
  const failed = passwordRequirements.filter((r) => !r.test(password));
  if (failed.length > 0) {
    return 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special character.';
  }
  return null;
}

/**
 * Validate that password and confirm-password match.
 */
export function validatePasswordMatch(password: string, confirm: string): string | null {
  if (!confirm) return 'Please confirm your password.';
  if (password !== confirm) return 'Passwords do not match.';
  return null;
}

/**
 * Validate name is not empty.
 */
export function validateName(name: string): string | null {
  if (!name.trim()) return 'Name is required.';
  if (name.trim().length < 2) return 'Name must be at least 2 characters.';
  return null;
}

/**
 * Map Firebase Auth error codes to user-friendly messages.
 */
export function getFirebaseErrorMessage(code: string): string {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password is too weak. Please choose a stronger password.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Contact support.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
}
