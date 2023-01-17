# API gateway
### api que faz a conexão entre os microserviços e o cliente, com uma aplicação de rankings inteligentes para jogadores de Tennis 
### microserviços:
- [Micro admin Back End](https://github.com/MatheusVict/micro-admin-backend) (responsável pelos jogadores e suas categorias)
- [Micro challenges](https://github.com/MatheusVict/micro-challenges) (responsável pelos desafios e partidas)
- [Micro rankings](https://github.com/MatheusVict/Micro-ranking) (responsável pela estruturação e criação de rankings de acordo com a categoria)
- [Micro notifications](https://github.com/MatheusVict/Micro-Notificacoes) (responsável por notificar o adversário do desafiante)

### Informações importantes:
  ```ruby
  node: v18.12.1
  nest: 9.1.4
  RabbitMQ 3.11.6
  ```
 - Crie uma arquivo .env seguindo o arquivo .env.example
    - AWS_RABBITMQ= string de conexão com RabbitMQ
    - JWT_PRIVATE_KEY= Chave privada JWT
    - JWT_EXPERIATION_TIME_TOKEN= Tempo de expiração do token
    - PORT_APP= Porta da aplicação

### Comandos:
#### Iniciação do projeto no modo watch

```ruby
yarn start:dev or npm run start:dev
```
#### Build para JavaScript

```ruby
yarn build or npm run build
```

#### Teste da aplicação(ainda sendo finalizado)

```ruby
yarn test or npm run test
```

> OBS: para funcionar é preciso que todos os microserviços estejam rodando(se utilizando do mesmo comando de iniciação citado acima)

## Rotas:

### Auth:
- Post: ```/auth/login```
  > Autenticação
  - Body: 
  ```ruby
  {
    "email": "email de um jogador registrado(criação de jogadores não precisa de autenticação)",
    "password": "Informe qualquer valor pois a feature de usuário ainda está sendo implementada"
  }
  ```
  - Irá receber um token, passe-o nas rotas através do Bearer Token

### Categorias:

- Post: ```/categories```
  > Criação
  - Body: 
  ```ruby
   {
	"category": "Nome da categoria",
	"description": "",
	"events": [{
		"name": "VITORIA",
		"operetion": "+",
		"value": Pontos ganhos: Number
	},
	{
		"name": "DERROTA",
		"operetion": "-",
		"value": Pontos perdidos: Number
	}]
  }
  ```
  
- Get: ```/categories?idCategory={ID da categoria}```
   > Busca
  - Se passado retorna a categoria desejada
  - Se não retorna todas
  
- Put: ```/categories/{ID da categoria}```
  > Atualização
  - Body: 
  ```ruby
   {
	"category": "Nome da categoria",
	"description": "",
	"events": [{
		"name": "VITORIA",
		"operetion": "+",
		"value": Pontos ganhos: Number
	},
	{
		"name": "DERROTA",
		"operetion": "-",
		"value": Pontos perdidos: Number
	}]
  }
  ```
  
- Delete: ```/categories/{ID da categori}```
  > Deleção


### Jogadores:
- Post: ```/players```
  > Criação
  - Body:
  ```ruby
  {
	"phoneNumber": "",
	"email": "",
	"name": "",
	"category": "ID da categoria"
  }
  ```
  
- Get: ```/players?idplayer={ID do jogador}```
  > Busca
  - Se passado retorna o jogador desejado
  - Se não retorna todos
  
- Put: ```/players/{ID do jogador}```
  > Atualização
  - Body
  ```ruby
  {
	"phoneNumber": "",
	"email": "",
	"category": "ID da categoria"
  }
  ```
- Delete: ```/players/{ID do jogador}```
  > Deleção

- Post: ```/players/{ID do jogador}/upload```
  > Associar foto a usuários
  -Body: ```File```
  
### Desafios:
- Post: ```/challenges```
  > Criação
  - Body: 
  ```ruby
  {
    "DateTimeChallenge": "2023-01-12T09:00:00",
    "requester": "ID do jogador que solicitou o desafio",
    "category": "ID da categoria",
    "players": [
    {
      "_id": "ID do jogador"
    },
    {
       "_id": "ID do jogador"
    }]
  }
  ```
  
- Get: ```/challenges/?idplayer={ID do jogador}```
  > Busca
  - Se passado retorna todos os desafios do usuário
  - Se não retorna todos os desafios

- Put: ```/challenges/{ID do desafio}```
  > Atualização
  - Body: 
  ```ruby
  {
    "status": "Status da resposta, ACEITO ou NEGADO"
  }
  ```
  
- Delete: ```/challenges/{ID do desafio}```
  > Deleção
  
- Post: ```/challenges/{ID do desafio}/match```
  > Associar um partida um desafio
  - Body: 
  ```ruby
  {
    "def": "ID do vencedor",
    "result": [{
      "set": "6-4"
    },{
      "set": "6-3"
    }]
  }
  ```
  
### Rankings:
- Get: ```/rankings/?idCategory={ID da categoria}&dataRef={Data de referência para consulta no ranking}```
  > Consulta
  - idCategory é obrigatorio
  - dataRef é opcional(se não informado a data atual será preenchida)


