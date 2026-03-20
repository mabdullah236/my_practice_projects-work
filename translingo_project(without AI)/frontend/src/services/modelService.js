import api from './api';

export const getModels = async () => {
  const response = await api.get('/models');
  return response.data;
};

export const translateText = async (payload) => {
  const response = await api.post('/translate', payload);
  return response.data;
};