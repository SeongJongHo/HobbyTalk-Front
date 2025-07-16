type CategoryState = {
    categories: Category[];
    lastUpdated: string | null;
    isLoading: boolean;
    error: string | null;
    fetchCategories: () => Promise<void>;
    refreshCategories: () => Promise<void>;
    clearCategories: () => void;
};

import { create } from 'zustand';
import { categoryApi } from '@/features/category/api/categoryApi';
import { persist } from 'zustand/middleware';
import type { Category } from '@/entities/category';

export const useCategoryStore = create<CategoryState>()(
    persist(
        (set, get) => ({
            categories: [],
            lastUpdated: null,
            isLoading: false,
            error: null,

            fetchCategories: async () => {
                const { lastUpdated } = get();

                if (lastUpdated) {
                    const oneHour = 60 * 60 * 1000;
                    const now = new Date().getTime();
                    const lastUpdateTime = new Date(lastUpdated).getTime();

                    if (now - lastUpdateTime < oneHour) {
                        return;
                    }
                }

                set({ isLoading: true, error: null });

                try {
                    const categories = await categoryApi.getCategories();
                    set({
                        categories: categories,
                        lastUpdated: new Date().toISOString(),
                        isLoading: false,
                        error: null,
                    });
                } catch (error) {
                    console.error('Error fetching categories:', error);
                }
            },

            refreshCategories: async () => {
                set({ isLoading: true, error: null });

                try {
                    const categories = await categoryApi.getCategories();
                    set({
                        categories,
                        lastUpdated: new Date().toISOString(),
                        isLoading: false,
                        error: null,
                    });
                } catch (error) {
                    set({
                        isLoading: false,
                        error:
                            error instanceof Error
                                ? error.message
                                : '카테고리를 불러오는데 실패했습니다.',
                    });
                }
            },

            clearCategories: () => {
                set({
                    categories: [],
                    lastUpdated: null,
                    error: null,
                });
            },
        }),
        {
            name: 'categories-storage',
            storage: {
                getItem: name => {
                    const value = localStorage.getItem(name);
                    return value ? JSON.parse(value) : null;
                },
                setItem: (name, value) => {
                    localStorage.setItem(name, JSON.stringify(value));
                },
                removeItem: name => {
                    localStorage.removeItem(name);
                },
            },
        }
    )
);
