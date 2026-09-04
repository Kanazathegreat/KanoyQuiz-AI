'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { Brain } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Material {
  explanation: string;
  keyPoints: string[];
  searchQueries: string[];
}

export default function BelajarPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<'setup' | 'loading' | 'result'>('setup');
  const [subject, setSubject] = useState('Matematika');
  const [topic, setTopic] = useState('');
  const [material, setMaterial] = useState<Material | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleGenerateMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setErrorMessage('Topik atau materi wajib diisi.');
      return;
    }

    setErrorMessage(null);
    setStep('loading');

    try {
      const res = await fetch('/api/generate-material', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, topic }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Terjadi kesalahan pada server.');
      }

setMaterial(data);
       // Save to Supabase history
       if (user) {
         supabase.from('material_history').insert({
           user_id: user.id,
           subject,
           topic,
         }).then(({ error }) => {
           if (error) console.error('Error saving material history:', error);
         });
       }
       setStep('result');
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal menghasilkan materi.');
      setStep('setup');
    }
  };

  if (!user) return null;

  return (
    <div className="p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link href="/dashboard" className="text-xl font-bold text-primary font-heading flex items-center gap-2">
            <Brain className="w-6 h-6" /> QuizAI
          </Link>
          <Link href="/dashboard" className="text-sm font-bold text-foreground/60 hover:text-primary">
            &larr; Kembali ke Dashboard
          </Link>
        </div>

        {errorMessage && step === 'setup' && (
          <div className="bg-red-50 text-red-700 border border-red-200 p-4 rounded-2xl text-sm mb-6 font-medium">
            {errorMessage}
          </div>
        )}

        {step === 'setup' && (
          <Card>
            <h2 className="text-2xl font-bold text-foreground mb-6">Mulai Belajar Materi Baru</h2>
            <form onSubmit={handleGenerateMaterial} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Mata Pelajaran</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-border-warm rounded-2xl focus:outline-none focus:border-primary text-foreground bg-white"
                >
                  <option value="Matematika">Matematika</option>
                  <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                  <option value="Bahasa Inggris">Bahasa Inggris</option>
                  <option value="IPA">IPA</option>
                  <option value="IPS">IPS</option>
                  <option value="Fisika">Fisika</option>
                  <option value="Kimia">Kimia</option>
                  <option value="Biologi">Biologi</option>
                  <option value="Sejarah">Sejarah</option>
                  <option value="Ekonomi">Ekonomi</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Materi atau Topik</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Contoh: Fotosintesis, Perang Dunia II, Turunan Fungsi..."
                  className="w-full px-4 py-3 border-2 border-border-warm rounded-2xl focus:outline-none focus:border-primary text-foreground placeholder:text-foreground/40 bg-white"
                />
              </div>

              <Button type="submit" variant="primary" className="w-full py-4 text-lg">
                Jelaskan Materi Ini
              </Button>
            </form>
          </Card>
        )}

        {step === 'loading' && (
          <Card className="text-center space-y-4 py-12">
            <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <h3 className="text-xl font-bold text-foreground">AI sedang menyiapkan materi untukmu...</h3>
            <p className="text-foreground/70 text-sm">Sedang merangkum poin-poin penting agar lebih mudah dipelajari.</p>
          </Card>
        )}

        {step === 'result' && material && (
          <div className="space-y-8">
            <Card className="space-y-6">
              <span className="bg-secondary/20 text-foreground px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {subject}
              </span>
              <h2 className="text-3xl font-bold text-foreground mt-2">{topic}</h2>

              <div className="prose prose-slate max-w-none text-foreground/80">
                <p className="leading-relaxed whitespace-pre-wrap">{material.explanation}</p>
              </div>

              <div className="bg-secondary/20 p-6 rounded-2xl border-2 border-secondary/40">
                <h3 className="text-lg font-bold text-foreground mb-4">Poin-Poin Kunci</h3>
                <ul className="space-y-2">
                  {material.keyPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-foreground">
                      <span className="text-primary mt-1">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">Sumber Belajar Lainnya</h3>
              <div className="grid gap-3">
                {material.searchQueries.map((query, idx) => (
                  <Card key={idx} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4">
                    <span className="font-semibold text-foreground">{query}</span>
                    <div className="flex gap-2">
                      <a
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-red-50 text-red-700 rounded-xl text-sm font-semibold hover:bg-red-100 transition"
                      >
                        📺 YouTube
                      </a>
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(query)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-semibold hover:bg-blue-100 transition"
                      >
                        🔍 Google
                      </a>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

<div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button variant="primary" className="flex-1" onClick={() => setStep('setup')}>
                  Cari Materi Lain
                </Button>
                <Link href="/dashboard" className="flex-1">
                  <Button variant="secondary" className="w-full">
                    Kembali ke Dashboard
                  </Button>
                </Link>
              </div>
          </div>
        )}
      </div>
    </div>
  );
}