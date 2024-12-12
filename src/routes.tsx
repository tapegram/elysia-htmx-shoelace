import Elysia from "elysia";
import { addTasksRoutes } from "./resources/tasks/routes";

export default function addRoutes(app: Elysia) {
  addTasksRoutes(app)
}

