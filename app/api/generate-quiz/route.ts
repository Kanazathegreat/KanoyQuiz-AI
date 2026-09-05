import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

// Server-side Supabase client with Service Role or at least public keys
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check rate limit
    const { data: limitData } = await supabase
      .from('api_rate_limit')
      .select('last_generated_at')
      .eq('user_id', user.id)
      .single();

    let diff = limitData?.last_generated_at ? Date.now() - new Date(limitData.last_generated_at).getTime() : null;
    let blocked = diff !== null && diff < 10000;
    console.log(`[QUIZ RATE LIMIT] user: ${user.id}, limitData:`, limitData, `diffMs: ${diff}, blocked: ${blocked}`);

    if (blocked) {
      return NextResponse.json(
        { error: 'Tunggu sebentar sebelum generate lagi ya!', isRateLimit: true },
        { status: 429 }
      );
    }

    const { subject, topic, numQuestions, difficulty = 'Sedang' } = await request.json();

    if (!subject || !topic || !numQuestions) {
      return NextResponse.json(
        { error: 'Parameter subject, topic, dan numQuestions wajib diisi.' },
        { status: 400 }
      );
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API Key Gemini belum dikonfigurasi di server.' },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-3.6-flash',
      generationConfig: { temperature: 0.9 }
    });

    let difficultyInstruction = 'Tingkat kesimpulan/kesulitan yang sesuai untuk pembelajar umum.';
    if (difficulty === 'Mudah') {
      difficultyInstruction = 'Tingkat kesulitan: Mudah. Soal dasar, konsep fundamental, cocok untuk pemula yang baru belajar topik ini.';
    } else if (difficulty === 'Sedang') {
      difficultyInstruction = 'Tingkat kesulitan: Sedang. Soal dengan kompleksitas menengah, mengombinasikan beberapa konsep.';
    } else if (difficulty === 'Sulit') {
      difficultyInstruction = 'Tingkat kesulitan: Sulit. Soal analitis/aplikatif yang menguji pemahaman mendalam, bisa melibatkan studi kasus atau perhitungan lebih kompleks.';
    }

    const sessionId = Math.random().toString(36).substring(7);
    const prompt = `Buatkan tepat ${numQuestions} soal kuis pilihan ganda dalam Bahasa Indonesia dengan topik "${topic}" untuk mata pelajaran "${subject}". 
${difficultyInstruction}
Sesi permintaan: ${sessionId}. 
Instruksi khusus:
1. Hasilkan soal yang unik dan bervariasi setiap kali diminta.
2. Jelajahi aspek-aspek berbeda dari topik, hindari selalu menggunakan contoh buku teks yang paling umum.
Berikan respons HANYA berupa array JSON yang valid tanpa markdown code block (tanpa \`\`\`json ... \`\`\`), dengan skema struktur berikut:
[
  {
    "question": "Pertanyaan soal...",
    "options": ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"],
    "correctIndex": indeks jawaban benar (angka 0 sampai 3),
    "explanation": "Penjelasan mengapa jawaban tersebut benar..."
  }
]`;

    let result;
    try {
      result = await model.generateContent(prompt);
    } catch (err: any) {
      console.error('Gemini API Call Error:', err);
      const errMsg = err?.message || String(err);
      const isRateLimit = /quota|rate limit|429|resource exhausted|too many requests/i.test(errMsg);

      if (isRateLimit) {
        return NextResponse.json(
          { error: 'Sistem sedang banyak digunakan. Coba lagi dalam beberapa menit ya!', isRateLimit: true },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { error: `Gagal memanggil model AI: ${errMsg}` },
        { status: 500 }
      );
    }

    const responseText = result.response.text();

    // Clean up markdown code blocks if Gemini added them despite instructions
    let cleanJsonStr = responseText.trim();
    if (cleanJsonStr.startsWith('```')) {
      cleanJsonStr = cleanJsonStr.replace(/^```(json)?\n/, '').replace(/\n```$/, '');
    }

    const questions = JSON.parse(cleanJsonStr);

    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('Format respons AI tidak valid.');
    }

    // Update rate limit timestamp
    await supabase.from('api_rate_limit').upsert({
      user_id: user.id,
      last_generated_at: new Date().toISOString(),
    });

    return NextResponse.json({ questions });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    const errMsg = error?.message || String(error);
    const isRateLimit = /quota|rate limit|429|resource exhausted|too many requests/i.test(errMsg);

    if (isRateLimit) {
      return NextResponse.json(
        { error: 'Sistem sedang banyak digunakan. Coba lagi dalam beberapa menit ya!', isRateLimit: true },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'Gagal membuat kuis dengan AI. Silakan coba lagi.' },
      { status: 500 }
    );
  }
}