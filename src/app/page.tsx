import { TechniqueGenerator } from '@/components/technique-generator';
import { ShieldOff } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-dvh w-full flex-col bg-background">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 md:px-6">
        <div className="flex items-center gap-2 text-2xl font-semibold font-headline text-accent">
          <ShieldOff className="h-7 w-7" />
          <h1>Sandbox Skipper</h1>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mx-auto grid w-full max-w-4xl gap-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter font-headline text-foreground sm:text-4xl md:text-5xl">
              Evade and Analyze
            </h2>
            <p className="max-w-[800px] mx-auto text-muted-foreground md:text-xl">
              Generate tailored sandbox bypass techniques based on your specific
              environment and objectives.
            </p>
          </div>
          <TechniqueGenerator />
        </div>
      </main>
      <footer className="flex items-center justify-center py-4 border-t">
        <p className="text-xs text-muted-foreground">
          Disclaimer: This tool is for educational and research purposes only.
        </p>
      </footer>
    </div>
  );
}
