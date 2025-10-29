import { RoleName } from "@/src/shared/enums/roleName";

export interface UsuarioSecurityRequest {
    nome: String,
    email: String,
    senha: String,
    roles: RoleName[]
}

export interface LoginSecurityRequest {
    email: String,
    senha: String
}

export interface UsuarioResponse{
    id: number,
    nome: string,
    email: string,
    roles: RoleName[]
}
