// src/components/Header.js
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext"; 
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Header() {
  const token = localStorage.getItem("token");
  const { user, logout } = useUser(); 
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, 
        },
      });
      setUserProfile(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setError("Failed to load profile data.");
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUserProfile();
  }, token);
  if (loading) {
    return <p className="text-center py-8">Loading profile...</p>;
  }

  if (error) {
    return <p className="text-center py-8 text-red-500">{error}</p>;
  }
  const { name, email, avatar, completedCourses, totalCourses, courses } = userProfile;
  const toggleDropdown = () => setShowDropdown(!showDropdown);

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between px-4">
        <a href="/" className="flex items-center gap-2">
          
          <span className="text-xl font-bold">Cambridge Institution</span>
        </a>
        
        <nav className="ml-auto flex gap-4 items-center">
          {user ? (
            <div className="relative">
              <button onClick={toggleDropdown} className="rounded-full p-2">
              <img
              src={avatar || "https://via.placeholder.com/100"}
              alt={name}
              className="h-14 w-14 rounded-full"
            />
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-md p-2">
                  
              
                  <div className="mt-2">
                    <Button className="w-full mb-4">
                    <Link to = "/profile">Profile</Link></Button>
                    <Button variant="destructive" onClick={logout} className="w-full">
                      Log Out
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Button variant="ghost"><Link to="/auth" state={{ from: location.pathname }}>
                Sign In</Link>
              </Button>
              <Button><Link to="/auth" state={{ from: location.pathname }}>Sign Up</Link></Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
