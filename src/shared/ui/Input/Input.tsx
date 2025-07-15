import React, { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Eye, EyeOff } from 'lucide-react';
import './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
  error?: string;
  showPasswordToggle?: boolean;
}

export const Input: React.FC<InputProps> = ({ 
  icon: Icon, 
  error, 
  className = '', 
  showPasswordToggle = false,
  type = 'text',
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const inputType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type;
  const hasRightIcon = showPasswordToggle;

  return (
    <div className={`input-container ${className}`}>
      <div className="input-wrapper">
        {Icon && <Icon className="input-icon" size={20} />}
        <input
          className={`input ${Icon ? 'input-with-icon' : ''} ${hasRightIcon ? 'input-with-right-icon' : ''} ${error ? 'input-error' : ''}`}
          type={inputType}
          {...props}
        />
        {showPasswordToggle && (
          <button
            type="button"
            className="input-toggle-btn"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && <span className="input-error-text">{error}</span>}
    </div>
  );
};
