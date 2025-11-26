'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, 
  Users, 
  BarChart3, 
  LogOut,
  User,
  Bell
} from 'lucide-react';
import { logout } from '../../../lib/auth';

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [naoLidas, setNaoLidas] = useState(0);
  const [nomeUsuario, setNomeUsuario] = useState<string>('Peão');

  useEffect(() => {
    fetchNaoLidas();
    fetchUsuarioAtual();
    const interval = setInterval(fetchNaoLidas, 30000); // Atualiza a cada 30 segundos
    
    // Escutar evento de atualização de notificações
    const handleNotificacoesAtualizadas = (event: CustomEvent) => {
      setNaoLidas(event.detail.naoLidas || 0);
    };
    
    window.addEventListener('notificacoesAtualizadas', handleNotificacoesAtualizadas as EventListener);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('notificacoesAtualizadas', handleNotificacoesAtualizadas as EventListener);
    };
  }, []);

  const fetchUsuarioAtual = async () => {
    try {
      const response = await fetch('/api/usuario/atual');
      if (response.ok) {
        const data = await response.json();
        if (data.name) {
          // Pegar apenas o primeiro nome
          const primeiroNome = data.name.split(' ')[0];
          setNomeUsuario(primeiroNome);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
    }
  };

  const fetchNaoLidas = async () => {
    try {
      const response = await fetch('/api/notificacoes?apenasNaoLidas=true');
      if (response.ok) {
        const data = await response.json();
        setNaoLidas(data.naoLidas || 0);
      }
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    }
  };

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/peao',
      icon: Home,
    },
    {
      name: 'Gerenciar Lotes',
      href: '/peao/lote',
      icon: Users,
    },
    {
      name: 'Notificações',
      href: '/peao/notificacoes',
      icon: Bell,
      badge: naoLidas,
    },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="bg-green-800 text-white w-64 min-h-screen p-4">
      <div className="flex items-center mb-8">
        <div className="bg-green-600 p-2 rounded-lg mr-3">
          <User className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold">PastoSmart</h1>
          <p className="text-sm text-gray-300">{nomeUsuario}</p>
        </div>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-green-600 text-white'
                  : 'text-gray-300 hover:bg-green-700 hover:text-white'
              }`}
            >
              <div className="flex items-center">
                <Icon className="h-5 w-5 mr-3" />
                {item.name}
              </div>
              {item.badge && item.badge > 0 && (
                <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 pt-4 border-t border-green-700">
        <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-gray-300 hover:bg-green-700 hover:text-white rounded-lg transition-colors">
          <LogOut className="h-5 w-5 mr-3" />
          Sair
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
