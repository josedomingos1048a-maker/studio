
'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Check, Copy, KeyRound, Plus, TerminalSquare } from 'lucide-react';

import { getBypassTechniques } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
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
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader } from '@/components/loader';
import { Input } from '@/components/ui/input';
import { Separator } from './ui/separator';

const formSchema = z.object({
  environmentDetails: z
    .string()
    .min(10, { message: 'Must be at least 10 characters.' })
    .max(500, { message: 'Must be 500 characters or less.' }),
  userObjectives: z
    .string()
    .min(10, { message: 'Must be at least 10 characters.' })
    .max(500, { message: 'Must be 500 characters or less.' }),
});

function TechniqueCard({ technique }: { technique: string }) {
  const { copied, copy } = useCopyToClipboard();
  return (
    <Card className="bg-card/50">
      <CardHeader className="flex-row items-start gap-4 space-y-0">
        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 text-primary">
          <TerminalSquare className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <CardTitle className="text-base font-medium">
            {technique}
          </CardTitle>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={() => copy(technique)}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copy technique</p>
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
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-8 w-8" />
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function TechniqueGenerator() {
  const [isPending, startTransition] = useTransition();
  const [techniques, setTechniques] = useState<string[]>([]);
  const [customTechnique, setCustomTechnique] = useState('');
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      environmentDetails: '',
      userObjectives: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      const result = await getBypassTechniques(values);
      if (result.success && result.data) {
        setTechniques(result.data);
        toast({
          title: 'Success!',
          description: `Generated ${result.data.length} new techniques.`,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error Generating Techniques',
          description: result.error || 'An unknown error occurred.',
        });
      }
    });
  };

  const handleAddCustomTechnique = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTechnique.trim()) {
      setTechniques((prev) => [...prev, customTechnique.trim()]);
      setCustomTechnique('');
      toast({
        title: 'Technique Added',
        description: 'Your custom technique has been added to the list.',
      });
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            Generate Techniques
          </CardTitle>
          <CardDescription>
            Describe the sandbox environment and your goals to generate a list
            of potential bypass methods.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="environmentDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Environment Details</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Windows 10, VBScript sandbox, network monitoring, API hooking on CreateProcess..."
                        className="min-h-[100px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="userObjectives"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Objectives</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Execute shellcode, read a file from disk, establish a C2 connection..."
                        className="min-h-[100px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? (
                  <>
                    <Loader className="mr-2 h-4 w-4" />
                    Generating...
                  </>
                ) : (
                  <>
                    <KeyRound className="mr-2 h-4 w-4" />
                    Generate
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="font-headline text-2xl font-semibold">
          Generated Techniques
        </h3>
        {isPending ? (
          <LoadingSkeleton />
        ) : techniques.length > 0 ? (
          <div className="space-y-4">
            {techniques.map((tech, index) => (
              <TechniqueCard key={index} technique={tech} />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
            <p>Your generated techniques will appear here.</p>
          </div>
        )}
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="font-headline text-2xl font-semibold">
          Add Custom Method
        </h3>
        <form onSubmit={handleAddCustomTechnique} className="flex gap-2">
          <Input
            value={customTechnique}
            onChange={(e) => setCustomTechnique(e.target.value)}
            placeholder="Input a custom strategy or modification"
            className="flex-grow"
          />
          <Button type="submit" variant="secondary">
            <Plus className="mr-2 h-4 w-4" />
            Add
          </Button>
        </form>
      </div>
    </div>
  );
}
