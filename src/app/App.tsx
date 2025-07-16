import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginPage } from '@/pages/login';
import './styles/global.css';
import { SignupPage } from '@/pages/signup';
import { HomePage } from '@/pages/home';
import { MessagesPage } from '@/pages/messages';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/messages" element={<MessagesPage />} />
            </Routes>
        </Router>
    );
}

export default App;
