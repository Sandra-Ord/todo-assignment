import {ITask} from "@/domain/ITask";
import {formatDate} from "@/utils/dateFormat";
import TaskStatusBadge from "@/components/task/TaskStatusBadge";

export default function TaskMetadata({ task }: { task: ITask }) {
    return (
        <div className="d-flex justify-content-between align-items-center">
      <span className="text-muted" data-toggle="tooltip" data-placement="right" title={formatDate(task.createdAt)}>
        Created at {formatDate(task.createdAt)}
      </span>
            <TaskStatusBadge dueAt={task.dueAt} completedAt={task.completedAt} />
        </div>
    );
}