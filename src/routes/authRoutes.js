import express from "express";

const authRouter = express.Router();

authRouter.post("/login", (req, res, next) => {
  try {
    res.status(200).send(`Login route work fine`);
  } catch (error) {
    next(error);
  }
});

authRouter.post("/register", (req, res) => {
  try {
    res.status(200).send(`Register route work fine.`);
  } catch (error) {
    next(error);
  }
});

export default authRouter;
