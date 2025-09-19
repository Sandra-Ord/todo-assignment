import axios from "axios";
import {ITask} from "@/domain/ITask";

export default class TaskService {
    private constructor() {}

    private static httpClient = axios.create({
        baseURL: "http://localhost:5221/api/ToDoTask/",
    })

    // [GET] /api/ToDoTask
    static async getTasks(){

        try {
            const response = await TaskService.httpClient.get<ITask[]>("");

            if (response.status < 300) {
                return {
                    data: response.data
                }
            }

            return {
                errors: [response.status.toString() + " " + response.statusText],
            }

        } catch (error) {
            return {
                errors: [JSON.stringify(error)]
            };
        }
    }

}