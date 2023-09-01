import * as Yup from "yup";
import { Op } from "sequelize";
import { parseISO } from "date-fns";
import Customer from "../models/Customer";
import Contact from "../models/Contact";

const customers = [
  { id: 1, nome: "Dev Samurai", site: "http://devsamurai.com.br" },
  { id: 2, nome: "Google", site: "http://google.com.br" },
  { id: 3, nome: "UOL", site: "http://uol.com.br" },
];

class CustomersController {
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
      const data = await Customer.findAll({
        include: [
          {
            model: Contact,
            attributes: ["id", "status"],
          },
        ],
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
      const customer = await Customer.findByPk(req.params.id);
      if (!customer) {
        res.status(404).json({ error: "Customer Not Found" });
      } else {
        console.log("GET :: /customers/:id", customer);
        res.json(customer);
      }
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

    const newCustomer = await Customer.create(req.body);
    return res.status(201).json(newCustomer);
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

    const customer = await Customer.findByPk(req.params.id);
    if (!customer) {
      res.status(404).json({ error: "Customer Not Found" });
    }

    await customer.update(req.body);

    return res.json(customer);
  }

  async destroy(req, res) {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) {
      res.status(404).json({ error: "Customer Not Found" });
    }
    await customer.destroy();
    return res.status(204).json();
  }
}

export default new CustomersController();
