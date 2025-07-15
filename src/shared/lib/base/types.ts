export type BaseResponseBody<T> = {
    data: T;
    message: string;
    status: number;
};
