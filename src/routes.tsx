import Elysia from "elysia";
import { addTasksRoutes } from "./resources/tasks/routes";
import { addAuthRoutes } from "./resources/users/routes";

export default function addRoutes(app: Elysia) {
  addAuthRoutes(app)
  addTasksRoutes(app)
}

