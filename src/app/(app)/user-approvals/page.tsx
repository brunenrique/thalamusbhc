
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, CheckCircle, ShieldQuestion, Trash2, UserX } from "lucide-react";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { collection, doc, getFirestore, query, updateDoc, where, deleteDoc, onSnapshot, Unsubscribe } from "firebase/firestore";
import { app } from "@/lib/firebase";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface PendingUser {
  id: string;
  name: string;
  email: string;
  role: string;
  dateRegistered: string;
  status: string;
}

export default function UserApprovalsPage() {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);
    const db = getFirestore(app);
    const q = query(collection(db, "users"), where("isApproved", "==", false));

    const unsubscribe: Unsubscribe = onSnapshot(q, (snapshot) => {
      const users = snapshot.docs.map(docSnap => {
        const data = docSnap.data() as any;
        return {
          id: docSnap.id,
          name: data.name || "Nome não informado",
          email: data.email,
          role: data.role || "Função não definida",
          dateRegistered: data.dateRegistered?.toDate ? data.dateRegistered.toDate().toISOString() : new Date().toISOString(),
          status: "Pendente",
        } as PendingUser;
      });
      setPendingUsers(users);
      setLoading(false);
    }, (error) => {
      console.error("Erro ao buscar usuários pendentes com onSnapshot:", error);
      toast({
        title: "Erro ao Carregar Usuários",
        description: "Não foi possível buscar os usuários pendentes em tempo real. Tente novamente mais tarde.",
        variant: "destructive",
      });
      setLoading(false);
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, [toast]);

  const handleApproveUser = async (userId: string) => {
    try {
      const db = getFirestore(app);
      await updateDoc(doc(db, "users", userId), { isApproved: true });
      // No need to manually update setPendingUsers here, onSnapshot will handle it
      toast({
        title: "Usuário Aprovado",
        description: "O usuário foi aprovado com sucesso e agora tem acesso ao sistema.",
      });
    } catch (error) {
      console.error("Erro ao aprovar usuário:", error);
      toast({
        title: "Erro ao Aprovar",
        description: "Não foi possível aprovar o usuário. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleRejectUser = async (userId: string, userName: string) => {
    try {
      const db = getFirestore(app);
      await deleteDoc(doc(db, "users", userId));
      // No need to manually update setPendingUsers here, onSnapshot will handle it
      toast({
        title: "Usuário Rejeitado",
        description: `O usuário ${userName} foi rejeitado e removido da lista de pendências.`,
        variant: "default",
      });
    } catch (error) {
      console.error("Erro ao rejeitar usuário:", error);
      toast({
        title: "Erro ao Rejeitar",
        description: "Não foi possível rejeitar o usuário. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const getRoleBadge = (role: string): "secondary" | "outline" | "default" => {
    if (role === "Psychologist") return "secondary";
    if (role === "Admin") return "default";
    return "outline";
  };

  const getRoleLabel = (role: string): string => {
    const roleMap: Record<string, string> = {
      Psychologist: "Psicólogo(a)",
      Secretary: "Secretário(a)",
      Admin: "Administrador(a)",
    };
    return roleMap[role] || role;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <ShieldQuestion className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-headline font-bold">Aprovação de Usuários</h1>
        </div>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline">Registros de Usuários Pendentes</CardTitle>
            <CardDescription>Carregando usuários pendentes...</CardDescription>
          </CardHeader>
          <CardContent className="text-center py-10">
            <Users className="mx-auto h-12 w-12 text-muted-foreground animate-pulse" />
            <p className="mt-2 text-muted-foreground">Buscando dados...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <ShieldQuestion className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-headline font-bold">Aprovação de Usuários</h1>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="font-headline">Registros de Usuários Pendentes</CardTitle>
          <CardDescription>Revise e aprove ou rejeite novos usuários solicitando acesso ao PsiGuard.</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">Nome</TableHead>
                    <TableHead className="min-w-[200px]">Email</TableHead>
                    <TableHead className="min-w-[120px]">Função Solicitada</TableHead>
                    <TableHead className="min-w-[150px]">Data de Registro</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right min-w-[220px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingUsers.map(user => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadge(user.role)}>
                          {getRoleLabel(user.role)}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(user.dateRegistered), "P 'às' HH:mm", { locale: ptBR })}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleApproveUser(user.id)}
                          className="bg-accent hover:bg-accent/90 text-accent-foreground"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" /> Aprovar
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="bg-destructive/90 hover:bg-destructive text-destructive-foreground"
                            >
                              <UserX className="mr-2 h-4 w-4" /> Rejeitar
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Rejeitar Usuário?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja rejeitar e excluir a solicitação de acesso de {user.name} ({user.email})? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleRejectUser(user.id, user.name)}
                                className="bg-destructive hover:bg-destructive/80"
                              >
                                Confirmar Rejeição
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10">
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium text-foreground">Nenhuma aprovação pendente</h3>
              <p className="mt-1 text-sm text-muted-foreground">Todos os usuários foram revisados.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
