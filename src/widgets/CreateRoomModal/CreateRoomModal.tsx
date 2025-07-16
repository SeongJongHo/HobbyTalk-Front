import React, { useState, useEffect } from 'react';
import { useCategoryStore } from '@/entities/category/store/useCategoryStore';
import './CreateRoomModal.css';

interface CreateRoomModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateRoomData) => Promise<void>;
}

export interface CreateRoomData {
    title: string;
    notice?: string;
    category_id: number;
    maximum_capacity: number;
    password?: string;
}

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
}) => {
    const [formData, setFormData] = useState<CreateRoomData>({
        title: '',
        notice: '',
        category_id: 1,
        maximum_capacity: 2,
        password: '',
    });
    const [isPrivate, setIsPrivate] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { categories, fetchCategories } = useCategoryStore();

    useEffect(() => {
        if (isOpen) {
            fetchCategories();
        }
    }, [isOpen, fetchCategories]);

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]:
                name === 'category_id' || name === 'maximum_capacity'
                    ? parseInt(value) || 0
                    : value,
        }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handlePrivateToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsPrivate(e.target.checked);
        if (!e.target.checked) {
            setFormData(prev => ({ ...prev, password: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = '채팅방 제목은 필수입니다.';
        }

        if (!formData.category_id) {
            newErrors.category_id = '카테고리를 선택해주세요.';
        }

        if (formData.maximum_capacity < 2) {
            newErrors.maximum_capacity = '최대 인원은 2명 이상이어야 합니다.';
        }

        if (isPrivate && !formData.password?.trim()) {
            newErrors.password = '비공개 채팅방은 비밀번호가 필요합니다.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm() || isSubmitting) {
            return;
        }

        const submitData = {
            ...formData,
            password: isPrivate ? formData.password : undefined,
            notice: formData.notice?.trim() || undefined,
        };

        setIsSubmitting(true);
        try {
            await onSubmit(submitData);
            handleClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (isSubmitting) return;

        setFormData({
            title: '',
            notice: '',
            category_id: 1,
            maximum_capacity: 2,
            password: '',
        });
        setIsPrivate(false);
        setErrors({});
        setIsSubmitting(false);
        onClose();
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
            <div className="modal-content">
                <div className="modal-header">
                    <h2>새 채팅방 만들기</h2>
                    <button className="modal-close-btn" onClick={handleClose}>
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="create-room-form">
                    <div className="form-group">
                        <label htmlFor="title">채팅방 제목 *</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="채팅방 제목을 입력하세요"
                            className={errors.title ? 'error' : ''}
                        />
                        {errors.title && (
                            <span className="error-message">
                                {errors.title}
                            </span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="category_id">카테고리 *</label>
                        <select
                            id="category_id"
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleInputChange}
                            className={errors.category_id ? 'error' : ''}
                        >
                            <option value="">카테고리를 선택하세요</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        {errors.category_id && (
                            <span className="error-message">
                                {errors.category_id}
                            </span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="maximum_capacity">최대 인원 *</label>
                        <input
                            type="number"
                            id="maximum_capacity"
                            name="maximum_capacity"
                            value={formData.maximum_capacity}
                            onChange={handleInputChange}
                            min="2"
                            max="100"
                            className={errors.maximum_capacity ? 'error' : ''}
                        />
                        {errors.maximum_capacity && (
                            <span className="error-message">
                                {errors.maximum_capacity}
                            </span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="notice">공지사항</label>
                        <textarea
                            id="notice"
                            name="notice"
                            value={formData.notice}
                            onChange={handleInputChange}
                            placeholder="채팅방 공지사항을 입력하세요 (선택사항)"
                            rows={3}
                        />
                    </div>

                    <div className="form-group">
                        <div className="checkbox-group">
                            <input
                                type="checkbox"
                                id="is_private"
                                checked={isPrivate}
                                onChange={handlePrivateToggle}
                            />
                            <label htmlFor="is_private">비공개 채팅방</label>
                        </div>
                    </div>

                    {isPrivate && (
                        <div className="form-group">
                            <label htmlFor="password">비밀번호 *</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="채팅방 비밀번호를 입력하세요"
                                className={errors.password ? 'error' : ''}
                            />
                            {errors.password && (
                                <span className="error-message">
                                    {errors.password}
                                </span>
                            )}
                        </div>
                    )}

                    <div className="modal-actions">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="cancel-btn"
                            disabled={isSubmitting}
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className="create-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? '생성 중...' : '채팅방 만들기'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
