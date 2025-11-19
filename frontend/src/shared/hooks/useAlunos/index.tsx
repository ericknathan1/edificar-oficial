import { AlunoFrequenciaResponse, AlunoResponse } from '@/src/core/types/alunos';
import { TurmaResponse } from '@/src/core/types/turma';
import AlunoService from '@/src/shared/services/aluno';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

/**
 * Hook para buscar a lista de todos os alunos.
 * Recarrega os dados automaticamente sempre que a tela ganha foco.
 */
export const useAlunos = () => {
  const [alunos, setAlunos] = useState<AlunoResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlunos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await AlunoService.retornarAlunos();
      if (data) {
        setAlunos(data);
      } else {
        setError('Não foi possível carregar os alunos.');
      }
    } catch (err) {
      console.error('Erro no hook useAlunos:', err);
      setError('Ocorreu um erro ao buscar os dados.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAlunos();
    }, [fetchAlunos])
  );

  return { alunos, isLoading, error, refetch: fetchAlunos };
};

export const useAlunosApagados = () => {
  const [alunos, setAlunos] = useState<AlunoResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlunos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await AlunoService.retornarAlunosApagados();
      if (data) {
        setAlunos(data);
      } else {
        setError('Não foi possível carregar os alunos apagados.');
      }
    } catch (err) {
      console.error('Erro no hook useAlunosApagados:', err);
      setError('Ocorreu um erro ao buscar os dados.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAlunos();
    }, [fetchAlunos])
  );

  return { alunos, isLoading, error, refetch: fetchAlunos };
};

/**
 * Hook para buscar os detalhes de um aluno específico (dados + turmas + frequências).
 * Recarrega os dados se o ID mudar.
 */
export const useAlunoDetalhes = (id: number | null) => {
  const [aluno, setAluno] = useState<AlunoResponse | null>(null);
  // CORREÇÃO: Backend retorna List<TurmaResponse>
  const [turmas, setTurmas] = useState<TurmaResponse[]>([]);
  // CORREÇÃO: Backend retorna List<AlunoFrequenciaResponse>
  const [frequencias, setFrequencias] = useState<AlunoFrequenciaResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetalhes = useCallback(async (alunoId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      // Busca os dados do aluno, turmas e frequências em paralelo
      const [alunoData, turmasData, frequenciasData] = await Promise.all([
        AlunoService.retornarAlunoPorId(alunoId),
        AlunoService.listarTurmasPorAluno(alunoId),
        AlunoService.listarFrequenciasPorAluno(alunoId)
      ]);

      if (alunoData) {
        setAluno(alunoData);
      } else {
        setError('Aluno não encontrado.');
      }
      
      setTurmas(turmasData || []); // Armazena dados das turmas
      setFrequencias(frequenciasData || []); // Armazena dados das frequências

    } catch (err) {
      console.error(`Erro no hook useAlunoDetalhes (id: ${alunoId}):`, err);
      setError('Ocorreu um erro ao buscar os detalhes do aluno.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchDetalhes(id);
    } else {
      // Limpa os dados se o ID for nulo
      setAluno(null);
      setTurmas([]);
      setFrequencias([]);
    }
  }, [id, fetchDetalhes]);

  return { aluno, turmas, frequencias, isLoading, error, refetch: () => id ? fetchDetalhes(id) : Promise.resolve() };
};