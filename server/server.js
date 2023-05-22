import express from "express";
import dotenv from "dotenv";

const app = express();

dotenv.config();
const { APP_URL, APP_PORT } = process.env;

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(APP_PORT, () => {
  console.log(`Server running on http://${APP_URL}:${APP_PORT}`);
});
