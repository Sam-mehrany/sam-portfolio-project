"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/projects', label: 'Projects' },
    { href: '/blog', label: 'Blog' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Sam Mehrany
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-muted-foreground transition-colors hover:text-foreground",
                // This logic correctly highlights the active page, including sub-pages like a single project.
                (pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))) && "text-foreground font-semibold"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="hidden md:flex">
            {/* This link now correctly points to the project request form on the homepage */}
            <Link href="/#project-request">
                <Button>Request a Project</Button>
            </Link>
        </div>
      </nav>
    </header>
  );
}
