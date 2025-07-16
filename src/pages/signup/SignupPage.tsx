import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SignupForm } from '@/features/auth';
import './SignupPage.css';
import { useAppNavigation } from '@/shared/lib/navigation/useAppNavigation';
import { useAuthStore } from '@/entities/user/store/useAuthStore';

export const SignupPage: React.FC = () => {
    const { goToLogin, goToHome } = useAppNavigation();
    const { token } = useAuthStore();

    useEffect(() => {
        if (token) {
            goToHome();
        }
    }, [token, goToHome]);

    const handleSignupSuccess = () => {
        alert('회원가입이 완료되었습니다!');
        goToLogin();
    };

    const handleSignupError = (error: string) => {
        alert(error);
    };

    return (
        <div className="signup-page">
            <div className="signup-card">
                <div className="signup-header">
                    <h1>계정 만들기</h1>
                    <p>HobbyTalk에 가입하여 취미 친구들을 만나보세요</p>
                </div>
                <div className="auth-section">
                    <SignupForm
                        onSuccess={handleSignupSuccess}
                        onError={handleSignupError}
                    />
                </div>
                <div className="navigation-section">
                    <p>이미 계정이 있으신가요?</p>
                    <Link to="/login" className="nav-link">
                        로그인
                    </Link>
                </div>
            </div>
        </div>
    );
};
