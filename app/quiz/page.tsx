'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { BookOpen, Brain, AlertCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export default function QuizPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<'setup' | 'loading' | 'taking' | 'result'>('setup');
  const [subject, setSubject] = useState('Matematika');
  const [topic, setTopic] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [isRetryMode, setIsRetryMode] = useState(false);
  const [difficulty, setDifficulty] = useState<'Mudah' | 'Sedang' | 'Sulit'>('Sedang');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRateLimitError, setIsRateLimitError] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  const loadingMessages = [
    'Menyusun pertanyaan yang menarik...',
    'Menyiapkan pilihan jawaban & opsi...',
    'Memeriksa tingkat kesulitan materi...',
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

  const handleStartQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setErrorMessage('Topik atau materi wajib diisi.');
      setIsRateLimitError(false);
      setIsRetryMode(false);
      return;
    }

    setErrorMessage(null);
    setIsRateLimitError(false);
    setIsRetryMode(false);
    setStep('loading');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ subject, topic, numQuestions, difficulty }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Terjadi kesalahan pada server.');
        setIsRateLimitError(Boolean(data.isRateLimit));
        setStep('setup');
        return;
      }

      setQuestions(data.questions);
      setSelectedAnswers(new Array(data.questions.length).fill(-1));
      setCurrentIndex(0);
      setStep('taking');
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal menghasilkan kuis.');
      setIsRateLimitError(false);
      setIsRetryMode(false);
      setStep('setup');
    }
  };

  const handleSelectOption = (optionIndex: number) => {
    const updated = [...selectedAnswers];
    updated[currentIndex] = optionIndex;
    setSelectedAnswers(updated);
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        score++;
      }
    });
    return score;
  };

  const handleRetryWrong = () => {
    const wrongQuestions = questions.filter((q, idx) => selectedAnswers[idx] !== q.correctIndex);
    if (wrongQuestions.length === 0) return; // should not happen if button is hidden
    setQuestions(wrongQuestions);
    setSelectedAnswers(new Array(wrongQuestions.length).fill(-1));
    setCurrentIndex(0);
    setIsRetryMode(true);
    setStep('taking');
  };

  if (!user) return null;

  return (
    <div className="p-6 md:p-12">
      <div className="max-w-2xl mx-auto">
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
                <h2 className="text-2xl font-bold text-foreground mb-6">Buat Kuis dengan AI</h2>
                <form onSubmit={handleStartQuiz} className="space-y-6">
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
                      placeholder="Contoh: Pecahan, Simple Present Tense, Hukum Newton..."
                      className="w-full px-4 py-3 border-2 border-border-warm rounded-2xl focus:outline-none focus:border-primary text-foreground placeholder:text-foreground/40 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-3">Tingkat Kesulitan</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['Mudah', 'Sedang', 'Sulit'] as const).map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setDifficulty(level)}
                          className={`py-3 px-4 rounded-2xl border-2 font-semibold transition ${
                            difficulty === level 
                              ? 'border-primary bg-primary text-white' 
                              : 'border-border-warm bg-white text-foreground'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Jumlah Soal</label>
                    <select
                      value={numQuestions}
                      onChange={(e) => setNumQuestions(Number(e.target.value))}
                      className="w-full px-4 py-3 border-2 border-border-warm rounded-2xl focus:outline-none focus:border-primary text-foreground bg-white"
                    >
                      <option value={5}>5 Soal</option>
                      <option value={10}>10 Soal</option>
                      <option value={15}>15 Soal</option>
                      <option value={20}>20 Soal</option>
                    </select>
                  </div>

                  <Button type="submit" variant="primary" className="w-full py-4 text-lg">
                    Buat Kuis
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
              <Card className="text-center space-y-4 py-12">
                <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <h3 className="text-xl font-bold text-foreground">AI sedang membuat soal untukmu...</h3>
                <p className="text-foreground/70 text-sm italic">{loadingMessages[loadingMessageIndex]}</p>
              </Card>
            </motion.div>
          )}

          {step === 'taking' && questions.length > 0 && (
             <motion.div
              key="taking"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
             <Card className="space-y-6">
               <div className="flex justify-between items-center text-sm font-semibold text-foreground/60">
                 <span>Soal {currentIndex + 1} dari {questions.length}</span>
                 <div className="flex items-center gap-2">
                   <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">{subject}</span>
                   <span className="bg-secondary/30 text-foreground px-2.5 py-1 rounded-full text-xs font-bold">{difficulty}</span>
                   {isRetryMode && (
                     <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded-full">
                       Mode Ulangi
                     </span>
                   )}
                 </div>
               </div>

               <h3 className="text-xl font-bold text-foreground">
                 {questions[currentIndex].question}
               </h3>

               <div className="space-y-3">
                 {questions[currentIndex].options.map((option, oIdx) => {
                   const isSelected = selectedAnswers[currentIndex] === oIdx;
                   return (
                     <button
                       key={oIdx}
                       onClick={() => handleSelectOption(oIdx)}
                       className={`w-full text-left p-4 rounded-2xl border-2 transition flex items-center gap-3 font-medium ${
                         isSelected
                           ? 'border-primary bg-primary/10 text-foreground'
                           : 'border-border-warm hover:border-primary/50 text-foreground'
                       }`}
                     >
                       <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold border-2 ${
                         isSelected ? 'bg-primary text-white border-primary' : 'border-border-warm text-foreground/50'
                       }`}>
                         {String.fromCharCode(65 + oIdx)}
                       </span>
                       {option}
                     </button>
                   );
                 })}
               </div>

               <div className="flex justify-between pt-4 border-t-2 border-border-warm">
                 <Button
                   variant="secondary"
                   disabled={currentIndex === 0}
                   onClick={() => setCurrentIndex(currentIndex - 1)}
                   className="px-6 py-2"
                 >
                   Sebelumnya
                 </Button>

                 {currentIndex < questions.length - 1 ? (
                   <Button variant="primary" onClick={() => setCurrentIndex(currentIndex + 1)} className="px-6 py-2">
                     Selanjutnya
                   </Button>
                 ) : (
                   <Button
                     variant="primary"
                     onClick={async () => {
                       const score = calculateScore();
                       if (user && !isRetryMode) {
                         try {
                           await supabase.from('quiz_history').insert({
                             user_id: user.id,
                             subject,
                             topic,
                             num_questions: questions.length,
                             score,
                             difficulty,
                           });
                         } catch (err) {
                           console.error('Failed to save quiz history:', err);
                         }
                       }
                       setStep('result');
                     }}
                     className="px-6 py-2 bg-emerald-500 border-b-emerald-700 hover:bg-emerald-600"
                   >
                     Selesai
                   </Button>
                 )}
               </div>
             </Card>
            </motion.div>
          )}

          {step === 'result' && (
             <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-6">
                <Card className="text-center space-y-4">
                  <h3 className="text-2xl font-bold text-foreground">Hasil Kuis</h3>
                  <div className="text-4xl font-extrabold text-primary">
                    {calculateScore()} dari {questions.length} benar
                  </div>
                  <p className="text-foreground/70 text-sm">Kerja bagus! Periksa pembahasan jawaban di bawah ini.</p>
                  
                  <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                    <Button variant="primary" onClick={() => {
                      setStep('setup');
                      setIsRetryMode(false);
                    }}>
                      Buat Kuis Baru
                    </Button>
                    {calculateScore() < questions.length && (
                      <Button variant="primary" onClick={handleRetryWrong} className="mt-2 sm:mt-0">
                        Ulangi yang Salah Aja
                      </Button>
                    )}
                    <Link href="/dashboard">
                      <Button variant="secondary">Kembali ke Dashboard</Button>
                    </Link>
                  </div>
                </Card>

                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-foreground">Review Pembahasan</h4>
                  {questions.map((q, qIdx) => {
                    const userAns = selectedAnswers[qIdx];
                    const isCorrect = userAns === q.correctIndex;
                    return (
                      <Card key={qIdx} className="space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <span className="font-semibold text-foreground">Soal {qIdx + 1}: {q.question}</span>
                          <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                            isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {isCorrect ? 'Benar' : 'Salah'}
                          </span>
                        </div>

                        <div className="text-sm space-y-1">
                          <p className="text-foreground/80">
                            <strong className="text-foreground">Jawabanmu:</strong> {userAns !== -1 ? q.options[userAns] : 'Tidak dijawab'}
                          </p>
                          {!isCorrect && (
                            <p className="text-emerald-800">
                              <strong className="text-emerald-900">Jawaban Benar:</strong> {q.options[q.correctIndex]}
                            </p>
                          )}
                        </div>

                        <div className="bg-background p-4 rounded-xl text-xs text-foreground/70 border border-border-warm">
                          <strong>Penjelasan:</strong> {q.explanation}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}