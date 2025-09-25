import {ITask} from "@/domain/ITask";
import MaterialIconLabel from "../common/MaterialIconLabel";
import {formatDate, untilDueDate} from "@/utils/dateFormat";

export default function TaskDetails({selectedTask} : {selectedTask: ITask}) {
    return (
        <div className="d-flex flex-column gap-2 p-2">
            <div className="d-flex gap-2">
                <MaterialIconLabel name={"calendar_clock"}
                                   label={`Due ${formatDate(selectedTask.dueAt)}`}/>
                <span className="text-muted">{untilDueDate(selectedTask.dueAt)}</span>
            </div>
            {selectedTask.completedAt && (
                <MaterialIconLabel name="event_available"
                                   label={`Completed at ${formatDate(selectedTask.completedAt)}`}/>
            )}
        </div>
    );
}