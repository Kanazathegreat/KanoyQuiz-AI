import { supabase } from '@/lib/supabase';

export interface QuizHistoryItem {
  id: string;
  user_id: string;
  subject: string;
  topic: string;
  num_questions: number;
  score: number;
  created_at: string;
}

export interface UserStats {
  quizCount: number;
  materialCount: number;
  averageScorePercentage: number | null;
  recentQuizzes: QuizHistoryItem[];
}

export async function getUserStats(userId: string): Promise<UserStats> {
  const [quizzesRes, materialsRes] = await Promise.all([
    supabase
      .from('quiz_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),
    supabase
      .from('material_history')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
  ]);

  const quizzes: QuizHistoryItem[] = quizzesRes.data || [];
  const quizCount = quizzes.length;
  const materialCount = materialsRes.count || 0;

  let averageScorePercentage: number | null = null;
  if (quizCount > 0) {
    const totalPercentage = quizzes.reduce((acc, curr) => {
      const percentage = curr.num_questions > 0 ? (curr.score / curr.num_questions) * 100 : 0;
      return acc + percentage;
    }, 0);
    averageScorePercentage = Math.round(totalPercentage / quizCount);
  }

  const recentQuizzes = quizzes.slice(0, 5);

  return {
    quizCount,
    materialCount,
    averageScorePercentage,
    recentQuizzes,
  };
}