import StorageService from '@/src/shared/services/auth/storage';
import axios from 'axios';

const api = axios.create(
    {
        // baseURL: "http://26.123.223.30:8080"
        baseURL: "http://academico3.rj.senac.br/edificar",
        headers: {
            'Content-Type': 'application/json',
        }
    }
);

api.interceptors.request.use(async (config) => {
    const token = await StorageService.returnToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    response => {
        return response;
    },
    async error => {
        if (error.response && error.response.status === 401) {
            await StorageService.clearData();
            console.log('Token inválido ou expirado. Usuário deslogado.');
            return Promise.reject(error);
        }
        return Promise.reject(error);
    }
);

export default api;