import { Router } from "express";
import users from "../app/controllers/UsersController";

const routes = new Router();

// USERS
routes.get("/users", users.index);
routes.get("/users/:id", users.show);
routes.post("/users", users.create);
routes.put("/users/:id", users.update);
routes.delete("/users/:id", users.destroy);

export default routes;
