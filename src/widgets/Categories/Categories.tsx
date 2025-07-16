import React from 'react';
import { useCategories } from '../../features/category';
import './Categories.css';

export const Categories: React.FC = () => {
  const { categories, loading, error } = useCategories();

  if (loading) {
    return (
      <div className="categories-widget">
        <div className="loading-state">
          <p>카테고리를 불러오는 중...</p>
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
      <div className="categories-header">
        <h3>취미 카테고리</h3>
        <button className="view-all-btn">전체보기</button>
      </div>
      
      <div className="categories-list">
        {categories.map((category, index) => (
          <div key={index} className="category-item">
            <div className="category-info">
              <span className="category-name">{category.name}</span>
              <span className="category-count">{category.open_chat_room_count.toLocaleString()}명</span>
            </div>
            <button className="join-btn">참여</button>
          </div>
        ))}
      </div>
      
      <div className="categories-footer">
        <button className="explore-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 14S9.5 16 12 16S16 14 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 9H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15 9H15.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          새로운 취미 찾기
        </button>
      </div>
    </div>
  );
};
