// "Error Cannot find package X..." => add "./" prefix
import express from "express";
import dotenv from "dotenv";

// Start Up
// NOTE: dotenv only work when the server.js file is launch from the root folder (e.g: "node src/server.js")
dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.get("/api", (req, res) => {
//   res.status(200).send(`Tgit he default api route is working.`);
// });

const jsonTest = {
  title: "Basic api route's test to see if json work perfectly",
  name: "Camelia",
  age: 34,
  skills: ["communication", "react"],
};

app.get("/api", (req, res) => {
  res.status(200).json(jsonTest);
});

// app.use("/api/auth", authRouter);

app.listen(process.env.APP_PORT, () =>
  console.log(
    `The todo-list server is running on: ${process.env.APP_URL}${process.env.APP_PORT}.`
  )
);
