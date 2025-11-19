import api from "@/src/core/api";
import { AlunoFrequenciaResponse, AlunoRequest, AlunoResponse } from "@/src/core/types/alunos";

import { TurmaResponse } from "@/src/core/types/turma";

const AlunoService = {
    async retornarAlunos() {
        try {
            const response = await api.get<AlunoResponse[]>("/alunos");
            return response.data;
        } catch (error) {
            console.error("AlunoService: erro ao buscar alunos", error);
            throw error; // Lança o erro para o hook tratar
        }
    },
    async retornarAlunosAtivos(){
        try{
            const response = await api.get<AlunoResponse[]>("/alunos/ativos");
            return response.data;
        }catch (error){
            console.error("AlunoService: erro ao buscar alunos ativos", error);
            throw error;
        }
    },
    async retornarAlunosApagados(){
        try{
            const response = await api.get<AlunoResponse[]>("/alunos/apagados");
            return response.data;
        }catch (error){
            console.error("AlunoService: erro ao buscar alunos apagados", error);
            throw error;
        }
    },
    async retornarAlunoPorId(id: number) {
        try {
            const response = await api.get<AlunoResponse>(`/alunos/${id}`);
            return response.data;
        } catch (error) {
            console.error("AlunoService: erro ao buscar aluno com id: " + id, error);
            throw error;
        }
    },
    async criarAluno(request: AlunoRequest) {
        try {
            const response = await api.post<AlunoResponse>("/alunos", request);
            return response.data;
        } catch (error) {
            console.error("AlunoService: erro ao criar aluno", error);
            throw error;
        }
    },
    async atualizarAluno(id: number, request: AlunoRequest) {
        try {
            const response = await api.put<AlunoResponse>(`/alunos/${id}`, request);
            return response.data;
        } catch (error) {
            console.error("AlunoService: erro ao atualizar aluno com id: " + id, error);
            throw error;
        }
    },
    async deletarAluno(id: number) {
        try {
            await api.delete(`/alunos/${id}`);
        } catch (error) {
            console.error("AlunoService: erro ao deletar aluno com id: " + id, error);
            throw error;
        }
    },
    async listarFrequenciasPorAluno(id: number) {
        try {
            // CORREÇÃO: O backend retorna List<AlunoFrequenciaResponse>
            const response = await api.get<AlunoFrequenciaResponse[]>(`/alunos/${id}/frequencias`);
            return response.data;
        } catch (error) {
            console.error("AlunoService: erro ao buscar frequencias do aluno com id: " + id, error);
            throw error;
        }
    },
    async listarTurmasPorAluno(id: number) {
        try {
            // CORREÇÃO: O backend retorna List<TurmaResponse>
            const response = await api.get<TurmaResponse[]>(`/alunos/${id}/turmas`);
            return response.data;
        } catch (error) {
            console.error("AlunoService: erro ao buscar turmas do aluno com id: " + id, error);
            throw error;
        }
    }
}

export default AlunoService;