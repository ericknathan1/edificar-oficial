import { RoleName } from "@/src/shared/enums/roleName";
import { StatusUsuario } from "@/src/shared/enums/statusUsuario";

// DTO: UsuarioSecurityRequest
export interface UsuarioSecurityRequest {
    nome: string,
    email: string,
    senha: string,
    roles: RoleName[]
}

// DTO: LoginSecurityRequest
export interface LoginSecurityRequest {
    email: string,
    senha: string
}

// DTO: UsuarioResponse
export interface UsuarioResponse {
    id: number,
    nome: string,
    email: string,
    status: StatusUsuario, // Adicionado (baseado no DTO de response)
    dataCriacao: Date,   // Adicionado (baseado no DTO de response)
    roles: RoleName[]
}

// DTO: UsuarioRequest (backend/src/main/java/com/app/edificar/DTO/request/UsuarioRequest.java)
// Este DTO no backend SÓ tem nome e email.
export interface UsuarioRequest {
    nome: string,
    email: string,
    // A senha não é atualizável por aqui, então removi
}

// DTO: UsuarioDadosResponse
export interface UsuarioDadosResponse {
    id: number,
    nome: string,
    email: string,
    status: StatusUsuario,
    dataCriacao: Date
}