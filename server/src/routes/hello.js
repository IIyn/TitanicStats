import { Router } from "express";

const appRouter = new Router();

appRouter.get("/", (req, res) => {
  res.send("Hello John Doe !");
});

export default appRouter;
