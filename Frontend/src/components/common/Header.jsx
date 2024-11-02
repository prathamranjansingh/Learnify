import React from 'react';
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center px-4">
        <a href="#" className="flex items-center gap-2">
          <img
            src="https://via.placeholder.com/32x32"
            alt="Class Central Logo"
            className="h-8 w-8"
          />
          <span className="text-xl font-bold">Class Central</span>
        </a>
        <nav className="ml-auto flex gap-4">
          <Button variant="ghost">Sign In</Button>
          <Button>Sign Up</Button>
        </nav>
      </div>
    </header>
  );
}