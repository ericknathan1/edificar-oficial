import api from "@/src/core/api"
import { FrequenciaResponse } from "@/src/core/types/frequencias"

const FrequenciaService = {
    async aplicarPresenca(idAula:number){
        try{
            const response = await api.post<FrequenciaResponse>(`/frequencias/aplicarPresenca/${idAula}`);
            return response.data;
        }catch(error){
            console.error("FrequenciaService: erro ao aplicar presença para aula com id: "+idAula,error);
        }
    }
}

export default FrequenciaService;