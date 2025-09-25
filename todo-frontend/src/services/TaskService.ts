import {ITask} from "@/domain/ITask";
import {IResponse} from "@/domain/IResultObject";
import {IRequestOptions} from "@/domain/IRequestOptions";
import {TaskFilterValues} from "@/domain/TaskEnums";
import {IFilter} from "@/domain/IFilter";
import {request} from "@/services/ApiClient";

export default class TaskService {

    private constructor() {}

    private static CONTROLLER = "ToDoTask";

    private static call<T>(options: Omit<IRequestOptions, 'controller'>): Promise<IResponse<T>> {
        return request<T>({...options, controller: TaskService.CONTROLLER});
    }

    // GET: api/ToDoTask
    static async getTasks() : Promise<IResponse<ITask[]>>{
        return TaskService.call<ITask[]>({method: 'get', endpoint: ''});
    }

    // POST: api/ToDoTask
    static async createTask(taskName: string, dueDate: string) : Promise<IResponse<ITask>> {
        const taskData = {
            taskName: taskName,
            // todo remove now date from here
            createdAt: new Date().toISOString(),
            dueAt: dueDate
        }
        return TaskService.call<ITask>({method: 'post', endpoint: '', data: taskData});
    }

    // PUT: api/ToDoTask/{id}
    static async editTask(id:string, taskName: string, dueDate: string) : Promise<IResponse<ITask>> {
        const taskData = {
            id: id,
            taskName: taskName,
            dueAt: dueDate
        }
        return TaskService.call<ITask>({method: 'put', endpoint: `${id}`, data: taskData});
    }

    // POST: api/ToDoTask/{id}/complete
    static async completeTask(id:string, completedDate: string) : Promise<IResponse<ITask>> {
        return TaskService.call<ITask>({method: 'post', endpoint: `${id}/complete`, data: { completedAt: completedDate }});
    }

    // POST: api/ToDoTask/{id}/uncomplete
    static async uncompleteTask(id:string) : Promise<IResponse<ITask>> {
        return TaskService.call<ITask>({method: 'post', endpoint: `${id}/uncomplete`});
    }

    // DELETE: api/ToDoTask/{id}
    static async deleteTask(taskId: string) : Promise<IResponse<ITask>> {
        return TaskService.call<ITask>({method: 'delete', endpoint: `${taskId}`});
    }

    // GET: api/filter
    static async getFilteredTasks(filter: IFilter): Promise<IResponse<ITask[]>> {
        return TaskService.call<ITask[]>({method: 'get', endpoint: 'filter', params: TaskService.buildFilterParams(filter)});
    }

    private static buildFilterParams(filter: IFilter): Record<string, TaskFilterValues> {
        const params: Record<string, TaskFilterValues> = {};

        if (typeof filter.completed === "boolean") params.completed = filter.completed;
        if (filter.search?.trim()) params.search = filter.search.trim();
        if (filter.dueDateFrom) params.dueDateFrom = new Date(filter.dueDateFrom).toISOString();
        if (filter.dueDateUntil) params.dueDateUntil = new Date(filter.dueDateUntil).toISOString();

        return params;
    }
}