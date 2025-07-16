import React, { useEffect, useState } from 'react';
import { Header } from '../../widgets/Header';
import { ChatRoomList } from '../../widgets/ChatRoomList';
import { categoryApi } from '@/features/category/api/categoryApi';
import type { Category } from '@/entities/category';
import './HomePage.css';

export const HomePage: React.FC = () => {
    const [trendingTopics, setTrendingTopics] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchTrendingTopics = async () => {
            setIsLoading(true);
            try {
                const topics = await categoryApi.getTrendingTopics();
                setTrendingTopics(topics);
            } catch (err) {
                console.error('❌ Trending API 실패:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTrendingTopics();
    }, []);

    return (
        <div className="home-page">
            <Header />
            <div className="home-content">
                <aside className="sidebar left-sidebar">
                    <div className="trending-topics">
                        <h3>인기 취미</h3>
                        <div className="topic-list">
                            {isLoading ? (
                                <p>로딩 중...</p>
                            ) : Array.isArray(trendingTopics) &&
                              trendingTopics.length > 0 ? (
                                trendingTopics.slice(0, 5).map(topic => (
                                    <div key={topic.id} className="topic-item">
                                        <span className="topic-name">
                                            {topic.name}
                                        </span>
                                        <span className="topic-count">
                                            {topic.open_chat_room_count}개
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p>인기 취미가 없습니다.</p>
                            )}
                        </div>
                    </div>
                </aside>

                <main className="main-content">
                    <ChatRoomList />
                </main>
            </div>
        </div>
    );
};
