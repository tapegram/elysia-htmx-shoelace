import { Html, } from "@elysiajs/html";
import { Task } from "../service";
import { TaskItem } from "./TaskItem";

export const TaskList = ({ tasks }: { tasks: Task[] }): JSX.Element => {
  return (
    <ol
      id="tasks-list"
    >
      {
        tasks.map((task) =>
          <li class="my-10"><TaskItem task={task} /></li>
        )
      }
    </ol>
  );
}
