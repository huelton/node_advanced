import * as Yup from "yup";
import { Op } from "sequelize";
import { parseISO } from "date-fns";
import Contact from "../models/Contact";
import Customer from "../models/Customer";

class ContactsController {
  async index(req, res) {
    const {
      nome,
      email,
      status,
      createdBefore,
      createdAfter,
      updatedBefore,
      updatedAfter,
      sort,
    } = req.query;

    const page = req.query.page || 1;
    const limit = req.query.limit || 25;

    let where = { customer_id: req.params.customerId };
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

    if (status) {
      where = {
        ...where,
        status: {
          [Op.in]: status.split(",").map(item => item.toUpperCase()),
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
      const data = await Contact.findAll({
        include: [
          {
            model: Customer,
            attributes: ["id", "status"],
            required: true, // obrigar o campo existir.
          },
        ],
        attributes: { exclude: ["customer_id", "customerId"] },
        where,
        order,
        limit,
        offset: limit * page - limit,
      });
      res.json(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async show(req, res) {
    try {
      const data = await Contact.findOne({
        where: {
          customer_id: req.params.customerId,
          id: req.params.id,
        },
        // include: [Customer], usado caso queira mostrar os dados de Customer
        attributes: { exclude: ["customer_id", "customerId"] },
      });
      res.json(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async create(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      status: Yup.string().uppercase(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Error on validate schema" });
    }

    const newContact = await Contact.create({
      customer_id: req.params.customerId,
      ...req.body,
      attributes: { exclude: ["customer_id", "customerId"] },
    });
    return res.status(201).json({
      newContact,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string(),
      email: Yup.string().email(),
      status: Yup.string().uppercase(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Error on validate schema" });
    }

    const data = await Contact.findOne({
      where: {
        customer_id: req.params.customerId,
        id: req.params.id,
      },
      // include: [Customer], usado caso queira mostrar os dados de Customer
      attributes: { exclude: ["customer_id", "customerId"] },
    });
    if (!data) {
      res.status(404).json({ error: "Contact Not Found" });
    }

    await data.update(req.body);

    return res.json(data);
  }

  async destroy(req, res) {
    const data = await Contact.findOne({
      where: {
        customer_id: req.params.customerId,
        id: req.params.id,
      },
    });
    if (!data) {
      res.status(404).json({ error: "Contact Not Found" });
    }
    await data.destroy();
    return res.status(204).json();
  }
}

export default new ContactsController();
