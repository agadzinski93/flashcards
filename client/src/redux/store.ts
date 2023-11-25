import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice'
import authApi from './apis/api'

export default configureStore({
    reducer: {
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware)
});