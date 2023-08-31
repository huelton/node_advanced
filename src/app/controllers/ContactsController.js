import Contact from "../models/Contact";

const customers = [
  { id: 1, nome: "Dev Samurai", site: "http://devsamurai.com.br" },
  { id: 2, nome: "Google", site: "http://google.com.br" },
  { id: 3, nome: "UOL", site: "http://uol.com.br" },
];

class ContactsController {
  async index(req, res) {
    try {
      const data = await Contact.findAll({
        limit: 1000,
      });
      res.json(data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  show(req, res) {
    const id = parseInt(req.params.id, 10);
    const customer = customers.find(item => item.id === id);
    const status = customer ? 200 : 404;
    console.log("GET :: /customers/:id", customer);
    return res.status(status).json(customer);
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

export default new ContactsController();
