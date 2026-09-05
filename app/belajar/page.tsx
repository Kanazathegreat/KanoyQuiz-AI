'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { Brain, AlertCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import Skeleton from '@/components/Skeleton';

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
  const [isRateLimitError, setIsRateLimitError] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  const loadingMessages = [
    'Menganalisis dan merangkum topik...',
    'Menyusun poin-poin kunci utama...',
    'Mencari kata kunci referensi terbantu...',
    'Hampir selesai, sebentar lagi siap...'
  ];

  useEffect(() => {
    if (step === 'loading') {
      const interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [step]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleGenerateMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setErrorMessage('Topik atau materi wajib diisi.');
      setIsRateLimitError(false);
      return;
    }

    setErrorMessage(null);
    setIsRateLimitError(false);
    setStep('loading');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/generate-material', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ subject, topic }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Terjadi kesalahan pada server.');
        setIsRateLimitError(Boolean(data.isRateLimit));
        setStep('setup');
        return;
      }

      setMaterial(data);
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
      setIsRateLimitError(false);
      setStep('setup');
    }
  };

  if (!user) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

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
          <div className={`${
            isRateLimitError 
              ? 'bg-amber-50 text-amber-700 border-amber-200' 
              : 'bg-red-50 text-red-700 border-red-200'
          } p-4 rounded-2xl text-sm mb-6 font-medium border flex items-center gap-3`}
          >
            {isRateLimitError ? (
              <AlertCircle className="w-5 h-5 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 shrink-0" />
            )}
            <span>{errorMessage}</span>
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 'setup' && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
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
            </motion.div>
          )}

          {step === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="space-y-6 p-8">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-9 w-3/4" />
                
                <div className="space-y-3 pt-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>

                <div className="bg-secondary/10 p-6 rounded-2xl border-2 border-secondary/30 space-y-3">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>

                <div className="text-center pt-6 border-t border-border-warm space-y-2">
                  <div className="inline-block w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
                  <h3 className="text-lg font-bold text-foreground">AI sedang menyiapkan materi untukmu...</h3>
                  <p className="text-foreground/70 text-sm italic">{loadingMessages[loadingMessageIndex]}</p>
                </div>
              </Card>
            </motion.div>
          )}

          {step === 'result' && material && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
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
                      {material.keyPoints.map((point: string, idx: number) => (
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
                    {material.searchQueries.map((query: string, idx: number) => (
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}