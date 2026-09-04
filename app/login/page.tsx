'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { Brain } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Email dan password wajib diisi.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Format email tidak valid.');
      return;
    }

    setLoading(true);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError('Email atau password salah.');
      return;
    }

    if (data.user) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-lg border-2 border-border-warm">
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm">
              <Brain className="w-5 h-5" />
            </div>
            <span className="text-2xl font-bold text-primary font-heading">QuizAI</span>
          </Link>
          <h2 className="text-xl font-bold text-foreground">Masuk ke Akun</h2>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 p-3 rounded-2xl text-sm mb-4 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-border-warm rounded-2xl focus:outline-none focus:border-primary text-foreground placeholder:text-foreground/40 bg-white shadow-inner"
              placeholder="nama@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-border-warm rounded-2xl focus:outline-none focus:border-primary text-foreground placeholder:text-foreground/40 bg-white shadow-inner"
              placeholder="••••••••"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-full py-3.5 font-bold shadow-md"
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </Button>
        </form>

        <p className="text-center text-sm text-foreground/70 mt-6 font-medium">
          Belum punya akun?{' '}
          <Link href="/register" className="text-primary font-bold hover:underline">
            Daftar
          </Link>
        </p>
      </Card>
    </div>
  );
}