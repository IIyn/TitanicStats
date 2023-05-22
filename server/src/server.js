import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import hello from "./routes/hello.js";
import users from "./routes/users.js";

const app = express();

dotenv.config("../.env");
const { APP_URL, APP_PORT, MONGO_URL } = process.env;

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/hello", hello);
app.use("/users", users);

try {
  await mongoose.connect(MONGO_URL);
  console.log("Connexion MonboDB établie!");

  app.listen(APP_PORT, () =>
    console.log(`L'application écoute sur http://${APP_URL}:${APP_PORT}`)
  );
} catch (err) {
  console.log("Impossible de démarrer l'application Node", err.message);
}
