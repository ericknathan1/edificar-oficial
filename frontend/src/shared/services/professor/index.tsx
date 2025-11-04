import api from "@/src/core/api";

const ProfessorService = {
    async listarProfessores(){
        try{
            const response = await api.get("/professores");
            return response.data;
        }catch(error){
            console.error("ProfessorService: erro ao listar professores",error);
        }
    },
    async retornarProfessorPorId(id:number){
        try{
            const response = await api.get(`/professores/${id}`);
            return response.data;
        }catch(error){
            console.error("ProfessorService: erro ao buscar professor com id: "+id,error);
        }
    },
    async retornarTurmasPorProfessor(id:number){
        try{
            const response = await api.get(`/professores/${id}/turmas`);
            return response.data;
        }catch(error){
            console.error("ProfessorService: erro ao buscar turmas do professor com id: "+id,error);
        }
    }
}

export default ProfessorService;