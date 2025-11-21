const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); // Módulo essencial para servir arquivos estáticos

const app = express();
// CRÍTICO: Usa a porta fornecida pelo ambiente (Render) ou 3000 para local
const PORT = process.env.PORT || 3000; 

// --- CONFIGURAÇÃO DE MIDDLEWARE ---
// Nota: CORS removido, pois o Render servirá Frontend e Backend no mesmo domínio.
app.use(bodyParser.json());

// --- MOCK DE DADOS EM MEMÓRIA ---
let consultores = [
    { id: 1, nomeCompleto: 'Maria Silva', email: 'maria.s@empresa.com', telefone: '11987654321', areaEspecializacao: 'Cloud Computing', dataCadastro: new Date().toISOString() },
    { id: 2, nomeCompleto: 'João Oliveira', email: 'joao.o@empresa.com', telefone: '11123456789', areaEspecializacao: 'Desenvolvimento Frontend', dataCadastro: new Date().toISOString() }
];
let nextId = 3; 

// --- DEFINIÇÃO DE CAMINHO ESTÁTICO ---
// Caminho para a pasta de build do Angular (relativo a backend-api/server.js)
const ANGULAR_DIST_PATH = path.join(__dirname, '..', 'frontend-app', 'dist', 'frontend-app'); 

// --- 1. ENDPOINTS DA API REST (/api/consultores) ---

// GET /api/consultores (Listar e Buscar/Filtrar)
app.get('/api/consultores', (req, res) => {
    const termoBusca = req.query.search ? req.query.search.toLowerCase() : '';
    
    if (termoBusca) {
        const resultados = consultores.filter(c => 
            c.nomeCompleto.toLowerCase().includes(termoBusca) ||
            c.email.toLowerCase().includes(termoBusca) ||
            c.areaEspecializacao.toLowerCase().includes(termoBusca)
        );
        return res.json(resultados);
    }
    res.json(consultores);
});

// GET /api/consultores/:id (Buscar por ID)
app.get('/api/consultores/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const consultor = consultores.find(c => c.id === id);
    if (consultor) {
        res.json(consultor);
    } else {
        res.status(404).send({ message: 'Consultor não encontrado.' });
    }
});

// POST /api/consultores (Criar Novo)
app.post('/api/consultores', (req, res) => {
    const novoConsultor = {
        id: nextId++,
        dataCadastro: new Date().toISOString(),
        ...req.body
    };
    if (!novoConsultor.nomeCompleto || !novoConsultor.email) {
        return res.status(400).send({ message: 'Nome e email são obrigatórios.' });
    }
    consultores.push(novoConsultor);
    res.status(201).json(novoConsultor);
});

// PUT /api/consultores/:id (Atualizar)
app.put('/api/consultores/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = consultores.findIndex(c => c.id === id);

    if (index !== -1) {
        const consultorAtualizado = {
            ...consultores[index],
            ...req.body,
            id: id, 
        };
        consultores[index] = consultorAtualizado;
        res.json(consultorAtualizado);
    } else {
        res.status(404).send({ message: 'Consultor não encontrado para atualização.' });
    }
});

// DELETE /api/consultores/:id (Excluir)
app.delete('/api/consultores/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = consultores.length;
    consultores = consultores.filter(c => c.id !== id);
    if (consultores.length < initialLength) {
        res.status(204).send(); 
    } else {
        res.status(404).send({ message: 'Consultor não encontrado.' });
    }
});

// --- 2. SERVIR ARQUIVOS ESTÁTICOS (Frontend) ---
// O Express serve todos os arquivos JS, CSS, assets, etc.
app.use(express.static(ANGULAR_DIST_PATH));

// --- 3. ROTA DE FALLBACK (Resolve "Cannot GET /" e Roteamento SPA) ---
// Para qualquer outra rota não capturada pela API, serve o index.html do Angular.
app.get('/:pathMatch(.*)*', (req, res) => {
  res.sendFile(path.join(ANGULAR_DIST_PATH, 'index.html'));
});


app.listen(PORT, () => {
    console.log(`🚀 Backend rodando na porta ${PORT}`);
});
