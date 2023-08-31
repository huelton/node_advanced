﻿# NODE ADVANCED

#### PROCEDIMENTO INSTALAÇÃO NODE

Site do Node.js: https://nodejs.org/

```
	npm install

	npm -v

```

```
	node -v

```

#### CRIAÇÃO PROJETO LINHA DE COMANDO NODE JS

```
	npm init -y

```

#### INSTALAÇÃO DO FRAMEWORK EXPRESS NODE JS

```
	npm install express

```

#### INSTALAÇÃO DO NODEMON NODE JS

```
	npm install nodemon@2.0.1

	incluir script dev:

	"scripts": {
    "dev": "nodemon .src/server.js"
    }

```

#### INSTALAÇÃO DE OUTRAS LIBS NODE JS

```
	npm install sucrase - para atualizar import e exports

  npm install sequelize        - ferramenta ORM - database
  npm install sequelize-cli -D

```

 ##### Configuração Sequelize
 ###### Arquivo na raiz: .sequelizerc

```
const { resolve } = require("path");

module.exports = {
  "config": resolve(__dirname, "src", "config", "database.js"),
  "models-path": resolve(__dirname, "src", "app", "models"),
  "migrations-path": resolve(__dirname, "src", "database", "migrations"),
  "seeders-path": resolve(__dirname, "src", "database", "seeds"),
}

```

 ##### Configuração banco de dados mysql
 ###### Arquivo: config/database.js

```

module.exports = {
  dialect: "mysql",
  host: "localhost", # endereco servidor
  username: "root", # usuario fake
  password: "root", # senha fake
  database: "teste_node", # banco fake
  define: {
    timestamp: true, // cria duas colunas: createdAt e updatedAt
    underscored: true,
    underscoredAll: true,
  },
};

```

#### EXECUTAR APLICAÇÃO

```
	npm run dev

```


#### SEQUELIZE MIGRATE

 ###### Comando para criar o arquivo de migração pelo sequelize
```
	yarn sequelize migration: create --name=create-customers

```

 ###### Comando para executar o arquivo de migração do sequelize
```
	yarn sequelize db:migrate

```

 ###### Comando para desfazer todas as migrações do sequelize
```
	yarn sequelize db:migrate:undo:all
