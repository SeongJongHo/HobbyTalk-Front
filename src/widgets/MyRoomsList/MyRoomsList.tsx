import React from 'react';
import { useMyRooms } from '@/features/chatRoom';
import './MyRoomsList.css';

export const MyRoomsList: React.FC = () => {
    const { rooms, loading, error } = useMyRooms();

    if (loading) {
        return (
            <div className="my-rooms-loading">
                <div className="loading-spinner"></div>
                <p>채팅방 목록을 불러오는 중...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="my-rooms-error">
                <p>채팅방 목록을 불러오는데 실패했습니다.</p>
                <p>{error}</p>
            </div>
        );
    }

    if (rooms.length === 0) {
        return (
            <div className="my-rooms-empty">
                <div className="empty-icon">💬</div>
                <h3>참여중인 채팅방이 없습니다</h3>
                <p>홈에서 관심있는 채팅방에 참여해보세요!</p>
            </div>
        );
    }

    return (
        <div className="my-rooms-list">
            {rooms.map(room => (
                <div key={room.id} className="my-room-card">
                    <div className="room-info">
                        <div className="room-header">
                            <h3 className="room-title">{room.title}</h3>
                            <span className="room-category">
                                {room.category}
                            </span>
                        </div>
                        <div className="room-meta">
                            <span className="member-count">
                                👥 {room.current_attendance}/
                                {room.maximum_capacity}
                            </span>
                            <span className="created-date">
                                {new Date(room.created_at).toLocaleDateString()}
                            </span>
                            {room.unread_count > 0 && (
                                <span className="unread-badge">
                                    {room.unread_count}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
