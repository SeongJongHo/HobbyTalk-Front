import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LoginForm } from '@/features/auth';
import { HomeLogo } from '@/shared/ui';
import './LoginPage.css';
import { useAppNavigation } from '@/shared/lib/navigation/useAppNavigation';
import { useAuthStore } from '@/entities/user/store/useAuthStore';

export const LoginPage: React.FC = () => {
    const { goToHome } = useAppNavigation();
    const { token } = useAuthStore();

    useEffect(() => {
        if (token) {
            goToHome();
        }
    }, [token, goToHome]);

    const handleLoginSuccess = () => {
        goToHome();
    };

    const handleLoginError = (error: string) => {
        alert(error);
    };

    return (
        <div className="login-page">
            <HomeLogo variant="auth" />
            <div className="login-card">
                <div className="login-header">
                    <h1>로그인</h1>
                    <p>오픈채팅으로 취미를 공유하세요</p>
                </div>
                <div className="auth-section">
                    <LoginForm
                        onSuccess={handleLoginSuccess}
                        onError={handleLoginError}
                    />
                </div>
                <div className="navigation-section">
                    <p>계정이 없으신가요?</p>
                    <Link to="/signup" className="nav-link">
                        회원가입
                    </Link>
                </div>
            </div>
        </div>
    );
};
