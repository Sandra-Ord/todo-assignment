export type RequestType = 'get' | 'post' | 'put' | 'delete';

export interface IRequestOptions {
    method: RequestType,
    controller: string,
    endpoint: string,
    data?: unknown,
    params?: Record<string, unknown>
}