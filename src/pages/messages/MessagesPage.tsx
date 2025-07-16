import React from 'react';
import { Header } from '../../widgets/Header';
import { MyRoomsList } from '../../widgets/MyRoomsList';
import './MessagesPage.css';

export const MessagesPage: React.FC = () => {
    return (
        <div className="messages-page">
            <Header />
            <main className="messages-main">
                <div className="messages-container">
                    <div className="messages-header">
                        <h1>내 채팅방</h1>
                        <p>참여중인 오픈채팅방 목록입니다</p>
                    </div>
                    <MyRoomsList />
                </div>
            </main>
        </div>
    );
};
