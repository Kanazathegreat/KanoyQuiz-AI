# KanoyQuiz AI

**Platform belajar dan kuis interaktif berbasis AI, 100% Bahasa Indonesia.**

QuizAI membantu siapa saja belajar lebih cerdas dengan menghasilkan kuis pilihan ganda dan ringkasan materi secara instan menggunakan AI — tinggal pilih mata pelajaran dan topik, AI yang urus sisanya.

🔗 **Link Coba:** [kanoyquiz.vercel.app](https://kanoyquiz.vercel.app/)

---

## Fitur Utama

- **Autentikasi Akun** — Register & login menggunakan Supabase Auth
- **Quiz Generator AI** — Pilih mata pelajaran, topik, dan jumlah soal → AI membuat soal pilihan ganda lengkap dengan pembahasan
- **Fitur Belajar AI** — Dapatkan ringkasan materi singkat beserta rekomendasi sumber belajar (link pencarian YouTube & Google)
- **Riwayat & Statistik** — Dashboard menampilkan jumlah kuis dikerjakan, materi dipelajari, skor rata-rata, dan riwayat aktivitas terakhir
- **Desain Playful & Hangat** — UI modern terinspirasi Duolingo dengan palet warna oranye-kuning

---

## Tech Stack

| Kategori | Teknologi |
|---|---|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) + TypeScript |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| Autentikasi & Database | [Supabase](https://supabase.com/) |
| AI Engine | [Google Gemini API](https://ai.google.dev/) |
| Ikon | [Lucide React](https://lucide.dev/) |
| Hosting | [Vercel](https://vercel.com/) |

---

## Menjalankan Secara Lokal

### 1. Clone repo ini

```bash
git clone https://github.com/Kanazathegreat/KanoyQuiz-AI.git
cd KanoyQuiz-AI
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Buat file `.env.local` di root project, isi dengan:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

- Dapatkan kredensial Supabase di **Project Settings > API** pada dashboard Supabase kamu.
- Dapatkan API key Gemini gratis di [aistudio.google.com/apikey](https://aistudio.google.com/apikey).

### 4. Setup database Supabase

Jalankan SQL berikut di **SQL Editor** Supabase untuk membuat tabel riwayat:

```sql
-- Quiz history table
create table quiz_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users,
  subject text not null,
  topic text not null,
  num_questions integer not null,
  score integer not null check (score between 0 and num_questions),
  created_at timestamptz default now()
);

alter table quiz_history enable row level security;

create policy "Users can insert their own quiz history"
  on quiz_history for insert
  with check (auth.uid() = user_id);

create policy "Users can select their own quiz history"
  on quiz_history for select
  using (auth.uid() = user_id);

-- Material history table
create table material_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users,
  subject text not null,
  topic text not null,
  created_at timestamptz default now()
);

alter table material_history enable row level security;

create policy "Users can insert their own material history"
  on material_history for insert
  with check (auth.uid() = user_id);

create policy "Users can select their own material history"
  on material_history for select
  using (auth.uid() = user_id);
```

Pastikan juga **Email Provider** aktif di **Authentication > Providers**.

### 5. Jalankan development server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

---

## Deployment

Project ini di-deploy menggunakan [Vercel](https://vercel.com/). Untuk deploy versimu sendiri:

1. Push repo ke GitHub
2. Import project di Vercel
3. Tambahkan 3 environment variables yang sama seperti di atas pada **Project Settings > Environment Variables**
4. Deploy

Setelah live, tambahkan URL production kamu ke **Authentication > URL Configuration** di Supabase (Site URL & Redirect URLs) agar autentikasi berfungsi normal.
