import { DiaPadrao } from "@/src/shared/enums/diaPadrao";
import { StatusPadrao } from "@/src/shared/enums/statusPadrao";

export interface TurmaResponse {
    id: number,
    nome: string,
    faixaEtaria: string,
    diaPadrao: DiaPadrao,
    statusPadrao: StatusPadrao
}

export interface TurmaRequest {
    nome: string,
    faixaEtaria: string,
    diaPadrao: DiaPadrao
}