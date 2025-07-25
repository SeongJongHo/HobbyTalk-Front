import type { LoginCredentials, SignupRequest } from '@/entities/user';
import { apiClient } from '@/shared/lib/api/apiClient';

export const authApi = {
    login: async (credentials: LoginCredentials): Promise<string> => {
        try {
            const response = await apiClient.post(
                '/api/command/v1/auth/sign-in',
                credentials
            );

            return response.data.data.access_token;
        } catch (error: any) {
            if (error.response?.data?.status) {
                console.error('Login error:', error);
                throw new Error(
                    error.response?.data?.message ||
                        '로그인 정보가 올바르지 않습니다.'
                );
            }

            throw new Error('로그인 중 오류가 발생했습니다.');
        }
    },

    signup: async (data: SignupRequest): Promise<void> => {
        try {
            await apiClient.post('/api/command/v1/auth/sign-up', data);
        } catch (error: any) {
            if (error.response?.data?.status) {
                throw new Error(
                    error.response?.data?.message ||
                        '회원가입 정보가 올바르지 않습니다.'
                );
            }

            throw new Error('회원가입 중 오류가 발생했습니다.');
        }
    },
};
