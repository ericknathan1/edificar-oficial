import { FrequenciaStatus } from "@/src/shared/enums/frequenciaStatus";
import { AlunoResponse } from "../alunos";
import { AulaResponse } from "../aulas";


export interface FrequenciaStatusRequest{
    alunoId:number,
    professorId:number,
    justificativa:string,
    status: FrequenciaStatus
}

export interface FrequenciaResponse{
    id:number,
    justificativa:string,
    status: FrequenciaStatus,
    aluno: AlunoResponse,
    aula: AulaResponse
}

export interface FrequenciaMediaResponse{
    aulaId: number,
    totalAlunos: number,
    totalPresentes: number,
    mediaPercentual:number
}