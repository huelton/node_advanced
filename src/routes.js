import { Router } from "express";
import customers from "./app/controllers/CustomersController";
import contacts from "./app/controllers/ContactsController";

const routes = new Router();

// CUSTOMERS
routes.get("/customers", customers.index);
routes.get("/customers/:id", customers.show);
routes.post("/customers", customers.create);
routes.put("/customers/:id", customers.update);
routes.delete("/customers/:id", customers.destroy);

// CONTACT
routes.get("/contacts", contacts.index);
routes.get("/contacts/:id", contacts.show);
routes.post("/contacts", contacts.create);
routes.put("/contacts/:id", contacts.update);
routes.delete("/contacts/:id", contacts.destroy);

export default routes;
