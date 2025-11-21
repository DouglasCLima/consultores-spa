const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); // <--- NOVO: Módulo para lidar com caminhos de arquivos

const app = express();
// CRÍTICO: Usa a porta fornecida pelo ambiente (Render) ou 3000 para local
const PORT = process.env.PORT || 3000; 

// --- CONFIGURAÇÃO DE MIDDLEWARE ---

// ATENÇÃO: Se você está rodando o Frontend no Render/Vercel no mesmo domínio, remova o CORS.
// Se ainda estiver em domínios diferentes, use o CORS com a URL final do seu Frontend.
// Para a arquitetura de domínio único no Render (a que estamos construindo), o CORS NÃO é necessário.
app.use(bodyParser.json());

// --- MOCK DE DADOS EM MEMÓRIA (Seu CRUD) ---
let consultores = [
    // ... Seus dados aqui ...
    { id: 1, nomeCompleto: 'Maria Silva', email: 'maria.s@empresa.com', telefone: '11987654321', areaEspecializacao: 'Cloud Computing', dataCadastro: new Date().toISOString() },
    { id: 2, nomeCompleto: 'João Oliveira', email: 'joao.o@empresa.com', telefone: '11123456789', areaEspecializacao: 'Desenvolvimento Frontend', dataCadastro: new Date().toISOString() }
];
let nextId = 3; 

// --- 1. SERVIR ARQUIVOS ESTÁTICOS (O Frontend Angular) ---
// O Render compila o Angular em: ../frontend-app/dist/frontend-app
const ANGULAR_DIST_PATH = path.join(__dirname, '..', 'frontend-app', 'dist', 'frontend-app'); 
app.use(express.static(ANGULAR_DIST_PATH));

// --- 2. ENDPOINTS DA API REST ---
// ... (Seu código dos endpoints GET, POST, PUT, DELETE aqui)
// Os endpoints de API vêm ANTES da rota genérica de fallback!

// GET /api/consultores (Listar e Buscar/Filtrar)
app.get('/api/consultores', (req, res) => {
    // ... lógica de busca ...
    res.json(consultores);
});
// ... (todos os outros endpoints PUT/POST/DELETE)

// --- 3. ROTA DE FALLBACK (Resolve o "Cannot GET /" e Roteamento SPA) ---
// Para qualquer rota não encontrada acima (exceto as da API), serve o index.html do Angular.
app.get('*', (req, res) => {
    // Apenas serve o index.html se não for uma rota da API
    if (!req.url.startsWith('/api')) {
        res.sendFile(path.join(ANGULAR_DIST_PATH, 'index.html'));
    }
});


app.listen(PORT, () => {
    console.log(`🚀 Backend rodando na porta ${PORT}`);
});

app.listen(PORT, () => {
    console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
});
