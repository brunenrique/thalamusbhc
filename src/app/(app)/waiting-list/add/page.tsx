
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
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
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockPsychologistsForSelect = [
  { id: "any", name: "Qualquer Psicólogo(a)" },
  { id: "psy1", name: "Dr. Silva" },
  { id: "psy2", name: "Dra. Jones" },
];

const priorityOptions = ["Alta", "Média", "Baixa"];

const waitingListFormSchema = z.object({
  patientName: z.string().min(3, { message: "O nome do paciente deve ter pelo menos 3 caracteres." }),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email({ message: "Por favor, insira um e-mail válido." }).optional().or(z.literal('')),
  requestedPsychologistId: z.string().optional(),
  priority: z.enum(["Alta", "Média", "Baixa"], { required_error: "Por favor, selecione uma prioridade." }),
  notes: z.string().optional(),
});

type WaitingListFormValues = z.infer<typeof waitingListFormSchema>;

export default function AddToWaitingListPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<WaitingListFormValues>({
    resolver: zodResolver(waitingListFormSchema),
    defaultValues: {
      patientName: "",
      contactPhone: "",
      contactEmail: "",
      requestedPsychologistId: "any",
      priority: "Média",
      notes: "",
    },
  });

  async function onSubmit(data: WaitingListFormValues) {
    setIsLoading(true);
    console.log("Adicionando à Lista de Espera (Simulado):", data);
    // Simula chamada de API
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast({
      title: "Paciente Adicionado à Lista de Espera (Simulado)",
      description: `${data.patientName} foi adicionado(a) com sucesso.`,
    });
    router.push("/waiting-list");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <UserPlus2 className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-headline font-bold">Adicionar à Lista de Espera</h1>
      </div>

      <Card className="shadow-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="font-headline">Detalhes do Paciente</CardTitle>
              <CardDescription>
                Preencha as informações abaixo para adicionar um paciente à lista de espera.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="patientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Paciente *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome completo do paciente" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone de Contato</FormLabel>
                      <FormControl>
                        <Input placeholder="(XX) XXXXX-XXXX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email de Contato</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@exemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="requestedPsychologistId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Psicólogo(a) Solicitado(a)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um(a) psicólogo(a) ou qualquer" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockPsychologistsForSelect.map(p => (
                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prioridade *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a prioridade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {priorityOptions.map(option => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Preferências de horário, motivo breve, etc." {...field} rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Adicionando..." : "Adicionar à Lista"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
