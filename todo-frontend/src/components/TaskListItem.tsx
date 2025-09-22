import {formatDate} from "@/utils/dateFormat";
import TaskStatusBadge from "@/components/ui/TaskStatusBadge";
import {ITask} from "@/domain/ITask";


interface TaskListItemProps {
    task: ITask;
    selectedTask?: ITask | null;
    setSelectedTask: (task: ITask) => void;
    setActiveAction: (action: "create" | "complete" | "delete" | "edit" | null) => void;
    setCompletedDate: (date: string) => void;
    formatDate: (date: string) => string;
}

export function TaskListItem({
                                 task,
                                 selectedTask,
                                 setSelectedTask,
                                 setActiveAction,
                                 setCompletedDate,
                                 formatDate,
                             }: TaskListItemProps) {
    const isSelected = selectedTask?.id === task.id;

    function handleClick() {
        setSelectedTask(task);
        setActiveAction(null);
    }

    function handleCompleteClick(e: React.MouseEvent) {
        e.stopPropagation();
        setSelectedTask(task);
        setActiveAction("complete");
        setCompletedDate(new Date().toISOString().slice(0, 16));
    }

    return (
        <div
            key={task.id}
            className={`touchable-element task-list-item d-flex justify-content-between align-items-center py-2 px-1 border-bottom rounded-4 ${isSelected ? "selected-task" : ""}`}
            onClick={handleClick}
        >
            <div className="d-flex gap-2 align-items-center">
        <span className="material-symbols-outlined" onClick={handleCompleteClick}>
          {task.completedAt ? "check_box" : "check_box_outline_blank"}
        </span>
                <span>
          <div>{task.taskName}</div>
          <div className="text-muted small">Due {formatDate(task.dueAt)}</div>
        </span>
            </div>
            <TaskStatusBadge dueAt={task.dueAt} completedAt={task.completedAt} />
        </div>
    );
}