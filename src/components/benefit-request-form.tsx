'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Check, Copy, ListChecks, FileText, User, FileDigit, Briefcase, Info } from 'lucide-react';

import { getBenefitSteps } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader } from '@/components/loader';
import { Input } from '@/components/ui/input';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const formSchema = z.object({
  fullName: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),
  cpf: z.string().length(11, { message: 'O CPF deve ter 11 dígitos.' }),
  benefitType: z.string().min(5, { message: 'Deve ter pelo menos 5 caracteres.' }),
  additionalInfo: z.string().optional(),
});

function StepCard({ step, index }: { step: string; index: number }) {
  const { copied, copy } = useCopyToClipboard();
  return (
    <Card className="bg-card/50">
      <CardHeader className="flex-row items-start gap-4 space-y-0">
        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 text-primary">
          <div className="text-xl font-bold">{index + 1}</div>
        </div>
        <div className="flex-1">
          <CardTitle className="text-base font-medium">{step}</CardTitle>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={() => copy(step)}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copiar passo</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex-row items-center gap-4 space-y-0">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
            </div>
            <Skeleton className="h-8 w-8" />
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

export function BenefitRequestForm() {
  const [isPending, startTransition] = useTransition();
  const [steps, setSteps] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      cpf: '',
      benefitType: '',
      additionalInfo: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setSteps([]);
    startTransition(async () => {
      const result = await getBenefitSteps(values);
      if (result.success && result.data) {
        setSteps(result.data);
        toast({
          title: 'Sucesso!',
          description: `Geramos ${result.data.length} passos para você.`,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Erro ao Gerar Passos',
          description: result.error || 'Ocorreu um erro desconhecido.',
        });
      }
    });
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            Informações para a Solicitação
          </CardTitle>
          <CardDescription>
            Preencha seus dados e o benefício desejado para obter um guia.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <div className="relative">
                           <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                           <Input placeholder="Seu nome completo" {...field} className="pl-10" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <FileDigit className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Apenas números" {...field} className="pl-10"/>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="benefitType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Benefício Desejado</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Ex: Aposentadoria por idade, Auxílio-doença..."
                          {...field}
                          className="pl-10"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="additionalInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Informações Adicionais (Opcional)</FormLabel>
                     <FormControl>
                        <div className="relative">
                          <Info className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Textarea
                            placeholder="Descreva qualquer detalhe que possa ser útil."
                            className="min-h-[100px] resize-y pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? (
                  <>
                    <Loader className="mr-2 h-4 w-4" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <ListChecks className="mr-2 h-4 w-4" />
                    Gerar Passo a Passo
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="font-headline text-2xl font-semibold">
          Seu Passo a Passo Personalizado
        </h3>
        {isPending ? (
          <LoadingSkeleton />
        ) : steps.length > 0 ? (
          <div className="space-y-4">
            {steps.map((step, index) => (
              <StepCard key={index} step={step} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4">Os passos para sua solicitação aparecerão aqui.</p>
          </div>
        )}
      </div>
    </div>
  );
}
