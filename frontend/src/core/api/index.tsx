import StorageService from '@/src/shared/services/auth/storage';
import axios from 'axios';

const api = axios.create(
    {
        baseURL: "http://academico3.rj.senac.br/edificar",
        headers: {
            'Content-Type': 'application/json',
        }
    }
);

const ENDPOINTS_PUBLICOS = [
  '/usuarios/login',
  '/usuarios/cadastro'
];


api.interceptors.request.use(async (config) => {
  const isEndpointPublico = ENDPOINTS_PUBLICOS.some(endpoint => 
    config.url?.includes(endpoint)
  );

  if (!isEndpointPublico) {
    const token = await StorageService.returnToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401) {
      await StorageService.clearData();
      throw new Error('Sessão expirada');
    }
    throw error;
  }
);

export default api;