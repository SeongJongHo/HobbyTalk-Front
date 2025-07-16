export interface ChatRoom {
    id: number;
    title: string;
    maximum_capacity: number;
    current_attendance: number;
    category: string;
    created_at: string;
    is_private: boolean;
}
