import api from "@/src/core/api"
import { Payload, TokenSecurityResponse } from "@/src/core/types/auth";
import { LoginSecurityRequest, UsuarioSecurityRequest } from "@/src/core/types/usuario/index"
import { jwtDecode } from "jwt-decode";
import StorageService from "../storage";


const LoginService = {
    async validateUser(email: String, password: String){
        try{
            const credentials:LoginSecurityRequest = {
                email: email,
                senha: password
            }

            const response = await api.post<TokenSecurityResponse>('/usuarios/login',credentials);
        
            const data = response.data;

            const token = data.token;

            await StorageService.saveToken(token);

            const payloadDec:Payload = jwtDecode<Payload>(token);

            const userId = payloadDec.sub;
            
            await StorageService.saveUserId(userId);

            return {token, userId};
        }catch (error){
            console.error('erro ao logar: ', error);
            throw error;
        }
    }
}

export default LoginService;