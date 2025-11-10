import { useState, useCallback, useEffect } from 'react';
import { AulaResponse } from '@/src/core/types/aulas';
import TurmaService from '@/src/shared/services/turma';

/**
 * Hook para buscar as aulas de uma turma específica.
 * Recarrega os dados se o turmaId mudar.
 */
export const useAulas = (turmaId: number | null) => {
  const [aulas, setAulas] = useState<AulaResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAulas = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await TurmaService.getAulasByTurmaId(id);
      if (data) {
        setAulas(data);
      } else {
        // O serviço pode retornar undefined em caso de erro interno
        setError('Não foi possível carregar as aulas.');
      }
    } catch (err) {
      console.error(`Erro no hook useAulas (turmaId: ${id}):`, err);
      setError('Ocorreu um erro ao buscar as aulas.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (turmaId) {
      fetchAulas(turmaId);
    } else {
      setAulas([]); // Limpa as aulas se não houver ID
    }
  }, [turmaId, fetchAulas]);

  return { aulas, isLoading, error, refetch: () => turmaId ? fetchAulas(turmaId) : Promise.resolve() };
};