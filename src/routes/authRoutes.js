import express from "express";

const authRouter = express.Router();

const isFalsy = (value) => !value;
const isUndefined = (value) => value === undefined;
const isNotString = (value) => typeof value !== "string";
const isShorterEqualThan = (value, shorterLength) => value < shorterLength;
const isLongerEqualThan = (value, higherLength) => value > higherLength;
const isLowerEqualThan = (value, lowerNumber) => value < lowerNumber;
const isHigherEqualThan = (value, higherNumber) => value < higherNumber;
const isNotEqual = (value, equalNumber) => value != equalNumber;

// TO-CONSIDER: Add typescript without hot reload to avoid build problem ?
// TO-CONSIDEr: Add prettier for better formatting ?
const validateStringProperty = (value, valueName, minLength, maxLength) => {
  if (isUndefined(value)) {
    return new Error(`Cannot process undefined ${valueName} property !`);
  }

  if (isNotString(value)) {
    return new Error(`Cannot process non string ${valueName} property !`);
  }

  if (isShorterEqualThan(value.length, minLength)) {
    return new Error(
      `Cannot process ${valueName} property shorter than ${minLength} characters !`
    );
  }

  if (isLongerEqualThan(value.length, maxLength)) {
    return new Error(
      `Cannot process ${valueName} property longer than ${maxLength} characters !`
    );
  }

  return true;
};

authRouter.post("/login", (req, res, next) => {
  try {
    // SECURITY: Verify JSON body
    if (isFalsy(req.body)) {
      throw new Error(`Cannot process undefined request body !`);
    }

    if (isNotEqual(Object.keys(req.body).length, 3)) {
      throw new Error(`Cannot process request body of the wrong size !`);
    }

    // SECURITY: Verify username property
    // TO-CONSIDER: Enforce no special characters in username, only letters, hyphens and numbers ?
    const MIN_USERNAME_LENGTH = 5;
    const MAX_USERNAME_LENGTH = 50;
    const usernameError = validateStringProperty(
      req.body.username,
      "username",
      MIN_USERNAME_LENGTH,
      MAX_USERNAME_LENGTH
    );

    if (usernameError instanceof Error) {
      throw usernameError;
    }

    // SECURITY: Verify email property
    // TO-DO: Add email pattern verification
    // TO-CONSIDER: Enforce no special characters in email, only letters, hyphens, @ and numbers ?
    const MIN_EMAIL_LENGTH = 6;
    const MAX_EMAIL_LENGTH = 150;
    const emailError = validateStringProperty(
      req.body.email,
      "email",
      MIN_EMAIL_LENGTH,
      MAX_EMAIL_LENGTH
    );

    if (emailError instanceof Error) {
      throw emailError;
    }

    // SECURITY: Verify password property
    // TO-CONSIDER: Force stronger password with uppercase, lowercase, special characters and number verification ?
    const MIN_PASSWORD_LENGTH = 6;
    const MAX_PASSWORD_LENGTH = 200;
    const passwordError = validateStringProperty(
      req.body.password,
      "password",
      MIN_PASSWORD_LENGTH,
      MAX_PASSWORD_LENGTH
    );

    if (passwordError instanceof Error) {
      throw passwordError;
    }

    res.status(200).send(`Login route work fine`);
  } catch (error) {
    next(error);
  }
});

authRouter.post("/register", (req, res, next) => {
  try {
    // SECURITY: Verify JSON body
    if (isFalsy(req.body)) {
      throw new Error(`Cannot process undefined request body !`);
    }

    if (isNotEqual(Object.keys(req.body).length, 2)) {
      throw new Error(`Cannot process request body of the wrong size !`);
    }

    // SECURITY: Verify email property
    // TO-DO: Add email pattern verification
    // TO-CONSIDER: Enforce no special characters in email, only letters, hyphens, @ and numbers ?
    const MIN_EMAIL_LENGTH = 6;
    const MAX_EMAIL_LENGTH = 150;
    const emailError = validateStringProperty(
      req.body.email,
      "email",
      MIN_EMAIL_LENGTH,
      MAX_EMAIL_LENGTH
    );

    if (emailError instanceof Error) {
      throw emailError;
    }

    // SECURITY: Verify password property
    // TO-CONSIDER: Force stronger password with uppercase, lowercase, special characters and number verification ?
    const MIN_PASSWORD_LENGTH = 6;
    const MAX_PASSWORD_LENGTH = 200;
    const passwordError = validateStringProperty(
      req.body.password,
      "password",
      MIN_PASSWORD_LENGTH,
      MAX_PASSWORD_LENGTH
    );

    if (passwordError instanceof Error) {
      throw passwordError;
    }

    res.status(200).send(`Register route work fine`);
  } catch (error) {
    next(error);
  }
});

export default authRouter;
