import Sequelize, { Model } from "sequelize";

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: Sequelize.STRING,
        email: Sequelize.STRING,
        password_hash: Sequelize.STRING,
      },
      {
        sequelize,
        name: {
          singular: "user",
          plural: "users",
        },
      }
    );
  }
}

export default User;
