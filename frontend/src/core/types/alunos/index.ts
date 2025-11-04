import { FrequenciaStatus } from "@/src/shared/enums/frequenciaStatus"
import { StatusPadrao } from "@/src/shared/enums/statusPadrao"
import { AulaResponse } from "../aulas"

export interface AlunoRequest{
    nomeCompleto:string,
    dataNasc: Date,
    contatoResponsavel:string
}

export interface AlunoResponse{
    id:number,
    nomeCompleto:string,
    dataNasci:Date,
    contatoResponsavel:string,
    dataCriacao:Date,
    status:StatusPadrao
}

export interface AlunoDadosResponse{
    id:number,
    nomeCompleto:string,
    dataNasci:Date,
    contatoResponsavel:string,
    dataCriacao:Date,
    status:StatusPadrao
}

export interface AlunoFrequenciaResponse{
    id: number,
    justificativa: string,
    frequenciaStatus: FrequenciaStatus,
    aula: AulaResponse
}