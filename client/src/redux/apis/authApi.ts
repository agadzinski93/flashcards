import api from './api'
const AUTH_PATH = '/auth'
type ApiResponse = {

    response: string;
    message: string;
    data?: {
        token: string;
    };

};
type registerData = {
    username: string,
    email: string,
    password: string,
    confirmPassword: string
}
type loginData = {
    username: string,
    password: string
}

const authApi = api.injectEndpoints({
    endpoints: (build) => ({
        registerUser: build.mutation<ApiResponse, registerData>({
            query: (formData) => ({
                url: `${AUTH_PATH}/register`,
                method: 'POST',
                body: formData
            })
        }),
        loginUser: build.mutation<ApiResponse, loginData>({
            query: (formData) => ({
                url: `${AUTH_PATH}/login`,
                method: 'POST',
                body: formData
            })
        }),
        logoutUser: build.mutation<ApiResponse, null>({
            query: () => ({
                url: `${AUTH_PATH}/logout`,
                method: 'POST'
            })
        })
    }),
});

export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useLogoutUserMutation
} = authApi;