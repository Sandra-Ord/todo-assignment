export interface IResponse<TResponseData> {
    errors?: string[],
    data?: TResponseData
}