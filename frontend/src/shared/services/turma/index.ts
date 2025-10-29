import api from "@/src/core/api"
import { TurmaResponse } from "@/src/core/types/turma"

const TurmaService = {
    async returnTurmas(){
        try{
            const response = await api.get<TurmaResponse[]>("/turmas");
            return response.data;
        }catch(error){
            console.error('Erro ao consultar dados da Turma: ', error);
        }
    }
}

export default TurmaService;