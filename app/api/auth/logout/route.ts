import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json({ message: 'Logged out successfully' });
    
    // Clear the token cookie
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0),
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Logout error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}