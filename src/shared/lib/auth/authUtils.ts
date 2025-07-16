import { useAuthStore } from '@/entities/user/store/useAuthStore';

export const checkAuthAndRedirect = (
    navigate: (path: string) => void
): boolean => {
    const { token } = useAuthStore.getState();

    if (!token) {
        const confirmed = window.confirm(
            '로그인 후 사용할 수 있습니다.\n로그인 페이지로 이동하시겠습니까?'
        );
        if (confirmed) {
            navigate('/login');
        }
        return false;
    }

    return true;
};

export const useAuthCheck = () => {
    const { token } = useAuthStore();

    const checkAuth = (navigate: (path: string) => void): boolean => {
        if (!token) {
            const confirmed = window.confirm(
                '로그인 후 사용할 수 있습니다.\n로그인 페이지로 이동하시겠습니까?'
            );
            if (confirmed) {
                navigate('/login');
            }
            return false;
        }
        return true;
    };

    return { token, checkAuth };
};
