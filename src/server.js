import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.get("/api", (req, res) => {
  res.status(200).send(`The default api route is working.`);
});

app.listen(process.env.APP_PORT, () =>
  console.log(
    `The todo-list server is running on: ${process.env.APP_URL}${process.env.APP_PORT}.`
  )
);
