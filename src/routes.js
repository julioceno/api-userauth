const express = require("express");
const UserController = require("./app/controllers/UserController");
const ProjectController = require("./app/controllers/ProjectController");
const authMiddleware = require("./app/middleware/auth");

const routes = express.Router();

routes.post("/auth/login", UserController.authenticate);
routes.post("/auth/register", UserController.store);

routes.get("/projects", authMiddleware, ProjectController.index);

module.exports = routes;