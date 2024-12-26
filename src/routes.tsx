import Elysia from "elysia";
import { addTasksRoutes } from "./resources/tasks/routes";
import { addAuthRoutes } from "./resources/users/routes";

export default function addRoutes(app: Elysia): Elysia {
  let _app = addAuthRoutes(app)
  return addTasksRoutes(_app)
}

