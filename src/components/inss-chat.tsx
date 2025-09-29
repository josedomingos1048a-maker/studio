'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Send, User, Bot } from 'lucide-react';

import { getInssAnswer } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Loader } from '@/components/loader';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  question: z.string().min(1, { message: 'A pergunta não pode estar vazia.' }),
});

type Message = {
  role: 'user' | 'bot';
  text: string;
};

export function InssChat() {
  const [isPending, startTransition] = useTransition();
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: '',
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setMessages((prev) => [...prev, { role: 'user', text: values.question }]);
    form.reset();

    startTransition(async () => {
      const result = await getInssAnswer(values);
      if (result.success && result.data) {
        setMessages((prev) => [...prev, { role: 'bot', text: result.data as string }]);
      } else {
        toast({
          variant: 'destructive',
          title: 'Erro ao obter resposta',
          description: result.error || 'Ocorreu um erro desconhecido.',
        });
        setMessages((prev) => prev.slice(0, -1));
      }
    });
  };

  return (
    <Card className="flex flex-col h-[60vh]">
      <CardContent className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              'flex items-start gap-3',
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            {message.role === 'bot' && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shrink-0">
                <Bot className="h-5 w-5" />
              </div>
            )}
            <div
              className={cn(
                'max-w-prose rounded-lg p-3 text-sm',
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              )}
            >
              <p>{message.text}</p>
            </div>
             {message.role === 'user' && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground shrink-0">
                <User className="h-5 w-5" />
              </div>
            )}
          </div>
        ))}
        {isPending && (
          <div className="flex items-start gap-3 justify-start">
             <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shrink-0">
                <Bot className="h-5 w-5" />
              </div>
            <div className='bg-muted rounded-lg p-3'>
                <Loader />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </CardContent>
      <div className="border-t p-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-center gap-2"
          >
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Textarea
                      placeholder="Digite sua pergunta aqui..."
                      className="resize-none"
                      {...field}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          form.handleSubmit(onSubmit)();
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending} size="icon">
              {isPending ? <Loader /> : <Send />}
            </Button>
          </form>
        </Form>
      </div>
    </Card>
  );
}
