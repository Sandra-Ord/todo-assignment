import axios from "axios";
import {ITask} from "@/domain/ITask";
import {IResponse} from "@/domain/IResultObject";
import {IFilter} from "@/domain/IFilter";

export default class TaskService {

    private constructor() {}

    private static httpClient = axios.create({
        baseURL: process.env.NEXT_PUBLIC_BACKEND_URL + "/api/ToDoTask/",
    })

    // [GET] /api/ToDoTask
    static async getTasks() : Promise<IResponse<ITask[]>>{

        try {
            const response = await TaskService.httpClient.get<ITask[]>("");

            if (response.status < 300) {
                return {
                    data: response.data
                };
            }

            return {
                errors: [response.status.toString() + " " + response.statusText]
            };

        } catch (error) {
            return {
                errors: [JSON.stringify(error)]
            };
        }
    }

    static async createTask(taskName: string, dueDate: string) : Promise<IResponse<ITask>> {
        const taskData = {
            taskName: taskName,
            // todo remove now date from here
            createdAt: new Date().toISOString(),
            dueAt: dueDate
        }

        try {
            const response = await TaskService.httpClient.post<ITask>("", taskData);
            if (response.status < 300) {
                return {
                    data: response.data
                };
            }
            return {
                errors: [response.status.toString() + " " + response.statusText]
            };

        } catch (error) {

            return {
                errors: [JSON.stringify(error)]
            };
        }
    }

    static async editTask(id:string, taskName: string, dueDate: string) : Promise<IResponse<ITask>> {
        const taskData = {
            id: id,
            taskName: taskName,
            dueAt: dueDate
        }

        try {
            const response = await TaskService.httpClient.put<ITask>(`${id}`, taskData);
            if (response.status < 300) {
                return {
                    data: response.data
                };
            }
            return {
                errors: [response.status.toString() + " " + response.statusText]
            };

        } catch (error) {

            return {
                errors: [JSON.stringify(error)]
            };
        }
    }

    static async completeTask(id:string, completedDate: string) : Promise<IResponse<ITask>> {
        const data = {
            completedAt: completedDate
        }

        try {
            const response = await TaskService.httpClient.post<ITask>(`${id}/complete`, data);
            if (response.status < 300) {
                return {
                    data: response.data
                };
            }
            return {
                errors: [response.status.toString() + " " + response.statusText]
            };

        } catch (error) {

            return {
                errors: [JSON.stringify(error)]
            };
        }
    }

    static async uncompleteTask(id:string) : Promise<IResponse<ITask>> {


        try {
            const response = await TaskService.httpClient.post<ITask>(`${id}/uncomplete`);
            if (response.status < 300) {
                return {
                    data: response.data
                };
            }
            return {
                errors: [response.status.toString() + " " + response.statusText]
            };

        } catch (error) {

            return {
                errors: [JSON.stringify(error)]
            };
        }
    }

    static async deleteTask(taskId: string) : Promise<IResponse<ITask>> {
        try {
            const response = await TaskService.httpClient.delete<ITask>(`${taskId}`);

            if (response.status < 300) {
                return {
                    data: response.data
                };
            }
            return {
                errors: [response.status.toString() + " " + response.statusText]
            };

        } catch (error) {

            return {
                errors: [JSON.stringify(error)]
            };
        }
    }

    static async getFilteredTasks(filter: IFilter): Promise<IResponse<ITask[]>> {
        try {
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

            const response = await TaskService.httpClient.get<ITask[]>("filter", { params });
            console.log(response);
            if (response.status < 300) {
                return { data: response.data };
            }

            return {
                errors: [response.status.toString() + " " + response.statusText]
            };
        } catch (error) {
            return {
                errors: [JSON.stringify(error)]
            };
        }
    }
}