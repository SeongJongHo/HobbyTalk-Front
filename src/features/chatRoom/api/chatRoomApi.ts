import { apiClient } from '../../../shared/lib/api/apiClient';
import type { ChatRoom } from '../../../entities/chatRoom';
import type { UseChatRoomsParams } from '../lib/useChatRooms';
import type { CreateRoomData } from '@/widgets/CreateRoomModal';
import type { MyChatRoom } from '@/entities/chatRoom/model/types';

export const chatRoomApi = {
    async getChatRooms(params: UseChatRoomsParams): Promise<ChatRoom[]> {
        const cleanParams: any = {
            category_id: params.category_id || 0,
            limit: params.limit || 20,
        };

        if (params.search) {
            cleanParams.search = params.search;
        }

        if (params.last_created_at) {
            cleanParams.last_created_at = params.last_created_at;
        }

        const response = await apiClient.get('/api/query/v1/open-chat-rooms', {
            params: cleanParams,
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

    async getMyRooms(params?: {
        last_created_at?: string;
        limit?: number;
    }): Promise<MyChatRoom[]> {
        const cleanParams: any = {};

        if (params?.limit) {
            cleanParams.limit = params.limit;
        }

        if (params?.last_created_at) {
            cleanParams.last_created_at = params.last_created_at;
        }

        const response = await apiClient.get(
            '/api/query/v1/open-chat-rooms/my',
            Object.keys(cleanParams).length > 0 ? { params: cleanParams } : {}
        );
        return response.data?.data || [];
    },
};
