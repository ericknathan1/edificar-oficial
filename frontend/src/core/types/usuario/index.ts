import { RoleName } from "@/src/shared/enums/roleName";
import { StatusUsuario } from "@/src/shared/enums/statusUsuario";

export interface UsuarioSecurityRequest {
    nome: string,
    email: string,
    senha: string,
    roles: RoleName[]
}

export interface LoginSecurityRequest {
    email: string,
    senha: string
}

export interface UsuarioResponse{
    id: number,
    nome: string,
    email: string,
    roles: RoleName[]
}

export interface UsuarioRequest{
    nome: string,
    email:string,
    senha:string
}

export interface UsuarioDadosResponse{
    id: number,
    nome: string,
    email: string,
    status: StatusUsuario,
    dataCriacao:Date
}