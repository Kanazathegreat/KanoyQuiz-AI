'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { Sparkles, BookOpen, Brain, ArrowRight, Zap, Target, Menu, X } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const fullName = user?.user_metadata?.full_name || user?.email || 'User';

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 sm:p-8 font-sans relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-secondary/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Floating Pill Header */}
      <div className="w-full max-w-5xl mx-auto z-50 sticky top-4 mb-8">
        <header className="bg-white/90 backdrop-blur-md rounded-full px-5 sm:px-6 py-2.5 sm:py-3 shadow-lg border border-border-warm flex items-center justify-between gap-4">
          {/* Logo Left */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white shadow-sm shrink-0">
              <Brain className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-primary font-heading tracking-wide">QuizAI</span>
          </Link>

          {/* Center Nav Items (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-background/60 p-1 rounded-full border border-border-warm/60">
            <Link
              href="/"
              className="bg-primary/10 text-primary font-bold text-sm px-4 py-1.5 rounded-full transition"
            >
              Beranda
            </Link>
            <a
              href="#fitur"
              className="text-foreground/70 hover:text-primary font-semibold text-sm px-4 py-1.5 rounded-full transition"
            >
              Fitur
            </a>
            <Link
              href="/docs"
              className="text-foreground/70 hover:text-primary font-semibold text-sm px-4 py-1.5 rounded-full transition"
            >
              Docs
            </Link>
            <Link
              href="/support"
              className="text-foreground/70 hover:text-primary font-semibold text-sm px-4 py-1.5 rounded-full transition"
            >
              Support
            </Link>
          </nav>

          {/* Right Action & Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
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
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="bg-primary/10 text-primary font-bold text-sm px-4 py-2.5 rounded-2xl"
            >
              Beranda
            </Link>
            <a
              href="#fitur"
              onClick={() => setMobileMenuOpen(false)}
              className="text-foreground/80 hover:text-primary font-semibold text-sm px-4 py-2.5 rounded-2xl"
            >
              Fitur
            </a>
            <Link
              href="/docs"
              onClick={() => setMobileMenuOpen(false)}
              className="text-foreground/80 hover:text-primary font-semibold text-sm px-4 py-2.5 rounded-2xl"
            >
              Docs
            </Link>
            <Link
              href="/support"
              onClick={() => setMobileMenuOpen(false)}
              className="text-foreground/80 hover:text-primary font-semibold text-sm px-4 py-2.5 rounded-2xl"
            >
              Support
            </Link>
          </div>
        )}
      </div>

      {/* Hero Section */}
      <main className="text-center space-y-8 max-w-3xl mx-auto z-10 pt-8 pb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/30 text-foreground font-semibold text-sm mb-2 shadow-sm border border-secondary/40">
          <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          Platform Belajar & Kuis Generatif AI #1
        </div>

        <h2 className="text-5xl md:text-6xl font-extrabold text-foreground tracking-tight leading-tight">
          Belajar Lebih Cerdas <br /> Dengan <span className="text-primary">Bantuan AI</span>
        </h2>

        <p className="text-xl text-foreground/70 max-w-2xl mx-auto font-medium">
          Tingkatkan pemahaman Anda melalui kuis interaktif dan materi yang dipersonalisasi oleh kecerdasan buatan.
        </p>

        <div className="pt-4 flex justify-center">
          {user ? (
            <Link href="/dashboard">
              <Button variant="primary" className="px-8 py-4 text-lg flex items-center gap-3">
                <BookOpen className="w-5 h-5" />
                Buka Dashboard
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          ) : (
            <Link href="/register">
              <Button variant="primary" className="px-8 py-4 text-lg flex items-center gap-3">
                <Sparkles className="w-5 h-5" />
                Mulai Belajar Sekarang
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          )}
        </div>
      </main>

      {/* Features Section */}
      <section id="fitur" className="w-full max-w-6xl mx-auto z-10 py-16">
        <div className="text-center space-y-3 mb-12">
          <h3 className="text-3xl md:text-4xl font-extrabold text-foreground">
            Kenapa Belajar Bareng <span className="text-primary">QuizAI</span>?
          </h3>
          <p className="text-foreground/70 font-medium text-lg max-w-xl mx-auto">
            Metode belajar modern yang dirancang untuk membantu Anda paham konsep lebih cepat dan menyenangkan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="flex flex-col items-center text-center p-8 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
              <Brain className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-foreground">Kuis AI Personal</h4>
            <p className="text-foreground/70 font-medium text-sm leading-relaxed">
              Buat soal latihan tak terbatas untuk topik apa saja secara instan, lengkap dengan pembahasan mendalam.
            </p>
          </Card>

          <Card className="flex flex-col items-center text-center p-8 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-secondary/30 flex items-center justify-center text-primary shadow-inner">
              <Zap className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-foreground">Belajar Cepat & Ringkas</h4>
            <p className="text-foreground/70 font-medium text-sm leading-relaxed">
              Dapatkan rangkuman poin-poin inti dari materi rumit tanpa perlu membaca buku tebal berjam-jam.
            </p>
          </Card>

          <Card className="flex flex-col items-center text-center p-8 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
              <Target className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-foreground">Pantau Perkembangan</h4>
            <p className="text-foreground/70 font-medium text-sm leading-relaxed">
              Catat histori kuis dan evaluasi tingkat pemahaman Anda lewat metrik statistik yang jelas.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
}