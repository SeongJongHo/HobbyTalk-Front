import React, { useState } from 'react';
import { Lock, User, Mail, Eye, EyeOff } from 'lucide-react';
import { Input, Button } from '@/shared/ui';
import type { SignupRequest } from '@/entities/user';
import { UserRole } from '@/entities/user';
import { authApi } from '@/features/auth/api/authApi';
import './SignupForm.css';

interface SignupFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onSuccess, onError }) => {
  const [formData, setFormData] = useState<SignupRequest>({
    nickname: '',
    password: '',
    password_confirm: '',
    username: '',
    phone_number: '',
    role: UserRole.USER,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: SignupRequest) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.password !== formData.password_confirm) {
      newErrors.password_confirm = '비밀번호가 일치하지 않습니다.';
    }

    if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 최소 8자 이상이어야 합니다.';
    }

    if (formData.phone_number.length < 10 || formData.phone_number.length > 11) {
      newErrors.phone_number = '전화번호는 10~11자리 숫자여야 합니다.';
    }

    if (!/^\d+$/.test(formData.phone_number)) {
      newErrors.phone_number = '전화번호는 숫자만 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    setLoading(true);

    try {
      await authApi.signup(formData);
      onSuccess?.();
    } catch (error) {
      onError?.('회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="signup-form" onSubmit={handleSubmit}>
      <Input
        icon={User}
        type="text"
        name="nickname"
        placeholder="별명"
        value={formData.nickname}
        onChange={handleInputChange}
        error={errors.nickname}
        required
      />
      <Input
        icon={User}
        type="text"
        name="username"
        placeholder="사용자명"
        value={formData.username}
        onChange={handleInputChange}
        error={errors.username}
        required
      />
      <Input
        icon={Mail}
        type="tel"
        name="phone_number"
        placeholder="전화번호 (10~11자리 숫자)"
        value={formData.phone_number}
        onChange={handleInputChange}
        error={errors.phone_number}
        required
      />
      <div className="password-input-wrapper">
        <Input
          icon={Lock}
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="비밀번호 (8자 이상)"
          value={formData.password}
          onChange={handleInputChange}
          error={errors.password}
          required
        />
        <button
          type="button"
          className="password-toggle"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      <div className="password-input-wrapper">
        <Input
          icon={Lock}
          type={showConfirmPassword ? "text" : "password"}
          name="password_confirm"
          placeholder="비밀번호 확인"
          value={formData.password_confirm}
          onChange={handleInputChange}
          error={errors.password_confirm}
          required
        />
        <button
          type="button"
          className="password-toggle"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      <Button
        type="submit"
        fullWidth
        loading={loading}
      >
        회원가입
      </Button>
    </form>
  );
};
