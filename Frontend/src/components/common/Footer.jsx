import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container grid gap-8 px-4 py-8 md:grid-cols-4">
        <div>
          <h4 className="mb-4 font-semibold">Browse by subject</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Art & Design
              </a>
            </li>
            <li>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Business
              </a>
            </li>
            <li>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Computer Science
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 font-semibold">Browse by provider</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Smithsonian
              </a>
            </li>
            <li>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Harvard
              </a>
            </li>
            <li>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                MIT
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 font-semibold">About</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Help Center
              </a>
            </li>
            <li>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Contact
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 font-semibold">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Cookie Policy
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}