import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { UserProvider } from './context/UserContext.jsx';
import CourseListing from './pages/CourseListing';
import CourseDetail from './pages/CourseDetail';
import AuthPage from './pages/AuthPage';
import Header from './components/common/Header';


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
      </Routes>
    </>
  );
}

function App() {
  return (
    <UserProvider>
      <Router>
        <AppContent />
      </Router>
    </UserProvider>
  );
}

export default App;
