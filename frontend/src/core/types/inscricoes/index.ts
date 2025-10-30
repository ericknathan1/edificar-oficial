import { AlunoDadosResponse } from "../alunos";
import { TurmaDadosResponse } from "../turma";

export interface InscricaoResponse{
    id:number,
    aluno: AlunoDadosResponse,
    turma: TurmaDadosResponse
}