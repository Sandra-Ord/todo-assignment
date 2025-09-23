import axios from "axios";
import {ITask} from "@/domain/ITask";
import {IResponse} from "@/domain/IResultObject";
import {IFilter} from "@/domain/IFilter";
import {request} from "@/services/ApiClient";

export default class TaskService {

    private constructor() {}

    private static httpClient = axios.create({
        baseURL: process.env.NEXT_PUBLIC_BACKEND_URL + "/api/ToDoTask/",
    })

    static async getTasks() : Promise<IResponse<ITask[]>>{
        return request<ITask[]>('get', '');
    }

    static async createTask(taskName: string, dueDate: string) : Promise<IResponse<ITask>> {
        const taskData = {
            taskName: taskName,
            // todo remove now date from here
            createdAt: new Date().toISOString(),
            dueAt: dueDate
        }

        return request<ITask>('post', '', taskData);
    }

    static async editTask(id:string, taskName: string, dueDate: string) : Promise<IResponse<ITask>> {
        const taskData = {
            id: id,
            taskName: taskName,
            dueAt: dueDate
        }

        return request<ITask>('put', `${id}`, taskData);
    }

    static async completeTask(id:string, completedDate: string) : Promise<IResponse<ITask>> {
        return request<ITask>('post', `${id}/complete`, { completedAt: completedDate });
    }

    static async uncompleteTask(id:string) : Promise<IResponse<ITask>> {
        return request<ITask>('post', `${id}/uncomplete`);
    }

    static async deleteTask(taskId: string) : Promise<IResponse<ITask>> {
        return request<ITask>('delete', `${taskId}`);
    }

    static async getFilteredTasks(filter: IFilter): Promise<IResponse<ITask[]>> {
        const params: Record<string, any> = {};

        if (filter.completed !== null && filter.completed !== undefined) {
            params.completed = filter.completed;
        }

        if (filter.search && filter.search.trim().length > 0) {
            params.search = filter.search.trim();
        }

        const tryToIso = (v?: string) => {
            if (!v) return undefined;
            const d = new Date(v);
            return isNaN(d.getTime()) ? undefined : d.toISOString();
        };

        const dueFromIso = tryToIso(filter.dueDateFrom);
        const dueUntilIso = tryToIso(filter.dueDateUntil);

        if (dueFromIso) params.dueDateFrom = dueFromIso;
        if (dueUntilIso) params.dueDateUntil = dueUntilIso;

        return request<ITask[]>('get', 'filter', undefined, params);
    }
}