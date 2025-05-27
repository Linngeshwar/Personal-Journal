const { login, register } = require("../controllers/AuthController");
const express = require("express");

const AuthRouter = express.Router();

AuthRouter.post("/login", login);
AuthRouter.post("/register", register);

module.exports = AuthRouter;
