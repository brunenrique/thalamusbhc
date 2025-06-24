"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { submitFeedback } from '@/services/feedbackService';
import { useToast } from '@/hooks/use-toast';
import logger from '@/lib/logger';
import * as Sentry from '@sentry/nextjs';

const feedbackSchema = z.object({
  text: z.string().min(3, { message: 'Digite pelo menos 3 caracteres.' }),
});

type FeedbackValues = z.infer<typeof feedbackSchema>;

export default function UserFeedback() {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);

  const form = useForm<FeedbackValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: { text: '' },
  });

  async function onSubmit(data: FeedbackValues) {
    setLoading(true);
    try {
      await submitFeedback(data.text);
      toast({ title: 'Feedback enviado' });
      form.reset();
    } catch (err) {
      Sentry.captureException(err);
      logger.error({ action: 'submit_feedback_error', meta: { error: err } });
      toast({ title: 'Erro ao enviar feedback', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        role="form"
      >
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conte-nos sobre sua sessão</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Deixe seu comentário..."
                  rows={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="bg-accent hover:bg-accent/90 text-accent-foreground"
          disabled={loading}
        >
          Enviar
        </Button>
      </form>
    </Form>
  );
}

