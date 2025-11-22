import api from '@/src/core/api';
import { LoginSecurityRequest, UsuarioResponse, UsuarioSecurityRequest } from '@/src/core/types/usuario';
import LoginService from '@/src/shared/services/auth/login';
import RegisterService from '@/src/shared/services/auth/register';
import StorageService from '@/src/shared/services/auth/storage';
import UserService from '@/src/shared/services/usuario';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

// Interface para o contexto de autenticação
interface AuthContextData {
  token: string | null;
  userId: string | null;
  user: UsuarioResponse | null;
  isLoading: boolean; // Indica se está carregando os dados do storage
  login: (credentials: LoginSecurityRequest) => Promise<void>;
  register: (data: UsuarioSecurityRequest) => Promise<void>;
  logout: () => void;
}

// Cria o contexto
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Cria o provedor de autenticação
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<UsuarioResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Função para carregar dados do storage na inicialização
  useEffect(() => {
    async function loadStorageData() {
      try {
        const storedToken = await StorageService.returnToken();
        const storedUserId = await StorageService.returnUserId();

        if (storedToken && storedUserId) {
          // Define o token no header da API para futuras requisições
          api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          
          // Busca os dados do usuário logado
          const userData = await UserService.returnAuthUser();
          setUser(userData);
          setToken(storedToken);
          setUserId(storedUserId);
        }
      } catch (e) {
        console.error("Erro ao carregar dados do storage ou buscar perfil:", e);
        // Se der erro (ex: token expirado), limpa tudo
        await logout();
      } finally {
        setIsLoading(false);
      }
    }

    loadStorageData();
  }, []);
  // Função de Login
  const login = useCallback(async (credentials: LoginSecurityRequest) => {
    try {
      // 1. Valida o usuário e obtém token + userId do LoginService
      const { token: newToken, userId: newUserId } = await LoginService.validateUser(
        credentials.email,
        credentials.senha
      );

      // 2. Define o token no header da API
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      // 3. Busca os dados do perfil do usuário
      const userData = await UserService.returnAuthUser();

      // 4. Salva tudo no state
      setToken(newToken);
      setUserId(newUserId);
      setUser(userData);

      // 5. Salva no Storage (já é feito dentro do LoginService, mas garantimos)
      // O LoginService já salva token e userId, não precisamos repetir.

    } catch (error) {
      console.error("Erro no login (useAuth):", error);
      throw error; // Repassa o erro para a tela de Login tratar (ex: exibir toast)
    }
  }, []);

  // Função de Registro
  const register = useCallback(async (data: UsuarioSecurityRequest) => {
    try {
      await RegisterService.createUser(data);
      // A tela de Registro será responsável por chamar o login() após o sucesso
    } catch (error) {
      console.error("Erro no registro (useAuth):", error);
      throw error; // Repassa o erro para a tela de Registro
    }
  }, []);

  // Função de Logout
  const logout = useCallback(async () => {
    try {
      await StorageService.clearData();
      // Remove o token do header da API
      delete api.defaults.headers.common['Authorization'];
      // Limpa o state
      setToken(null);
      setUserId(null);
      setUser(null);
    } catch (e) {
      console.error("Erro ao fazer logout:", e);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, userId, user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto de autenticação
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
}