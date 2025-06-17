import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { MoreVertical } from 'lucide-react';

interface CardToolbarProps {
  onEdit?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
}

const CardToolbar: React.FC<CardToolbarProps> = ({ onEdit, onArchive, onDelete }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="w-6 h-6">
          <MoreVertical className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {onEdit && <DropdownMenuItem onClick={onEdit}>Editar</DropdownMenuItem>}
        {onArchive && <DropdownMenuItem onClick={onArchive}>Arquivar</DropdownMenuItem>}
        {onDelete && <DropdownMenuItem onClick={onDelete}>Deletar</DropdownMenuItem>}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CardToolbar;