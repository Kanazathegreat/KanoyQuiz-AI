import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(request: Request) {
  try {
    const { subject, topic } = await request.json();

    if (!subject || !topic) {
      return NextResponse.json(
        { error: 'Parameter subject dan topic wajib diisi.' },
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
    const prompt = `Jelaskan materi "${topic}" untuk mata pelajaran "${subject}" dalam Bahasa Indonesia.
Sesi permintaan: ${sessionId}.
Instruksi:
1. Berikan penjelasan yang jelas, ringkas, dan mudah dipahami oleh pembelajar umum (sekitar 150-250 kata). Sertakan contoh singkat.
2. Buat daftar 3-5 poin kunci (key points) dari materi tersebut.
3. Sarankan 4-6 kata kunci pencarian (search queries) yang spesifik untuk menemukan sumber belajar lebih lanjut di Google atau YouTube.
4. Berikan respons HANYA berupa JSON valid tanpa markdown code block dengan skema:
{
  "explanation": "Penjelasan materi...",
  "keyPoints": ["Poin 1", "Poin 2", "Poin 3"],
  "searchQueries": ["Kata kunci 1", "Kata kunci 2"]
}`;

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
    let cleanJsonStr = responseText.trim();
    if (cleanJsonStr.startsWith('```')) {
      cleanJsonStr = cleanJsonStr.replace(/^```(json)?\n/, '').replace(/\n```$/, '');
    }

    const material = JSON.parse(cleanJsonStr);
    return NextResponse.json(material);
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
      { error: 'Gagal membuat materi belajar. Silakan coba lagi.' },
      { status: 500 }
    );
  }
}