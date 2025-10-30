import api from "@/src/core/api";
import { UsuarioResponse } from "@/src/core/types/usuario/index";


const UserService = {
    async returnUser(id: number){
        try{
            const userResponse = await api.get<UsuarioResponse>(`/usuarios/${id}`);
            return userResponse.data;
        }catch(error){
            console.error('UserService: erro ao buscar usuario ', error);
        }
    }, async returnAllUsers(){
        try{
            const userResponse = await api.get<UsuarioResponse[]>("/usuarios");
            return userResponse.data;
        }catch(error){
            console.error('UserService: erro ao listar usuarios', error);
        }
    }, async returnActiveUsers(){
        try{
            const userResponse = await api.get<UsuarioResponse[]>("/usuarios/ativos");
            return userResponse.data;
        }catch(error){
            console.error('UserService: erro ao listar usuarios ativos', error);
        }
    }, async returnDeletedUsers(){
        try{
            const userResponse = await api.get<UsuarioResponse[]>("/usuarios/apagados");
            return userResponse.data;
        }catch(error){
            console.error("UserService: erro ao listar usuarios apagados", error);
        }
    }, async returnAuthUser(){
        try{
            const userResponse = await api.get<UsuarioResponse>("/usuarios/perfil");
            return userResponse.data;
        }catch(error){
            console.error("UserService: erro ao buscar usuário logado.", error);
        }
    },
    async deleteUser(id: number){
        try{
            await api.delete(`/usuarios/${id}`);
        }catch(error){
            console.error("UserService: erro ao deletar usuário.", error);
        }
    }
}

export default UserService;