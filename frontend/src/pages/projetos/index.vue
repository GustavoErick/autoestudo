<template>
  <div>
    <h1 class="text-h4 mb-4">Lista de Projetos</h1>

  <div v-if="carregando" class="text-center my-5">
    <v-progress-circular indeterminate color="primary"></v-progress-circular>
  </div>
  
  <v-container v-else fluid>    
    <v-btn prepend-icon="mdi-plus" stacked variant="tonal" class="mb-2" @click="abrirModalCriar()">
    Novo projeto
    </v-btn>
      <v-row dense>
        <v-col
          v-for="projeto in projetoStore.projetos"
          :key="projeto.id"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card variant="tonal">
            <v-card-title>{{ projeto.nome }}</v-card-title>
            <v-card-subtitle>Status: {{ projeto.status }}</v-card-subtitle>
            <v-card-text>Turno: {{ projeto.turno }}</v-card-text>

            <v-card-actions>
              <v-btn variant="tonal" @click="abrirModalEditar(projeto)">Editar</v-btn>
              <v-btn color="red" @click="abrirModalExcluir(projeto)">Excluir</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="modalCriar" max-width="500px">
      <v-card>
        <v-card-title>Adicionar Projeto</v-card-title>
        <v-card-text>
          <v-text-field label="Nome do Projeto"></v-text-field>
          <v-select
            :items="statusOptions"
            label="Status"
          ></v-select>
          <v-select
            :items="turnoOptions"
            label="Turno"
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="fecharModalCriar">Cancelar</v-btn>
          <v-btn color="primary" @click="salvarEdicao">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="modalEditar" max-width="500px">
      <v-card>
        <v-card-title>Editar Projeto</v-card-title>
        <v-card-text>
          <v-text-field v-model="projetoSelecionado.nome" label="Nome do Projeto"></v-text-field>
          <v-select
            v-model="projetoSelecionado.status"
            :items="statusOptions"
            label="Status"
          ></v-select>
          <v-select
            v-model="projetoSelecionado.turno"
            :items="turnoOptions"
            label="Turno"
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="fecharModalEditar">Cancelar</v-btn>
          <v-btn color="primary" @click="salvarEdicao">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="modalExcluir" max-width="500px">
      <v-card>
        <v-card-title class="text-h6">Tem certeza que deseja excluir esse projeto?</v-card-title>
        <v-card-actions>
          <v-btn text @click="fecharModalExcluir">Cancelar</v-btn>
          <v-btn color="red" @click="confirmarExclusao">Sim, excluir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
  
<script setup>
  import { ref, onMounted } from 'vue'
  import { useProjetoStore } from '@/store/projetoStore'

  const projetoStore = useProjetoStore()
  const carregando = ref(false)

  const modalCriar = ref(false)
  const modalEditar = ref(false)
  const modalExcluir = ref(false)
  const projetoSelecionado = ref({
    id: null,
    nome: '',
    status: '',
    turno: ''
  })

  const statusOptions = ['EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO']
  const turnoOptions = ['MANHA', 'TARDE', 'NOITE']

  onMounted(async () => {
    await buscarProjetos()
  })

  async function buscarProjetos() {
    carregando.value = true
    try {
      await projetoStore.buscarProjetos()
    } catch (error) {
      console.error('Erro ao buscar projetos:', error)
    } finally {
      carregando.value = false
    }
  }

  function abrirModalCriar() {
    // projetoSelecionado.value = { ...projeto } 
    modalCriar.value = true
  }

  function fecharModalCriar() {
    modalCriar.value = false
  }

  function abrirModalEditar(projeto) {
    projetoSelecionado.value = { ...projeto } 
    modalEditar.value = true
  }

  function fecharModalEditar() {
    modalEditar.value = false
  }

  async function salvarEdicao() {
    try {
      await projetoStore.salvarProjeto(projetoSelecionado.value)
      await buscarProjetos()
      modalCriar.value = false
      modalEditar.value = false
    } catch (error) {
      console.error('Erro ao salvar projeto:', error)
    }
  }

  function abrirModalExcluir(projeto) {
    projetoSelecionado.value = { ...projeto }
    console.log(projetoSelecionado.id)
    modalExcluir.value = true
  }

  function fecharModalExcluir() {
    modalExcluir.value = false
  }

  async function confirmarExclusao() {
    try {
      await projetoStore.excluirProjeto(projetoSelecionado.value)
      await buscarProjetos()
      modalExcluir.value = false
    } catch (error) {
      console.error('Erro ao excluir projeto:', error)
    }
  }
</script>