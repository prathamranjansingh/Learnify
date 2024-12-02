import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { UserProvider } from './context/UserContext.jsx';
import CourseListing from './pages/CourseListing';
import CourseDetail from './pages/CourseDetail';
import AuthPage from './pages/AuthPage';
import Header from './components/common/Header';
import { Toaster } from './components/ui/toaster.jsx';
import LeaderBoard from './pages/LeaderBoard.jsx';
import ProfilePage from './pages/Profile.jsx';


function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth'; // Check if on AuthPage route

  return (
    <>
      {!isAuthPage && <Header />} 
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={<CourseListing />} />
        <Route path="/courses/:courseId" element={<CourseDetail />} />
        <Route path="/courses/:courseId/leaderboard" element={<LeaderBoard />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <UserProvider>
      <Router>
        <AppContent />
        <Toaster />
      </Router>
    </UserProvider>
  );
}

export default App;
