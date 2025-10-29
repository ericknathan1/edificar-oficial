
import { RoleName } from "@/src/shared/enums/roleName"
import { StatusUsuario } from "@/src/shared/enums/statusUsuario"

export interface LoginRequest{
    email: String,
    senha: String
}

export interface CadRequest{
    nome: String,
    email: String,
    senha: String
    roles: RoleName[]
}

export interface Response{
    id: Number,
    nome: String,
    email: String,
    status: StatusUsuario,
    dataCriacao: Date,
    roles: RoleName[]
}

export interface ResponseDados{
    id: Number,
    nome: String,
    email: String,
    status: StatusUsuario,
    dataCriacao: Date
}

export interface Payload{
    sub: string; 
    iat: number;
    exp: number;
    roles?: string[];
}


export interface LoginResponse{
    token: string;
}

export type ListaUsuarios = Response[]
