import { NextResponse } from 'next/server';

export async function GET() {
    const scope = 'openid';

    // A URL para a qual a Riot irá redirecionar após o login
    const redirectUri = process.env.RIOT_REDIRECT_URI;
    const riotClientId = process.env.RIOT_CLIENT_ID;

    // Log para depuração
    console.log("-----------------------------------------");
    console.log("DEBUG: Iniciando autenticação com a Riot");
    console.log("Client ID utilizado:", riotClientId);
    console.log("URL de Redirecionamento utilizada:", redirectUri);
    console.log("-----------------------------------------");

    if (!riotClientId || !redirectUri) {
        console.error("Variáveis de ambiente da API da Riot não configuradas.");
        return NextResponse.json({ success: false, message: 'Configuração do servidor incompleta.' }, { status: 500 });
    }

    const responseType = 'code';

    const authorizationUrl = `https://auth.riotgames.com/authorize?` +
        `client_id=${riotClientId}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_type=${responseType}` +
        `&scope=${scope}`;

    console.log("URL de Autorização Completa:", authorizationUrl);
    console.log("-----------------------------------------");

    // Redirecionar o usuário para a página de login da Riot
    return NextResponse.redirect(authorizationUrl);
}
