import FormErrorMessage from "@/components/common/FormErrorMessage";
import DashboardButton from "@/components/common/DashboardButton";
import MaterialIcon from "@/components/common/MaterialIcon";

interface CreateTaskFormProps {
    standardInputClassnames: string;
    createTask: {
        taskName: string;
        taskNameValidationError: string;
        dueDate: string;
        dueDateValidationError: string;
    };
    setCreateTask: React.Dispatch<
        React.SetStateAction<{
            taskName: string;
            taskNameValidationError: string;
            dueDate: string;
            dueDateValidationError: string;
        }>
    >;
    handleCreateTask: () => void;
    onClose: () => void;
}

export default function CreateTaskForm({
                                           standardInputClassnames,
                                           createTask,
                                           setCreateTask,
                                           handleCreateTask,
                                           onClose,
                                       }: CreateTaskFormProps) {
    return (
        <div>
            <h2 className="title p-2 border-bottom d-flex align-items-center justify-content-between">
                Create a New Task
                <MaterialIcon name="close" className="touchable-element" onClick={onClose} />
            </h2>

            <div className="p-2 pt-3 d-flex flex-column gap-3">
                {/* Task name */}
                <div>
                    <div className="d-flex justify-content-between align-items-center gap-4">
                        <label htmlFor="NewTaskName">Task name</label>
                        <input
                            value={createTask.taskName}
                            onChange={(e) =>
                                setCreateTask({
                                    ...createTask,
                                    taskName: e.target.value,
                                    taskNameValidationError: "",
                                })
                            }
                            className={standardInputClassnames}
                            id="NewTaskName"
                            placeholder="Task name..."
                        />
                    </div>
                    <FormErrorMessage message={createTask.taskNameValidationError} />
                </div>

                {/* Due date */}
                <div>
                    <div className="d-flex justify-content-between align-items-center">
                        <label htmlFor="NewTaskDueDate">Due date</label>
                        <div>
                            <input
                                value={createTask.dueDate}
                                onChange={(e) =>
                                    setCreateTask({
                                        ...createTask,
                                        dueDate: e.target.value,
                                        dueDateValidationError: "",
                                    })
                                }
                                className={standardInputClassnames}
                                id="NewTaskDueDate"
                                type="datetime-local"
                            />
                        </div>
                    </div>
                    <FormErrorMessage message={createTask.dueDateValidationError} />
                </div>

                {/* Submit */}
                <div className="d-flex justify-content-center">
                    <DashboardButton
                        text="Create"
                        icon="add_circle"
                        className="primary"
                        onClick={handleCreateTask}
                    />
                </div>
            </div>
        </div>
    );
}