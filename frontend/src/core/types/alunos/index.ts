import { FrequenciaStatus } from "@/src/shared/enums/frequenciaStatus";
import { StatusPadrao } from "@/src/shared/enums/statusPadrao";
import { AulaResponse } from "../aulas";
import { TurmaResponse } from "../turma";

export interface AlunoRequest {
    nomeCompleto: string,
    dataNasc: Date, // ou string, dependendo de como você envia
    contatoResponsavel: string
}

export interface AlunoResponse {
    id: number,
    nomeCompleto: string,
    dataNasc: Date, // Corrigido de dataNasci
    contatoResponsavel: string,
    dataCriacao: Date,
    status: StatusPadrao // Corrigido de string
}

export interface AlunoDadosResponse {
    id: number,
    nomeCompleto: string,
    dataNasc: Date, // Corrigido de dataNasci
    contatoResponsavel: string,
    dataCriacao: Date,
    status: StatusPadrao // Corrigido de string
}

// Backend DTO: AlunoFrequenciaResponse
export interface AlunoFrequenciaResponse {
    id: number,
    justificativa: string,
    status: FrequenciaStatus, // Corrigido de frequenciaStatus para bater com o DTO
    aula: AulaResponse
}

// Adicionado para a tela de detalhes do aluno
export interface AlunoDetalhes {
    aluno: AlunoDadosResponse;
    turmas: TurmaResponse[];
    frequencias: AlunoFrequenciaResponse[];
}