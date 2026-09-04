import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(request: Request) {
  try {
    const { subject, topic, numQuestions } = await request.json();

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

    const sessionId = Math.random().toString(36).substring(7);
    const prompt = `Buatkan tepat ${numQuestions} soal kuis pilihan ganda dalam Bahasa Indonesia dengan topik "${topic}" untuk mata pelajaran "${subject}". 
Sesi permintaan: ${sessionId}. 
Instruksi khusus:
1. Hasilkan soal yang unik dan bervariasi setiap kali diminta.
2. Jelajahi aspek-aspek berbeda dari topik, hindari selalu menggunakan contoh buku teks yang paling umum.
3. Tingkat kesulitan yang sesuai untuk pembelajar umum.
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