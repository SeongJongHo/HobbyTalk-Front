import React, { useEffect, useState } from 'react';
import { categoryApi } from '@/features/category/api/categoryApi';
import type { Category } from '@/entities/category';
import './Categories.css';

export const Categories: React.FC = () => {
  const [trendingTopics, setTrendingTopics] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrendingTopics = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const topics = await categoryApi.getTrendingTopics();
        setTrendingTopics(topics);
      } catch (err) {
        setError(err instanceof Error ? err.message : '트렌딩 카테고리를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingTopics();
  }, []);

  if (isLoading) {
    return (
      <div className="categories-widget">
        <div className="loading-state">
          <p>인기 카테고리를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="categories-widget">
        <div className="error-state">
          <p>오류가 발생했습니다: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="categories-widget">
      <div className="categories-list">
        {Array.isArray(trendingTopics) && trendingTopics.length > 0 ? (
          trendingTopics.map((category) => (
            <div key={category.id} className="category-item">
              <div className="category-info">
                <span className="category-name">{category.name}</span>
                <span className="category-count">{category.open_chat_room_count.toLocaleString()}개 채팅방</span>
              </div>
              <button className="join-btn">참여</button>
            </div>
          ))
        ) : (
          <div className="no-categories">
            <p>표시할 인기 카테고리가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};
