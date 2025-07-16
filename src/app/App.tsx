import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginPage } from '@/pages/login';
import './styles/global.css';
import { SignupPage } from '@/pages/signup';
import { HomePage } from '@/pages/home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </Router>
  );
}

export default App;
