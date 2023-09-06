import express from "express";
import userRouter from "./routes/UserRouter";
import customerRouter from "./routes/CustomerRouter";
import contactRouter from "./routes/ContactRouter";

import "./database";

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
  }

  routes() {
    this.server.use(userRouter);
    this.server.use(customerRouter);
    this.server.use(contactRouter);
  }
}

export default new App().server;
