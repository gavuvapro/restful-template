const { Op } = require("sequelize");
const User = require("../models/User");

exports.getById = async (id) => User.findByPk(id);

exports.list = async ({ page = 1, limit = 10, search, sortBy = "createdAt", order = "DESC" }) => {
  const where = {};
  if (search) {
    where[Op.or] = [
      { firstName: { [Op.iLike]: `%${search}%` } },
      { lastName: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
    ];
  }
  const offset = (page - 1) * limit;
  const { rows, count } = await User.findAndCountAll({ where, limit, offset, order: [[sortBy, order]] });
  return { rows, count, page, limit };
};
