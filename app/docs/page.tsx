import Header from '@/components/Header';
import Card from '@/components/Card';
import { UserPlus, LayoutDashboard, Brain, BookOpen, TrendingUp, HelpCircle, Lightbulb } from 'lucide-react';

export default function DocsPage() {
  const steps = [
    { icon: UserPlus, title: "Daftar akun gratis", desc: "Buat akun untuk mulai menyimpan progress belajarmu." },
    { icon: LayoutDashboard, title: "Pilih aktivitas di dashboard", desc: "Klik tombol Mulai Belajar atau Buat Kuis Baru." },
    { icon: Brain, title: "Kuis AI", desc: "Tentukan mapel dan topik, AI akan buatkan kuis unik untukmu." },
    { icon: BookOpen, title: "Belajar Materi", desc: "Dapatkan penjelasan singkat dan sumber belajar eksternal." },
    { icon: TrendingUp, title: "Cek progres", desc: "Lihat statistik dan riwayat belajarmu di dashboard." },
  ];

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <Header activeItem="docs" />
      <main className="max-w-4xl mx-auto space-y-12">
        <section className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold text-foreground font-heading">Cara Menggunakan QuizAI</h1>
          <p className="text-foreground/70 font-medium text-lg">Ikuti langkah mudah ini untuk memaksimalkan pengalaman belajarmu.</p>
        </section>

        <section className="grid md:grid-cols-2 gap-6">
          {steps.map((step, i) => (
            <Card key={i} className="flex gap-4 p-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <step.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-lg mb-1">{i + 1}. {step.title}</h3>
                <p className="text-foreground/70 font-medium text-sm">{step.desc}</p>
              </div>
            </Card>
          ))}
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground text-center">Tanya Jawab (FAQ)</h2>
          <Card className="space-y-4 p-6">
            <div>
              <h4 className="font-bold text-foreground flex items-center gap-2"><HelpCircle className="w-5 h-5 text-primary" /> Apakah QuizAI gratis?</h4>
              <p className="text-foreground/70 text-sm mt-1 ml-7">Ya, sepenuhnya gratis untuk digunakan selama tahap awal ini.</p>
            </div>
            <div>
              <h4 className="font-bold text-foreground flex items-center gap-2"><Lightbulb className="w-5 h-5 text-primary" /> Kenapa generate soal butuh waktu?</h4>
              <p className="text-foreground/70 text-sm mt-1 ml-7">AI membutuhkan beberapa detik untuk menyusun soal yang relevan, unik, dan bervariasi.</p>
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
}