import {IResponse} from "@/domain/IResultObject";
import {IRequestOptions} from "@/domain/IRequestOptions";
import axios from "axios";

const httpClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL + "/api/",
});

export async function request<T>({ method, controller, endpoint = "", data, params }: IRequestOptions): Promise<IResponse<T>> {
    try {
        const url = endpoint ? `${controller}/${endpoint}` : controller;
        const response = await httpClient.request<T>({ method, url, data, params });
        if (response.status < 300) return { data: response.data };
        return { errors: [`${response.status} ${response.statusText}`] };
    } catch (error) {
        return { errors: [JSON.stringify(error)] };
    }
}