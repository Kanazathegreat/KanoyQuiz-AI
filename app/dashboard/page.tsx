'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { Brain, BookOpen, Sparkles, FileCheck, TrendingUp, Calendar, ArrowRight } from 'lucide-react';
import { getUserStats, UserStats } from '@/lib/stats';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    getUserStats(user.id)
      .then((data) => {
        setStats(data);
      })
      .catch((err) => {
        console.error('Failed to load user stats:', err);
      })
      .finally(() => {
        setLoadingStats(false);
      });
  }, [user, router]);

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
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/30 text-foreground font-semibold text-xs border border-secondary/40">
            <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
            Dashboard Belajar
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
            Selamat datang, {user.user_metadata?.full_name || 'User'}!
          </h1>
          <p className="text-foreground/70 font-medium text-base md:text-lg">
            Siap belajar sesuatu yang baru hari ini? Pilih aktivitas di bawah untuk mulai.
          </p>
        </div>

        {/* Stats Row (Secondary / Compact) */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <motion.div variants={itemVariants}>
              <Card className="flex items-center gap-3.5 p-4 bg-white/70">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground/60">Kuis Dikerjakan</p>
                  <h3 className="text-xl font-bold text-foreground">
                    {loadingStats ? '...' : (stats?.quizCount ?? 0)}
                  </h3>
                </div>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Card className="flex items-center gap-3.5 p-4 bg-white/70">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground/60">Materi Dipelajari</p>
                  <h3 className="text-xl font-bold text-foreground">
                    {loadingStats ? '...' : (stats?.materialCount ?? 0)}
                  </h3>
                </div>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Card className="flex items-center gap-3.5 p-4 bg-white/70">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground/60">Skor Rata-rata</p>
                  <h3 className="text-xl font-bold text-foreground">
                    {loadingStats ? '...' : (stats?.averageScorePercentage !== null ? `${stats?.averageScorePercentage}%` : '-')}
                  </h3>
                </div>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        {/* Main Action Cards (Primary / Prominent) */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <div className="grid md:grid-cols-2 gap-6 pt-2">
            {/* Mulai Belajar Card */}
            <motion.div variants={itemVariants}>
              <Card className="flex flex-col p-8 bg-gradient-to-br from-amber-50/80 via-white to-orange-50/60 border-2 border-amber-200/60 shadow-md hover:shadow-lg transition">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700 shadow-inner shrink-0">
                    <BookOpen className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Eksplorasi Konsep</span>
                    <h2 className="text-2xl font-bold text-foreground">Mulai Belajar</h2>
                  </div>
                </div>
                <p className="text-foreground/75 mb-6 flex-grow font-medium leading-relaxed">
                  Pelajari materi apa pun dengan penjelasan ringkas, poin penting, dan video referensi instan dari AI.
                </p>
                <Link href="/belajar">
                  <Button variant="primary" className="w-full py-4 text-base font-bold flex items-center justify-center gap-2">
                    Cari Materi Sekarang <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </Card>
            </motion.div>

            {/* Buat Kuis Card */}
            <motion.div variants={itemVariants}>
              <Card className="flex flex-col p-8 bg-gradient-to-br from-orange-50/80 via-white to-amber-50/60 border-2 border-orange-200/60 shadow-md hover:shadow-lg transition">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center text-primary shadow-inner shrink-0">
                    <Brain className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">Uji Pemahaman</span>
                    <h2 className="text-2xl font-bold text-foreground">Buat Kuis Baru</h2>
                  </div>
                </div>
                <p className="text-foreground/75 mb-6 flex-grow font-medium leading-relaxed">
                  Uji kemampuanmu lewat kuis interaktif yang dirancang khusus oleh AI lengkap dengan pembahasan detail.
                </p>
                <Link href="/quiz">
                  <Button variant="primary" className="w-full py-4 text-base font-bold flex items-center justify-center gap-2">
                    Mulai Latihan Kuis <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        {/* Recent History Section */}
        <div className="space-y-4 pt-4">
          <h2 className="text-xl font-bold text-foreground">Riwayat Terakhir</h2>
          <Card className="p-6">
            {loadingStats ? (
              <p className="text-foreground/60 text-center py-4">Memuat riwayat...</p>
            ) : !stats?.recentQuizzes || stats.recentQuizzes.length === 0 ? (
              <div className="text-center py-6 space-y-2">
                <p className="text-foreground/70 font-medium">Belum ada riwayat kuis. Yuk mulai belajar!</p>
              </div>
            ) : (
              <div className="divide-y divide-border-warm">
                {stats.recentQuizzes.map((quiz) => (
                  <div key={quiz.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                          {quiz.subject}
                        </span>
                        <h4 className="font-bold text-foreground text-sm">{quiz.topic}</h4>
                      </div>
                      <p className="text-xs text-foreground/50 flex items-center gap-1 mt-1 font-medium">
                        <Calendar className="w-3 h-3" />
                        {new Date(quiz.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-foreground text-base">
                        {quiz.score}/{quiz.num_questions}
                      </span>
                      <p className="text-xs text-foreground/60 font-semibold">
                        {Math.round((quiz.score / quiz.num_questions) * 100)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}