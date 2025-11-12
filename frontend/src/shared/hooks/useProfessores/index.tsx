import { TurmaResponse } from '@/src/core/types/turma';
import { UsuarioDadosResponse } from '@/src/core/types/usuario';
import ProfessorService from '@/src/shared/services/professor';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

/**
 * Hook para buscar a lista de todos os professores.
 * Recarrega os dados automaticamente sempre que a tela ganha foco.
 */
export const useProfessores = () => {
  const [professores, setProfessores] = useState<UsuarioDadosResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfessores = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ProfessorService.listarProfessores();
      if (data) {
        setProfessores(data);
      } else {
        setError('Não foi possível carregar os professores.');
      }
    } catch (err) {
      console.error('Erro no hook useProfessores:', err);
      setError('Ocorreu um erro ao buscar os dados.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchProfessores();
    }, [fetchProfessores])
  );

  return { professores, isLoading, error, refetch: fetchProfessores };
};

/**
 * Hook para buscar os detalhes de um professor (dados + turmas).
 * Recarrega os dados se o ID mudar.
 */
export const useProfessorDetalhes = (id: number | null) => {
  const [professor, setProfessor] = useState<UsuarioDadosResponse | null>(null);
  const [turmas, setTurmas] = useState<TurmaResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetalhes = useCallback(async (professorId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      // Busca os dados do professor e as turmas em paralelo
      const [professorData, turmasData] = await Promise.all([
        ProfessorService.retornarProfessorPorId(professorId),
        ProfessorService.retornarTurmasPorProfessor(professorId)
      ]);

      if (professorData) {
        setProfessor(professorData);
      } else {
        setError('Professor não encontrado.');
      }
      
      setTurmas(turmasData || []); // Armazena dados das turmas

    } catch (err) {
      console.error(`Erro no hook useProfessorDetalhes (id: ${professorId}):`, err);
      setError('Ocorreu um erro ao buscar os detalhes do professor.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchDetalhes(id);
    } else {
      // Limpa os dados se o ID for nulo
      setProfessor(null);
      setTurmas([]);
    }
  }, [id, fetchDetalhes]);

  return { professor, turmas, isLoading, error, refetch: () => id ? fetchDetalhes(id) : Promise.resolve() };
};