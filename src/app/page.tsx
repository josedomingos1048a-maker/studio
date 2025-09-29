import Image from 'next/image';
import { BenefitRequestForm } from '@/components/benefit-request-form';
import { AppHeader } from '@/components/app-header';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const heroImage = PlaceHolderImages.find(
    (img) => img.id === 'benefit-request-hero'
  );

  return (
    <div className="flex min-h-dvh w-full flex-col bg-background">
      <AppHeader />
      <main className="flex flex-1 flex-col">
        {heroImage && (
          <div className="relative w-full h-48 md:h-64">
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              style={{ objectFit: 'cover' }}
              data-ai-hint={heroImage.imageHint}
              className="opacity-20"
            />
             <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8 bg-gradient-to-t from-background via-background/80 to-transparent">
              <div className="mx-auto grid w-full max-w-4xl text-center space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter font-headline text-foreground sm:text-4xl md:text-5xl">
                  Solicite seu Benefício do INSS
                </h2>
                <p className="max-w-[800px] mx-auto text-muted-foreground md:text-xl">
                  Preencha o formulário abaixo para receber um passo a passo simplificado e gerado por IA para o seu pedido.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="w-full p-4 md:p-8 -mt-16">
           <div className="mx-auto grid w-full max-w-4xl gap-8">
            <BenefitRequestForm />
          </div>
        </div>
      </main>
      <footer className="flex items-center justify-center py-4 border-t">
        <p className="text-xs text-muted-foreground">
          Este aplicativo é um protótipo para fins de demonstração.
        </p>
      </footer>
    </div>
  );
}
