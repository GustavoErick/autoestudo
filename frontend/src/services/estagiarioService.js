import { api } from './axiosConfig';

export const estagiarioService = {
  async buscarTodos() {
    const response = await api.get('/estagiarios')
    return response.data._embedded?.estagiarios || []
  },
  
  async buscarPorId(id) {
    const response = await api.get(`/estagiarios/${id}`)
    return response.data
  },
  
  async criar(estagiario) {
    const response = await api.post('/estagiarios', estagiario)
    return response.data
  },
  
  async atualizar(id, estagiario) {
    const response = await api.put(`/estagiarios/${id}`, estagiario)
    return response.data
  },
  
  async excluir(id) {
    await api.delete(`/estagiarios/${id}`)
  }
}