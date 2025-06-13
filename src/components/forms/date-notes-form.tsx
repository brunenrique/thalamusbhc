"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

/**
 * Schema for the DateNotesForm
 */
export const dateNotesSchema = z.object({
  dateTime: z
    .coerce.date()
    .refine((d) => d >= new Date(), {
      message: "A data e hora deve ser igual ou posterior ao momento atual.",
    }),
  notes: z
    .string()
    .min(5, { message: "Notas deve ter no mínimo 5 caracteres." }),
});

export type DateNotesFormValues = z.infer<typeof dateNotesSchema>;

interface DateNotesFormProps {
  defaultDateTime?: Date;
}

export default function DateNotesForm({ defaultDateTime }: DateNotesFormProps) {
  const form = useForm<DateNotesFormValues>({
    resolver: zodResolver(dateNotesSchema),
    defaultValues: {
      dateTime: defaultDateTime ?? new Date(),
      notes: "",
    },
  });

  React.useEffect(() => {
    if (defaultDateTime) {
      form.setValue("dateTime", defaultDateTime);
    }
  }, [defaultDateTime, form]);

  function onSubmit(data: DateNotesFormValues) {
    console.log("Form submitted", data);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="dateTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data/Hora *</FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  value={
                    field.value instanceof Date
                      ? field.value.toISOString().slice(0, 16)
                      : field.value
                  }
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? new Date(e.target.value) : undefined
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas *</FormLabel>
              <FormControl>
                <Textarea rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Salvar</Button>
      </form>
    </Form>
  );
}
