"use client";

import Image from "next/image";
import styles from "./page.module.css";
import {useEffect, useState} from "react";
import {ITask} from "@/domain/ITask";
import TaskService from "@/services/TaskService";

export default function ToDoTaskDashboard() {

    const [isLoading, setIsLoading] = useState(true);

    const [tasks, setTasks] = useState<ITask[]>([]);


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

    const [activeAction, setActiveAction] = useState<"create" | "complete" | "delete" | "edit" | null>(null);

    const [validationError, setValidationError] = useState("");

    const loadTasks = async () => {
        const response = await TaskService.getTasks();
        if (response.data) {
            setTasks(response.data);
        }
        setIsLoading(false);
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

                setSelectedTask({...selectedTask, taskName: editTask.taskName, dueAt: editTask.dueDate});
                setActiveAction(null);
                setEditTask({taskName: "", taskNameValidationError: "", dueDate: "", dueDateValidationError: ""});
                // todo update value in tasks
                // todo return the updated task from backend for easier ui updating
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
            }
        } else {
            console.error("Failed to delete task", response.errors);
        }
    }

    useEffect(() => {
        loadTasks();
    }, []);


    return (

        <div className="p-4 dashboard">


            <h3 className="title border-bottom p-1 pb-2 d-flex align-items-center justify-content-between">
                <div className="d-flex gap-2 align-items-center">
                    <span className="material-symbols-outlined">add_task</span> To Do Dashboard
                </div>
                <span className="material-symbols-outlined"
                      style={{cursor: "pointer"}}
                      onClick={() => {
                          setSelectedTask(null);
                          setActiveAction("create");
                      }}>
                    add
                </span>
            </h3>


            <div className="row p-2">
                <div className="col-5 border-end d-flex flex-column gap-3">
                    <div>
                        <div className="d-flex justify-content-between align-items-center gap-4">
                            <input className="rounded-5 border-0 px-3 py-1 w-100" placeholder="Search task..."></input>
                            <button className="rounded-5 border-0 px-3 py-1 primary" type="submit">
                                Search
                            </button>
                        </div>
                    </div>

                    <div>
                        <div className="d-flex justify-content-between align-items-center gap-4">

                            <div className="d-flex align-items-center gap-2">
                                <span role="button" className="dropdown-toggle d-flex align-items-center gap-2"
                                      data-bs-toggle="dropdown" aria-expanded="false" style={{cursor: 'pointer'}}>
                                    <span className="material-symbols-outlined">sort</span> Sort by
                                </span>
                                <div className="dropdown-menu dropdown-menu-start">
                                    <button className="dropdown-item" type="button">Due Date</button>
                                    <button className="dropdown-item" type="button">Completion Date</button>
                                    <button className="dropdown-item" type="button">Creation Date</button>
                                    <li>
                                        <hr className="dropdown-divider"/>
                                    </li>
                                    <div className="form-check form-switch dropdown-item">
                                        <input className="form-check-input" type="checkbox" role="switch" checked
                                               id="flexSwitchCheckDefault"/>
                                        <label htmlFor="flexSwitchCheckDefault">Completed tasks last</label>
                                    </div>


                                </div>

                            </div>

                            <div className="d-flex align-items-center gap-2">
                                <span role="button" className="dropdown-toggle d-flex align-items-center gap-2"
                                      data-bs-toggle="dropdown" aria-expanded="false" style={{cursor: 'pointer'}}>
                                    Filter by <span className="material-symbols-outlined">filter_list</span>
                                </span>
                                <div className="dropdown-menu dropdown-menu-end">
                                    <button className="dropdown-item" type="button">Action</button>
                                    <button className="dropdown-item" type="button">Another action</button>
                                    <button className="dropdown-item" type="button">Something else here</button>
                                </div>

                            </div>

                        </div>
                    </div>

                    <div className="d-flex flex-column">

                        {isLoading ? (
                            <div className="d-flex align-items-center justify-content-center">
                                <div className="spinner-border"></div>
                            </div>
                        ) : (
                            <div className="d-flex flex-column gap-1">
                                {tasks.map((task) => {
                                    let badgeText = "";
                                    let badgeClass = "";

                                    if (task.completedAt) {
                                        badgeText = "Completed";
                                        badgeClass = "success";
                                    } else if (new Date(task.dueAt) < new Date()) {
                                        badgeText = "Overdue";
                                        badgeClass = "danger";
                                    } else {
                                        badgeText = "Due soon";
                                        badgeClass = "warning";
                                    }

                                    return (
                                        <div key={task.id}
                                             className={`task-list-item d-flex justify-content-between align-items-center py-2 px-1 border-bottom rounded-4
                                         ${selectedTask?.id === task.id ? "selected-task" : ""}`}
                                             style={{cursor: "pointer"}}
                                             onClick={() => {
                                                 setSelectedTask(task);
                                                 setActiveAction(null);
                                             }}>
                                            <div className="d-flex gap-2 align-items-center">
                                            <span className="material-symbols-outlined"
                                                  style={{cursor: "pointer"}}
                                                  onClick={(e) => {
                                                      e.stopPropagation();
                                                      setSelectedTask(task);
                                                      setActiveAction("complete");
                                                  }}
                                            >
                                                {task.completedAt ? "check_box" : "check_box_outline_blank"}
                                            </span>
                                                <span>
                                                <div>{task.taskName}</div>
                                                <div className="text-muted small">
                                                    Due {new Date(task.dueAt).toLocaleString("en-GB", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                                </div>
                                            </span>
                                            </div>
                                            <span className={`badge ${badgeClass}`}>{badgeText}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                    </div>

                </div>

                <div className="col-7">

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
                                                   className="rounded-5 border-0 px-3 py-1 w-100"
                                                   placeholder="Task name"/>
                                        </div>
                                        <div
                                            className="text-end small text-danger">
                                            {editTask.taskNameValidationError}
                                        </div>
                                    </div>
                                ) : (
                                    <h2 className="title d-flex align-items-center justify-content-between">
                                        <div className="d-flex gap-2 align-items-center">
                                            <span className="material-symbols-outlined"
                                                  style={{cursor: 'pointer'}}
                                                  onClick={() => {
                                                      setActiveAction(activeAction === "complete" ? null : "complete");
                                                  }}
                                            >
                                                {selectedTask.completedAt ? "check_box" : "check_box_outline_blank"}
                                            </span>
                                            {selectedTask.taskName}
                                        </div>
                                        <span className="material-symbols-outlined"
                                              style={{cursor: "pointer"}}
                                              onClick={() => {
                                                  setSelectedTask(null);
                                                  setActiveAction(null);
                                              }}>
                                                    close
                                        </span>
                                    </h2>
                                )}

                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="text-muted"
                                          data-toggle="tooltip" data-placement="right" title="19.09.2024 23:59">
                                                      Created at{" "}
                                        {new Date(selectedTask.createdAt).toLocaleString("en-GB", {
                                            day: "2-digit",
                                            month: "short",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                    <span className="badge success">Completed</span>
                                    {/*<span className="badge warning">Due soon</span>*/}
                                    {/*<span className="badge danger">Overdue</span>*/}
                                </div>

                            </div>

                            <div className="p-2 d-flex flex-column gap-2">

                                {activeAction === "complete" && (
                                    <div className="d-flex flex-column gap-2">

                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="fw-bold">Task completed as of</span>
                                            <input className="rounded-5 border-0 px-3 py-1" type="datetime-local"/>
                                        </div>

                                        <div className="d-flex justify-content-between px-2">
                                            <button
                                                className="d-flex align-items-center gap-2 rounded-5 border-0 px-3 py-1 success">
                                                <span className="material-symbols-outlined">check_box</span>
                                                Complete
                                            </button>

                                            <button
                                                className="d-flex align-items-center gap-2 rounded-5 border-0 px-3 py-1 cancel"
                                                onClick={() => setActiveAction(null)}>
                                                <span className="material-symbols-outlined">cancel</span>
                                                Cancel
                                            </button>
                                        </div>

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
                                            <label className="d-flex gap-2" htmlFor="EditTaskDueDate">
                                                <span className="material-symbols-outlined">calendar_clock</span>
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
                                                   className="rounded-5 border-0 px-3 py-1"
                                                   id="EditTaskDueDate"
                                                   type="datetime-local"/>
                                        </div>
                                        <div className="text-end small text-danger">
                                            {editTask.dueDateValidationError}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="d-flex align-items-center gap-2">
                                        <span className="material-symbols-outlined">calendar_clock</span>
                                        Due{" "}
                                        {new Date(selectedTask.dueAt).toLocaleString("en-GB", {
                                            day: "2-digit",
                                            month: "short",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                        <span className="text-muted">(in 7 days)</span>
                                    </div>
                                )}


                                <div className="d-flex align-items-center gap-2">
                                    <span className="material-symbols-outlined">event_available</span>
                                    Completed at 28. September 12:00
                                </div>

                                {activeAction === null && (
                                    <div className="d-flex justify-content-between align-items-center py-5">
                                        <div className="d-flex gap-2 text-muted"
                                             style={{cursor: "pointer"}}
                                             onClick={() => {
                                                 setActiveAction("delete")
                                             }}
                                        >
                                            <span className="material-symbols-outlined">delete</span> Delete
                                        </div>

                                        <div className="d-flex gap-2 text-muted"
                                             style={{cursor: "pointer"}}
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
                                            Edit <span className="material-symbols-outlined">edit</span>
                                        </div>
                                    </div>)}


                                {activeAction === "delete" && (
                                    <div className="d-flex flex-column gap-4 py-5">
                                        <div className="text-center text-muted">
                                            Are you sure you want to delete this task?
                                        </div>
                                        <div className="d-flex justify-content-between px-2">
                                            <button
                                                className="d-flex align-items-center gap-2 rounded-5 border-0 px-3 py-1 danger"
                                                onClick={() => handleDeleteTask(selectedTask.id)}>
                                                <span className="material-symbols-outlined">delete</span>
                                                Delete
                                            </button>
                                            <button
                                                className="d-flex align-items-center gap-2 rounded-5 border-0 px-3 py-1 cancel"
                                                onClick={() => setActiveAction(null)}>
                                                <span className="material-symbols-outlined">cancel</span>
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {activeAction === "edit" && (
                                    <div className="d-flex flex-column gap-4 py-5">
                                        <div className="text-center text-muted">
                                            Save changes?
                                        </div>
                                        <div className="d-flex justify-content-between px-2">

                                            <button
                                                className="d-flex align-items-center gap-2 rounded-5 border-0 px-3 py-1 warning"
                                                onClick={() => handleEditTask()}
                                            >
                                                <span className="material-symbols-outlined">edit</span>
                                                Save
                                            </button>
                                            <button
                                                className="d-flex align-items-center gap-2 rounded-5 border-0 px-3 py-1 cancel"
                                                onClick={() => setActiveAction(null)}>
                                                <span className="material-symbols-outlined">cancel</span>
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}

                            </div>

                        </div>

                    ) : activeAction === "create" ? (

                        <div>

                            <h2 className="title p-2 border-bottom d-flex align-items-center justify-content-between">
                                Create a New Task
                                <span className="material-symbols-outlined"
                                      style={{cursor: "pointer"}}
                                      onClick={() => {
                                          setSelectedTask(null);
                                          setActiveAction(null);
                                      }}>
                                    close
                                </span>
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
                                               className="rounded-5 border-0 px-3 py-1 "
                                               id="NewTaskName"
                                               placeholder="Task name..."/>
                                    </div>
                                    <div className="text-end small text-danger">{createTask.taskNameValidationError}</div>
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
                                                   className="rounded-5 border-0 px-3 py-1"
                                                   id="NewTaskDueDate"
                                                   type="datetime-local"/>
                                        </div>
                                    </div>
                                    <div className="text-end small text-danger">{createTask.dueDateValidationError}</div>
                                </div>

                                <div className="d-flex justify-content-center">
                                    <button
                                        className="d-flex gap-2 rounded-5 border-0 px-3 py-1 primary"
                                        onClick={() => handleCreateTask()}
                                    >
                                        <span className="material-symbols-outlined">add_circle</span>
                                        Create
                                    </button>
                                </div>

                            </div>

                        </div>
                    ) : (
                        <div className="d-flex flex-column h-100 gap-2 justify-content-center align-items-center"
                             style={{cursor: "pointer"}}
                             onClick={() => {
                                 setSelectedTask(null);
                                 setActiveAction("create");
                             }}
                        >
                            Add a new task to do
                            <span className="material-symbols-outlined">add_circle</span>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}
