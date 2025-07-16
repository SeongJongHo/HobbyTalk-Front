import { apiClient } from "../../../shared/lib/api/apiClient";
import { type Category } from "@/entities/category";

export const categoryApi = {
    async getCategories(): Promise<Category[]> {
        const response = await apiClient.get("/api/query/v1/categories");
        console.log("전체 카테고리 API 응답:", response.data);
        // API 응답 구조: { message: "Success", status: 200, data: [...] }
        return response.data.data;
    },

    async getTrendingTopics(): Promise<Category[]> {
        const response = await apiClient.get(
            "/api/query/v1/categories/trending"
        );
        console.log("API 응답:", response.data);
        // API 응답 구조: { message: "Success", status: 200, data: [...] }
        return response.data.data;
    },
};
