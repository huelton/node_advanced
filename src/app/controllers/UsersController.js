import * as Yup from "yup";
import { Op } from "sequelize";
import { parseISO } from "date-fns";
import Contact from "../models/Contact";
import User from "../models/User";

class UsersController {
  async index(req, res) {
    const {
      nome,
      email,
      createdBefore,
      createdAfter,
      updatedBefore,
      updatedAfter,
      sort,
    } = req.query;

    const page = req.query.page || 1;
    const limit = req.query.limit || 25;

    let where = {};
    let order = [];

    if (nome) {
      where = {
        ...where,
        nome: {
          [Op.like]: nome,
        },
      };
    }

    if (email) {
      where = {
        ...where,
        email: {
          [Op.like]: email,
        },
      };
    }

    if (createdBefore) {
      where = {
        ...where,
        createdAt: {
          [Op.gte]: parseISO(createdBefore),
        },
      };
    }

    if (createdAfter) {
      where = {
        ...where,
        createdAt: {
          [Op.lte]: parseISO(createdAfter),
        },
      };
    }

    if (updatedBefore) {
      where = {
        ...where,
        updatedAt: {
          [Op.gte]: parseISO(updatedBefore),
        },
      };
    }

    if (updatedAfter) {
      where = {
        ...where,
        updatedAt: {
          [Op.lte]: parseISO(updatedAfter),
        },
      };
    }

    if (sort) {
      order = sort.split(",").map(item => item.split(":"));
    }

    try {
      const data = await User.findAll({
        attributes: { exclude: ["password", "password_hash"] },
        where,
        order,
        limit,
        offset: limit * page - limit,
      });
      res.json(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async show(req, res) {
    try {
      const data = await User.findByPk(req.params.id);
      if (!data) {
        res.status(404).json();
      }
      res.json(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async create(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .min(8)
        .required(),
      passwordConfirmation: Yup.string().when("password", (password, field) =>
        password ? field.required().oneOf([Yup.ref("password")]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Error on validate schema" });
    }

    const { id, nome, email, createdAt, updatedAt } = await User.create(
      req.body
    );
    return res.status(201).json({ id, nome, email, createdAt, updatedAt });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(8),
      password: Yup.string()
        .min(8)
        .when("oldPassword", (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      passwordConfirmation: Yup.string().when("password", (password, field) =>
        password ? field.required().oneOf([Yup.ref("password")]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Error on validate schema" });
    }

    const data = await User.findByPk(req.params.id);
    if (!data) {
      res.status(404).json({ error: "User Not Found" });
    }

    const { oldPassword } = req.body;
    if (oldPassword && !(await data.checkPassword(oldPassword))) {
      res.status(401).json({ error: "User Password not Match" });
    }

    const { id, nome, email, createdAt, updatedAt } = await data.update(
      req.body
    );

    return res.status(201).json({ id, nome, email, createdAt, updatedAt });
  }

  async destroy(req, res) {
    const data = await User.findByPk(req.params.id);
    if (!data) {
      res.status(404).json({ error: "User Not Found" });
    }
    await data.destroy();
    return res.status(204).json();
  }
}

export default new UsersController();
