/**
 * Encrypts / hashes a password string on the client side before network transmission.
 * Prevents plain-text passwords from appearing in browser DevTools Network payloads.
 */
export async function hashPasswordClient(password: string): Promise<string> {
  if (!password) return '';
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
