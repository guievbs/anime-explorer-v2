# 🧭 Anime Explorer — README

Uma aplicação **SPA em React.js** + **Backend Express.js** + **SQLite** que permite:

* Buscar animes usando **Jikan API**
* Favoritar animes (armazenados no frontend)
* Inserir animes no banco local
* Sortear anime aleatório
* Logar com usuário `admin`
* Gerenciar favoritos via *drawer* deslizante
* Design minimalista usando **Material UI (MUI)**

Totalmente alinhado ao **Projeto 2** (3 camadas: frontend, backend, banco).

---

# 📁 Estrutura do Projeto

```
/
├── backend/
│   ├── src/
│   │   ├── server.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   └── anime.routes.js
│   │   ├── models/
│   │   │   └── AnimeModel.js
│   │   └── config/
│   │       └── db.js
│   ├── setup_db.js         # script para criar o banco + seeds
│   ├── package.json
│   └── data/app.db         # criado na primeira execução
│
└── frontend/
    ├── src/
    │   ├── api/client.js
    │   ├── components/
    │   ├── contexts/
    │   └── ...
    ├── vite.config.mjs
    └── package.json
```

---

# 🛠️ 1. Requisitos

Instale:

* **Node.js 18+**
* **npm**
* (opcional) **Git**
* Nada extra é necessário: DB SQLite já é embutido.

---

# ⚙️ 2. Configurando o Backend

Acesse a pasta:

```bash
cd backend
```

Instale dependências:

```bash
npm install
```

## Criar / atualizar banco de dados

Execute:

```bash
node setup_db.js
```

Esse script irá:

* Criar o arquivo `backend/data/app.db`
* Criar tabelas `users` e `animes`
* Criar usuário administrador:

```
username: admin
senha: senha123
role: admin
```

* Inserir um anime real como seed (*Fullmetal Alchemist: Brotherhood*)

## Rodar o backend

```bash
npm run dev
```

Ou:

```bash
node src/server.js
```

Backend estará rodando em:

```
http://localhost:4000
```

### Testar backend rapidamente

Abra no navegador:

```
http://localhost:4000/api/health
```

Retorno esperado:

```json
{ "ok": true }
```

---

# 🎨 3. Configurando o Frontend

Acesse a pasta:

```bash
cd frontend
```

Instale dependências:

```bash
npm install
```

Inicie o servidor Vite:

```bash
npm run dev
```

Frontend rodará em:

```
http://127.0.0.1:5173
```

---

# 🔐 4. Login

Use o usuário seed criado pelo backend:

```
Usuário: admin
Senha:   senha123
```

Após logar, você será redirecionado para a UI principal.

---

# 🔍 5. Como usar

### ▶️ Buscar anime

No topo da interface, digite parte do nome e clique **Buscar**.

A busca usa **exclusivamente Jikan API**, e os resultados são mostrados como cards.

### 🎲 Aleatório

Clique no botão **Aleatório** para sortear um anime.

### ⭐ Favoritos

Clique no card → *Favoritar*

Clique no ícone de coração no topo para abrir o **drawer de favoritos**.

### 🗑️ Excluir anime local

Se o anime for local (inserido via API), aparecerá botão **Excluir** no drawer.

### ➕ Inserir anime local (opcional)

Via requisição:

```
POST /api/anime
Body JSON:
{
  "title": "Meu Anime",
  "score": 8.5,
  "image_url": "https://..."
}
```

---

# 🧪 6. Testes

### Backend (Mocha + Supertest)

```bash
cd backend
npm run test
```

### Frontend (Vitest + Testing Library)

```bash
cd frontend
npm run test
```

# 📑 8. Resumo

✔ SPA React + Context API
✔ Backend Express + SQLite
✔ Login com sessão
✔ Busca na Jikan API
✔ Favoritos com Drawer
✔ Design limpo com Material UI
✔ Suporte a inserir/excluir animes locais
✔ Testes backend + frontend
✔ Pronto para deploy
