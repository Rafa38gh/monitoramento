import { NextRequest, NextResponse } from "next/server";
import { userOnlineGauge } from "../../../lib/metrics";
export async function POST(req: NextRequest) {
  console.log("📤 API Logout POST chamada");

  try {
    // Criar resposta
    const response = NextResponse.json(
      {
        message: "Logout realizado com sucesso",
      },
      { status: 200 }
    );

    // Remover o cookie auth_token
    response.cookies.set("auth_token", "", {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 0, // Expira imediatamente
    });

    console.log("✅ Cookie auth_token removido (POST)");
    userOnlineGauge.dec(); // decrementa o número de usuários online
    return response;
  } catch (error) {
    console.error("Erro no logout:", error);
    return NextResponse.json(
      {
        message: "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}

// Também aceitar GET para caso o usuário acesse /api/logout diretamente
export async function GET(req: NextRequest) {
  console.log("📤 API Logout GET chamada");

  try {
    // Criar resposta de redirecionamento
    const response = NextResponse.redirect(new URL("/", req.url));

    // Remover o cookie auth_token
    response.cookies.set("auth_token", "", {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 0, // Expira imediatamente
    });

    console.log("✅ Cookie auth_token removido (GET)");
    return response;
  } catch (error) {
    console.error("Erro no logout GET:", error);
    const response = NextResponse.redirect(new URL("/", req.url));
    return response;
  }
}
