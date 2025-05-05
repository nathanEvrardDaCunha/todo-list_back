import express from "express";

const authRouter = express.Router();

authRouter.post("/login", (req, res) => {
  // TO-FIX: Crash if the request miss one of the body property
  // const { username, email, password } = req.body;

  // successJson = {
  //   message: "Login route work fine.",
  //   username: username,
  //   email: email,
  //   password: password,
  // };
  // res.status(200).json(successJson);

  res.status(200).send(`Login route work fine.`);
});

authRouter.post("/register", (req, res) => {
  // TO-FIX: Crash if the request miss one of the body property
  // const { email, password } = req.body;

  // successJson = {
  //   message: "Register route work fine.",
  //   email: email,
  //   password: password,
  // };
  // res.status(200).json(successJson);

  res.status(200).send(`Register route work fine.`);
});

export default authRouter;
