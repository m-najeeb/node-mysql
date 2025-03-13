const User = require("../models/userModel");
const { Op } = require("sequelize");

class UserQueries {
  async getUserDetailsByData(data) {
    return await User.findOne({
      where: {
        [Op.or]: [
          { username: data.username },
          { email: data.email },
          { phone: data.phone },
        ],
      },
    });
  }

  async createUser(data) {
    return await User.create(data);
  }

  async getUserByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  async getUserById(id) {
    return await User.findByPk(id);
  }

  async getUserDetailsById(id) {
    return await User.findOne({ where: { id } });
  }
}

module.exports = new UserQueries();
