import { apiClient } from "../../../shared/lib/api/apiClient";
import { type Category } from "@/entities/category";

export const categoryApi = {
    async getCategories(): Promise<Category[]> {
        const response = await apiClient.get("/api/query/v1/categories");
        return response.data;
    },

    async getTrendingTopics(): Promise<string[]> {
        const response = await apiClient.get(
            "/api/query/v1/categories/trending"
        );
        return response.data;
    },
};
