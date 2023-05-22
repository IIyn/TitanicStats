import express from "express";
import dotenv from "dotenv";
import hello from "./routes/hello";

const app = express();

dotenv.config("../.env");
const { APP_URL, APP_PORT } = process.env;

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/hello", hello);

app.listen(APP_PORT, () => {
  console.log(`Server running on http://${APP_URL}:${APP_PORT}`);
});
