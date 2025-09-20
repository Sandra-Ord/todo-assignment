import axios from "axios";
import {ITask} from "@/domain/ITask";
import {IResponse} from "@/domain/IResultObject";


export default class TaskService {
    private constructor() {}

    private static httpClient = axios.create({
        baseURL: "http://localhost:5221/api/ToDoTask/",
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

}