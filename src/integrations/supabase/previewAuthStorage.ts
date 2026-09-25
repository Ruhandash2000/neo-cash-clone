/**
 * Custom authentication storage handler for browser environments.
 * Returns standard localStorage when running in standard Web environments.
 */
export function brokeredPreviewStorage(): Storage | undefined {
  if (typeof window === 'undefined') return undefined;
  return window.localStorage;
}
