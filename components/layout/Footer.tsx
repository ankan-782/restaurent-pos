"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-hairline bg-canvas text-body mt-16">
      <div className="max-w-7xl mx-auto px-sm lg:px-lg py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Column 1: Brand */}
          <div className="space-y-4 md:col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity w-fit">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                <svg className="w-5 h-5 text-on-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <span className="text-display-sm font-semibold text-ink">POS</span>
            </Link>
            <p className="text-body-sm text-body leading-relaxed max-w-[360px]">
              A modern, high-performance point-of-sale interface designed for swift and seamless restaurant order management.
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 className="text-caption-mono text-mute uppercase font-semibold tracking-wider mb-4">
              Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-body-sm hover:text-ink transition-colors">
                  Products List
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="text-body-sm hover:text-ink transition-colors">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-body-sm hover:text-ink transition-colors">
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Tech Stack */}
          <div>
            <h4 className="text-caption-mono text-mute uppercase font-semibold tracking-wider mb-4">
              Technology
            </h4>
            <ul className="space-y-2">
              <li className="text-body-sm text-body">Next.js Framework</li>
              <li className="text-body-sm text-body">Redux State Management</li>
              <li className="text-body-sm text-body">Tailwind CSS</li>
              <li className="text-body-sm text-body">Lucide React Icons</li>
            </ul>
          </div>

          {/* Column 4: Project Info */}
          <div>
            <h4 className="text-caption-mono text-mute uppercase font-semibold tracking-wider mb-4">
              System Info
            </h4>
            <ul className="space-y-2">
              <li className="text-body-sm text-body">New Order Module</li>
              <li className="text-body-sm text-body">Divergent Assessment</li>
              <li className="text-body-sm text-body">Responsive Layout</li>
              <li className="text-body-sm text-body">Persistent State</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-hairline pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-caption text-mute text-center md:text-left">
            &copy; {new Date().getFullYear()} Restaurant POS - New Order Module Assessment. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-caption-mono text-mute">v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
