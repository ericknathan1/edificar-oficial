import { StatusAula } from "@/src/shared/enums/statusAula";
import { UsuarioDadosResponse } from "../usuario";

export interface AulaResponse{
    id:number,
    data:Date,
    horaInicio:string,
    horaFim:string,
    statusAulas:StatusAula,
    topico:string,
    visitantes:number,
    usuario:UsuarioDadosResponse
}