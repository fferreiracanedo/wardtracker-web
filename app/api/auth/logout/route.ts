import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const response = NextResponse.json({ success: true, message: 'Logout successful' });

        // Define o cookie com uma data de expiração no passado para removê-lo
        response.cookies.set('auth_token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: -1, // Expira imediatamente
        });

        return response;
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
