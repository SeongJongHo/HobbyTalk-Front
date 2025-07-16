import { useState, useEffect } from 'react';
import { chatRoomApi } from '../api/chatRoomApi';
import type { ChatRoom } from '../../../entities/chatRoom';

export type UseChatRoomsParams = {
    categoryId?: string;
    search?: string;
    lastCreatedAt?: string;
    limit?: number;
};

type UseChatRoomsReturn = {
    rooms: ChatRoom[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
};

export const useChatRooms = (
    params: UseChatRoomsParams = {}
): UseChatRoomsReturn => {
    const [rooms, setRooms] = useState<ChatRoom[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRooms = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await chatRoomApi.getChatRooms(params);
            setRooms(data);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : '채팅방을 불러오는데 실패했습니다.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, [params.categoryId, params.search, params.lastCreatedAt, params.limit]);

    return {
        rooms,
        loading,
        error,
        refetch: fetchRooms,
    };
};
