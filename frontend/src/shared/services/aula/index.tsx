import api from "@/src/core/api";

const AulaService = {
    async iniciarAula(idAula:number){
        try{
            const response = await api.put(`/aulas/${idAula}/iniciarAula`);
            return response.data;
        }catch(error){
            console.error("AulaService: erro ao iniciar aula com id: "+idAula,error);
        }
    }, async finalizarAula(idAula:number){
        try{
            const response = await api.put(`/aulas/${idAula}/finalizarAula`);
            return response.data;
        }catch(error){
            console.error("AulaService: erro ao finalizar aula com id: "+idAula,error);
        }
    }, async listarAulas(){
        try{
            const response = await api.get("/aulas");
            return response.data;
        }catch(error){
            console.error("AulaService: erro ao listar aulas",error);
        }
    }
}

export default AulaService;