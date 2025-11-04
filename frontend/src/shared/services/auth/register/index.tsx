import api from "@/src/core/api";
import { UsuarioSecurityRequest } from "@/src/core/types/usuario/index";

const RegisterService = {
    async createUser(request:UsuarioSecurityRequest){
        try{
            await api.post("/usuarios/cadastro", request);
        }catch(error){
            console.error("RegisterService: erro ao tentar cadastrar usuario", error);
            throw error;
        }
    }
}

export default RegisterService;