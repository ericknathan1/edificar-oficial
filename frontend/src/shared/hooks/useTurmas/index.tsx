import { AlunoDadosResponse } from '@/src/core/types/alunos';
import { AulaResponse } from '@/src/core/types/aulas';
import { TurmaResponse } from '@/src/core/types/turma';
import { UsuarioDadosResponse } from '@/src/core/types/usuario';
import TurmaService from '@/src/shared/services/turma';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

/**
 * Hook para buscar a lista de turmas ATIVAS.
 * Recarrega os dados automaticamente sempre que a tela ganha foco.
 */
export const useTurmas = () => {
  const [turmas, setTurmas] = useState<TurmaResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTurmas = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await TurmaService.returnTurmasAtivas();
      if (data) {
        setTurmas(data);
      } else {
        setError('Não foi possível carregar as turmas.');
      }
    } catch (err) {
      console.error('Erro no hook useTurmas:', err);
      setError('Ocorreu um erro ao buscar os dados.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchTurmas();
    }, [fetchTurmas])
  );

  return { turmas, isLoading, error, refetch: fetchTurmas };
};

/**
 * Hook para buscar todos os detalhes de uma turma (dados, professores, alunos, aulas).
 * Recarrega os dados se o ID mudar.
 */
export const useTurmaDetalhes = (id: number | null) => {
  const [turma, setTurma] = useState<TurmaResponse | null>(null);
  const [professores, setProfessores] = useState<UsuarioDadosResponse[]>([]);
  const [alunos, setAlunos] = useState<AlunoDadosResponse[]>([]);
  const [aulas, setAulas] = useState<AulaResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  
  const fetchDetalhes = useCallback(async (turmaId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      // Busca todos os dados em paralelo
      const [turmaData, professoresData, alunosData, aulasData] = await Promise.all([
        TurmaService.returnTurmaById(turmaId),
        TurmaService.getProfessoresByTurmaId(turmaId),
        TurmaService.getAlunoByTurmaId(turmaId),
        TurmaService.getAulasByTurmaId(turmaId)
      ]);

      if (turmaData) {
        setTurma(turmaData);
        setProfessores(professoresData || []);
        setAlunos(alunosData || []);
        setAulas(aulasData || []);
      } else {
        setError('Turma não encontrada.');
      }
    } catch (err) {
      console.error(`Erro no hook useTurmaDetalhes (id: ${turmaId}):`, err);
      setError('Ocorreu um erro ao buscar os detalhes da turma.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchDetalhes(id);
    } else {
      // Limpa os dados se o ID for nulo
      setTurma(null);
      setProfessores([]);
      setAlunos([]);
      setAulas([]);
    }
  }, [id, fetchDetalhes]);

  return { turma, professores, alunos, aulas, isLoading, error, refetch: () => id ? fetchDetalhes(id) : Promise.resolve() };
};

export const useTurmasApagadas = () => {
  const [turmas, setTurmas] = useState<TurmaResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTurmas = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await TurmaService.returnDeletedTurmas();
      if (data) {
        setTurmas(data);
      } else {
        setError('Não foi possível carregar as turmas apagadas.');
      }
    } catch (err) {
      console.error('Erro no hook useTurmasApagadas:', err);
      setError('Ocorreu um erro ao buscar os dados.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchTurmas();
    }, [fetchTurmas])
  );

  return { turmas, isLoading, error, refetch: fetchTurmas };
};