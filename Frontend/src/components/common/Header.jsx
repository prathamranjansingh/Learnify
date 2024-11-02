// src/components/Header.js
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext"; 
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const { user, logout } = useUser(); 
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center px-4">
        <a href="/" className="flex items-center gap-2">
          <img
            src="https://via.placeholder.com/32x32"
            alt="Class Central Logo"
            className="h-8 w-8"
          />
          <span className="text-xl font-bold">Class Central</span>
        </a>
        
        <nav className="ml-auto flex gap-4 items-center">
          {user ? (
            <div className="relative">
              <button onClick={toggleDropdown} className="rounded-full bg-gray-200 p-2">
                <img
                  src="https://via.placeholder.com/32x32"
                  alt="User Avatar"
                  className="h-8 w-8 rounded-full"
                />
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-md p-2">
                  <p className="text-sm font-medium">Username: {user.username}</p>
                  <p className="text-sm">Email: {user.email}</p>
              
                  <div className="mt-2">
                    <Button variant="ghost" onClick={logout} className="w-full">
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
