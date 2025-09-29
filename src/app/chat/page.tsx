import { AppHeader } from '@/components/app-header';
import { InssChat } from '@/components/inss-chat';
import { MessageCircle } from 'lucide-react';

export default function ChatPage() {
  return (
    <div className="flex min-h-dvh w-full flex-col bg-background">
      <AppHeader />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mx-auto grid w-full max-w-4xl gap-8">
          <div className="text-center space-y-2">
            <div className="inline-block rounded-lg bg-muted p-3">
              <MessageCircle className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold tracking-tighter font-headline text-foreground sm:text-4xl md:text-5xl">
              Tire suas dúvidas sobre o INSS
            </h2>
            <p className="max-w-[800px] mx-auto text-muted-foreground md:text-xl">
              Faça uma pergunta sobre regras, benefícios e procedimentos. A IA responderá como um especialista.
            </p>
          </div>
          <InssChat />
        </div>
      </main>
      <footer className="flex items-center justify-center py-4 border-t">
        <p className="text-xs text-muted-foreground">
          As respostas são geradas por IA e podem conter imprecisões. Verifique sempre as fontes oficiais.
        </p>
      </footer>
    </div>
  );
}
