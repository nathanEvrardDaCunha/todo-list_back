import express from "express";

const authRouter = express.Router();

authRouter.post("/login", (req, res, next) => {
  try {
    const jsonBody = req.body;

    if (jsonBody === undefined) {
      throw new Error(`Cannot process undefined request body !`);
    }

    res.status(200).send(`Login route work fine`);
  } catch (error) {
    next(error);
  }
});

authRouter.post("/register", (req, res, next) => {
  try {
    const jsonBody = req.body;

    if (jsonBody === undefined) {
      throw new Error(`Cannot process undefined request body !`);
    }

    res.status(200).send(`Register route work fine.`);
  } catch (error) {
    next(error);
  }
});

export default authRouter;
