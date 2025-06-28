import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
    const token = req.cookies.get('auth_token')?.value;

    if (!token) {
        return NextResponse.json({ isAuthenticated: false, user: null }, { status: 200 });
    }

    const { JWT_SECRET } = process.env;

    if (!JWT_SECRET) {
        console.error("JWT_SECRET não está configurado no servidor.");
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return NextResponse.json({ isAuthenticated: true, user: decoded }, { status: 200 });
    } catch (error) {
        // Token inválido ou expirado
        console.log("Verificação de token falhou:", error);

        // Retornar uma resposta explícita de "não autenticado" e instruir o navegador a limpar o cookie inválido.
        const response = NextResponse.json({ isAuthenticated: false, user: null }, { status: 200 });
        response.cookies.set('auth_token', '', { maxAge: -1, path: '/' });

        return response;
    }
}
