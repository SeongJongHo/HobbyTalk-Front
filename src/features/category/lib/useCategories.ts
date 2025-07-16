import { useState, useEffect } from "react";
import { categoryApi } from "../api/categoryApi";
import type { Category } from "../../../entities/category";

interface UseCategoriesReturn {
    categories: Category[];
    trendingTopics: Category[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export const useCategories = (): UseCategoriesReturn => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [trendingTopics, setTrendingTopics] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [categoriesData, trendingData] = await Promise.all([
                categoryApi.getCategories(),
                categoryApi.getTrendingTopics(),
            ]);

            setCategories(categoriesData);
            setTrendingTopics(trendingData);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "데이터를 불러오는데 실패했습니다."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return {
        categories,
        trendingTopics,
        loading,
        error,
        refetch: fetchData,
    };
};
