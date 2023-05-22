import User from "../models/User.js";
import { Router } from "express";

const appRouter = new Router();

appRouter.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (err) {
    console.log(err);
    res.status(500).send("Impossible de récupérer les documents");
  }
});

appRouter.get("/add", async (req, res) => {
    res.send
});


appRouter.post("/add", async (req, res) => {
  const { user_name } = req.body;

  if (!user_name || !user_password || !user_email) {
    return res.status(400).send("Il manque un champ");
  }

  try {
    await User.create({
      name: user_name,
      email: user_email,
      password: user_password,
    });
    res.status(201).send("Document inséré");
  } catch (err) {
    console.log(err);
    res.status(500).send("Impossible d'insérer le document");
  }
});

export default appRouter;
