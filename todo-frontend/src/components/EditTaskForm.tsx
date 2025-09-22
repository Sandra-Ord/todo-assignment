import {IEditableTask} from "@/domain/IEditableTask";
import FormErrorMessage from "@/components/common/FormErrorMessage";
import TaskMetadata from "@/components/ui/TaskMetaData";
import MaterialIcon from "@/components/common/MaterialIcon";
import {ITask} from "@/domain/ITask";
import ConfirmActionBlock from "@/components/ui/ConfirmActionBlock";
import MaterialIconLabel from "@/components/common/MaterialIconLabel";
import {formatDate} from "@/utils/dateFormat";

interface EditTaskFormProps {
    editTask: IEditableTask,
    setEditTask: (value: IEditableTask) => void,
    selectedTask: ITask,
    onConfirm: () => void,
    onCancel: () => void,
    standardInputClassnames: string
}

export default function EditTaskForm({
                                         editTask,
                                         setEditTask,
                                         selectedTask,
                                         onConfirm,
                                         onCancel,
                                         standardInputClassnames,
                                     }: EditTaskFormProps) {
    return (
        <>
            <div className="border-bottom p-2">
                <div>
                    <div className="d-flex align-items-center">
                        <input value={editTask.taskName}
                               onChange={(e) => {
                                   setEditTask({
                                       ...editTask,
                                       taskName: e.target.value,
                                       taskNameValidationError: ""
                                   })
                               }}
                               className={`${standardInputClassnames} my-2 w-100`}
                               placeholder="Task name"/>
                    </div>
                    <FormErrorMessage message={editTask.taskNameValidationError}/>
                </div>
                <TaskMetadata task={selectedTask}/>
            </div>

            <div className="p-2">
                <div className="d-flex flex-column gap-2">
                    <div className="d-flex justify-content-between align-items-center">
                        <label className="d-flex align-items-center gap-2"
                               htmlFor="EditTaskDueDate">
                            <MaterialIcon name="calendar_clock"/>
                            Due Date
                        </label>
                        <input value={editTask.dueDate}
                               onChange={(e) => {
                                   setEditTask({
                                       ...editTask,
                                       dueDate: e.target.value,
                                       dueDateValidationError: ""
                                   })
                               }}
                               className={standardInputClassnames}
                               id="EditTaskDueDate"
                               type="datetime-local"/>
                    </div>
                    <FormErrorMessage message={editTask.dueDateValidationError}/>
                </div>
                {selectedTask.completedAt && (
                    <MaterialIconLabel name="event_available"
                                       label={`Completed at ${formatDate(selectedTask.completedAt)}`}/>
                )}

            </div>
            <ConfirmActionBlock
                message="Save changes?"
                confirmText="Save" confirmIcon="edit" confirmClass="warning"
                onConfirm={onConfirm}
                onCancel={onCancel}
            />
        </>
    );
}