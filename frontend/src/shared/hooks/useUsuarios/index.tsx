import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { UsuarioResponse } from '@/src/core/types/usuario';
import UserService from '@/src/shared/services/usuario';

/**
 * Hook para buscar a lista de usuários ATIVOS.
 * Recarrega os dados automaticamente sempre que a tela ganha foco.
 */
export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState<UsuarioResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsuarios = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await UserService.returnActiveUsers();
      if (data) {
        setUsuarios(data);
      } else {
        setError('Não foi possível carregar os usuários.');
      }
    } catch (err) {
      console.error('Erro no hook useUsuarios:', err);
      setError('Ocorreu um erro ao buscar os dados.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // useFocusEffect recarrega os dados toda vez que a tela/componente ganha foco
  useFocusEffect(
    useCallback(() => {
      fetchUsuarios();
    }, [fetchUsuarios])
  );

  return { usuarios, isLoading, error, refetch: fetchUsuarios };
};

/**
 * Hook para buscar um usuário específico pelo ID.
 * Recarrega os dados se o ID mudar.
 */
export const useUsuario = (id: number | null) => {
  const [usuario, setUsuario] = useState<UsuarioResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsuario = useCallback(async (userId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await UserService.returnUser(userId);
      if (data) {
        setUsuario(data);
      } else {
        setError('Usuário não encontrado.');
      }
    } catch (err) {
      console.error(`Erro no hook useUsuario (id: ${userId}):`, err);
      setError('Ocorreu um erro ao buscar o usuário.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // useEffect normal, pois só queremos recarregar se o ID mudar
  useEffect(() => {
    if (id) {
      fetchUsuario(id);
    } else {
      setUsuario(null); // Limpa os dados se o ID for nulo
    }
  }, [id, fetchUsuario]);

  return { usuario, isLoading, error, refetch: () => id ? fetchUsuario(id) : Promise.resolve() };
};