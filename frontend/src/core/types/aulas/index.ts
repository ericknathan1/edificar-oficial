import { StatusAula } from "@/src/shared/enums/statusAula";
import { UsuarioDadosResponse } from "../usuario";

// DTO: AulaResponse (backend/src/main/java/com/app/edificar/DTO/response/AulaResponse.java)
export interface AulaResponse {
    id: number,
    data: Date,
    horaInicio: string,
    horafim: string, // Nome no DTO backend é 'horafim'
    statusAula: StatusAula, // Nome no DTO backend é 'statusAula'
    topico: string,
    visitantes: number, // Nome no DTO backend é 'visitantes'
    usuario: UsuarioDadosResponse // Professor
}

// DTO: AulaRequest (backend/src/main/java/com/app/edificar/DTO/request/AulaRequest.java)
export interface AulaRequest {
    data: Date; // ou string 'YYYY-MM-DD'
    turmaId: number;
    usuarioId?: number; // Opcional na criação
}

// DTO: AulaUpdateRequest (backend/src/main/java/com/app/edificar/DTO/request/AulaUpdateRequest.java)
export interface AulaUpdateRequest {
    data?: Date; // ou string 'YYYY-MM-DD'
    topico?: string;
    visitante?: number; // Nome no DTO backend é 'visitante'
    usuarioId?: number;
}