export type RTKApiResponse = {
    data: {
        response: string;
        message: string;
        data?: {
            token: string;
        };
    };
}