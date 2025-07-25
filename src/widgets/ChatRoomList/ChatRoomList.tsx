﻿import React, { useState, useEffect, useCallback } from 'react';
import { useChatRooms } from '@/features/chatRoom';
import { chatRoomApi } from '@/features/chatRoom/api/chatRoomApi';
import { useCategoryStore } from '@/entities/category/store/useCategoryStore';
import { CreateRoomModal } from '@/widgets/CreateRoomModal';
import type { CreateRoomData } from '@/widgets/CreateRoomModal';
import { useAuthCheck } from '@/shared/lib/auth/authUtils';
import { useNavigate } from 'react-router-dom';
import './ChatRoomList.css';

export const ChatRoomList: React.FC = () => {
    const navigate = useNavigate();
    const { checkAuth } = useAuthCheck();

    const [selectedCategory, setSelectedCategory] = useState<number | null>(
        null
    );
    const [allRooms, setAllRooms] = useState<any[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [lastCreatedAt, setLastCreatedAt] = useState<string | null>(null);

    const [inputValue, setInputValue] = useState('');
    const [isSearchMode, setIsSearchMode] = useState(false);
    const [currentSearchTerm, setCurrentSearchTerm] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const roomsPerPage = 20;

    const { categories, fetchCategories, clearCategories } = useCategoryStore();

    const resetPagination = useCallback(() => {
        setAllRooms([]);
        setLastCreatedAt(null);
        setHasMore(true);
    }, []);

    const resetSearch = useCallback(() => {
        setInputValue('');
        setIsSearchMode(false);
        setCurrentSearchTerm('');
    }, []);

    useEffect(() => {
        clearCategories();
        fetchCategories();
    }, [fetchCategories, clearCategories]);

    const addRoomsToList = useCallback(
        (newRooms: any[], isNewSearch = false) => {
            setAllRooms(prevRooms => {
                if (isNewSearch) {
                    return newRooms;
                }

                const existingIds = new Set(prevRooms.map(room => room.id));
                const uniqueNewRooms = newRooms.filter(
                    room => !existingIds.has(room.id)
                );
                return [...prevRooms, ...uniqueNewRooms];
            });

            if (newRooms.length > 0) {
                setLastCreatedAt(newRooms[newRooms.length - 1].created_at);
            }

            if (newRooms.length < roomsPerPage) {
                setHasMore(false);
            }
        },
        [roomsPerPage]
    );

    const { rooms, loading, error, refetch } = useChatRooms({
        category_id: selectedCategory || undefined,
        search: '',
        last_created_at: lastCreatedAt || undefined,
        limit: roomsPerPage,
    });

    useEffect(() => {
        if (rooms && !isSearchMode) {
            addRoomsToList(rooms, lastCreatedAt === null);

            if (lastCreatedAt === null && rooms.length === 0) {
                setHasMore(false);
            }
        }
    }, [rooms, lastCreatedAt, isSearchMode, addRoomsToList]);

    const handleJoinRoom = useCallback(
        (room: any) => {
            if (!checkAuth(navigate)) {
                return;
            }

            const isFull =
                (room.current_attendance || 0) >= (room.maximum_capacity || 0);
            if (isFull) {
                alert('이 채팅방은 만원입니다.');
                return;
            }

            alert('아직 제공되지 않는 기능입니다.');
            return;
        },
        [checkAuth, navigate]
    );

    const handleCreateRoom = useCallback(
        async (data: CreateRoomData) => {
            try {
                await chatRoomApi.createChatRoom(data);

                alert('채팅방이 성공적으로 생성되었습니다!');

                navigate('/messages');
            } catch (error: any) {
                alert(
                    error.message ||
                        '채팅방 생성에 실패했습니다. 다시 시도해주세요.'
                );
            }
        },
        [navigate]
    );

    const openCreateModal = useCallback(() => {
        if (!checkAuth(navigate)) {
            return;
        }
        setIsCreateModalOpen(true);
    }, [checkAuth, navigate]);

    const closeCreateModal = useCallback(() => {
        setIsCreateModalOpen(false);
    }, []);

    const loadMoreData = useCallback(async () => {
        if (searchLoading) return;

        try {
            setSearchLoading(true);

            const params = {
                category_id: selectedCategory || undefined,
                search: isSearchMode ? currentSearchTerm : '',
                last_created_at: lastCreatedAt || undefined,
                limit: roomsPerPage,
            };

            const results = await chatRoomApi.getChatRooms(params);
            addRoomsToList(results);
        } catch (error) {
            console.error('데이터 로드 실패:', error);
        } finally {
            setSearchLoading(false);
        }
    }, [
        searchLoading,
        selectedCategory,
        isSearchMode,
        currentSearchTerm,
        lastCreatedAt,
        roomsPerPage,
        addRoomsToList,
    ]);

    const handleScroll = useCallback(() => {
        if (loading || searchLoading || !hasMore) return;

        const scrollTop =
            window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        if (scrollTop + windowHeight >= documentHeight - 1000) {
            if (isSearchMode) {
                loadMoreData();
            } else {
                refetch();
            }
        }
    }, [loading, searchLoading, hasMore, isSearchMode, loadMoreData, refetch]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    const handleCategoryChange = (category: number | null) => {
        setSelectedCategory(category);
        resetSearch();
        resetPagination();
    };

    const executeSearch = async () => {
        const searchTerm = inputValue.trim();

        if (!searchTerm) {
            resetSearch();
            resetPagination();
            refetch();
            return;
        }

        if (searchTerm.length < 2) {
            alert('검색어는 2글자 이상 입력해주세요.');
            return;
        }

        try {
            setIsSearchMode(true);
            setCurrentSearchTerm(searchTerm);
            resetPagination();
            setSearchLoading(true);

            const searchResults = await chatRoomApi.getChatRooms({
                category_id: selectedCategory || undefined,
                search: searchTerm,
                limit: roomsPerPage,
            });

            addRoomsToList(searchResults, true);
        } catch (error) {
            console.error('검색 실패:', error);
            alert('검색 중 오류가 발생했습니다.');
        } finally {
            setSearchLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            executeSearch();
        }
    };

    const handleClearSearch = () => {
        resetSearch();
        resetPagination();
        refetch();
    };

    if (error) {
        return (
            <div className="error-message">오류가 발생했습니다: {error}</div>
        );
    }

    return (
        <div className="chat-room-list">
            <div className="room-list-header">
                <div className="header-title">
                    <h2>오픈 채팅방</h2>
                </div>

                <div className="header-actions">
                    <div className="search-section">
                        <input
                            type="text"
                            placeholder="채팅방 제목, 설명으로 검색... (2글자 이상)"
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="room-search-input"
                        />
                        {inputValue && (
                            <button
                                onClick={handleClearSearch}
                                className="clear-search-btn"
                                title="검색 초기화"
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    <button onClick={executeSearch} className="search-btn">
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <path
                                d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        검색
                    </button>

                    <button
                        className="create-room-btn"
                        onClick={openCreateModal}
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <path
                                d="M12 5V19M5 12H19"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        방 만들기
                    </button>
                </div>
            </div>

            <div className="category-filter">
                <button
                    key="all"
                    className={`category-btn ${
                        selectedCategory === null ? 'active' : ''
                    }`}
                    onClick={() => handleCategoryChange(null)}
                >
                    전체
                </button>

                {Array.isArray(categories) &&
                    categories.map(category => (
                        <button
                            key={category.id}
                            className={`category-btn ${
                                selectedCategory === category.id ? 'active' : ''
                            }`}
                            onClick={() => handleCategoryChange(category.id)}
                        >
                            {category.name}
                        </button>
                    ))}
            </div>

            {(selectedCategory || currentSearchTerm) && (
                <div className="active-filters">
                    {selectedCategory && (
                        <span className="filter-tag">
                            카테고리:{' '}
                            {categories.find(cat => cat.id === selectedCategory)
                                ?.name || '알 수 없음'}
                            <button onClick={() => handleCategoryChange(null)}>
                                ✕
                            </button>
                        </span>
                    )}
                    {currentSearchTerm && (
                        <span className="filter-tag">
                            검색: "{currentSearchTerm}"
                            <button onClick={handleClearSearch}>✕</button>
                        </span>
                    )}
                </div>
            )}

            <div className="rooms-grid">
                {allRooms.map(room => (
                    <div key={room.id} className="room-card">
                        <div className="room-header">
                            <div className="room-info">
                                <div className="room-category">
                                    {room.category || '기타'}
                                </div>
                                {room.is_private && (
                                    <span className="private-badge">
                                        🔒 비공개
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="room-content">
                            <h3 className="room-title">{room.title}</h3>
                            <p className="room-description">
                                {room.description}
                            </p>
                        </div>

                        <div className="room-footer">
                            <div className="room-footer-left">
                                <div className="room-tags">
                                    {room.hashtags &&
                                        room.hashtags.map(
                                            (tag: string, index: number) => (
                                                <span
                                                    key={index}
                                                    className="room-tag"
                                                >
                                                    #{tag}
                                                </span>
                                            )
                                        )}
                                </div>
                                <div className="room-meta">
                                    <div className="room-status">
                                        {room.status === 'active' && (
                                            <span className="status-active">
                                                🟢 활성
                                            </span>
                                        )}
                                        {room.status === 'inactive' && (
                                            <span className="status-inactive">
                                                ⚫ 비활성
                                            </span>
                                        )}
                                        {(room.current_attendance || 0) >=
                                            (room.maximum_capacity || 0) && (
                                            <span className="status-full">
                                                🔴 만원
                                            </span>
                                        )}
                                    </div>
                                    <div className="room-participants-footer">
                                        <span className="participants-text">
                                            👥 {room.current_attendance || 0}/
                                            {room.maximum_capacity || 0}명
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="room-actions">
                                <button
                                    className="join-room-btn"
                                    onClick={() => handleJoinRoom(room)}
                                    disabled={
                                        (room.current_attendance || 0) >=
                                        (room.maximum_capacity || 0)
                                    }
                                >
                                    {(room.current_attendance || 0) >=
                                    (room.maximum_capacity || 0)
                                        ? '🔴 만원'
                                        : room.is_private
                                        ? '🔒 비밀번호 입력'
                                        : '🚪 입장하기'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {(loading || searchLoading) && (
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <span>
                        {searchLoading
                            ? '검색 중...'
                            : '채팅방을 불러오는 중...'}
                    </span>
                </div>
            )}

            {!hasMore && allRooms.length > 0 && (
                <div className="no-more-data">모든 채팅방을 불러왔습니다.</div>
            )}

            {!loading && !searchLoading && allRooms.length === 0 && (
                <div className="no-data">
                    <div className="no-data-icon">💬</div>
                    {isSearchMode ? (
                        <>
                            <h3>검색 결과가 없습니다</h3>
                            <p>
                                "{currentSearchTerm}"에 대한 채팅방을 찾을 수
                                없습니다.
                            </p>
                            <button
                                className="create-first-room-btn"
                                onClick={handleClearSearch}
                            >
                                전체 채팅방 보기
                            </button>
                        </>
                    ) : (
                        <>
                            <h3>채팅방이 없습니다</h3>
                            <p>첫 번째 채팅방을 만들어보세요!</p>
                            <button
                                className="create-first-room-btn"
                                onClick={openCreateModal}
                            >
                                방 만들기
                            </button>
                        </>
                    )}
                </div>
            )}

            <CreateRoomModal
                isOpen={isCreateModalOpen}
                onClose={closeCreateModal}
                onSubmit={handleCreateRoom}
            />
        </div>
    );
};
