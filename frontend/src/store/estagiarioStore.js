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
    estagiariosAtivos: (state) => state.estagiarios.filter(p => p.status === 'ATIVO'),
    
    estagiarioPorId: (state) => (id) => {
      return state.estagiarios.find(estagiario => estagiario.id === id)
    }
  },
  
  actions: {
    // async buscarEstagiarios() {
    //     this.carregando = true
    //     try {
    //         const { data } = await api.get('/estagiarios')
    //         const estagiarios = data._embedded?.estagiarios || data || []
        
    //         this.estagiarios = estagiarios.map(estagiario => {
    //             const href = estagiario._links?.self?.href || ''
    //             const id = href.split('/').pop() 
    //             return { ...estagiario, id }
    //         })
        
    //         this.erro = null
    //     } catch (error) {
    //         this.erro = error.message
    //         console.error('Erro ao buscar estagiarios:', error)
    //     } finally {
    //         this.carregando = false
    //     }
    // },

    // async buscarEstagiarios() {
    //   this.carregando = true
    //   try {
    //     const { data } = await api.get('/estagiarios')
    //     const estagiarios = data._embedded?.estagiarios || data || []
    
    //     const estagiariosComProjeto = await Promise.all(
    //       estagiarios.map(async estagiario => {
    //         const href = estagiario._links?.self?.href || ''
    //         const id = href.split('/').pop()
    
    //         // Buscando o projeto do estagiário
    //         const projetoLink = estagiario._links?.projeto?.href
    //         let projetoId = null
    //         let projetoNome = null
    
    //         if (projetoLink) {
    //           try {
    //             const { data: projetoData } = await api.get(projetoLink)
    //             projetoId = projetoData.id
    //             projetoNome = projetoData.nome
    //           } catch (err) {
    //             console.error(`Erro ao buscar projeto do estagiário ${id}`, err)
    //           }
    //         }
    
    //         return {
    //           ...estagiario,
    //           id,
    //           projeto: projetoId,
    //           nomeProjeto: projetoNome,
    //         }
    //       })
    //     )
    
    //     this.estagiarios = estagiariosComProjeto
    //     this.erro = null
    //   } catch (error) {
    //     this.erro = error.message
    //     console.error('Erro ao buscar estagiarios:', error)
    //   } finally {
    //     this.carregando = false
    //   }
    // },

    async buscarEstagiarios() {
      this.carregando = true
      try {
        const { data } = await api.get('/estagiarios')
        const estagiarios = data._embedded?.estagiarios || data || []
    
        const estagiariosComProjeto = await Promise.all(
          estagiarios.map(async estagiario => {
            const href = estagiario._links?.self?.href || ''
            const id = href.split('/').pop()
    
            // Buscando o projeto do estagiário
            const projetoLink = estagiario._links?.projeto?.href
            let projetoId = null
            let projetoNome = null
    
            if (projetoLink) {
              try {
                const { data: projetoData } = await api.get(projetoLink)
                projetoId = projetoData.id
                projetoNome = projetoData.nome
              } catch (err) {
                console.error(`Erro ao buscar projeto do estagiário ${id}`, err)
              }
            }
    
            return {
              ...estagiario,
              id,
              projeto: projetoId,
              nomeProjeto: projetoNome,
            }
          })
        )
    
        this.estagiarios = estagiariosComProjeto
        this.erro = null
      } catch (error) {
        this.erro = error.message
        console.error('Erro ao buscar estagiarios:', error)
      } finally {
        this.carregando = false
      }
    },
    
      
    
    // async salvarEstagiario(estagiario) {
    //   this.carregando = true
    //   //console.log(estagiario)
    //   try {
    //     if (estagiario.id) {
    //         //console.log('tem id')
    //       await api.put(`/estagiarios/${estagiario.id}`, estagiario)
    //     } else {
    //         //console.log('nao tem id')
    //         await api.post('/estagiarios', estagiario)
    //       }
    //     await this.buscarEstagiarios()
    //   } catch (error) {
    //     this.erro = error.message
    //   } finally {
    //     this.carregando = false
    //   }
    // },

    async salvarEstagiario(estagiario) {
      this.carregando = true;
      try {
        // Limpe o objeto para conter apenas campos do backend
        const dadosParaEnviar = {
          primeiroNome: estagiario.primeiroNome,
          segundoNome: estagiario.segundoNome,
          email: estagiario.email,
          status: estagiario.status
        };
        
        // Se houver projeto, adicione com formato correto para PATCH
        if (estagiario.projeto) {
          // Se for um caminho relativo como '/projetos/302'
          if (typeof estagiario.projeto === 'string' && estagiario.projeto.includes('/projetos/')) {
            dadosParaEnviar.projeto = `http://localhost:8080${estagiario.projeto}`;
            
            // Se for um número/ID direto
          } else if (estagiario.projeto) {
            dadosParaEnviar.projeto = `http://localhost:8080/projetos/${estagiario.projeto}`;
          }
        }
        
        console.log('Dados enviados para API:', dadosParaEnviar);
        
        if (estagiario.id) {
          await api.patch(`/estagiarios/${estagiario.id}`, dadosParaEnviar);
        } else {
          await api.post('/estagiarios', dadosParaEnviar);
        }
        await this.buscarEstagiarios();
      } catch (error) {
        this.erro = error.message;
        console.error('Erro completo:', error.response?.data || error);
      } finally {
        this.carregando = false;
      }
    },

    // async salvarEstagiario(estagiario) {
    //   this.carregando = true
    //   try {
    //     // Criar um objeto limpo apenas com os campos que o backend espera
    //     const dadosParaEnviar = {
    //       primeiroNome: estagiario.primeiroNome,
    //       segundoNome: estagiario.segundoNome,
    //       email: estagiario.email,
    //       status: estagiario.status
    //     };
        
    //     // Adicionar o projeto apenas se ele existir
    //     if (estagiario.projeto) {
    //       dadosParaEnviar.projeto = estagiario.projeto;
    //     }
        
    //     if (estagiario.id) {
    //       await api.patch(`/estagiarios/${estagiario.id}`, dadosParaEnviar)
    //     } else {
    //       await api.post('/estagiarios', dadosParaEnviar)
    //     }
    //     await this.buscarEstagiarios()
    //   } catch (error) {
    //     this.erro = error.message
    //     console.error('Erro ao salvar:', error.response?.data || error);
    //   } finally {
    //     this.carregando = false
    //   }
    // },

    async excluirEstagiario(estagiario) {
        this.carregando = true

        if (estagiario.status !== 'INATIVO') {
          return
        }

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