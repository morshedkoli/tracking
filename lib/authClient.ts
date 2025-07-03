'use client';

export async function getSession() {
  try {
    const response = await fetch('/api/auth/session');
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

export async function logout() {
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  } catch (error) {
    console.error('Error during logout:', error);
  }
}