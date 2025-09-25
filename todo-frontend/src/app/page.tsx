"use client";

import {useEffect, useState} from "react";
import {ITask} from "@/domain/ITask";
import {IFilter} from "@/domain/IFilter";
import {IEditableTask} from "@/domain/IEditableTask";
import {TaskAction, TaskSortBy} from "@/domain/TaskEnums";
import TaskService from "@/services/TaskService";
import {formatDate, untilDueDate} from "@/utils/dateFormat";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import MaterialIcon from "@/components/common/MaterialIcon";
import MaterialIconLabel from "@/components/common/MaterialIconLabel";
import DashboardButton from "@/components/common/DashboardButton";
import ConfirmActionBlock from "@/components/ui/ConfirmActionBlock";
import FilterMenu from "@/components/FilterMenu";
import SortMenu from "@/components/SortMenu";
import {TaskListItem} from "@/components/task/TaskListItem";
import TaskMetadata from "@/components/task/TaskMetaData";
import CreateTaskForm from "@/components/task/CreateTaskForm";
import EditTaskForm from "@/components/task/EditTaskForm";
import CompleteTaskForm from "@/components/task/CompleteTaskForm";

export default function ToDoTaskDashboard() {
    const standardInput = "rounded-5 border-0 px-3 py-1"

    const [isLoading, setIsLoading] = useState(true);

    const [tasks, setTasks] = useState<ITask[]>([]);
    const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
    const [activeAction, setActiveAction] = useState<TaskAction>(null);

    // Filter/Sort States
    const [sortBy, setSortBy] = useState<TaskSortBy>("dueAt");
    const [completedLast, setCompletedLast] = useState<boolean>(false);
    const [filter, setFilter] = useState<IFilter>({
        completed: null,
        search: "",
        dueDateFrom: "",
        dueDateUntil: ""
    });

    // Create/Edit/Complete Task States
    const [completedDate, setCompletedDate] = useState("");
    const [formTask, setFormTask] = useState<IEditableTask>({
        taskName: "",
        taskNameValidationError: "",
        dueDate: "",
        dueDateValidationError: ""
    });

    const loadTasks = async () => {
        setIsLoading(true);
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

    function validateTask(task: IEditableTask): IEditableTask {
        const updated = {...task};
        updated.taskNameValidationError = task.taskName ? "" : "Task name is required!";
        updated.dueDateValidationError = task.dueDate ? "" : "Due date is required!";
        return updated;
    }

    const handleSubmitTask = async () => {
        const validated = validateTask(formTask);
        if (validated.taskNameValidationError || validated.dueDateValidationError) {
            setFormTask(validated);
            return;
        }

        let response;
        if (selectedTask && activeAction === "edit") {
            response = await TaskService.editTask(selectedTask.id, formTask.taskName, formTask.dueDate);
        } else if (!selectedTask && activeAction === "create") {
            response = await TaskService.createTask(formTask.taskName, formTask.dueDate);
        } else {
            return;
        }

        if (!response.errors) {
            setSelectedTask(response.data!);
            setActiveAction(null);
            setFormTask({taskName: "", taskNameValidationError: "", dueDate: "", dueDateValidationError: ""});
            await applyFilter();
        } else {
            console.error("Failed to submit task", response.errors);
        }
    }

    const handleDeleteTask = async (taskId: string) => {
        const response = await TaskService.deleteTask(taskId);
        if (!response.errors) {
            setTasks(tasks.filter((task) => task.id !== taskId));
            setSelectedTask(null);
            setActiveAction(null);
        } else {
            console.error("Failed to delete task", response.errors);
        }
    }

    const handleAlterTaskCompletion = async () => {
        if (!selectedTask) return;
        const response = selectedTask.completedAt
            ? await TaskService.uncompleteTask(selectedTask.id)
            : await TaskService.completeTask(selectedTask.id, completedDate);
        if (!response.errors) {
            setSelectedTask(response.data!);
            setActiveAction(null);
            await applyFilter();
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
                                  setFormTask({
                                      taskName: "",
                                      taskNameValidationError: "",
                                      dueDate: "",
                                      dueDateValidationError: ""
                                  });
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
                                <EditTaskForm editTask={formTask} setEditTask={setFormTask} selectedTask={selectedTask}
                                              onConfirm={handleSubmitTask}
                                              onCancel={() => {
                                                  setFormTask({
                                                      taskName: "",
                                                      taskNameValidationError: "",
                                                      dueDate: "",
                                                      dueDateValidationError: ""
                                                  });
                                                  setActiveAction(null);
                                              }}
                                              standardInputClassnames={standardInput}/>
                            ) : (
                                <>
                                    {/*Task Detail View Header*/}
                                    <div className="border-bottom p-2">
                                        <h2 className="title d-flex align-items-center justify-content-between">
                                            <MaterialIconLabel
                                                name={selectedTask.completedAt ? "check_box" : "check_box_outline_blank"}
                                                label={selectedTask.taskName} onClick={() => {
                                                setActiveAction(activeAction === "complete" ? null : "complete");
                                                setCompletedDate(new Date().toISOString().slice(0, 16));
                                            }}/>
                                            <MaterialIcon name="close"
                                                          className="touchable-element"
                                                          onClick={() => {
                                                              setSelectedTask(null);
                                                              setActiveAction(null);
                                                          }}/>
                                        </h2>
                                        <TaskMetadata task={selectedTask}/>
                                    </div>
                                    {/*Task Detail Information*/}
                                    <div className="d-flex flex-column gap-2 p-2 pb-5">

                                        {(activeAction === "complete" && !selectedTask.completedAt) ? (
                                            <CompleteTaskForm
                                                standardInputClassnames={standardInput}
                                                completedDate={completedDate}
                                                setCompletedDate={setCompletedDate}
                                                onConfirm={() => handleAlterTaskCompletion()}
                                                onCancel={() => setActiveAction(null)}
                                            />
                                        ) : (activeAction === "complete" && (
                                            <ConfirmActionBlock message="Mark the task as incomplete?"
                                                                confirmText="Uncomplete"
                                                                confirmIcon="check_box_outline_blank"
                                                                confirmClass="warning"
                                                                onConfirm={() => handleAlterTaskCompletion()}
                                                                onCancel={() => setActiveAction(null)}/>
                                        ))}

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

                            {/*Select Action Bar (edit/delete)*/}
                            {activeAction === null && (
                                <div className="d-flex justify-content-between align-items-center py-5">
                                    <MaterialIconLabel label="Delete" name="delete" className='text-muted'
                                                       onClick={() => {
                                                           setActiveAction("delete")
                                                       }}/>

                                    <MaterialIconLabel label="Edit" name="edit"
                                                       className="flex-row-reverse text-muted" onClick={() => {
                                        setActiveAction("edit");
                                        setFormTask({
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
                            createTask={formTask}
                            setCreateTask={setFormTask}
                            handleCreateTask={handleSubmitTask}
                            onClose={() => {
                                setFormTask({
                                    taskName: "",
                                    taskNameValidationError: "",
                                    dueDate: "",
                                    dueDateValidationError: ""
                                });
                                setSelectedTask(null);
                                setActiveAction(null);
                            }}/>
                    ) : (
                        <MaterialIconLabel label="Add a new task to do" name="add_circle"
                                           className='title flex-column h-100 justify-content-center'
                                           onClick={() => {
                                               setFormTask({
                                                   taskName: "",
                                                   taskNameValidationError: "",
                                                   dueDate: "",
                                                   dueDateValidationError: ""
                                               });
                                               setSelectedTask(null);
                                               setActiveAction("create");
                                           }}/>
                    )}
                </div>

            </div>

        </div>
    );
}