import {IResponse} from "@/domain/IResultObject";
import axios from "axios";

const httpClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL + "/api/ToDoTask/",
});

export async function request<T>(
    method: 'get' | 'post' | 'put' | 'delete',
    url: string,
    data?: any,
    params?: Record<string, any>
): Promise<IResponse<T>> {
    try {
        const response = await httpClient.request<T>({ method, url, data, params });
        if (response.status < 300) return { data: response.data };
        return { errors: [`${response.status} ${response.statusText}`] };
    } catch (error) {
        return { errors: [JSON.stringify(error)] };
    }
}