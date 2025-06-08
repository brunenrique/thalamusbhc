
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserCheck, Users, CheckCircle, ShieldQuestion } from "lucide-react";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Mock data - replace with actual data fetching from Firestore
const mockPendingUsers = [
  { id: "usr1", name: "Dr. Eleanor Vance", email: "eleanor.vance@example.com", role: "Psychologist", dateRegistered: "2024-07-20", status: "Pendente" },
  { id: "usr2", name: "Samuel Green", email: "sam.green@example.com", role: "Secretary", dateRegistered: "2024-07-19", status: "Pendente" },
  { id: "usr3", name: "Dr. Arthur Finch", email: "arthur.finch@example.com", role: "Psychologist", dateRegistered: "2024-07-18", status: "Pendente" },
];

export default function UserApprovalsPage() {
  // TODO: Fetch pending users from Firestore where isApproved === false
  // TODO: Implement handleApproveUser function to update Firestore

  const handleApproveUser = (userId: string) => {
    console.log(`Aprovando usuário ${userId}...`);
    // Update Firestore: set isApproved = true for this userId
    // Re-fetch or update local state
  };

  const getRoleBadge = (role: string): "secondary" | "outline" | "default" => {
    if (role === "Psychologist") return "secondary";
    if (role === "Admin") return "default"; // Or a more distinct color for Admin
    return "outline";
  }
  
  const getRoleLabel = (role: string): string => {
    const roleMap: Record<string, string> = {
        Psychologist: "Psicólogo(a)",
        Secretary: "Secretário(a)",
        Admin: "Administrador(a)"
    };
    return roleMap[role] || role;
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
          <CardDescription>Revise e aprove novos usuários solicitando acesso ao PsiGuard.</CardDescription>
        </CardHeader>
        <CardContent>
          {mockPendingUsers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Data de Registro</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPendingUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadge(user.role)}>
                        {getRoleLabel(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>{format(new Date(user.dateRegistered), "P", { locale: ptBR })}</TableCell>
                    <TableCell>
                      <Badge variant="destructive">{user.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        size="sm" 
                        onClick={() => handleApproveUser(user.id)}
                        className="bg-accent hover:bg-accent/90 text-accent-foreground"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" /> Aprovar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
