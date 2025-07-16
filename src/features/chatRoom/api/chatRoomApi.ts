import { apiClient } from '../../../shared/lib/api/apiClient';
import type { ChatRoom } from '../../../entities/chatRoom';
import type { UseChatRoomsParams } from '../lib/useChatRooms';
import type { CreateRoomData } from '@/widgets/CreateRoomModal';

export const chatRoomApi = {
    async getChatRooms(params: UseChatRoomsParams): Promise<ChatRoom[]> {
        const defaultParams = {
            categoryId: 0,
            lastCreatedAt: Date.now(),
            limit: 20,
        };
        const mergedParams = { ...defaultParams, ...params };
        const response = await apiClient.get('/api/query/v1/open-chat-rooms', {
            params: mergedParams,
        });
        return response.data?.data || [];
    },

    async createChatRoom(data: CreateRoomData): Promise<ChatRoom> {
        try {
            const response = await apiClient.post(
                '/api/command/v1/open-chat-rooms',
                data
            );
            return response.data?.data;
        } catch (error: any) {
            if (error.response?.data?.status) {
                throw new Error(
                    error.response?.data?.message ||
                        '채팅방 생성에 실패했습니다.'
                );
            }
            throw new Error('채팅방 생성에 실패했습니다.');
        }
    },
};
