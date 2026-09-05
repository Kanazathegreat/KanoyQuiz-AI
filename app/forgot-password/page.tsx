'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { Brain, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError('Email wajib diisi.');
      return;
    }

    setLoading(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (resetError) {
      setError('Gagal mengirim email reset password.');
    } else {
      setSuccess(true);
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
          <h2 className="text-xl font-bold text-foreground">Reset Password</h2>
        </div>

        {success ? (
          <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-4 rounded-2xl text-sm mb-4 font-medium">
            Jika email terdaftar, kami sudah mengirimkan link untuk reset password. Cek inbox atau folder spam ya.
          </div>
        ) : (
          <>
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

              <Button type="submit" variant="primary" disabled={loading} className="w-full py-3.5 font-bold shadow-md">
                {loading ? 'Mengirim...' : 'Kirim Link Reset'}
              </Button>
            </form>
          </>
        )}

        <p className="text-center text-sm text-foreground/70 mt-6 font-medium">
          <Link href="/login" className="text-primary font-bold hover:underline">
            &larr; Kembali ke Login
          </Link>
        </p>
      </Card>
    </div>
  );
}