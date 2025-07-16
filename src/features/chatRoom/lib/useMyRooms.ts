import { useState, useEffect } from 'react';
import { chatRoomApi } from '../api/chatRoomApi';
import type { MyChatRoom } from '@/entities/chatRoom/model/types';

interface UseMyRoomsReturn {
    rooms: MyChatRoom[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export const useMyRooms = (): UseMyRoomsReturn => {
    const [rooms, setRooms] = useState<MyChatRoom[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMyRooms = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await chatRoomApi.getMyRooms();
            setRooms(data);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : '채팅방 목록을 불러오는데 실패했습니다.'
            );
            console.error('Failed to fetch my rooms:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyRooms();
    }, []);

    return {
        rooms,
        loading,
        error,
        refetch: fetchMyRooms,
    };
};
