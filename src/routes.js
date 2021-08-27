const express = require("express");
const AuthController = require("./app/controllers/authController");
const ProjectController = require("./app/controllers/ProjectController");
const authMiddleware = require("./app/middleware/auth");

const routes = express.Router();

routes.post("/auth/login", AuthController.authenticate);
routes.post("/auth/register", AuthController.store);

routes.post("/auth/forgot_password", AuthController.forgotPassword);
routes.post("/auth/reset_password", AuthController.resetPassword);

routes.get("/projects", authMiddleware, ProjectController.index);

module.exports = routes;