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

    const loadTasks = async () => {
        const response = await TaskService.getTasks();

        console.log("tasks");
        console.log(response);

        if (response.data) {
            setTasks(response.data);
        }

        setIsLoading(false);
    };

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

                <span className="title material-symbols-outlined p-1">add</span>
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
                            {/*<div className="d-flex align-items-center gap-2">*/}
                            {/*        <button type="button" className="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">*/}
                            {/*            Filter <span className="material-symbols-outlined">filter_list</span>*/}
                            {/*        </button>*/}
                            {/*        <div className="dropdown-menu dropdown-menu-end">*/}
                            {/*            <button className="dropdown-item" type="button">Action</button>*/}
                            {/*            <button className="dropdown-item" type="button">Another action</button>*/}
                            {/*            <button className="dropdown-item" type="button">Something else here</button>*/}
                            {/*        </div>*/}

                            {/*</div>*/}
                        </div>
                    </div>

                    <div className="d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                            <div className="d-flex gap-2 align-items-center">

                                <span className="material-symbols-outlined">check_box_outline_blank</span>
                                <span>
                                    <div>Task name</div>
                                    <div className="text-muted small">Due 27. Sept 23:59</div>
                                </span>
                            </div>
                            <span className="badge danger">Overdue</span>
                        </div>

                        <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                            <div className="d-flex gap-2 align-items-center">
                                <span className="material-symbols-outlined">check_box_outline_blank</span>
                                <span>
                                    <div>Task name</div>
                                    <div className="text-muted small">Due 27. Sept 23:59</div>
                                </span>
                            </div>
                            <span className="badge danger">Overdue</span>
                        </div>

                        <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                            <div className="d-flex gap-2 align-items-center">
                                <span className="material-symbols-outlined">check_box_outline_blank</span>
                                <span>
                                    <div>Task name</div>
                                    <div className="text-muted small">Due 27. Sept 23:59</div>
                                </span>
                            </div>
                            <span className="badge warning">Due soon</span>
                        </div>

                        <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                            <div className="d-flex gap-2 align-items-center">
                                <span className="material-symbols-outlined">check_box_outline_blank</span>
                                <span>
                                    <div>Task name</div>
                                    <div className="text-muted small">Due 27. Sept 23:59</div>
                                </span>
                            </div>
                            <span className="badge success">Completed</span>
                        </div>
                    </div>


                </div>

                <div className="col-7">
                    {/*this is detailed task view*/}
                    <div className="">
                        <div className="border-bottom">
                            <div className="p-2">

                                <div className="d-flex justify-content-between align-content-center">
                                    <h2 className="d-flex gap-2 align-items-center">
                                        <span className="material-symbols-outlined">check_box_outline_blank</span>
                                        Task name
                                    </h2>
                                    <span className="material-symbols-outlined">close</span>
                                </div>

                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="text-muted"
                                          data-toggle="tooltip" data-placement="right" title="19.09.2024 23:59">
                                        Created at 19. September 25
                                    </span>
                                    <span className="badge success">Completed</span>
                                    {/*<span className="badge warning">Due soon</span>*/}
                                    {/*<span className="badge danger">Overdue</span>*/}

                                </div>

                            </div>

                        </div>
                        <div className="p-2 d-flex flex-column gap-2">

                            {/*this will only be visible if the user has triggered task completing*/}
                            <div className="d-flex flex-column gap-2">
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="fw-bold">Task completed as of</span>
                                    <div>
                                        <input className="rounded-5 border-0 px-3 py-1" type="datetime-local"/>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-center">
                                    <button
                                        className="d-flex align-items-center gap-2 rounded-5 border-0 px-3 py-1 success">
                                        <span className="material-symbols-outlined">check_box</span>
                                        Complete
                                    </button>
                                </div>
                            </div>


                            <div>
                                This is a placeholder text for a task which may or may not have some additional text as
                                its description. this has not yet been added to the data model and is a to do for now.
                            </div>

                            <div className="d-flex align-items-center gap-2">
                                <span className="material-symbols-outlined">calendar_clock</span>
                                Due 27. September 23:59 <span className="text-muted">(in 7 days)</span>
                            </div>

                            <div className="d-flex align-items-center gap-2">
                                <span className="material-symbols-outlined">event_available</span>
                                Completed at 28. September 12:00
                            </div>

                            <div className="d-flex justify-content-between align-items-center py-5">
                                <div className="d-flex justify-content-end gap-2 text-muted">
                                    <span className="material-symbols-outlined">delete</span> Delete
                                </div>

                                <div className="d-flex justify-content-end gap-2 text-muted">
                                    Edit <span className="material-symbols-outlined">edit</span>
                                </div>
                            </div>

                            <div className="d-flex justify-content-center">
                                <button
                                    className="d-flex align-items-center gap-2 rounded-5 border-0 px-3 py-1 cancel">
                                    <span className="material-symbols-outlined">cancel</span>
                                    Cancel
                                </button>
                            </div>



                            {/*<div className="accordion" id="accordionExample">*/}
                            {/*    <div className="">*/}
                            {/*        <h2 className="accordion-header">*/}
                            {/*            <button className="accordion-button light-purple" type="button"*/}
                            {/*                    data-bs-toggle="collapse" data-bs-target="#collapseOne"*/}
                            {/*                    aria-expanded="true" aria-controls="collapseOne">*/}
                            {/*                More options*/}
                            {/*            </button>*/}
                            {/*        </h2>*/}
                            {/*        <div id="collapseOne" className="accordion-collapse collapse show"*/}
                            {/*             data-bs-parent="#accordionExample">*/}

                            {/*            <div className="accordion-body d-flex flex-wrap gap-3">*/}
                            {/*                /!* Edit button *!/*/}
                            {/*                <button className="btn btn-outline-primary d-flex align-items-center gap-2">*/}
                            {/*                    <span className="material-symbols-outlined">edit</span>*/}
                            {/*                    Edit*/}
                            {/*                </button>*/}

                            {/*                /!* Delete button *!/*/}
                            {/*                <button className="btn btn-outline-danger d-flex align-items-center gap-2">*/}
                            {/*                    <span className="material-symbols-outlined">delete</span>*/}
                            {/*                    Delete*/}
                            {/*                </button>*/}

                            {/*                /!* Uncomplete button *!/*/}
                            {/*                <button*/}
                            {/*                    className="btn btn-outline-secondary d-flex align-items-center gap-2">*/}
                            {/*                    <span*/}
                            {/*                        className="material-symbols-outlined">check_box_outline_blank</span>*/}
                            {/*                    Uncomplete*/}
                            {/*                </button>*/}
                            {/*            </div>*/}

                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*</div>*/}

                        </div>

                    </div>
                </div>
            </div>

        </div>
    );
}
