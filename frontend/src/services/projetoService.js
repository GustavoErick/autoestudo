import { api } from './axiosConfig';

export const projetoService = {
  async buscarTodos() {
    const response = await api.get('/projetos')
    return response.data._embedded?.projetos || []
  },
  
  async buscarPorId(id) {
    const response = await api.get(`/projetos/${id}`)
    return response.data
  },
  
  async criar(projeto) {
    const response = await api.post('/projetos', projeto)
    return response.data
  },
  
  async atualizar(id, projeto) {
    const response = await api.put(`/projetos/${id}`, projeto)
    return response.data
  },
  
  async excluir(id) {
    await api.delete(`/projetos/${id}`)
  }
}