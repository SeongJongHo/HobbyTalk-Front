import { useState } from "react";
import { authApi } from "../api/authApi";
import { useAuthStore } from "@/entities/user";

export const useLoginMutation = () => {
    const [loading, setLoading] = useState(false);
    const setToken = useAuthStore((state) => state.setToken);
    const submit = async (
        credentials: { username: string; password: string },
        onSuccess?: () => void,
        onError?: (error: string) => void
    ) => {
        setLoading(true);

        try {
            const token = await authApi.login(credentials);
            setToken(token);
            onSuccess?.();
        } catch (e) {
            const errorMessage =
                e instanceof Error ? e.message : "로그인에 실패했습니다.";
            onError?.(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return { submit, loading };
};
