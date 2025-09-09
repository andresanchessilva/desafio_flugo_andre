# Desafio Frontend - Cadastro de Colaboradores (Flugo)

Projeto de um formulário multi-step para cadastro de colaboradores com dados persistidos no Firebase.

---

### 🚀 **Aplicação Online:** [Acessar o Deploy na Vercel](https://desafio-flugo-andre.vercel.app/)

---

### ✨ Funcionalidades

- Listagem de colaboradores com ordenação via servidor.
- Formulário de cadastro em múltiplos passos.
- Persistência de dados em tempo real com o Firebase Firestore.
- Feedback de sucesso/erro com notificações (Snackbar).
- Edição e exclusão de colaboradores. 🔥
- Filtros de colaboradores por nome, e-mail e departamento. 🔥
- Listagem, criação, edição e exclusão de departamentos. 🔥
- Autenticação. 🔥
- Página 404 (Not found). 🔥
 
⚠️ Observações Importantes:

- Filtros e Ordenação: Os filtros de colaboradores (nome, e-mail e departamento) não devem ser usados em conjunto com a ordenação. Foram criados indexes no Firestore que permitem usar qualquer combinação dos três filtros de forma independente, mas combinar filtros com ordenação não é suportado. O filtro corresponde ao início do texto buscado e é case-sensitive. Mesmo sendo possível contornar isso de outras formas, optou-se por enviar o filtro diretamente para o Firestore em vez de fazer todo o filtro apenas no frontend.

- Restrições de Exclusão: 
  - Um colaborador não pode ser excluído se ele for gerente de outro colaborador ou de um departamento.
  - Um departamento não pode ser excluído se possuir colaboradores vinculados a ele.

---

### 🛠️ Tecnologias Utilizadas

- **ReactJS** com **TypeScript**
- **Vite** como ambiente de desenvolvimento
- **Material-UI (MUI)** para componentes de UI
- **React Router DOM** para roteamento
- **Firebase (Firestore)** para o banco de dados

---

### ⚙️ Como Rodar o Projeto Localmente

**1. Clone o repositório:**

```bash
git clone https://github.com/andresanchessilva/desafio_flugo_andre.git
cd desafio_flugo_andre
```

**2. Instale as dependências:**

```bash
npm install
```

**3. Configure as Variáveis de Ambiente:**

- Crie uma cópia do arquivo de exemplo `.env.example`:
  ```bash
  cp .env.example .env
  ```
- Abra o arquivo `.env` e adicione suas credenciais do Firebase. É necessário ter uma coleção chamada **employees**, os documentos seguem o seguinte formato:

```json
{
  "name": "string",
  "email": "string",
  "department": "string",
  "status": ["ativo", "inativo"]
  "createdAt": "timestamp"
}
```

- Observação: imaginando que status poderia incluir outros valores além de “ativo” ou “inativo”, foi usado string em vez de boolean. No entanto, nesta implementação, as chips são renderizadas apenas para os valores “ativo” ou “inativo”.

**4. Rode a aplicação:**

```bash
npm run dev
```

Acesse `http://localhost:5173` no seu navegador.

---

💾 André Gustavo Sanches Silva  
📞 (44) 99732-5770 | 💼 [LinkedIn](https://www.linkedin.com/in/andr%C3%A9-gustavo-silva-090986274/) | ✉️ andre.sanchessilva@gmail.com
