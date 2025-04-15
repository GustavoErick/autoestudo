<template>
    <div>
        <h1 class="text-h4 mb-4">Lista de Estagiários</h1>

    <div v-if="carregando" class="text-center my-5">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>

    <v-container v-else fluid>    
        <v-btn prepend-icon="mdi-plus" stacked variant="tonal" class="mb-2" @click="abrirModalCriar()">
        Novo estagiário
        </v-btn>
        <v-row dense>
            <v-col
            v-for="estagiario in estagiarioStore.estagiarios"
            :key="estagiario.id"
            cols="12"
            sm="6"
            md="4"
            >
            <v-card variant="tonal">
                <v-card-title>{{ estagiario.primeiroNome }} {{ estagiario.segundoNome }}</v-card-title>
                <v-card-subtitle>Status: {{ estagiario.status }}</v-card-subtitle>
                <v-card-text>Email: {{ estagiario.email }}</v-card-text>
                <!-- <v-card-text>Projeto: {{ estagiario.projeto }}</v-card-text> -->
                <v-card-text>Projeto: {{ estagiario.nomeProjeto || 'Não associado' }}</v-card-text>


                <v-card-actions>
                <v-btn variant="tonal" @click="abrirModalEditar(estagiario)">Editar</v-btn>
                <!-- <v-btn color="red" @click="abrirModalExcluir(estagiario)">Excluir</v-btn> -->
                <v-btn color="red" v-if="estagiario.status === 'INATIVO'" @click="abrirModalExcluir(estagiario)">
                Excluir
                </v-btn>
                </v-card-actions>
            </v-card>
            </v-col>
        </v-row>
        </v-container>

        <v-dialog v-model="modalCriar" max-width="500px">
        <v-card>
            <v-card-title>Adicionar Estagiário</v-card-title>
            <v-card-text>
            <v-text-field v-model="estagiarioSelecionado.primeiroNome" label="Primeiro nome do estagiário"></v-text-field>
            <v-text-field v-model="estagiarioSelecionado.segundoNome" label="Segundo nome do estagiário"></v-text-field>
            <v-text-field v-model="estagiarioSelecionado.email" label="Email do estagiário"></v-text-field>
            <v-select
            v-model="estagiarioSelecionado.status"
            :items="statusOptions"
            label="Status"
            />
            <v-select
            v-model="estagiarioSelecionado.projeto"
            :items="projetosOptions"
            item-title="title"
            item-value="value"
            label="Projeto"
            />
            </v-card-text>
            <v-card-actions>
            <v-btn text @click="fecharModalCriar">Cancelar</v-btn>
            <v-btn color="primary" @click="salvarEdicao">Adicionar</v-btn>
            </v-card-actions>
        </v-card>
        </v-dialog>

        <v-dialog v-model="modalEditar" max-width="500px">
        <v-card>
            <v-card-title>Editar Estagiário</v-card-title>
            <v-card-text>
            <v-text-field v-model="estagiarioSelecionado.primeiroNome" label="Primeiro nome do estagiário"></v-text-field>
            <v-text-field v-model="estagiarioSelecionado.segundoNome" label="Segundo nome do estagiário"></v-text-field>
            <v-text-field v-model="estagiarioSelecionado.email" label="Email do estagiário"></v-text-field>
            <v-select
                v-model="estagiarioSelecionado.status"
                :items="statusOptions"
                label="Status"
            ></v-select>
            <div v-if="estagiarioSelecionado.nomeProjeto" class="mb-2">
                Projeto atual: <strong>{{ estagiarioSelecionado.nomeProjeto }}</strong>
            </div>
            <v-select
            v-model="estagiarioSelecionado.projeto"
            :items="projetosOptions"
            item-title="title"
            item-value="value"
            label="Selecione o projeto"
            />
            </v-card-text>
            <v-card-actions>
            <v-btn text @click="fecharModalEditar">Cancelar</v-btn>
            <v-btn color="primary" @click="salvarEdicao">Salvar</v-btn>
            </v-card-actions>
        </v-card>
        </v-dialog>

        <v-dialog v-model="modalExcluir" max-width="500px">
        <v-card>
            <v-card-title class="text-h6">Tem certeza que deseja excluir esse estagiário?</v-card-title>
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
    import { useEstagiarioStore } from '@/store/estagiarioStore'

    import { useProjetoStore } from '@/store/projetoStore'

    const projetoStore = useProjetoStore()

    const estagiarioStore = useEstagiarioStore()
    const carregando = ref(false)

    const modalCriar = ref(false)
    const modalEditar = ref(false)
    const modalExcluir = ref(false)
    const estagiarioSelecionado = ref({
        id: null,
        primeiroNome: '',
        segundoNome: '',
        email: '',
        status: '',
        projeto: null
    })

    const statusOptions = ['ATIVO', 'INATIVO']
    
    
    onMounted(async () => {
        // await buscarEstagiarios()
        try {
            await projetoStore.buscarProjetos()
            projetosOptions.splice(0, projetosOptions.length, ...projetoStore.projetos.map(p => ({
                title: p.nome,
                value: p.id
            })))
            await buscarEstagiarios()
        } catch (error) {
            console.error('Erro ao carregar dados iniciais:', error)
        } finally {
            carregando.value = false
        }
    })

    const projetosOptions = [] // fazer req pra ter todos os projetos 
    
    async function buscarEstagiarios() {
        carregando.value = true
        try {
            await estagiarioStore.buscarEstagiarios()
        } catch (error) {
            console.error('Erro ao buscar estagiarios:', error)
        } finally {
            carregando.value = false
        }
    }

    function abrirModalCriar() {
        estagiarioSelecionado.value = {
            id: null,
            primeiroNome: '',
            segundoNome: '',
            email: '',
            status: '',
            projeto: null
        }

        modalCriar.value = true
    }

    function fecharModalCriar() {
        modalCriar.value = false
    }

    // function abrirModalEditar(estagiario) {
    //     console.log(estagiarioSelecionado.projeto)
    //     estagiarioSelecionado.value = { ...estagiario } 
    //     modalEditar.value = true
    // }

    function abrirModalEditar(estagiario) {
        const projetoId = estagiario.projeto?.id || estagiario.projeto?.split?.('/').pop() || null

        estagiarioSelecionado.value = {
            ...estagiario,
            projeto: projetoId
        } 
        modalEditar.value = true
    }

    function fecharModalEditar() {
        modalEditar.value = false
    }

    // async function salvarEdicao() {
    //     try {
    //         await estagiarioStore.salvarEstagiario({
    //             ...estagiarioSelecionado.value,
    //             projeto: `/projetos/${estagiarioSelecionado.value.projeto}`
    //         })
    //         //await estagiarioStore.salvarEstagiario(estagiarioSelecionado.value)
    //         await buscarEstagiarios()
    //         modalCriar.value = false
    //         modalEditar.value = false
    //     } catch (error) {
    //         console.error('Erro ao salvar estagiario:', error)
    //     }
    // }

    async function salvarEdicao() {
        try {
            // Preparar apenas os dados essenciais
            const dadosEssenciais = {
                id: estagiarioSelecionado.value.id,
                primeiroNome: estagiarioSelecionado.value.primeiroNome,
                segundoNome: estagiarioSelecionado.value.segundoNome,
                email: estagiarioSelecionado.value.email,
                status: estagiarioSelecionado.value.status
            };
            
            // Adicionar projeto apenas se existir
            if (estagiarioSelecionado.value.projeto) {
                dadosEssenciais.projeto = estagiarioSelecionado.value.projeto;
            }
            
            await estagiarioStore.salvarEstagiario(dadosEssenciais);
            await buscarEstagiarios();
            modalCriar.value = false;
            modalEditar.value = false;
        } catch (error) {
            console.error('Erro ao salvar estagiario:', error);
        }
    }

    function abrirModalExcluir(estagiario) {
        estagiarioSelecionado.value = { ...estagiario }
        console.log(estagiarioSelecionado.id)
        modalExcluir.value = true
    }

    function fecharModalExcluir() {
        modalExcluir.value = false
    }

    async function confirmarExclusao() {
        try {
            await estagiarioStore.excluirEstagiario(estagiarioSelecionado.value)
            await buscarEstagiarios()
            modalExcluir.value = false
        } catch (error) {
            console.error('Erro ao excluir estagiario:', error)
        }
    }
</script>