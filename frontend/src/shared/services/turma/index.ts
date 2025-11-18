import api from "@/src/core/api";
import { AlunoDadosResponse } from "@/src/core/types/alunos";
import { AulaResponse } from "@/src/core/types/aulas";
import { InscricaoResponse } from "@/src/core/types/inscricoes";
import { LecionaResponse } from "@/src/core/types/leciona";
import { TurmaRequest, TurmaResponse, TurmaStatusRequest } from "@/src/core/types/turma";
import { UsuarioDadosResponse } from "@/src/core/types/usuario";

const TurmaService = {
    async returnTurmas(){
        try{
            const response = await api.get<TurmaResponse[]>("/turmas");
            return response.data;
        }catch(error){
            console.error('Erro ao consultar dados da Turma: ', error);
        }
    }, async returnDeletedTurmas(){
        try{
            const response = await api.get<TurmaResponse[]>("/turmas/apagadas");
            return response.data;
        }catch(error){
            console.error('Erro ao retornar turmas apagadas: ', error);
        }
    }
    , async returnTurmaById(id:number){
        try{
            const response = await api.get<TurmaResponse>(`/turmas/${id}`);
            return response.data;
        }catch(error){
            console.error("TurmaService: erro ao buscar turma com id"+id,error);
        }
    },async updateTurma(id:number,request:TurmaRequest){
        try{
            const response = await api.put<TurmaResponse>(`/turmas/${id}`,request);
            return response.data;
        }catch(error){
            console.error("TurmaService: erro ao atualizar turma com id: "+id,error);
        }
    }, async updateTurmaStatus(id:number,request:TurmaStatusRequest){
        try{
            const response = await api.patch<TurmaResponse>(`/turmas/${id}`,request);
            return response.data;
        }catch(error){
            console.error("TurmaService: erro ao atualizar status da turma com id: "+id,error);
        }
    }, async createTurma(request: TurmaRequest){
        try{
            const response = await api.post<TurmaResponse>("/turmas",request);
            return response.data;
        }catch(error){
            console.error("TurmaService: erro ao criar turma",error);
        }
    },async createTurmaSemAula(request: TurmaRequest){
        try{
            const response = await api.post<TurmaResponse>("/turmas/semAulas",request);
            return response.data;
        }catch(error){
            console.error("TurmaService: erro ao criar turma",error);
        }
    }, async deleteTurma(id:number){
        try{
            await api.delete(`/turmas/${id}`);
        }catch(error){
            console.error("TurmaService: erro ao deletar",error);
        }
    },async putAlunoInTurma(idTurma:number,idAluno:number){
        try{
            const response = await api.post<InscricaoResponse>(`/turmas/${idTurma}/aluno/${idAluno}`);
            return response.data;
        }catch(error){
            console.error("TurmaService: erro ao tentar associar aluno a turma",error);
        }
    },async putProfessorInTurma(idTurma:number,idProfessor:number){
        try{
            const response = await api.post<LecionaResponse>(`/turmas/${idTurma}/professores/${idProfessor}`);
            return response.data;
        }catch(error){
            console.error("TurmaService: erro ao tentar associar professor a turma",error);
        }
    },async getProfessoresByTurmaId(idTurma:number){
        try{
            const response = await api.get<UsuarioDadosResponse[]>(`/turmas/${idTurma}/professores`);
            return response.data;
        }catch(error){
            console.error("TurmaService: erro ao tentar exibir professores da turma",error);
        }
    }, async getAlunoByTurmaId(idTurma:number){
        try{
            const response = await api.get<AlunoDadosResponse[]>(`/turmas/${idTurma}/alunos`);
            return response.data;
        }catch(error){
            console.error("TurmaService: erro ao tentar exibir alunos de uma turma",error);
        }
    }, async getAulasByTurmaId(idTurma:number){
        try{
            const response = await api.get<AulaResponse[]>(`/turmas/${idTurma}/aulas`);
            return response.data;
        }catch(error){
            console.error("TurmaService: error ao tentar exibir aulas de uma turma", error);
        }
    }, async returnTurmasAtivas(){
        try{
            const response = await api.get<TurmaResponse[]>("/turmas/ativas");
            return response.data;
        }catch(error){
            console.error('TurmaService: error ao tentar exibir turmas ativas', error);
        }
    }
}

export default TurmaService;