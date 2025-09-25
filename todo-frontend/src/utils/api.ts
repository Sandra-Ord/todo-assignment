import {IResponse} from "@/domain/IResultObject";

export async function handleApiCall<T>(
    apiCall: () => Promise<IResponse<T>>,
    onSuccess: (data: T) => void,
    description?: string
) {
    try {
        const response = await apiCall();
        if (response.errors) {
            console.error("API error:", response.errors);
        } else if (response.data !== undefined) {
            onSuccess(response.data);
        }
    } catch (err) {
        console.error(`Unexpected API error${description ? ` during ${description}` : ""}:`, err);
    }
}