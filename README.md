[![NodeJS](https://img.shields.io/badge/-NodeJs-6633cc?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Gemini](https://img.shields.io/badge/-Gemini-000000?style=flat-square&logo=gemini&logoColor=white)](https://www.gemini.com/)
[![Google Cloud](https://img.shields.io/badge/-Google%20Cloud-4285F4?style=flat-square&logo=googlecloud&logoColor=white)](https://cloud.google.com/)

# **Gerenciador de Posts: API com Node.js, MongoDB e Gemini**

Bem-vindo ao repositório da API **Instabytes**! Esta API realiza operações CRUD (Create, Read, Update, Delete) para gerenciar posts, incluindo título, descrição, alt e imagens. A API está hospedada no **Google Cloud Run** e usa o **MongoDB Atlas** para armazenar os dados. A descrição das imagens postadas é gerada automaticamente pela **Google Generative AI (Gemini)**.

A **API** está sendo consumida na página do **Instabytes** hospedada no **Vercel**, onde você pode visualizar as imagens, títulos e descrições dos posts. Você pode acessar a página clicando no link abaixo:

[Visite a página do Instabytes no Vercel](https://instabytes.vercel.app)

---

## **Visão Geral da Arquitetura**

Este projeto utiliza as seguintes tecnologias para oferecer uma solução escalável e eficiente:

- **Node.js** com **Express.js** para criar a API.
- **MongoDB Atlas** para armazenamento de dados (posts).
- **Google Cloud Run** para hospedagem da API.
- **Google Cloud Storage** para armazenar imagens dos posts.
- **Google Generative AI (Gemini)** para gerar descrições automáticas das imagens postadas.
- **Multer** para manipulação de arquivos (imagens) na API.
- **Postman** para testes e depuração.
- **Vercel** para hospedar o frontend que consome a API.

---

## **Funcionalidades da API**

A API **Instabytes** oferece as seguintes funcionalidades:

- **GET** `/posts`: Retorna uma lista de todos os posts cadastrados, incluindo título, descrição, URL da imagem e descrição alternativa (alt).
- **POST** `/posts`: Cria um novo post.
- **POST** `/upload`: Faz o upload de uma imagem e cria um novo post associando-a.
- **PUT** `/upload/:id`: Atualiza um post existente, permitindo alterar título, descrição gerada automaticamente pela IA e texto alternativo (alt).
- **DELETE** `/posts/:id`: Exclui um post.

---

## **Como Executar Localmente**

Siga os passos abaixo para rodar o projeto no seu ambiente local:

### **Pré-requisitos**

- **Node.js** (>= 16.x)
- **MongoDB Atlas** (ou outra instância MongoDB)
- **Conta no Google Cloud** para a integração com o Google Cloud Storage e Google Generative AI.
- **Postman** para testar a API.

### **Passos para Rodar Localmente**

1. **Clone este repositório:**
```bash
  git clone https://github.com/VeronicaCasanova/post-maker-api.git
```  
  
2. **Navegue até o diretório do projeto:**
```bash
  cd post-maker-api
```

3. **Instale as dependências:**
```bash
  npm install express
  npm install mongodb
  npm i @google/generative-ai
  npm install multer
  npm i cors
  npm install dotenv

```

4. **Crie um arquivo .env na raiz do projeto e adicione suas variáveis de ambiente:**
```bash
  STRING_CONEXAO=mongodb+srv://usuario:senha@cluster.mongodb.net/database
  GEMINI_API_KEY=chave-da-api-do-gemini
```

5. **Inicie a API localmente:**
```bash 
   npm start
```

Agora a API estará disponível em http://localhost:3000/posts. Você pode usar o Postman ou o Insomnia para testar as rotas de criação, leitura, atualização e exclusão de posts.


# Endpoints da API

A API oferece os seguintes endpoints para realizar as operações CRUD:

## **POST Image**
Este endpoint permite criar um novo post enviando uma imagem. 

1. No Postman, selecione o método POST.
2. Insira a URL do endpoint: http://localhost:3000/upload?imagem
3. Acesse a Aba Body
4. Na aba Body, escolha a opção form-data. Essa configuração permite enviar arquivos e outros dados no formato correto.
5. Adicione um Campo Key ☑️
6. Insira uma nova chave (Key) chamada "imagem". Esse nome deve corresponder ao nome esperado no backend (neste caso, o campo "imagem" é configurado no middleware Multer).
7. Ao lado do campo "imagem", clique no menu suspenso chamado "File" e selecione a opção "File".
8. No Campo "Value", clique no botão "Select Files" e escolha uma imagem PNG de até 2MB que deseja enviar.
9. Envie a Requisição clicando no botão "Send".

### Exemplo de resposta:
```json
[
  {
    "message": "Imagem enviada com sucesso!",
    "post": {
        "acknowledged": true,
        "insertedId": "674a3db8da4dac21142f99ab",
        "imgUrl": "http://localhost:3000/uploads/674a3db8da4dac21142f99ab.png"
    }
}
  ...
]

 ```

## **GET Posts**
Lista todos os posts.

GET http://localhost:3000/posts

### Exemplo de resposta:
```json
[
  {
        "_id": "6749d631e30c8dfd85d59db7",
        "descricao": "Campo de flores silvestres vibrantes ao pé de uma imponente montanha nevada.\n",
        "imgUrl": "http://localhost:3000/uploads/6749d631e30c8dfd85d59db7.png",
        "alt": "montanha",
        "titulo": "Prado de Rainier"
  },
  {
        "_id": "674a3db8da4dac21142f99ab",
        "descricao": "Sem descrição",
        "imgUrl": "http://localhost:3000/uploads/674a3db8da4dac21142f99ab.png",
        "alt": "Descrição alternativa padrão",
        "titulo": "Título padrão"
    },
  ...
]

```

## **GET Image**
Retorna a imagem postada.

GET http://localhost:3000/uploads/:id.png

### Exemplo de resposta:
```json
[
  {
        "_id": "674a3db8da4dac21142f99ab",
        "descricao": "Sem descrição",
        "imgUrl": "http://localhost:3000/uploads/674a3db8da4dac21142f99ab.png",
        "alt": "Descrição alternativa padrão",
        "titulo": "Título padrão"
    },
  ...
]
```

## **Update Post**
Atualiza um post existente. A descrição da imagem será gerada automaticamente pelo Google Generative AI (Gemini).

PUT http://localhost:3000/upload/:id

### Corpo da requisição:
```json
{
    "titulo": "Gato Aquarela",
    "alt": "Gato Aquarela"
}
```

### Exemplo de resposta:
```json
{
    "mensagem": "Post atualizado com sucesso!",
    "post": {
        "descricao": "Gato ruivo em aquarela vibrante.\n",
        "alt": "Gato Aquarela",
        "imgUrl": "http://localhost:3000/uploads/674a3db8da4dac21142f99ab.png",
        "titulo": "Gato Aquarela"
    }
}
```
## **DELETE POST**
Deleta um post específico.

DELETE http://localhost:3000/posts/:id

### Exemplo de resposta:
```json

{
    "mensagem": "Post com ID 674a3db8da4dac21142f99ab excluído com sucesso."
}
```
---

# **Deploy na Google Cloud Run ☁️**
Este guia explica como realizar o deploy da API no Google Cloud Run para demonstrar o consumo no frontend. Siga os passos abaixo:

## Passos para Deploy na Google Cloud

### 1. Criar um Projeto no Google Cloud
1. Acesse o [Google Cloud Console](https://console.cloud.google.com).
2. Crie um novo projeto:  
   • Clique em **Selecionar Projeto**.  
   • Escolha a opção **Novo Projeto**.  
   • Dê um nome ao projeto e clique em **Criar**.

### 2. Ativar o Cloud Shell
1. No canto superior direito do console, clique no botão **Ativar Cloud Shell**.  
2. Aguarde o ambiente ser inicializado.

### 3. Clonar o Repositório do GitHub
  1. Clone o repositório do projeto:
  ```bash
  git clone https://github.com/seu-usuario/nome-do-projeto
  ```

  2. Navegue até o diretório do projeto:
  ```bash
  cd nome-do-projeto
  ```

### 4. Habilitar os Serviços do Google Cloud
  1. Execute o script para habilitar os serviços necessários:
  ```bash
  bash services.sh
  ```

### 5. Abrir o Editor de Código
  1. No Cloud Shell, clique em **Abrir Editor**.
  2. Confirme que você está no diretório do projeto verificando com:
  ```bash
  cd nome-do-projeto
  ```

### 6. Configurar o Arquivo .env
  1. Crie o arquivo `.env` no diretório raiz do projeto.
  ```bash
  touch .env
  ```

  2. Adicione as variáveis de ambiente no formato correto. Certifique-se de que o arquivo .env tem as variáveis no formato correto. As variáveis devem estar entre aspas duplas, como no exemplo abaixo:
  ```bash
  STRING_CONEXAO="mongodb+srv://usuario:senha@cluster.mongodb.net/database"
  GEMINI_API_KEY="chave-da-api-do-gemini"
  ```

### 7. Remover o .gitignore
  1. Execute o comando abaixo para remover o arquivo `.gitignore`, evitando problemas durante o deploy:
  ```bash
  rm .gitignore
  ```

### 8. Instalar Dependências
  1. Instale as dependências necessárias do projeto com:
  ```bash
  npm install
  ```

### 9. Fazer o Deploy no Google Cloud Run
  1. Execute o seguinte comando para iniciar o deploy:
  ```bash
  gcloud run deploy --source . --port=3000
  ```

  2. Durante o processo:  
    • Escolha um nome para o serviço.  
    • Selecione a região desejada.  
    • Confirme a permissão para **unauthenticated invocations** digitando `y`.

### 10. Obter o Endpoint da API  
  • Após a conclusão do deploy, o endereço da API será exibido no terminal.  
  • Use este endereço para acessar ou testar a API.  

---

  **Dica**: Guarde o endereço disponibilizado no final para utilizar nas requisições e integração de serviços.

---

# Frontend: Exemplo de Funcionamento

Uma página exibindo a imagem, título e descrição gerada pela IA:

![Captura de Tela (47)](https://github.com/user-attachments/assets/12d44efb-7694-4bbf-aef0-b69938663dc8)

![sophie4](https://github.com/user-attachments/assets/765903d7-4efe-40d9-a8af-092624753dd1)

