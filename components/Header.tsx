'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Button from '@/components/Button';
import { Brain, Menu, X } from 'lucide-react';

interface HeaderProps {
  activeItem?: 'home' | 'fitur' | 'docs' | 'support';
}

export default function Header({ activeItem }: HeaderProps) {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const fullName = user?.user_metadata?.full_name || user?.email || 'User';

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const navItems = [
    { label: 'Beranda', href: '/', id: 'home' },
    { label: 'Fitur', href: '/#fitur', id: 'fitur' },
    { label: 'Docs', href: '/docs', id: 'docs' },
    { label: 'Support', href: '/support', id: 'support' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto z-50 sticky top-4 mb-8">
      <header className="bg-white/90 backdrop-blur-md rounded-full px-5 sm:px-6 py-2.5 sm:py-3 shadow-lg border border-border-warm grid grid-cols-2 md:grid-cols-3 items-center gap-4">
        {/* Logo Left */}
        <Link href="/" className="flex items-center gap-2 justify-self-start">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white shadow-sm shrink-0">
            <Brain className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-primary font-heading tracking-wide">QuizAI</span>
        </Link>

        {/* Center Nav Items (Desktop) */}
        <nav className="hidden md:flex items-center justify-self-center gap-1 bg-background/60 p-1 rounded-full border border-border-warm/60">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`font-semibold text-sm px-4 py-1.5 rounded-full transition ${
                activeItem === item.id
                  ? 'bg-primary/10 text-primary font-bold'
                  : 'text-foreground/70 hover:text-primary'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Action & Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 justify-self-end">
          {user ? (
            <>
              <span className="hidden sm:inline text-xs sm:text-sm font-semibold text-foreground">Halo, {fullName}</span>
              <Button
                variant="secondary"
                onClick={handleLogout}
                className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="secondary" className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" className="px-3.5 sm:px-5 py-1.5 text-xs sm:text-sm">
                  Register
                </Button>
              </Link>
            </>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-full text-foreground hover:bg-black/5 transition"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Dropdown Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl p-4 shadow-xl border border-border-warm flex flex-col gap-2 z-50">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`font-semibold text-sm px-4 py-2.5 rounded-2xl transition ${
                activeItem === item.id
                  ? 'bg-primary/10 text-primary font-bold'
                  : 'text-foreground/80 hover:text-primary'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}