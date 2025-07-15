import React from 'react';
import { Lock, User } from 'lucide-react';
import { Input, Button } from '@/shared/ui';
import './LoginForm.css';
import { useLoginForm } from '../../hook/useLoginForm';
import { useLoginMutation } from '../../hook/useLoginMutation';

interface LoginFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onError }) => {
  const { credentials, handleInputChange } = useLoginForm();
  const { submit, loading } = useLoginMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit(credentials, onSuccess, onError);
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <Input
        icon={User}
        type="text"
        name="username"
        placeholder="사용자명"
        value={credentials.username}
        onChange={handleInputChange}
        required
      />
      <Input
        icon={Lock}
        type="password"
        name="password"
        placeholder="비밀번호"
        value={credentials.password}
        onChange={handleInputChange}
        required
      />
      <Button
        type="submit"
        fullWidth
        loading={loading}
      >
        로그인
      </Button>
    </form>
  );
};
