'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { Brain } from 'lucide-react';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password || !confirmPassword) {
      setError('Password baru dan konfirmasi wajib diisi.');
      return;
    }

    if (password.length < 6) {
      setError('Password minimal 6 karakter.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError('Gagal memperbarui password. Sesi reset mungkin sudah kadaluarsa.');
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
          <h2 className="text-xl font-bold text-foreground">Password Baru</h2>
        </div>

        {success ? (
          <div className="space-y-4">
            <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-4 rounded-2xl text-sm font-medium">
              Password berhasil diperbarui! Silakan masuk kembali.
            </div>
            <Link href="/login">
              <Button variant="primary" className="w-full">
                Ke Halaman Login
              </Button>
            </Link>
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
                <label className="block text-sm font-semibold text-foreground mb-1">Password Baru</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-border-warm rounded-2xl focus:outline-none focus:border-primary text-foreground placeholder:text-foreground/40 bg-white shadow-inner"
                  placeholder="Minimal 6 karakter"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-1">Konfirmasi Password Baru</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-border-warm rounded-2xl focus:outline-none focus:border-primary text-foreground placeholder:text-foreground/40 bg-white shadow-inner"
                  placeholder="Ketik ulang password"
                />
              </div>

              <Button type="submit" variant="primary" disabled={loading} className="w-full py-3.5 font-bold shadow-md">
                {loading ? 'Menyimpan...' : 'Simpan Password Baru'}
              </Button>
            </form>
          </>
        )}
      </Card>
    </div>
  );
}