import React, { useState, useEffect, useCallback } from 'react';
import { useChatRooms } from '@/features/chatRoom';
import { chatRoomApi } from '@/features/chatRoom/api/chatRoomApi';
import { useCategoryStore } from '@/entities/category/store/useCategoryStore';
import { CreateRoomModal } from '@/widgets/CreateRoomModal';
import type { CreateRoomData } from '@/widgets/CreateRoomModal';
import './ChatRoomList.css';

export const ChatRoomList: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null
    );
    const [lastCreatedAt, setLastCreatedAt] = useState<string | null>(null);
    const [allRooms, setAllRooms] = useState<any[]>([]);
    const [hasMore, setHasMore] = useState(true);

    const [inputValue, setInputValue] = useState('');
    const [isSearchMode, setIsSearchMode] = useState(false);
    const [currentSearchTerm, setCurrentSearchTerm] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const roomsPerPage = 20;

    const { categories, fetchCategories, clearCategories } = useCategoryStore();

    useEffect(() => {
        clearCategories();
        fetchCategories();
    }, [fetchCategories, clearCategories]);

    const { rooms, loading, error, refetch } = useChatRooms({
        categoryId: selectedCategory || undefined,
        search: '',
        lastCreatedAt: lastCreatedAt || undefined,
        limit: roomsPerPage,
    });

    useEffect(() => {
        if (rooms && rooms.length > 0 && !isSearchMode) {
            setAllRooms(prevRooms => {
                const existingIds = new Set(prevRooms.map(room => room.id));
                const newRooms = rooms.filter(
                    room => !existingIds.has(room.id)
                );

                if (lastCreatedAt === null) {
                    return rooms;
                } else {
                    return [...prevRooms, ...newRooms];
                }
            });

            if (rooms.length < roomsPerPage) {
                setHasMore(false);
            }

            if (rooms.length > 0) {
                setLastCreatedAt(rooms[rooms.length - 1].created_at);
            }
        }
    }, [rooms, lastCreatedAt, roomsPerPage, isSearchMode]);

    const handleJoinRoom = useCallback((room: any) => {
        const isFull =
            (room.current_attendance || 0) >= (room.maximum_capacity || 0);

        if (isFull) {
            alert('이 채팅방은 만원입니다.');
            return;
        }

        alert('아직 구현되지 않은 기능입니다.');
    }, []);

    const handleCreateRoom = useCallback(async (data: CreateRoomData) => {
        try {
            await chatRoomApi.createChatRoom(data);

            alert('채팅방이 성공적으로 생성되었습니다!');

            setAllRooms([]);
            setLastCreatedAt(null);
            setHasMore(true);
        } catch (error: any) {
            alert(
                error.message ||
                    '채팅방 생성에 실패했습니다. 다시 시도해주세요.'
            );
        }
    }, []);

    const openCreateModal = useCallback(() => {
        setIsCreateModalOpen(true);
    }, []);

    const closeCreateModal = useCallback(() => {
        setIsCreateModalOpen(false);
    }, []);

    const handleScroll = useCallback(() => {
        if (loading || !hasMore || isSearchMode) return;

        const scrollTop =
            window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        if (scrollTop + windowHeight >= documentHeight - 1000) {
            refetch();
        }
    }, [loading, hasMore, refetch, isSearchMode]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    const handleCategoryChange = (category: string | null) => {
        setSelectedCategory(category);
        setIsSearchMode(false);
        setCurrentSearchTerm('');
        setAllRooms([]);
        setLastCreatedAt(null);
        setHasMore(true);
    };

    const executeSearch = async () => {
        const searchTerm = inputValue.trim();

        if (!searchTerm) {
            setIsSearchMode(false);
            setCurrentSearchTerm('');
            setAllRooms([]);
            setLastCreatedAt(null);
            setHasMore(true);
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
            setAllRooms([]);
            setLastCreatedAt(null);
            setHasMore(false);
            setSearchLoading(true);

            const searchResults = await chatRoomApi.getChatRooms({
                categoryId: selectedCategory || undefined,
                search: searchTerm,
                limit: 100,
            });

            setAllRooms(searchResults);
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
        setInputValue('');
        setIsSearchMode(false);
        setCurrentSearchTerm('');
        setAllRooms([]);
        setLastCreatedAt(null);
        setHasMore(true);
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
                                selectedCategory === category.name
                                    ? 'active'
                                    : ''
                            }`}
                            onClick={() => handleCategoryChange(category.name)}
                        >
                            {category.name}
                        </button>
                    ))}
            </div>

            {(selectedCategory || currentSearchTerm) && (
                <div className="active-filters">
                    {selectedCategory && (
                        <span className="filter-tag">
                            카테고리: {selectedCategory}
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
