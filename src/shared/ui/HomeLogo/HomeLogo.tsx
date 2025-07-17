import React from 'react';
import { Link } from 'react-router-dom';
import './HomeLogo.css';

interface HomeLogoProps {
    variant?: 'header' | 'auth';
    className?: string;
}

export const HomeLogo: React.FC<HomeLogoProps> = ({
    variant = 'header',
    className = '',
}) => {
    return (
        <Link to="/" className={`home-logo home-logo--${variant} ${className}`}>
            <span className="home-logo__icon">🗣️</span>
            <span className="home-logo__text">HobbyTalk</span>
        </Link>
    );
};
