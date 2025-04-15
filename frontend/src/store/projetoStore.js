import { defineStore } from 'pinia'
import { api } from '../axiosConfig'

export const useProjetoStore = defineStore('projeto', {
  state: () => ({
    projetos: [],
    projetoAtual: null,
    carregando: false,
    erro: null
  }),
  
  getters: {
    projetosAtivos: (state) => state.projetos.filter(p => p.status === 'EM_ANDAMENTO'),
    
    projetoPorId: (state) => (id) => {
      return state.projetos.find(projeto => projeto.id === id)
    }
  },
  
  actions: {
    async buscarProjetos() {
        this.carregando = true
        try {
            const { data } = await api.get('/projetos')
            const projetos = data._embedded?.projetos || data || []
        
            this.projetos = projetos.map(projeto => {
                const href = projeto._links?.self?.href || ''
                const id = href.split('/').pop() 
                return { ...projeto, id }
            })
        
            this.erro = null
        } catch (error) {
            this.erro = error.message
            console.error('Erro ao buscar projetos:', error)
        } finally {
            this.carregando = false
        }
    },

    async salvarProjeto(projeto) {
      console.log(projeto)
      this.carregando = true
      try {
        if (projeto.id) {
            console.log('tem id')
          await api.put(`/projetos/${projeto.id}`, projeto)
        } else {
            console.log('nao tem id')
          await api.post('/projetos', projeto)
        }
        await this.buscarProjetos()
      } catch (error) {
        this.erro = error.message
      } finally {
        this.carregando = false
      }
    },

    async excluirProjeto(projeto) {
      this.carregando = true
      try {
        if (projeto.id) {
          const resposta = await api.get(`http://localhost:8080/projetos/${projeto.id}/estagiarios`);
          if (resposta.data._embedded && 
            resposta.data._embedded.estagiarios && 
            resposta.data._embedded.estagiarios.length > 0) {
          this.erro = "Não é possível excluir o projeto pois existem estagiários alocados. Desaloque os estagiários primeiro."
          return
        }
          await api.delete(`/projetos/${projeto.id}`)
        }

        await this.buscarProjetos()
      } catch (error) {
        this.erro = error.message
      } finally {
        this.carregando = false
      }
    }
  }
})