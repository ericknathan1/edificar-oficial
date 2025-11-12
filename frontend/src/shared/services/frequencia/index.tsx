import api from "@/src/core/api";
import { FrequenciaMediaResponse, FrequenciaResponse, FrequenciaStatusRequest } from "@/src/core/types/frequencias";

const FrequenciaService = {
    async aplicarPresenca(idAula: number, request: FrequenciaStatusRequest) {
        try {
            // CORREÇÃO: Este endpoint espera um body FrequenciaStatusRequest
            const response = await api.post<FrequenciaResponse>(
                `/frequencias/aplicarPresenca/${idAula}`,
                request // Enviando o body
            );
            return response.data;
        } catch (error) {
            console.error("FrequenciaService: erro ao aplicar presença para aula com id: " + idAula, error);
            throw error;
        }
    },

    // --- Métodos Faltantes ---
    async retornarFrequenciasPorAula(idAula: number) {
        try {
            const response = await api.get<FrequenciaResponse[]>(`/frequencias/aula/${idAula}`);
            return response.data;
        } catch (error) {
            console.error("FrequenciaService: erro ao buscar frequências da aula com id: " + idAula, error);
            throw error;
        }
    },

    async retornarMediaPorAula(idAula: number) {
        try {
            const response = await api.get<FrequenciaMediaResponse>(`/frequencias/aula/${idAula}/media`);
            return response.data;
        } catch (error) {
            console.error("FrequenciaService: erro ao buscar média da aula com id: " + idAula, error);
            throw error;
        }
    }
}

export default FrequenciaService;