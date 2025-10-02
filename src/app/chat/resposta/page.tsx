'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AppHeader } from '@/components/app-header';
import { Bot, ChevronLeft, User, FileText, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getInssAnswer } from '@/app/actions';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

function AnswerDisplay() {
  const searchParams = useSearchParams();
  const question = searchParams.get('q');
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (question) {
      getInssAnswer({ question })
        .then((result) => {
          if (result.success && result.data) {
            setAnswer(result.data);
          } else {
            setError(result.error || 'Ocorreu um erro desconhecido.');
          }
        })
        .catch(() => {
          setError('Falha ao conectar com o servidor.');
        });
    } else {
        setError("Nenhuma pergunta foi fornecida.");
    }
  }, [question]);

  if (!question) {
      return (
         <Card className="bg-destructive/10 border-destructive">
            <CardHeader className="flex-row items-center gap-4 space-y-0">
                <AlertTriangle className="h-8 w-8 text-destructive" />
                <CardTitle className="text-destructive">Pergunta não encontrada</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-destructive-foreground">Volte para a página anterior e faça sua pergunta para que a IA possa responder.</p>
                <Button asChild variant="link" className="px-0">
                    <Link href="/chat">
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Voltar para o chat
                    </Link>
                </Button>
            </CardContent>
        </Card>
      )
  }

  return (
    <div className="space-y-8">
        {/* User's Question */}
        <Card>
            <CardHeader className="flex-row items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <User className="h-6 w-6" />
                </div>
                <CardTitle className="font-headline text-xl">Sua Pergunta</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-base text-foreground">{question}</p>
            </CardContent>
        </Card>
      
        {/* AI's Answer */}
        <Card className="border-primary/50 shadow-lg shadow-primary/10">
            <CardHeader className="flex-row items-center gap-4 bg-muted/50 rounded-t-lg">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Bot className="h-6 w-6" />
                </div>
                <CardTitle className="font-headline text-xl text-primary">Resposta do Especialista IA</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                {error ? (
                    <div className="text-destructive">
                        <h3 className="font-bold">Erro ao gerar resposta:</h3>
                        <p>{error}</p>
                    </div>
                ) : answer ? (
                    <ReactMarkdown
                      className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-normal prose-strong:text-foreground"
                    >
                      {answer}
                    </ReactMarkdown>
                ) : (
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                        <br/>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/5" />
                    </div>
                )}
            </CardContent>
        </Card>

        <Button asChild variant="outline">
            <Link href="/chat">
                <ChevronLeft className="mr-2" />
                Fazer outra pergunta
            </Link>
        </Button>
    </div>
  );
}


export default function RespostaPage() {
  return (
    <div className="flex min-h-dvh w-full flex-col bg-background">
      <AppHeader />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mx-auto grid w-full max-w-4xl gap-8">
           <Suspense fallback={<LoadingState />}>
                <AnswerDisplay />
           </Suspense>
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

function LoadingState() {
    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/3" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-5 w-4/5" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                </CardContent>
            </Card>
        </div>
    )
}
