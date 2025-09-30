import { Landmark } from 'lucide-react';
import { Loader } from './loader';

export function SplashScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background text-primary">
      <div className="flex items-center gap-4 text-4xl font-headline">
        <Landmark className="h-12 w-12 text-secondary" />
        <h1 className="tracking-tighter">Simplifica INSS</h1>
      </div>
      <div className="mt-8 flex items-center gap-2 text-muted-foreground">
        <Loader className="h-5 w-5" />
        <p>Carregando seu assistente...</p>
      </div>
    </div>
  );
}
