'use client';

import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Header from '@/components/Header';
import { Sparkles, BookOpen, Brain, ArrowRight, Zap, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const { user } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 sm:p-8 font-sans relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-secondary/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Shared Header */}
      <Header activeItem="home" />

      {/* Hero Section */}
      <motion.main 
        className="text-center space-y-8 max-w-3xl mx-auto z-10 pt-8 pb-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/30 text-foreground font-semibold text-sm mb-2 shadow-sm border border-secondary/40">
          <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          Platform Belajar & Kuis Generatif AI #1
        </motion.div>

        <motion.h2 variants={itemVariants} className="text-5xl md:text-6xl font-extrabold text-foreground tracking-tight leading-tight">
          Belajar Lebih Cerdas <br /> Dengan <span className="text-primary">Bantuan AI</span>
        </motion.h2>

        <motion.p variants={itemVariants} className="text-xl text-foreground/70 max-w-2xl mx-auto font-medium">
          Tingkatkan pemahaman Anda melalui kuis interaktif dan materi yang dipersonalisasi oleh kecerdasan buatan.
        </motion.p>

        <motion.div variants={itemVariants} className="pt-4 flex justify-center">
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
        </motion.div>
      </motion.main>

      {/* Features Section */}
      <motion.section 
        id="fitur" 
        className="w-full max-w-6xl mx-auto z-10 py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <div className="text-center space-y-3 mb-12">
          <h3 className="text-3xl md:text-4xl font-extrabold text-foreground">
            Kenapa Belajar Bareng <span className="text-primary">QuizAI</span>?
          </h3>
          <p className="text-foreground/70 font-medium text-lg max-w-xl mx-auto">
            Metode belajar modern yang dirancang untuk membantu Anda paham konsep lebih cepat dan menyenangkan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div variants={itemVariants}><Card className="flex flex-col items-center text-center p-8 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
              <Brain className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-foreground">Kuis AI Personal</h4>
            <p className="text-foreground/70 font-medium text-sm leading-relaxed">
              Buat soal latihan tak terbatas untuk topik apa saja secara instan, lengkap dengan pembahasan mendalam.
            </p>
          </Card></motion.div>

          <motion.div variants={itemVariants}><Card className="flex flex-col items-center text-center p-8 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-secondary/30 flex items-center justify-center text-primary shadow-inner">
              <Zap className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-foreground">Belajar Cepat & Ringkas</h4>
            <p className="text-foreground/70 font-medium text-sm leading-relaxed">
              Dapatkan rangkuman poin-poin inti dari materi rumit tanpa perlu membaca buku tebal berjam-jam.
            </p>
          </Card></motion.div>

          <motion.div variants={itemVariants}><Card className="flex flex-col items-center text-center p-8 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
              <Target className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-foreground">Pantau Perkembangan</h4>
            <p className="text-foreground/70 font-medium text-sm leading-relaxed">
              Catat histori kuis dan evaluasi tingkat pemahaman Anda lewat metrik statistik yang jelas.
            </p>
          </Card></motion.div>
        </div>
      </motion.section>
    </div>
  );
}