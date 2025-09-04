# Cinemais API

Este projeto consiste em uma API RESTful para a plataforma de streaming "Cinemais", desenvolvida como parte de um teste técnico para desenvolvedor(a) Back End Júnior. O serviço gerencia um catálogo de mídias (filmes e séries) e a lista de "Favoritos" dos usuários.

---

## 1. Justificativa das Escolhas Técnicas

* **Framework (NestJS)**: A escolha pelo NestJS foi motivada por sua arquitetura modular e baseada em classes, que promove a organização do código, a separação de responsabilidades (Controller, Service, Repository) e a escalabilidade. A tipagem forte com TypeScript, que é nativa no NestJS, aumenta a segurança e a manutenibilidade do código, o que é um ponto preferencial no teste.
* **Banco de Dados (Prisma)**: A opção pelo Prisma é justificada por sua abordagem de ORM que simplifica a interação com o banco de dados. O Prisma é "type-safe", o que significa que ele gera automaticamente os tipos para suas consultas, evitando erros de digitação e melhorando a experiência de desenvolvimento. A facilidade de uso, especialmente com migrações e a geração do cliente, permite focar na lógica de negócio.

---

## 2. Como Rodar o Projeto

### Pré-requisitos
Certifique-se de ter o Docker e o Docker Compose instalados em sua máquina.

### Executando com Docker Compose (Recomendado)
Esta é a forma mais simples e preferencial de rodar o projeto, pois ele já orquestra o contêiner da aplicação e o banco de dados PostgreSQL.

1.  Clone este repositório.
2.  Na raiz do projeto, execute o comando:
    ```bash
    docker-compose up --build
    ```
3.  O servidor estará disponível na porta `3033` (ou a porta configurada no `docker-compose.yml`).

### Executando Localmente
Se preferir, você pode rodar a aplicação localmente.

1.  Instale as dependências:
    ```bash
    npm install
    ```
2.  Configure a variável de ambiente `DATABASE_URL` no arquivo `.env`.
3.  Rode a migração do banco de dados para criar as tabelas:
    ```bash
    npx prisma migrate dev --name init
    ```
4.  Inicie a aplicação:
    ```bash
    npm run start:dev
    ```

---

## 3. Como Rodar os Testes

Este projeto contém testes unitários para a lógica de negócio principal e testes de integração (e2e) para os endpoints da API.

* Para rodar os testes de unidade:
    ```bash
    npm run test
    ```
* Para rodar os testes de integração:
    ```bash
    npm run test:e2e
    ```

---

## 4. Documentação dos Endpoints

A documentação completa da API está disponível interativamente no Swagger. Após iniciar o servidor, acesse a URL:

**`http://localhost:3033/api-docs`**

Abaixo estão alguns exemplos de como interagir com as rotas usando o `cURL` (OBS: os dados de ID foram colocados de forma random, devem ser alterados na hora de usar para os que a pessoa cadastrou e recebeu):

### Gerenciamento do Catálogo de Mídia (`/media`)

#### **`POST /media`**
Adiciona um novo filme ao catálogo.

```bash
curl --location 'http://localhost:3000/media' \
--header 'Content-Type: application/json' \
--data '{
    "title": "Matrix Genérica",
    "description": "Um dev descobre que o mundo é uma simulação e precisa debugá-lo.",
    "type": "movie",
    "releaseYear": 2025,
    "genre": "Ficção Científica"
}'
```

#### **`GET /media`**
Lista todos os itens de mídia disponíveis no catálogo.

```bash
curl --location 'http://localhost:3000/media'
```

#### **`GET /media/{id}`**
Busca um item de mídia específico pelo seu ID.

```bash
curl --location 'http://localhost:3000/media/cmf4hyx0i00006zw05tdlq65m'
```

### Gerenciamento da Lista de Favoritos (/users/{userId}/favorites)

#### **`POST /users/{userId}/favorites`**
Adiciona um item de mídia à lista de favoritos de um usuário.

```bash
curl --location 'http://localhost:3000/users/cmf2sina400006zpwpb1rzqxt/favorites' \
--header 'Content-Type: application/json' \
--data '{
    "mediaId": "cmf4hyx0i00006zw05tdlq65m"
}'
```

#### **`GET /users/{userId}/favorites`**
Lista todos os itens da lista de favoritos de um usuário.

```bash
curl --location 'http://localhost:3000/users/cmf2sina400006zpwpb1rzqxt/favorites'
```

#### **`DELETE /users/{userId}/favorites/{mediaId}`**
Remove um item de mídia da lista de favoritos de um usuário

```bash
curl --location --request DELETE 'http://localhost:3000/users/cmf2sina400006zpwpb1rzqxt/favorites/cmf4hyx0i00006zw05tdlq65m'
```