import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get('code')

    if (!code) {
        return NextResponse.redirect(new URL('/?error=AuthCodeMissing', req.url))
    }

    const { RIOT_CLIENT_ID, RIOT_CLIENT_SECRET, JWT_SECRET, NEXT_PUBLIC_APP_URL } = process.env
    const redirectUri = `${NEXT_PUBLIC_APP_URL}/api/auth/riot/callback`

    if (!RIOT_CLIENT_ID || !RIOT_CLIENT_SECRET || !JWT_SECRET || !NEXT_PUBLIC_APP_URL) {
        console.error('Variáveis de ambiente ausentes para o callback da Riot.')
        return NextResponse.redirect(new URL('/?error=ServerConfigError', req.url))
    }

    try {
        // 1. Trocar o código de autorização por um access token
        const tokenResponse = await fetch('https://auth.riotgames.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${Buffer.from(`${RIOT_CLIENT_ID}:${RIOT_CLIENT_SECRET}`).toString('base64')}`,
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: redirectUri,
            }),
        })

        const tokenData = await tokenResponse.json()

        if (!tokenResponse.ok) {
            // --- PASSO DE DEBUG ---
            console.log("-----------------------------------------");
            console.error("DEBUG: Erro ao obter token da Riot.");
            console.error("Status da Resposta:", tokenResponse.status);
            console.error("Corpo da Resposta (Erro):", tokenData);
            console.log("-----------------------------------------");
            // --- FIM DO PASSO DE DEBUG ---
            return NextResponse.redirect(new URL(`/?error=${tokenData.error || 'TokenError'}`, req.url))
        }

        // 2. Usar o access token para obter informações do usuário
        const userInfoResponse = await fetch('https://americas.api.riotgames.com/riot/account/v1/accounts/me', {
            headers: {
                'Authorization': `Bearer ${tokenData.access_token}`,
            },
        })

        const userInfo = await userInfoResponse.json()

        if (!userInfoResponse.ok) {
            console.error('Erro ao obter informações do usuário da Riot:', userInfo)
            return NextResponse.redirect(new URL(`/?error=${userInfo.status?.message || 'UserInfoError'}`, req.url))
        }

        // 3. Preparar dados para o JWT
        const userPayload = {
            puuid: userInfo.puuid,
            gameName: userInfo.gameName,
            tagLine: userInfo.tagLine,
        }

        // 4. Criar o JWT
        const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '7d' })

        // 5. Redirecionar para o dashboard e definir o cookie
        const redirectUrl = new URL('/dashboard', req.url)
        const response = NextResponse.redirect(redirectUrl)

        response.cookies.set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 7 dias
        })

        return response

    } catch (error) {
        console.error('Erro inesperado no callback da Riot:', error)
        return NextResponse.redirect(new URL('/?error=InternalServerError', req.url))
    }
}

// Permitir apenas GET requests
export async function POST() {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
} 