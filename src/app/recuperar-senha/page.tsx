"use client";

import React, { useState } from "react";

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMensagem("");
    setLoading(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

      const response = await fetch(`${baseUrl}/api/recuperar-senha`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setMensagem(data.message || "Verifique seu e-mail.");
    } catch (err) {
      console.error(err);
      setMensagem("Erro ao enviar solicitação.");
    }

    setLoading(false);
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border-l-4 border-blue-600">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Recuperar Senha</h2>
        <p className="text-gray-600 mb-6">
          Informe seu e-mail e enviaremos um link para redefinir sua senha.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">E-mail</label>
            <input
              type="email"
              className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:bg-blue-400"
          >
            {loading ? "Enviando..." : "Enviar link"}
          </button>
        </form>

        {mensagem && (
          <p className="text-center text-gray-700 mt-4 bg-gray-100 p-2 rounded">
            {mensagem}
          </p>
        )}
      </div>
    </div>
  );
}
