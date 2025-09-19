"use client";

import Image from "next/image";
import styles from "./page.module.css";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import {useEffect, useState} from "react";
import {ITask} from "@/domain/ITask";
import TaskService from "@/services/TaskService";

export default function ToDoTaskDashboard() {

    const [isLoading, setIsLoading] = useState(true);

    const [tasks, setTasks] = useState<ITask[]>([]);

    const [selectedTask, setSelectedTask] = useState<ITask | null>(null);

    const [newTaskName, setNewTaskName] = useState("");
    const [newTaskDueDate, setNewTaskDueDate] = useState("");
    const [dueDateValidationError, setDueDateValidationError] = useState("");
    const [taskNameValidationError, setTaskNameValidationError] = useState("");
    const [validationError, setValidationError] = useState("");

    const [editTask, setEditTask] = useState({taskName: "", taskNameValidationError: "", dueDate: "", dueDateValidationError: "" });

    const [activeAction, setActiveAction] = useState<"create" | "complete" | "delete" | "edit" | null>(null);

    const loadTasks = async () => {
        const response = await TaskService.getTasks();

        if (response.data) {
            setTasks(response.data);
        }

        setIsLoading(false);
    };

    const handleCreateTask = async() => {
        if (newTaskName.length < 1) {
            setTaskNameValidationError("Task name is required!");
        }
        if (newTaskDueDate.length < 1) {
            setDueDateValidationError("Due date is required!");
        }
        if (newTaskName.length < 1 || newTaskDueDate.length < 1) {
            return;
        }

        const response = await TaskService.createTask(newTaskName, newTaskDueDate);

        if (response.data) {
            setSelectedTask(response.data);
            setActiveAction(null);
            setNewTaskName("");
            setNewTaskDueDate("");
            tasks.push(response.data);
        }
        if (response.errors && response.errors.length > 0) {
            setValidationError(response.errors[0]);
        }
    }

    const handleEditTask = async() => {

        if (selectedTask) {
            if (editTask.taskName.length < 1) {
                setEditTask({ ...editTask, taskNameValidationError: "Task name is required!" })
            }
            if (editTask.dueDate.length < 1) {
                setEditTask({ ...editTask, dueDateValidationError: "Due date is required!" })
            }
            if (editTask.taskName.length < 1 || editTask.dueDate.length < 1) {
                return;
            }

            const response = await TaskService.editTask(selectedTask.id, editTask.taskName, editTask.dueDate);
            if (!response.errors) {

                setSelectedTask({...selectedTask, taskName: editTask.taskName, dueAt: editTask.dueDate});
                setActiveAction(null);
                setEditTask({taskName: "", taskNameValidationError: "", dueDate: "", dueDateValidationError: "" });
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
            }
        } else {
            console.error("Failed to delete task", response.errors);
        }
    }

    useEffect(() => {
        loadTasks();
    }, []);

    if (isLoading) {
        return (
            <div>to do - loading</div>
        );
    }

    return (

        <div className="p-4 dashboard">

            <div className="d-flex flex-row justify-content-between align-items-center border-bottom">
                <h3 className="title p-1 d-flex align-items-center gap-2">
                    <span className="material-symbols-outlined">add_task</span> To Do Dashboard
                </h3>

                <span className="title material-symbols-outlined p-1"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                          setSelectedTask(null);
                          setActiveAction("create");
                      }}>
                    add
                </span>
            </div>

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
                                         style={{ cursor: "pointer" }}
                                         onClick={() => {
                                             setSelectedTask(task);
                                             setActiveAction(null);
                                         }}>
                                        <div className="d-flex gap-2 align-items-center">
                                            <span className="material-symbols-outlined"
                                                  style={{ cursor: "pointer" }}
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

                    </div>


                </div>

                <div className="col-7">
                    {/*this is detailed task view*/}
                    {selectedTask ? (
                        <div className="">
                            <div className="border-bottom">
                                <div className="p-2">

                                    {activeAction === "edit" ? (
                                        <div>
                                            <div className="d-flex align-items-center">
                                                <input value={editTask.taskName}
                                                       onChange={(e) => {
                                                           setEditTask({ ...editTask, taskName: e.target.value, taskNameValidationError: "" })
                                                       }}
                                                       className="rounded-5 border-0 px-3 py-1 w-100"
                                                       placeholder="Task name"/>
                                            </div>
                                            <div className="text-end small text-danger">{editTask.taskNameValidationError}</div>
                                        </div>
                                    ) : (
                                        <div className="d-flex justify-content-between align-content-center">
                                            <h2 className="d-flex gap-2 align-items-center">
                                            <span className="material-symbols-outlined"
                                                  style={{cursor: 'pointer'}}
                                                  onClick={() => {
                                                      setActiveAction(activeAction === "complete" ? null : "complete");
                                                  }}
                                            >
                                                {selectedTask.completedAt ? "check_box" : "check_box_outline_blank"}
                                            </span>
                                                {selectedTask.taskName}
                                            </h2>
                                            <span className="material-symbols-outlined"
                                                  style={{ cursor: "pointer" }}
                                                  onClick={() => {
                                                      setSelectedTask(null);
                                                      setActiveAction(null);
                                                  }}>
                                            close
                                        </span>
                                        </div>
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

                            </div>
                            <div className="p-2 d-flex flex-column gap-2">

                                {activeAction === "complete" && (
                                    <div className="d-flex flex-column gap-2">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="fw-bold">Task completed as of</span>
                                            <div>
                                                <input className="rounded-5 border-0 px-3 py-1" type="datetime-local"/>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-between px-4">
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
                                    This is a placeholder text for a task which may or may not have some additional text as
                                    its description. this has not yet been added to the data model and is a to do for now.
                                </div>

                                {activeAction === "edit" ? (
                                    <div>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <label className="d-flex gap-2" htmlFor="EditTaskDueDate">
                                                <span className="material-symbols-outlined">calendar_clock</span>
                                                Due Date
                                            </label>
                                            <div>
                                                <input value={editTask.dueDate}
                                                       onChange={(e) => {
                                                           setEditTask({ ...editTask, dueDate: e.target.value, dueDateValidationError: "" })
                                                       }}
                                                       className="rounded-5 border-0 px-3 py-1"
                                                       id="EditTaskDueDate"
                                                       type="datetime-local"/>
                                            </div>
                                        </div>
                                        <div className="text-end small text-danger">{editTask.dueDateValidationError}</div>
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
                                    <div className="d-flex justify-content-end gap-2 text-muted"
                                         style={{ cursor: "pointer" }}
                                         onClick={() => {setActiveAction("delete")}}
                                    >
                                        <span className="material-symbols-outlined">delete</span> Delete
                                    </div>

                                    <div className="d-flex justify-content-end gap-2 text-muted"
                                         style={{ cursor: "pointer" }}
                                         onClick={() => {
                                             setActiveAction("edit");
                                             setEditTask({taskName: selectedTask?.taskName, taskNameValidationError: "", dueDate: selectedTask?.dueAt, dueDateValidationError: "" });
                                         }}
                                    >
                                        Edit <span className="material-symbols-outlined">edit</span>
                                    </div>
                                </div>)}


                                {activeAction === "delete" && (
                                    <div className="d-flex flex-column gap-4 py-5">
                                        <div className="d-flex justify-content-center text-muted">
                                            Are you sure you want to delete this task?
                                        </div>
                                        <div className="d-flex justify-content-between px-4">

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
                                        <div className="d-flex justify-content-center text-muted">
                                            Save changes?
                                        </div>
                                        <div className="d-flex justify-content-between px-4">

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
                        <div className="">

                            <div className="border-bottom">
                                <div className="p-2">
                                    <div className="d-flex justify-content-between align-content-center">
                                        <h2 className="d-flex align-items-center">
                                            Create a New Task
                                        </h2>
                                        <span className="material-symbols-outlined"
                                              style={{ cursor: "pointer" }}
                                              onClick={() => {
                                                  setSelectedTask(null);
                                                  setActiveAction(null);
                                              }}>
                                            close
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-2 pt-3 d-flex flex-column gap-3">

                                <div>
                                    <div className="d-flex justify-content-between align-items-center gap-4">
                                        <label className="" htmlFor="NewTaskName">Task name</label>
                                        <input value={newTaskName}
                                               onChange={(e) => {
                                                   setNewTaskName(e.target.value);
                                                   setTaskNameValidationError("");
                                               }}
                                               className="rounded-5 border-0 px-3 py-1 "
                                               id="NewTaskName"
                                               placeholder="Task name..."/>
                                    </div>
                                    <div className="text-end small text-danger">{taskNameValidationError}</div>
                                </div>

                                <div>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <label className="" htmlFor="NewTaskDueDate">Due date</label>
                                        <div>
                                            <input value={newTaskDueDate}
                                                   onChange={(e) => {
                                                       setNewTaskDueDate(e.target.value);
                                                       setDueDateValidationError("");
                                                   }}
                                                   className="rounded-5 border-0 px-3 py-1"
                                                   id="NewTaskDueDate"
                                                   type="datetime-local"/>
                                        </div>
                                    </div>
                                    <div className="text-end small text-danger">{dueDateValidationError}</div>
                                </div>

                                <div className="d-flex justify-content-center px-4">
                                    <button
                                        className="d-flex align-items-center gap-2 rounded-5 border-0 px-3 py-1 success"
                                        onClick={() => handleCreateTask()}
                                    >
                                        <span className="material-symbols-outlined">check_box</span>
                                        Create
                                    </button>
                                </div>

                            </div>

                        </div>
                    ) : (
                        <div className="d-flex flex-column h-100 gap-2 justify-content-center align-items-center"
                             style={{ cursor: "pointer" }}
                             onClick={() => {
                                 setSelectedTask(null);
                                 setActiveAction("create");
                             }}
                        >
                            <div>
                                Add a new task to do
                            </div>
                            <span className="material-symbols-outlined">
                                add_circle
                            </span>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}
