import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { FirebaseError } from 'firebase/app';

interface UseApiFormOptions<T> {
  apiFunction: (data: T) => Promise<any>;
  successMessage: string;
  onSuccess?: (result?: any) => void;
}

export function useApiForm<T>({
  apiFunction,
  successMessage,
  onSuccess,
}: UseApiFormOptions<T>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (data: T) => {
    setIsSubmitting(true);
    try {
      const result = await apiFunction(data);
      toast({
        title: 'Sucesso',
        description: successMessage,
      });
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      let description = 'Ocorreu um erro. Por favor, tente novamente.';
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            description = 'E-mail ou senha inválidos.';
            break;
          case 'auth/too-many-requests':
            description =
              'Acesso temporariamente bloqueado devido a muitas tentativas.';
            break;
        }
      }
      toast({
        title: 'Erro',
        description: description,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, handleSubmit };
}
