import Header from '@/components/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { MessageSquareText } from 'lucide-react';

export default function SupportPage() {
  return (
    <div className="min-h-screen p-4 sm:p-8">
      <Header activeItem="support" />
      <main className="max-w-3xl mx-auto space-y-8 text-center">
        <section className="space-y-4">
          <h1 className="text-4xl font-extrabold text-foreground font-heading">Butuh Bantuan?</h1>
          <p className="text-foreground/70 font-medium text-lg">Punya saran, kritik, atau menemukan bug? Kami sangat ingin mendengarnya!</p>
        </section>

        <Card className="p-8 space-y-6">
          <MessageSquareText className="w-16 h-16 text-primary mx-auto" />
          <p className="text-foreground/80 font-medium">Bantu kami meningkatkan QuizAI agar menjadi platform belajar yang lebih baik untuk semua orang.</p>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSeH6c-jBtFU3r88pGQIS0-rRV39jGQNmjzmWLuvRrDLKMsXFA/viewform?usp=publish-editor"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full sm:w-auto"
          >
            <Button variant="primary" className="py-4 px-8 font-bold text-lg flex items-center justify-center gap-3 w-full">
              <MessageSquareText className="w-5 h-5" /> Laporkan Bug / Kasih Saran
            </Button>
          </a>
        </Card>

        <p className="text-foreground/60 text-sm font-medium">
          Kami masih dalam tahap pengembangan awal, jadi setiap masukanmu sangat berarti!
        </p>
      </main>
    </div>
  );
}