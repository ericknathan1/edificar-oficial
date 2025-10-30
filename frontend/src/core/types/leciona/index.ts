import { TurmaResponse } from "../turma";
import { UsuarioResponse } from "../usuario";

export interface LecionaResponse{
id:number,
turma: TurmaResponse,
usuario: UsuarioResponse
}

export interface LecionaRequest{
    turmaId:number,
    usuarioId:number
}