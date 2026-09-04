'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { Brain } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName || !email || !password) {
      setError('Semua kolom wajib diisi.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Format email tidak valid.');
      return;
    }

    if (password.length < 6) {
      setError('Password minimal harus 6 karakter.');
      return;
    }

    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    setLoading(false);

    if (signUpError) {
      if (signUpError.message.includes('already registered')) {
        setError('Email sudah terdaftar.');
      } else {
        setError(signUpError.message);
      }
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
          <h2 className="text-xl font-bold text-foreground">Buat Akun Baru</h2>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 p-3 rounded-2xl text-sm mb-4 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1">Nama Lengkap</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 border-2 border-border-warm rounded-2xl focus:outline-none focus:border-primary text-foreground placeholder:text-foreground/40 bg-white shadow-inner"
              placeholder="John Doe"
            />
          </div>

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
              placeholder="Minimal 6 karakter"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-full py-3.5 font-bold shadow-md"
          >
            {loading ? 'Memproses...' : 'Daftar'}
          </Button>
        </form>

        <p className="text-center text-sm text-foreground/70 mt-6 font-medium">
          Sudah punya akun?{' '}
          <Link href="/login" className="text-primary font-bold hover:underline">
            Masuk
          </Link>
        </p>
      </Card>
    </div>
  );
}