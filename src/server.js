// "Error Cannot find package X..." => add "./" prefix
import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/authRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";

// Start Up
// TO-NOTE: dotenv only work when the server.js file is launch from the root folder (e.g: "node src/server.js")
dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const jsonTest = {
  title: "Basic api route's test to see if json work perfectly",
  name: "Camelia",
  age: 34,
  skills: ["communication", "react"],
};

app.get("/api", (req, res) => {
  res.status(200).json(jsonTest);
});

app.use("/api/auth", authRouter);

// TO-CONSIDER: Add "models" folder, if necessary
// TO-CONSIDER: Add "controllers" folder, if necessary
// TO-CONSIDER: Add "services" folder, if necessary
// Source: https://www.coreycleary.me/project-structure-for-an-express-rest-api-when-there-is-no-standard-way

// TO-DO: Implement default response for non existing route, no matter the method
// app.get('*')
// app.post('*')
// app.put('*')
// app.delete('*')

// TO-NOTE: The errorhandler need to be right before the end
// If not, it'll not work or return to express default error handling system
app.use(errorHandler);

app.listen(process.env.APP_PORT, () =>
  console.log(
    `The todo-list server is running on: ${process.env.APP_URL}${process.env.APP_PORT}.`
  )
);
