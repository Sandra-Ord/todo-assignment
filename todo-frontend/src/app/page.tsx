"use client";

import Image from "next/image";
import styles from "./page.module.css";
import {useEffect, useState} from "react";
import {ITask} from "@/domain/ITask";
import TaskService from "@/services/TaskService";
import TaskStatusBadge from "@/components/TaskStatusBadge";
import DashboardButton from "@/components/DashboardButton";
import {formatDate, untilDueDate} from "@/utils/dateFormat";
import MaterialIcon from "@/components/MaterialIcon";
import ConfirmActionButtons from "@/components/ConfirmActionButtons";
import FormErrorMessage from "@/components/FormErrorMessage";
import {IFilter} from "@/domain/IFilter";

export default function ToDoTaskDashboard() {
    const standardInput = "rounded-5 border-0 px-3 py-1"

    const [isLoading, setIsLoading] = useState(true);

    const [tasks, setTasks] = useState<ITask[]>([]);

    const [sortBy, setSortBy] = useState<"dueAt" | "completedAt" | "createdAt">("dueAt");
    const [completedLast, setCompletedLast] = useState<boolean>(false);

    const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
    const [createTask, setCreateTask] = useState({
        taskName: "",
        taskNameValidationError: "",
        dueDate: "",
        dueDateValidationError: ""
    });
    const [editTask, setEditTask] = useState({
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
                <div className="d-flex gap-2 align-items-center">
                    <MaterialIcon name="add_task"/> To Do Dashboard
                </div>
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
                        <div className="btn-group">
                            <span role="button"
                                  className="dropdown-toggle d-flex align-items-center gap-2 touchable-element"
                                  data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
                                <MaterialIcon name="sort"/>
                                <span className="d-md-none d-lg-inline">Sort by</span>
                            </span>
                            <ul className="dropdown-menu dropdown-menu-start ">
                                <li>
                                    <button className="dropdown-item" type="button"
                                            onClick={() => setSortBy("dueAt")}>Due Date
                                    </button>
                                </li>
                                <li>
                                    <button className="dropdown-item" type="button"
                                            onClick={() => setSortBy("completedAt")}>Completion Date
                                    </button>
                                </li>
                                <li>
                                    <button className="dropdown-item" type="button"
                                            onClick={() => setSortBy("createdAt")}>Creation Date
                                    </button>
                                </li>
                                <li>
                                    <hr className="dropdown-divider"/>
                                </li>
                                <li className="dropdown-item">
                                    <div className="form-check form-switch">
                                        <input className="form-check-input" type="checkbox" role="switch"
                                               id="completedTasksLast"
                                               onChange={(e) => setCompletedLast(e.target.checked)}/>
                                        <label htmlFor="completedTasksLast">Completed Tasks Last</label>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="btn-group">
                            <span role="button"
                                  className="dropdown-toggle d-flex align-items-center gap-2 touchable-element"
                                  data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
                                <span className="d-md-none d-lg-inline">Filter by</span>
                                <MaterialIcon name="filter_list"/>
                            </span>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li className="px-3 py-1 dropdown-item">
                                    <div className="form-check ">
                                        <input className="form-check-input" type="checkbox"
                                               checked={filter.completed === true}
                                               onChange={(e) => {
                                                   const completed = e.target.checked;
                                                   setFilter({
                                                       ...filter,
                                                       completed: completed
                                                           ? filter.completed === false
                                                               ? null
                                                               : true
                                                           : filter.completed === true
                                                               ? null
                                                               : false
                                                   });
                                               }}
                                               id="completedCheck"
                                        />
                                        <label className="form-check-label" htmlFor="completedCheck">
                                            Completed
                                        </label>
                                    </div>
                                </li>

                                <li className="px-3 py-1 dropdown-item">
                                    <div className="form-check ">
                                        <input className="form-check-input" type="checkbox"
                                               checked={filter.completed === false}
                                               onChange={(e) => {
                                                   const uncompleted = e.target.checked;
                                                   setFilter({
                                                       ...filter,
                                                       completed: uncompleted
                                                           ? filter.completed === true
                                                               ? null
                                                               : false
                                                           : filter.completed === false
                                                               ? null
                                                               : true
                                                   });
                                               }}
                                               id="uncompletedCheck"/>
                                        <label className="form-check-label" htmlFor="uncompletedCheck">
                                            Not Completed
                                        </label>
                                    </div>
                                </li>
                                <li className="px-3 py-1">
                                    <div className="fw-semibold small text-muted mb-2">Due Date Range</div>
                                    <div className="d-flex flex-column gap-2">
                                        <div>
                                            <label htmlFor="DueDateFrom"
                                                   className="form-label small text-muted">From</label>
                                            <input
                                                type="datetime-local"
                                                id="DueDateFrom"
                                                className={`${standardInput} w-100 shadow-sm`}
                                                value={filter.dueDateFrom}
                                                onChange={(e) => setFilter({...filter, dueDateFrom: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="DueDateUntil"
                                                   className="form-label small text-muted">Until</label>
                                            <input
                                                type="datetime-local"
                                                id="DueDateUntil"
                                                className={`${standardInput} w-100 shadow-sm`}
                                                value={filter.dueDateUntil}
                                                onChange={(e) => setFilter({...filter, dueDateUntil: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/*Task List*/}
                    <div className="flex-grow-1 overflow-auto vh-100">

                        {isLoading ? (
                            <div className="d-flex align-items-center justify-content-center">
                                <div className="spinner-border"></div>
                            </div>
                        ) : (
                            <div className="d-flex flex-column gap-1">
                                {sortTasks(tasks).map((task) => (
                                        <div key={task.id}
                                             className={`touchable-element task-list-item d-flex justify-content-between align-items-center py-2 px-1 border-bottom rounded-4
                                         ${selectedTask?.id === task.id ? "selected-task" : ""}`}
                                             onClick={() => {
                                                 setSelectedTask(task);
                                                 setActiveAction(null);
                                             }}>
                                            <div className="d-flex gap-2 align-items-center">
                                                <span className="material-symbols-outlined"
                                                      onClick={(e) => {
                                                          e.stopPropagation();
                                                          setSelectedTask(task);
                                                          setActiveAction("complete");
                                                          setCompletedDate(new Date().toISOString().slice(0, 16));
                                                      }}
                                                >
                                                    {task.completedAt ? "check_box" : "check_box_outline_blank"}
                                                </span>
                                                <span>
                                                    <div>{task.taskName}</div>
                                                    <div className="text-muted small">
                                                        Due {formatDate(task.dueAt)}
                                                    </div>
                                                </span>
                                            </div>
                                            <TaskStatusBadge dueAt={task.dueAt} completedAt={task.completedAt}/>
                                        </div>
                                    )
                                )}
                            </div>
                        )}

                    </div>

                </div>

                {/*Task Detail View Section*/}
                <div className="col-12 col-md-7 order-1 p-2 border-bottom">

                    {selectedTask ? (

                        <div>

                            <div className="border-bottom p-2">

                                {activeAction === "edit" ? (
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
                                                   className={`${standardInput} my-2 w-100`}
                                                   placeholder="Task name"/>
                                        </div>
                                        <FormErrorMessage message={editTask.taskNameValidationError}/>
                                    </div>
                                ) : (
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
                                )}

                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="text-muted"
                                          data-toggle="tooltip" data-placement="right" title="19.09.2024 23:59">
                                                      Created at{" "}
                                        {formatDate(selectedTask.createdAt)}
                                    </span>
                                    <TaskStatusBadge dueAt={selectedTask.dueAt} completedAt={selectedTask.completedAt}/>
                                </div>

                            </div>

                            <div className="p-2 d-flex flex-column gap-2">

                                {activeAction === "complete" && (
                                    <div className="d-flex flex-column gap-2">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="fw-bold">Task completed as of</span>
                                            <input className={standardInput} type="datetime-local"
                                                   onChange={(e) => setCompletedDate(e.target.value)}
                                                   value={completedDate}/>
                                        </div>
                                        <ConfirmActionButtons confirmText="Complete"
                                                              confirmIcon="check_box"
                                                              confirmClass="success"
                                                              onConfirm={() => handleCompleteTask(selectedTask.id)}
                                                              onCancel={() => setActiveAction(null)}/>
                                    </div>
                                )}

                                <div>
                                    This is a placeholder text for a task which may or may not have some additional text
                                    as
                                    its description. this has not yet been added to the data model and is a to do for
                                    now.
                                </div>

                                {activeAction === "edit" ? (
                                    <div>
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
                                                   className={standardInput}
                                                   id="EditTaskDueDate"
                                                   type="datetime-local"/>
                                        </div>
                                        <FormErrorMessage message={editTask.dueDateValidationError}/>
                                    </div>
                                ) : (
                                    <div className="d-flex align-items-center gap-2">
                                        <MaterialIcon name="calendar_clock"/>
                                        Due{" "}
                                        {formatDate(selectedTask.dueAt)}
                                        <span className="text-muted">{untilDueDate(selectedTask.dueAt)}</span>
                                    </div>
                                )}

                                {selectedTask.completedAt && (
                                    <div className="d-flex align-items-center gap-2">
                                        <MaterialIcon name="event_available"/>
                                        Completed at {formatDate(selectedTask.completedAt)}
                                    </div>
                                )}


                                {activeAction === null && (
                                    <div className="d-flex justify-content-between align-items-center py-5">
                                        <div className="d-flex gap-2 text-muted touchable-element"
                                             onClick={() => {
                                                 setActiveAction("delete")
                                             }}
                                        >
                                            <MaterialIcon name="delete"/> Delete
                                        </div>

                                        <div className="d-flex gap-2 text-muted touchable-element"
                                             onClick={() => {
                                                 setActiveAction("edit");
                                                 setEditTask({
                                                     taskName: selectedTask?.taskName,
                                                     taskNameValidationError: "",
                                                     dueDate: selectedTask?.dueAt,
                                                     dueDateValidationError: ""
                                                 });
                                             }}
                                        >
                                            Edit <MaterialIcon name="edit"/>
                                        </div>
                                    </div>
                                )}

                                {activeAction === "delete" && (
                                    <div className="d-flex flex-column gap-4 py-5">
                                        <div className="text-center text-muted">
                                            Are you sure you want to delete this task?
                                        </div>
                                        <ConfirmActionButtons confirmText="Delete"
                                                              confirmIcon="delete"
                                                              confirmClass="danger"
                                                              onConfirm={() => handleDeleteTask(selectedTask.id)}
                                                              onCancel={() => setActiveAction(null)}/>
                                    </div>
                                )}

                                {activeAction === "edit" && (
                                    <div className="d-flex flex-column gap-4 py-5">
                                        <div className="text-center text-muted">
                                            Save changes?
                                        </div>
                                        <ConfirmActionButtons confirmText="Save"
                                                              confirmIcon="edit"
                                                              confirmClass="warning"
                                                              onConfirm={() => handleEditTask()}
                                                              onCancel={() => setActiveAction(null)}/>
                                    </div>
                                )}

                            </div>

                        </div>

                    ) : activeAction === "create" ? (

                        <div>

                            <h2 className="title p-2 border-bottom d-flex align-items-center justify-content-between">
                                Create a New Task
                                <MaterialIcon name="close" className="touchable-element"
                                              onClick={() => {
                                                  setSelectedTask(null);
                                                  setActiveAction(null);
                                              }}/>
                            </h2>

                            <div className="p-2 pt-3 d-flex flex-column gap-3">

                                <div>
                                    <div className="d-flex justify-content-between align-items-center gap-4">
                                        <label htmlFor="NewTaskName">Task name</label>
                                        <input value={createTask.taskName}
                                               onChange={(e) => {
                                                   setCreateTask({
                                                       ...createTask,
                                                       taskName: e.target.value,
                                                       taskNameValidationError: ""
                                                   })
                                               }}
                                               className={standardInput}
                                               id="NewTaskName"
                                               placeholder="Task name..."/>
                                    </div>
                                    <FormErrorMessage message={createTask.taskNameValidationError}/>
                                </div>

                                <div>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <label htmlFor="NewTaskDueDate">Due date</label>
                                        <div>
                                            <input value={createTask.dueDate}
                                                   onChange={(e) => {
                                                       setCreateTask({
                                                           ...createTask,
                                                           dueDate: e.target.value,
                                                           dueDateValidationError: ""
                                                       })

                                                   }}
                                                   className={standardInput}
                                                   id="NewTaskDueDate"
                                                   type="datetime-local"/>
                                        </div>
                                    </div>
                                    <FormErrorMessage message={createTask.dueDateValidationError}/>
                                </div>

                                <div className="d-flex justify-content-center">
                                    <DashboardButton text="Create" icon="add_circle" className="primary"
                                                     onClick={() => handleCreateTask()}/>
                                </div>

                            </div>

                        </div>
                    ) : (
                        <div
                            className="title touchable-element d-flex flex-column h-100 gap-2 justify-content-center align-items-center"
                            onClick={() => {
                                setSelectedTask(null);
                                setActiveAction("create");
                            }}
                        >
                            Add a new task to do
                            <MaterialIcon name="add_circle"/>
                        </div>
                    )}
                </div>

            </div>

        </div>
    );
}
