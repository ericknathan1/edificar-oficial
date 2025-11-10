import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { AlunoResponse, AlunoDadosResponse } from '@/src/core/types/alunos';
import AlunoService from '@/src/shared/services/aluno';
import { TurmaResponse } from '@/src/core/types/turma';

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

/**
 * Hook para buscar os detalhes de um aluno específico (dados + turmas).
 * Recarrega os dados se o ID mudar.
 */
export const useAlunoDetalhes = (id: number | null) => {
  const [aluno, setAluno] = useState<AlunoDadosResponse | null>(null);
  const [turmas, setTurmas] = useState<TurmaResponse | null>(null); // O service indica que retorna UMA turma, não um array
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetalhes = useCallback(async (alunoId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      // Busca os dados do aluno e as turmas em paralelo
      const [alunoData, turmasData] = await Promise.all([
        AlunoService.retornarAlunoPorId(alunoId),
        AlunoService.listarTurmasPorAluno(alunoId)
      ]);

      if (alunoData) {
        setAluno(alunoData);
      } else {
        setError('Aluno não encontrado.');
      }
      
      setTurmas(turmasData || null); // Armazena dados das turmas

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
      setTurmas(null);
    }
  }, [id, fetchDetalhes]);

  return { aluno, turmas, isLoading, error, refetch: () => id ? fetchDetalhes(id) : Promise.resolve() };
};