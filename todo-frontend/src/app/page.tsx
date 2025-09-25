"use client";

import {useEffect, useMemo, useState} from "react";
import {ITask} from "@/domain/ITask";
import {IFilter} from "@/domain/IFilter";
import {IEditableTask} from "@/domain/IEditableTask";
import {TaskAction, TaskSortBy} from "@/domain/TaskEnums";
import TaskService from "@/services/TaskService";
import {formatDate, untilDueDate} from "@/utils/dateFormat";
import {handleApiCall} from "@/utils/api";
import {isTaskValid, sortTasks, validateTask} from "@/utils/taskUtils";
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

const EMPTY_TASK_FORM: IEditableTask = { taskName: "", taskNameValidationError: "", dueDate: "", dueDateValidationError: "" };

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

    const sortedTasks = useMemo(() => sortTasks(tasks, sortBy, completedLast), [tasks, sortBy, completedLast]);

    // Create/Edit/Complete Task States
    const [completedDate, setCompletedDate] = useState("");
    const [formTask, setFormTask] = useState<IEditableTask>(EMPTY_TASK_FORM);

    const loadTasks = async () => {
        setIsLoading(true);
        await handleApiCall(
            () => TaskService.getTasks(),
            (data) => setTasks(data),
            "loading tasks"
        );
        setIsLoading(false);
    };

    const applyFilter = async () => {
        setIsLoading(true);
        await handleApiCall(
            () => TaskService.getFilteredTasks(filter),
            (data) => setTasks(data),
            "applying task filter"
        );
        setIsLoading(false);
    };

    const handleSubmitTask = async () => {
        const validated = validateTask(formTask);
        if (isTaskValid(validated)) {
            setFormTask(validated);
            return;
        }

        await handleApiCall(
            selectedTask && activeAction === "edit"
                ? () => TaskService.editTask(selectedTask.id, formTask.taskName, formTask.dueDate)
                : () => TaskService.createTask(formTask.taskName, formTask.dueDate),
            async (data) => {
                setSelectedTask(data);
                setActiveAction(null);
                setFormTask(EMPTY_TASK_FORM);
                await applyFilter();
            },
            selectedTask ? "editing task" : "creating task"
        );
    }

    const handleDeleteTask = async (taskId: string) => {
        await handleApiCall(
            () => TaskService.deleteTask(taskId),
            (data) => {
                setTasks(tasks.filter((task) => task.id !== taskId));
                setSelectedTask(null);
                setActiveAction(null);
            },
            "deleting task"
        );
    }

    const handleAlterTaskCompletion = async () => {
        if (!selectedTask) return;
        await handleApiCall(
            selectedTask.completedAt
                ? () => TaskService.uncompleteTask(selectedTask.id)
                : () => TaskService.completeTask(selectedTask.id, completedDate),
            async (data) => {
                setSelectedTask(data);
                setActiveAction(null);
                await applyFilter();
            },
            selectedTask.completedAt ? "marking task as incomplete" : "marking task as complete"
        );
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
                                  setFormTask(EMPTY_TASK_FORM);
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
                        <SortMenu sortBy={sortBy} setSortBy={setSortBy}
                                  completedLast={completedLast} setCompletedLast={setCompletedLast}/>
                        <FilterMenu filter={filter} setFilter={setFilter}/>
                    </div>

                    {/*Task List*/}
                    <div className="flex-grow-1 overflow-auto vh-100">
                        {isLoading ? (
                            <LoadingSpinner/>
                        ) : sortedTasks.length > 0 ? (
                            <div className="d-flex flex-column gap-1">
                                {sortTasks(tasks, sortBy, completedLast).map((task) => (
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
                        ) : (
                            <div className="text-center text-muted py-4">
                                No tasks found.
                            </div>
                        )}
                    </div>

                </div>

                {/*Task Detail View Section*/}
                <div className="col-12 col-md-7 order-1 p-2 border-bottom">

                    {selectedTask ? (
                        <>

                            {activeAction === "edit" ? (
                                <EditTaskForm editTask={formTask} setEditTask={setFormTask} selectedTask={selectedTask}
                                              onConfirm={handleSubmitTask}
                                              onCancel={() => {
                                                  setFormTask(EMPTY_TASK_FORM);
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
                                setFormTask(EMPTY_TASK_FORM);
                                setSelectedTask(null);
                                setActiveAction(null);
                            }}/>
                    ) : (
                        <MaterialIconLabel label="Add a new task to do" name="add_circle"
                                           className='title flex-column h-100 justify-content-center'
                                           onClick={() => {
                                               setFormTask(EMPTY_TASK_FORM);
                                               setSelectedTask(null);
                                               setActiveAction("create");
                                           }}/>
                    )}
                </div>

            </div>

        </div>
    );
}