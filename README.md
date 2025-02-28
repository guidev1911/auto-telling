# Auto-Telling API

## 📌 Descrição
A **Auto-Telling API** é uma aplicação backend que gerencia um sistema de automóveis e usuários. Esta API fornece um CRUD completo para carros e usuários, contando com segurança, testes e documentação robusta. Ela foi desenvolvida para alimentar um frontend em React.js.

## 🚀 Tecnologias Utilizadas
- **Node.js**
- **Express.js**
- **Jest & Supertest** (Testes automatizados)
- **Joi** (Validação de dados)
- **Swagger** (Documentação da API)
- **Socket.io** (WebSockets para comunicação em tempo real)
- **JWT (JSON Web Token)** (Autenticação e segurança)
- **Bcrypt.js** (Criptografia de senhas)
- **Banco de Dados** (Especificar MySQL, PostgreSQL, MongoDB, etc.)

## ⚙️ Requisitos
- Node.js instalado
- Banco de dados configurado
- Gerenciador de pacotes (npm ou yarn)

## 📥 Instalação
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/auto-telling-api.git

# Acesse o diretório do projeto
cd auto-telling-api

# Instale as dependências
npm install  # ou yarn install
```

## 🔧 Configuração
Crie um arquivo `.env` na raiz do projeto e configure as variáveis de ambiente:
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASS=senha
DB_NAME=auto_telling
JWT_SECRET=sua_chave_secreta
```

## ▶️ Execução
```bash
# Iniciar a API em modo de desenvolvimento
npm run dev

# Iniciar a API em modo de produção
npm start
```

## 📌 Rotas da API
A documentação completa das rotas pode ser acessada via Swagger:
```
http://localhost:3001/api-docs
```

Exemplo de algumas rotas:
- `POST /auth/login` - Autenticação do usuário
- `GET /carros` - Lista todos os carros
- `POST /carros` - Adiciona um novo carro
- `PUT /cars/:id` - Atualiza um carro existente
- `DELETE /carros/:id` - Remove um carro

## 🧪 Testes
Rodar os testes automatizados com Jest e Supertest:
```bash
npm test
```

## 🤝 Contribuição
Sinta-se à vontade para contribuir com este projeto!

## 📜 Licença
Este projeto está licenciado sob a MIT License.

