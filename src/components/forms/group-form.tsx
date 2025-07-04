'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Save, CalendarDays, ListChecks } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { groupSchema } from '@/schemas/groupSchema';
import { createGroup, updateGroup } from '@/services/groupService';
import type { z } from 'zod';
import logger from '@/lib/logger';

// Mock data - ideally fetch from services or context
const mockPatientsForSelect = [
  { id: '1', name: 'Alice Wonderland' },
  { id: '2', name: 'Bob O Construtor' },
  { id: '3', name: 'Charlie Brown' },
  { id: '4', name: 'Diana Prince' },
  { id: '5', name: 'Eva Green' },
  { id: '6', name: 'Frank Castle' },
];

const mockPsychologistsForSelect = [
  { id: 'psy1', name: 'Dr. Silva' },
  { id: 'psy2', name: 'Dra. Jones' },
];

const daysOfWeekOptions = [
  { id: 'monday', label: 'Segunda-feira' },
  { id: 'tuesday', label: 'Terça-feira' },
  { id: 'wednesday', label: 'Quarta-feira' },
  { id: 'thursday', label: 'Quinta-feira' },
  { id: 'friday', label: 'Sexta-feira' },
  { id: 'saturday', label: 'Sábado' },
  { id: 'sunday', label: 'Domingo' },
];

export type GroupFormValues = z.infer<typeof groupSchema>;

interface GroupFormProps {
  initialData?: GroupFormValues;
  groupId?: string;
}

export default function GroupForm({ initialData, groupId }: GroupFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<GroupFormValues>({
    resolver: zodResolver(groupSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      psychologistId: '',
      patientIds: [],
      dayOfWeek: 'monday',
      startTime: '18:00',
      endTime: '19:30',
      meetingAgenda: '',
    },
  });

  async function onSubmit(data: GroupFormValues) {
    setIsLoading(true);
    try {
      if (groupId) {
        await updateGroup(groupId, data);
      } else {
        await createGroup(data);
      }
      toast({
        title: groupId ? 'Grupo Atualizado' : 'Grupo Criado',
        description: `O grupo "${data.name}" foi ${groupId ? 'atualizado' : 'criado'} com sucesso. Horário ${data.dayOfWeek} das ${data.startTime} às ${data.endTime}.`,
      });
      router.push('/groups');
    } catch (e) {
      logger.error({ action: 'save_group_error', meta: { error: e } });
      toast({
        title: 'Erro ao Salvar',
        description: 'Não foi possível salvar o grupo. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="shadow-lg">
      <Form {...form}>
        <form role="form" onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="font-headline">
              {groupId ? 'Editar Detalhes do Grupo' : 'Novo Grupo Terapêutico'}
            </CardTitle>
            <CardDescription>
              Preencha as informações para {groupId ? 'atualizar' : 'criar'} o grupo.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Grupo *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Grupo de Apoio à Ansiedade" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detalhes sobre o grupo, objetivos, etc."
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="psychologistId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Psicólogo(a) Responsável *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o(a) psicólogo(a)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockPsychologistsForSelect.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="patientIds"
              render={() => (
                <FormItem>
                  <FormLabel>Integrantes do Grupo *</FormLabel>
                  <Card className="p-4 bg-muted/20">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-60 overflow-y-auto">
                      {mockPatientsForSelect.map((patient) => (
                        <FormField
                          key={patient.id}
                          control={form.control}
                          name="patientIds"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={patient.id}
                                className="flex flex-row items-center space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    aria-label={`Selecionar ${patient.name}`}
                                    checked={field.value?.includes(patient.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), patient.id])
                                        : field.onChange(
                                            (field.value || []).filter(
                                              (value) => value !== patient.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal cursor-pointer">
                                  {patient.name}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                  </Card>
                  <FormDescription>
                    Selecione os pacientes que farão parte deste grupo.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Card className="p-4 bg-muted/20 space-y-4">
              <CardTitle className="text-md font-semibold flex items-center">
                <CalendarDays className="mr-2 h-5 w-5 text-primary" /> Horário do Grupo
              </CardTitle>
              <FormField
                control={form.control}
                name="dayOfWeek"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dia da Semana *</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o dia" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {daysOfWeekOptions.map((day) => (
                          <SelectItem key={day.id} value={day.id}>
                            {day.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hora de Início *</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hora de Término *</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormDescription>
                Este horário será reservado na agenda do psicólogo responsável.
              </FormDescription>
            </Card>

            <FormField
              control={form.control}
              name="meetingAgenda"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <ListChecks className="mr-2 h-4 w-4 text-primary" /> Roteiro dos Encontros
                    (Opcional)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva o planejamento ou tópicos para as sessões do grupo. Ex: Sessão 1: Apresentações. Sessão 2: Tema X."
                      {...field}
                      rows={5}
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormDescription>
                    Este roteiro ajudará a guiar as sessões do grupo.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              type="submit"
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
              disabled={isLoading}
            >
              <Save className="mr-2 h-4 w-4" />
              {isLoading
                ? groupId
                  ? 'Salvando...'
                  : 'Criando Grupo...'
                : groupId
                  ? 'Salvar Alterações'
                  : 'Criar Grupo'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
