"use client";

import {useEffect, useState} from "react";
import {ITask} from "@/domain/ITask";
import TaskService from "@/services/TaskService";
import TaskStatusBadge from "@/components/ui/TaskStatusBadge";
import DashboardButton from "@/components/common/DashboardButton";
import {formatDate, untilDueDate} from "@/utils/dateFormat";
import MaterialIcon from "@/components/common/MaterialIcon";
import ConfirmActionButtons from "@/components/ui/ConfirmActionButtons";
import FormErrorMessage from "@/components/common/FormErrorMessage";
import {IFilter} from "@/domain/IFilter";
import CompleteTaskForm from "@/components/CompleteTaskForm";
import ConfirmActionBlock from "@/components/ui/ConfirmActionBlock";
import CreateTaskForm from "@/components/CreateTaskForm";
import {TaskListItem} from "@/components/TaskListItem";
import FilterMenu from "@/components/FilterMenu";
import SortMenu from "@/components/SortMenu";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import TaskMetadata from "@/components/ui/TaskMetaData";
import {IEditableTask} from "@/domain/IEditableTask";
import MaterialIconLabel from "@/components/common/MaterialIconLabel";
import EditTaskForm from "@/components/EditTaskForm";

export default function ToDoTaskDashboard() {
    const standardInput = "rounded-5 border-0 px-3 py-1"

    const [isLoading, setIsLoading] = useState(true);

    const [tasks, setTasks] = useState<ITask[]>([]);

    const [sortBy, setSortBy] = useState<"dueAt" | "completedAt" | "createdAt">("dueAt");
    const [completedLast, setCompletedLast] = useState<boolean>(false);


    const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
    const [createTask, setCreateTask] = useState<IEditableTask>({
        taskName: "",
        taskNameValidationError: "",
        dueDate: "",
        dueDateValidationError: ""
    });
    const [editTask, setEditTask] = useState<IEditableTask>({
        taskName: "",
        taskNameValidationError: "",
        dueDate: "",
        dueDateValidationError: ""
    });

    const [filter, setFilter] = useState<IFilter>({
        completed: null,
        search: "",
        dueDateFrom: "",
        dueDateUntil: ""
    });

    const [completedDate, setCompletedDate] = useState("");

    const [activeAction, setActiveAction] = useState<"create" | "complete" | "delete" | "edit" | null>(null);

    const [validationError, setValidationError] = useState("");

    const loadTasks = async () => {
        const response = await TaskService.getTasks();
        if (response.data) {
            setTasks(response.data);
        }
        setIsLoading(false);
    };

    const sortTasks = (tasks: ITask[]) => {
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

    const applyFilter = async () => {
        const preparedFilter: IFilter = {
            ...filter,
            dueDateFrom: filter.dueDateFrom ? (new Date(filter.dueDateFrom).toISOString()) : "",
            dueDateUntil: filter.dueDateUntil ? (new Date(filter.dueDateUntil).toISOString()) : ""
        };

        const response = await TaskService.getFilteredTasks({
            completed: preparedFilter.completed,
            search: preparedFilter.search || "",
            dueDateFrom: preparedFilter.dueDateFrom || "",
            dueDateUntil: preparedFilter.dueDateUntil || ""
        });

        if (response.data) {
            setTasks(response.data);
        } else if (response.errors) {
            console.error("Failed to fetch filtered tasks", response.errors);
        }
    };

    const handleCreateTask = async () => {
        const updatedTask = {...createTask};

        if (!createTask.taskName) {
            updatedTask.taskNameValidationError = "Task name is required!";
        }
        if (!createTask.dueDate) {
            updatedTask.dueDateValidationError = "Due date is required!";
        }
        if (createTask.taskName.length < 1 || createTask.dueDate.length < 1) {
            setCreateTask(updatedTask);
            return;
        }

        const response = await TaskService.createTask(createTask.taskName, createTask.dueDate);

        if (response.data) {
            setSelectedTask(response.data);
            setActiveAction(null);
            setCreateTask({taskName: "", taskNameValidationError: "", dueDate: "", dueDateValidationError: ""});
            tasks.push(response.data);
        }
        if (response.errors && response.errors.length > 0) {
            setValidationError(response.errors[0]);
        }
    }

    const handleEditTask = async () => {

        if (selectedTask) {
            const updatedTask = {...editTask};

            if (editTask.taskName.length < 1) {
                updatedTask.taskNameValidationError = "Task name is required!";
            }
            if (editTask.dueDate.length < 1) {
                updatedTask.dueDateValidationError = "Due date is required!";
            }
            if (editTask.taskName.length < 1 || editTask.dueDate.length < 1) {
                setEditTask(updatedTask);
                return;
            }

            const response = await TaskService.editTask(selectedTask.id, editTask.taskName, editTask.dueDate);
            if (!response.errors) {
                console.log(response);
                setSelectedTask(response.data!);
                setActiveAction(null);
                setEditTask({taskName: "", taskNameValidationError: "", dueDate: "", dueDateValidationError: ""});
                // todo update value in tasks
            }

            if (response.errors && response.errors.length > 0) {
                setValidationError(response.errors[0]);
            }
        }


    }

    const handleDeleteTask = async (taskId: string) => {
        const response = await TaskService.deleteTask(taskId);
        if (!response.errors) {
            setTasks(tasks.filter((task) => task.id !== taskId));
            if (selectedTask?.id === taskId) {
                setSelectedTask(null);
                setActiveAction(null);
            }
        } else {
            console.error("Failed to delete task", response.errors);
        }
    }

    const handleCompleteTask = async (taskId: string) => {
        const response = await TaskService.completeTask(taskId, completedDate);
        if (!response.errors) {
            if (selectedTask?.id === taskId) {
                setSelectedTask(response.data!);
                setActiveAction(null);
            }

        } else {
            console.error("Failed to complete task", response.errors);
        }
    }

    const handleUncompleteTask = async (taskId: string) => {
        const response = await TaskService.uncompleteTask(taskId);
        if (!response.errors) {
            if (selectedTask?.id === taskId) {
                setSelectedTask(response.data!);
                setActiveAction(null);
            }
        } else {
            console.error("Failed to complete task", response.errors);
        }
    }

    useEffect(() => {
        loadTasks();
    }, []);


    return (

        <div className="p-4 my-3 dashboard">

            {/*Dashboard Header*/}
            <h3 className="title border-bottom p-1 pb-2 d-flex align-items-center justify-content-between">
                <MaterialIconLabel name="add_task" label="To Do Dashboard"/>
                <MaterialIcon name="add" className="touchable-element"
                              onClick={() => {
                                  setSelectedTask(null);
                                  setActiveAction("create");
                              }}/>
            </h3>


            <div className="d-flex flex-wrap flex-row-reverse p-2">

                {/*Task List Section*/}
                <div className="col-12 col-md-5 order-2  d-flex flex-column gap-3 p-2 border-bottom">

                    {/*Search bar*/}
                    <div className="d-flex justify-content-between align-items-center gap-4">
                        <input className={`${standardInput} w-100`} placeholder="Search task..." value={filter.search}
                               onChange={(e) => setFilter({...filter, search: e.target.value})}></input>
                        <DashboardButton text="Search" icon="search" onClick={() => applyFilter()}
                                         className="flex-row-reverse primary" textClassName="d-none d-md-inline"/>
                    </div>

                    {/*Sort and Filter*/}
                    <div className="d-flex justify-content-between align-items-center gap-4">
                        <SortMenu sortBy={sortBy} setSortBy={setSortBy} completedLast={completedLast}
                                  setCompletedLast={setCompletedLast}/>
                        <FilterMenu filter={filter} setFilter={setFilter}/>
                    </div>

                    {/*Task List*/}
                    <div className="flex-grow-1 overflow-auto vh-100">

                        {isLoading ? (
                            <LoadingSpinner/>
                        ) : (
                            <div className="d-flex flex-column gap-1">
                                {sortTasks(tasks).map((task) => (
                                        <TaskListItem
                                            key={task.id}
                                            task={task}
                                            selectedTask={selectedTask}
                                            setSelectedTask={setSelectedTask}
                                            setActiveAction={setActiveAction}
                                            setCompletedDate={setCompletedDate}
                                            formatDate={formatDate}
                                        />
                                    )
                                )}
                            </div>
                        )}

                    </div>

                </div>

                {/*Task Detail View Section*/}
                <div className="col-12 col-md-7 order-1 p-2 border-bottom">

                    {selectedTask ? (
                        <>

                            {activeAction == "edit" ? (
                                <EditTaskForm editTask={editTask} setEditTask={setEditTask} selectedTask={selectedTask}
                                              onConfirm={handleEditTask}
                                              onCancel={() => setActiveAction(null)}
                                              standardInputClassnames={standardInput}/>
                            ) : (
                                <>
                                    <div className="border-bottom p-2">

                                        <h2 className="title d-flex align-items-center justify-content-between">
                                            <div className="d-flex gap-2 align-items-center">
                                                <MaterialIcon
                                                    name={selectedTask.completedAt ? "check_box" : "check_box_outline_blank"}
                                                    className="touchable-element"
                                                    onClick={() => {
                                                        setActiveAction(activeAction === "complete" ? null : "complete");
                                                        setCompletedDate(new Date().toISOString().slice(0, 16));
                                                    }}/>
                                                {selectedTask.taskName}
                                            </div>
                                            <MaterialIcon name="close"
                                                          className="touchable-element"
                                                          onClick={() => {
                                                              setSelectedTask(null);
                                                              setActiveAction(null);
                                                          }}/>
                                        </h2>
                                        <TaskMetadata task={selectedTask}/>

                                    </div>
                                    <div className="p-2 d-flex flex-column gap-2">

                                        {activeAction === "complete" && (
                                            <CompleteTaskForm
                                                standardInputClassnames={standardInput}
                                                completedDate={completedDate}
                                                setCompletedDate={setCompletedDate}
                                                onConfirm={() => handleCompleteTask(selectedTask.id)}
                                                onCancel={() => setActiveAction(null)}
                                            />
                                        )}

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
                                </>
                            )}

                            {activeAction === null && (
                                <div className="d-flex justify-content-between align-items-center py-5">
                                    <MaterialIconLabel label="Delete" name="delete" className='text-muted'
                                                       onClick={() => {
                                                           setActiveAction("delete")
                                                       }}/>

                                    <MaterialIconLabel label="Edit" name="edit"
                                                       className="flex-row-reverse text-muted" onClick={() => {
                                        setActiveAction("edit");
                                        setEditTask({
                                            taskName: selectedTask?.taskName,
                                            taskNameValidationError: "",
                                            dueDate: selectedTask?.dueAt,
                                            dueDateValidationError: ""
                                        });
                                    }}/>
                                </div>
                            )}

                            {activeAction === "delete" && (
                                <ConfirmActionBlock
                                    message="Are you sure you want to delete this task?"
                                    confirmText="Delete" confirmIcon="delete" confirmClass="danger"
                                    onConfirm={() => handleDeleteTask(selectedTask.id)}
                                    onCancel={() => setActiveAction(null)}
                                />
                            )}

                        </>
                    ) : activeAction === "create" ? (
                        <CreateTaskForm
                            standardInputClassnames={standardInput}
                            createTask={createTask}
                            setCreateTask={setCreateTask}
                            handleCreateTask={handleCreateTask}
                            onClose={() => {
                                setSelectedTask(null);
                                setActiveAction(null);
                            }}/>
                    ) : (
                        <MaterialIconLabel label="Add a new task to do" name="add_circle"
                                           className='title flex-column h-100 justify-content-center'
                                           onClick={() => {
                                               setSelectedTask(null);
                                               setActiveAction("create");
                                           }}/>
                    )}
                </div>

            </div>

        </div>
    );
}