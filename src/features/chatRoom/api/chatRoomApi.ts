import { apiClient } from "../../../shared/lib/api/apiClient";
import type { ChatRoom } from "../../../entities/chatRoom";
import type { UseChatRoomsParams } from "../lib/useChatRooms";

export const chatRoomApi = {
    async getChatRooms(params: UseChatRoomsParams): Promise<ChatRoom[]> {
        const defaultParams = {
            categoryId: 0,
            lastCreatedAt: Date.now(),
            limit: 20,
        };
        const mergedParams = { ...defaultParams, ...params };
        const response = await apiClient.get("/api/query/v1/open-chat-rooms", {
            params: mergedParams,
        });
        return response.data?.data || [];
    },
};
