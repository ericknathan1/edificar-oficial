import api from "@/src/core/api"
import { LecionaRequest, LecionaResponse } from "@/src/core/types/leciona"

const LecionaService = {
    async listarLecionas(){
        try{
            const response = await api.get<LecionaResponse[]>("/lecionas");
            return response.data;
        }catch(error){
            console.error("LecionaService: erro ao listar lecionas",error);
            }
    }, async salvarLeciona(request:LecionaRequest){
        try{
            const response = await api.post<LecionaResponse>("/lecionas",request);
            return response.data;
        } catch(error){
            console.error("LecionaService: erro ao salvar leciona",error);
        }
    }
}

export default LecionaService;