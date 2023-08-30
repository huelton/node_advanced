module.exports = {
  dialect: "mysql",
  host: "localhost",
  username: "root",
  password: "root",
  database: "teste_node",
  define: {
    timestamp: true, // cria duas colunas: createdAt e updatedAt
    underscored: true,
    underscoredAll: true,
  },
};
