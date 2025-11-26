'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, TrendingUp, Calendar, DollarSign } from 'lucide-react';

interface Boi {
  id: number;
  peso: number | null;
}

interface Lote {
  id: number;
  codigo: string;
  vacinado: boolean;
  data_venda?: string | null;
  bois?: Boi[];
  quantidadeBois?: number;
  pesoMedio?: number;
}

interface Estatisticas {
  totalLotes: number;
  totalBois: number;
  pesoMedioGeral: number;
  lotesVacinados: number;
}

const PeaoPage = () => {
  const [estatisticas, setEstatisticas] = useState<Estatisticas>({
    totalLotes: 0,
    totalBois: 0,
    pesoMedioGeral: 0,
    lotesVacinados: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEstatisticas();
  }, []);

  const fetchEstatisticas = async () => {
    try {
      const response = await fetch('/api/lotes');
      if (!response.ok) throw new Error('Falha ao buscar lotes');
      
      const lotes: Lote[] = await response.json();
      console.log("Lotes recebidos:", lotes);

      // Filtrar apenas lotes ativos (não vendidos)
      const lotesAtivos = lotes.filter(lote => !lote.data_venda);

      // total de lotes (apenas ativos)
      const totalLotes = lotesAtivos.length;

      // total de bois (somando bois[] ou quantidadeBois) - apenas de lotes ativos
      let totalBois = 0;
      let somaPesos = 0;
      lotesAtivos.forEach((lote) => {
        if (Array.isArray(lote.bois) && lote.bois.length > 0) {
          lote.bois.forEach((boi) => {
            if (typeof boi.peso === "number" && !isNaN(boi.peso)) {
              somaPesos += boi.peso;
              totalBois++;
            }
          });
        } else if (lote.quantidadeBois && lote.pesoMedio) {
          somaPesos += lote.quantidadeBois * lote.pesoMedio;
          totalBois += lote.quantidadeBois;
        }
      });

      // média geral segura
      const pesoMedioGeral =
        totalBois > 0 ? somaPesos / totalBois : 0;

      const lotesVacinados = lotesAtivos.filter((l) => l.vacinado).length;

      setEstatisticas({
        totalLotes,
        totalBois,
        pesoMedioGeral,
        lotesVacinados,
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64 text-gray-600">
        Carregando dashboard...
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard - Peão</h1>
        <p className="text-gray-600">
          Visão geral dos lotes e bois sob sua responsabilidade
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card icon={<Users className="h-6 w-6 text-green-600" />} label="Total de Lotes" value={estatisticas.totalLotes} />
        <Card icon={<Users className="h-6 w-6 text-green-600" />} label="Total de Bois" value={estatisticas.totalBois} />
        <Card icon={<TrendingUp className="h-6 w-6 text-green-600" />} label="Peso Médio Geral" value={`${estatisticas.pesoMedioGeral.toFixed(1)} kg`} />
        <Card icon={<Calendar className="h-6 w-6 text-green-600" />} label="Lotes Vacinados" value={estatisticas.lotesVacinados} />
      </div>

      {/* Ações Rápidas */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Ações Rápidas
          </h3>
          <div className="space-y-3">
            <Link href="/peao/lote">
              <Button
                icon={<Users className="h-5 w-5 mr-3" />}
                title="Gerenciar Lotes"
                subtitle="Visualizar e gerenciar lotes"
              />
            </Link>

            <Link href="/peao/novo-lote">
              <Button
                icon={<DollarSign className="h-5 w-5 mr-3" />}
                title="Novo Lote"
                subtitle="Cadastrar novo lote"
              />
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Informações Importantes
          </h3>
          <div className="space-y-3 text-sm text-gray-600">
            <InfoDot text="Sistema funcionando normalmente" />
            <InfoDot text={`${estatisticas.totalBois} bois em acompanhamento`} />
            <InfoDot text={`${estatisticas.lotesVacinados} lotes vacinados`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeaoPage;

/* === Componentes auxiliares === */
const Card = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) => (
  <div className="bg-white p-6 rounded-lg shadow border">
    <div className="flex items-center">
      <div className="p-2 bg-green-100 rounded-lg">{icon}</div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

const Button = ({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) => (
  <button className="w-full text-left px-4 py-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors">
    <div className="flex items-center">
      {icon}
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-green-600">{subtitle}</p>
      </div>
    </div>
  </button>
);

const InfoDot = ({ text }: { text: string }) => (
  <div className="flex items-center">
    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
    {text}
  </div>
);
