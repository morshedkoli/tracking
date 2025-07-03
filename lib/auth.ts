import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, JWT_SECRET);
  return payload;
}

export async function login(token: string) {
  const cookieStore = cookies();
  cookieStore.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
  });
}

export async function logout() {
  const cookieStore = cookies();
  cookieStore.delete('token');
}

export async function getSession() {
  const cookieStore = cookies();
  const token = cookieStore.get('token');
  if (!token) return null;
  try {
    const session = await decrypt(token.value);
    return session;
  } catch (error) {
    return null;
  }
}

export async function validateRequest(request: NextRequest) {
  const token = request.cookies.get('token');
  if (!token) return null;
  try {
    const session = await decrypt(token.value);
    return session;
  } catch (error) {
    return null;
  }
}