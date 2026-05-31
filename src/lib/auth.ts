import { cookies } from 'next/headers';
import crypto from 'crypto';

// Creates a cryptographic signature of the environment credentials
export function getSessionSignature(): string {
  const secret = process.env.SESSION_SECRET || 'fallback-secret-key-123';
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'securepassword123';
  
  return crypto
    .createHmac('sha256', secret)
    .update(`${username}:${password}`)
    .digest('hex');
}

// Check if the current request is authenticated
export async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get('wedding_session')?.value;
  
  if (!sessionValue) return false;
  return sessionValue === getSessionSignature();
}
