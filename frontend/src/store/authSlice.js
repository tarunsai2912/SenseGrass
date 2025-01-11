import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axios from "axios";
import { AUTH_ENDPOINTS } from "../utility/url";

const { LOGIN } = AUTH_ENDPOINTS;

const initialState = {
    name: localStorage.getItem("name") || null,
    user: localStorage.getItem("user") || null,
    token: localStorage.getItem("token") || null,
    role: localStorage.getItem("role") || null,
    email: localStorage.getItem("email") || null,
    pro: false,
    error: null,
    isLoading: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setIsLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setUser: (state, action) => {
            state.email = action.payload.email;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.role = action.payload.role;
            state.name = action.payload.name;
            state.pro = action.payload.pro
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearAuth: (state) => {
            state.name = null;
            state.user = null;
            state.token = null;
            state.role = null;
            state.email = null;
            state.error = null;
        },
        addPro: (state, action) => {
            state.pro = action.payload
        }
    },
});

export const { setIsLoading, setUser, setError, clearAuth, addPro } = authSlice.actions;

export const login = (credentials) => async (dispatch) => {
    const toastId = toast.loading("Logging In...");
    dispatch(setIsLoading(true));
    try {
        const response = await axios.post(LOGIN, credentials);
        toast.dismiss(toastId);
        toast.success("Login Success");
        const { name, token, role, email, user, pro } = response.data;
        localStorage.setItem("name", name);
        localStorage.setItem("user", user);
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("email", email);
        dispatch(setUser({ name, token, email, role, user, pro }));
        dispatch(setIsLoading(false));
    } 
    catch (error) {
        toast.dismiss(toastId);
        dispatch(setError(error.response.data.message));
        dispatch(setIsLoading(false));
    }
};

export const logout = () => (dispatch) => {
    localStorage.removeItem("name");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    dispatch(clearAuth());
};

export default authSlice.reducer;
