import type { LoginCredentials, SignupRequest } from "@/entities/user";
import { apiClient } from "@/shared/lib/api/apiClient";

export const authApi = {
    login: async (credentials: LoginCredentials): Promise<string> => {
        try {
            const response = await apiClient.post(
                "/api/v1/auth/sign-in",
                credentials
            );

            return response.data.token;
        } catch (error: any) {
            if (error.response?.status === 401) {
                throw new Error(
                    error.response?.message ||
                        "로그인 정보가 올바르지 않습니다."
                );
            }

            throw new Error("로그인 중 오류가 발생했습니다.");
        }
    },

    signup: async (data: SignupRequest): Promise<void> => {
        try {
            await apiClient.post("/api/v1/auth/sign-up", data);
        } catch (error: any) {
            if (error.response?.status) {
                throw new Error(
                    error.response?.message ||
                        "회원가입 정보가 올바르지 않습니다."
                );
            }

            throw new Error("회원가입 중 오류가 발생했습니다.");
        }
    },
};
