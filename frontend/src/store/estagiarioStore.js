import { defineStore } from 'pinia'
import { api } from '../axiosConfig'

export const useEstagiarioStore = defineStore('estagiario', {
  state: () => ({
    estagiarios: [],
    estagiarioAtual: null,
    carregando: false,
    erro: null
  }),
  
  getters: {
    estagiariosAtivos: (state) => state.estagiarios.filter(p => p.status === 'EM_ANDAMENTO'),
    
    estagiarioPorId: (state) => (id) => {
      return state.estagiarios.find(estagiario => estagiario.id === id)
    }
  },
  
  actions: {
    async buscarEstagiarios() {
        this.carregando = true
        try {
            const { data } = await api.get('/estagiarios')
            const estagiarios = data._embedded?.estagiarios || data || []
        
            this.estagiarios = estagiarios.map(estagiario => {
                const href = estagiario._links?.self?.href || ''
                const id = href.split('/').pop() 
                return { ...estagiario, id }
            })
        
            this.erro = null
        } catch (error) {
            this.erro = error.message
            console.error('Erro ao buscar estagiarios:', error)
        } finally {
            this.carregando = false
        }
    },
      
    
    async salvarEstagiario(estagiario) {
      this.carregando = true
      try {
        if (estagiario.id) {
            console.log('tem id')
          await api.put(`/estagiarios/${estagiario.id}`, estagiario)
        } else {
            console.log('nao tem id')
          await api.post('/estagiarios', estagiario)
        }
        await this.buscarEstagiarios()
      } catch (error) {
        this.erro = error.message
      } finally {
        this.carregando = false
      }
    },

    async excluirEstagiario(estagiario) {
        this.carregando = true
        try {
          if (estagiario.id) {
            await api.delete(`/estagiarios/${estagiario.id}`)
          }

          await this.buscarEstagiarios()
        } catch (error) {
          this.erro = error.message
        } finally {
          this.carregando = false
        }
      }
  }
})