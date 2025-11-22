import api from "@/src/core/api";
import { AulaRequest, AulaResponse, AulaUpdateRequest } from "@/src/core/types/aulas";

const AulaService = {
    async iniciarAula(idAula: number) {
        try {
            const response = await api.put<AulaResponse>(`/aulas/${idAula}/iniciarAula`);
            return response.data;
        } catch (error) {
            console.error("AulaService: erro ao iniciar aula", error);
            throw error;
        }
    },
    async finalizarAula(idAula: number) {
        try {
            const response = await api.put<AulaResponse>(`/aulas/${idAula}/finalizarAula`);
            return response.data;
        } catch (error) {
            console.error("AulaService: erro ao finalizar aula", error);
            throw error;
        }
    },
    async listarAulas() {
        try {
            const response = await api.get<AulaResponse[]>("/aulas");
            return response.data;
        } catch (error) {
            console.error("AulaService: erro ao listar aulas", error);
            throw error;
        }
    },
    // --- Novos Métodos Adicionados ---
    async salvarAula(request: AulaRequest) {
        try {
            const response = await api.post<AulaResponse>("/aulas", request);
            return response.data;
        } catch (error) {
            console.error("AulaService: erro ao salvar nova aula", error);
            throw error;
        }
    },
    async reagendarAula(idAula: number, request: AulaUpdateRequest) {
        try {
            const response = await api.put<AulaResponse>(`/aulas/${idAula}`, request);
            return response.data;
        } catch (error) {
            console.error("AulaService: erro ao reagendar aula", error);
            throw error;
        }
    },
    async retornarAulaPorId(idAula: number) {
        try {
            const response = await api.get<AulaResponse>(`/aulas/${idAula}`);
            return response.data;
        } catch (error) {
            console.error("AulaService: erro ao buscar aula", error);
            throw error;
        }
    },
    async cancelarAula(idAula: number) {
        try {
            await api.delete(`/aulas/${idAula}`);
        } catch (error) {
            console.error("AulaService: erro ao cancelar aula", error);
            throw error;
        }
    }
}

export default AulaService;