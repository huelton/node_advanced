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
    const id = parseInt(req.params.id, 10);
    try {
      const data = Customer.findByPk(id);
      // const status = data.status ? 200 : 404;
      console.log("GET :: /customers/:id", data);
      res.json(data);
      // res.status(status).json(data.status);
    } catch (error) {
      console.error("Error fetching customers:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  create(req, res) {
    const { nome, site } = req.body;
    const id = customers[customers.length - 1].id + 1;
    const newCustomer = { id, nome, site };
    customers.push(newCustomer);

    return res.status(201).json(newCustomer);
  }

  update(req, res) {
    const id = parseInt(req.params.id, 10);
    const { nome, site } = req.body;
    const index = customers.findIndex(item => item.id === id);
    const status = index >= 0 ? 200 : 404;
    if (index >= 0) {
      customers[index] = { id: parseInt(id, 10), nome, site };
    }
    return res.status(status).json(customers[index]);
  }

  destroy(req, res) {
    const id = parseInt(req.params.id, 10);
    const index = customers.findIndex(item => item.id === id);
    const status = index >= 0 ? 204 : 404;
    if (index >= 0) {
      customers.splice(index, 1);
    }
    return res.status(status).json();
  }
}

export default new CustomersController();
