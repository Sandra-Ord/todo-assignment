import {IEditableTask} from "@/domain/IEditableTask";
import {ITask} from "@/domain/ITask";
import {TaskSortBy} from "@/domain/TaskEnums";

export function validateTask(task: IEditableTask): IEditableTask {
    const updated = {...task};
    updated.taskNameValidationError = task.taskName ? "" : "Task name is required!";
    updated.dueDateValidationError = task.dueDate ? "" : "Due date is required!";
    return updated;
}

export function isTaskValid(task: IEditableTask): boolean {
    return !(task.taskNameValidationError || task.dueDateValidationError);
}

export function sortTasks(tasks: ITask[], sortBy: TaskSortBy, completedLast: boolean) : ITask[] {
    return [...tasks].sort((a, b) => {
        if (completedLast) {
            const aCompleted = Boolean(a.completedAt);
            const bCompleted = Boolean(b.completedAt);

            if (aCompleted && !bCompleted) return 1; // b before a
            if (!aCompleted && bCompleted) return -1; // a before b
        }
        const aDate = new Date(a[sortBy] ?? 0).getTime();
        const bDate = new Date(b[sortBy] ?? 0).getTime();

        if (sortBy === "completedAt") {
            if (!aDate && bDate) return 1;  // a has no completedAt, b first
            if (aDate && !bDate) return -1; // a has completedAt, a first
        }

        return bDate - aDate; // descending
    });
}