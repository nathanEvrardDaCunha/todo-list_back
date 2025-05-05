import express from "express";

const authRouter = express.Router();

authRouter.post("/login", (req, res, next) => {
  try {
    const jsonBody = req.body;

    if (jsonBody === undefined) {
      throw new Error(`Cannot process undefined request body !`);
    }

    const jsonKeys = Object.keys(jsonBody).length;
    if (jsonKeys != 3) {
      throw new Error(`Cannot process request body of the wrong size !`);
    }

    const jsonUsername = jsonBody.username;
    if (jsonUsername === undefined) {
      throw new Error(`Cannot process undefined username property !`);
    }

    const jsonEmail = jsonBody.email;
    if (jsonEmail === undefined) {
      throw new Error(`Cannot process undefined email property !`);
    }

    const jsonPassword = jsonBody.password;
    if (jsonPassword === undefined) {
      throw new Error(`Cannot process undefined password property !`);
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

    const jsonKeys = Object.keys(jsonBody).length;
    if (jsonKeys != 2) {
      throw new Error(`Cannot process request body of the wrong size !`);
    }

    const jsonEmail = jsonBody.email;
    if (jsonEmail === undefined) {
      throw new Error(`Cannot process undefined email property !`);
    }

    const jsonPassword = jsonBody.password;
    if (jsonPassword === undefined) {
      throw new Error(`Cannot process undefined password property !`);
    }

    res.status(200).send(`Register route work fine.`);
  } catch (error) {
    next(error);
  }
});

export default authRouter;
