import axios from "axios";

const BASE_URL = import.meta.env.API_BASE_URL;

export const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});
