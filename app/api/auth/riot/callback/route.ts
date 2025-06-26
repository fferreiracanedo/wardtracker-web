import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const error = searchParams.get('error')
    const state = searchParams.get('state')

    // Se houve erro na autorização
    if (error) {
        console.error('Erro na autorização Riot:', error)
        return NextResponse.redirect(
            new URL(`/?error=${encodeURIComponent('Erro na autorização com Riot Games')}`, request.url)
        )
    }

    // Se não recebeu o código de autorização
    if (!code) {
        return NextResponse.redirect(
            new URL(`/?error=${encodeURIComponent('Código de autorização não recebido')}`, request.url)
        )
    }

    try {
        // Trocar código por token no backend
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
        const response = await fetch(`${apiUrl}/auth/riot/callback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code,
                redirect_uri: `${request.nextUrl.origin}/api/auth/riot/callback`,
            }),
        })

        const data = await response.json()

        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Erro na autenticação')
        }

        // Sucesso - redirecionar para dashboard com token
        const redirectUrl = new URL('/dashboard', request.url)
        redirectUrl.searchParams.set('token', data.token)
        redirectUrl.searchParams.set('user', JSON.stringify(data.user))

        return NextResponse.redirect(redirectUrl)

    } catch (error) {
        console.error('Erro no callback da Riot:', error)
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'

        return NextResponse.redirect(
            new URL(`/?error=${encodeURIComponent(errorMessage)}`, request.url)
        )
    }
}

// Permitir apenas GET requests
export async function POST() {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
} 