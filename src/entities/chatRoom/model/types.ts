export interface ChatRoom {
    id: number;
    title: string;
    maximum_capacity: number;
    current_attendance: number;
    category: string;
    created_at: string;
    is_private: boolean;
}

export type MyChatRoom = {
    id: number;
    title: string;
    maximum_capacity: number;
    current_attendance: number;
    category: string;
    created_at: string;
    is_private: boolean;
    unread_count: number;
};
