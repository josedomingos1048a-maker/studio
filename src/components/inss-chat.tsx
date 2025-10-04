'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Send } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Loader } from '@/components/loader';


const formSchema = z.object({
  question: z.string().min(10, { message: 'A pergunta deve ter pelo menos 10 caracteres.' }),
});

export function InssChat() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(() => {
      const params = new URLSearchParams({ q: values.question });
      router.push(`/chat/resposta?${params.toString()}`);
    });
  };

  return (
    <Card className="w-full">
       <CardContent className="p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Digite sua pergunta detalhada sobre o INSS aqui..."
                      className="min-h-[120px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? (
                  <Loader className="mr-2" />
              ) : (
                <>
                  <Send className="mr-2" />
                  Enviar Pergunta
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        <p>A IA usará esta pergunta para gerar uma resposta detalhada em uma nova página.</p>
      </CardFooter>
    </Card>
  );
}
