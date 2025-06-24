'use client';

import { useState } from 'react';
import { useClinicalStore } from '@/stores/clinicalStore';
import { useMapFilters, MapFilters } from '@/hooks/use-map-filters';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Archive, Filter, Plus } from 'lucide-react'; // Example icons

export function MapToolbar() {
  const { addCard, labels, restoreCard, cards } = useClinicalStore();

  const { filters, setFilters } = useMapFilters();

  const [newCardType, setNewCardType] = useState('Generic');

  const handleAddCard = () => {
    addCard(newCardType);
  };

  const handleFilterChange = (key: keyof MapFilters, value: any) => {
    setFilters(key, value);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-2 border-b">
      {/* Create Card Section */}
      <div className="flex items-center gap-2 border-r pr-2">
        <Label htmlFor="cardTypeSelect">
          <Plus className="h-4 w-4" />
        </Label>
        <Select onValueChange={setNewCardType} defaultValue={newCardType}>
          <SelectTrigger id="cardTypeSelect" className="w-[120px]">
            <SelectValue placeholder="Select card type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Generic">Generic</SelectItem>
            <SelectItem value="ABC">ABC</SelectItem>
            <SelectItem value="Chain">Chain</SelectItem>
            <SelectItem value="Matrix">Matrix</SelectItem>
            {/* Add other card types here */}
          </SelectContent>
        </Select>
        <Button onClick={handleAddCard}>Add Card</Button>
      </div>

      {/* Filters Section */}
      <div className="flex items-center gap-2">
        <Label htmlFor="filterMenu">
          <Filter className="h-4 w-4" />
        </Label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" id="filterMenu">
              Filters
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Filter Cards</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* Filter by Card Type */}
            <DropdownMenuItem>
              <div className="flex flex-col w-full">
                <Label htmlFor="filterCardType">Card Type</Label>
                <Select
                  value={filters.type || ''}
                  onValueChange={(value) => handleFilterChange('type', value === '' ? null : value)}
                >
                  <SelectTrigger id="filterCardType">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Types</SelectItem>
                    <SelectItem value="Generic">Generic</SelectItem>
                    <SelectItem value="ABC">ABC</SelectItem>
                    <SelectItem value="Chain">Chain</SelectItem>
                    <SelectItem value="Matrix">Matrix</SelectItem>
                    {/* Add other card types here */}
                  </SelectContent>
                </Select>
              </div>
            </DropdownMenuItem>

            {/* Filter by Session Number */}
            <DropdownMenuItem>
              <div className="flex flex-col w-full">
                <Label htmlFor="filterSessionNumber">Session Number</Label>
                <Input
                  id="filterSessionNumber"
                  type="number"
                  placeholder="All Sessions"
                  value={filters.sessionNumber || ''}
                  onChange={(e) =>
                    handleFilterChange(
                      'sessionNumber',
                      e.target.value === '' ? null : parseInt(e.target.value, 10)
                    )
                  }
                />
              </div>
            </DropdownMenuItem>

            {/* Filter by Labels */}
            <DropdownMenuItem>
              <div className="flex flex-col w-full">
                <Label>Labels</Label>
                {labels.map((label) => (
                  <div key={label.id} className="flex items-center space-x-2">
                    <Switch
                      checked={filters.labels?.includes(label.id) || false}
                      onCheckedChange={(checked) => {
                        const currentLabels = filters.labels || [];
                        if (checked) {
                          handleFilterChange(
                            'labels',
                            [...currentLabels, label.id].filter(
                              (value, index, self) => self.indexOf(value) === index
                            ) // Ensure unique labels
                          );
                        } else {
                          handleFilterChange(
                            'labels',
                            currentLabels.filter((id) => id !== label.id)
                          );
                        }
                      }}
                      id={`filterLabel-${label.id}`}
                    />

                    <Label htmlFor={`filterLabel-${label.id}`}>{label.text}</Label>
                  </div>
                ))}
              </div>
            </DropdownMenuItem>

            {/* Filter by Archived Cards */}
            <DropdownMenuItem>
              <div className="flex items-center space-x-2 w-full">
                <Label htmlFor="filterArchived">Show Archived</Label>
                <Switch
                  id="filterArchived"
                  onCheckedChange={(checked) => handleFilterChange('showArchived', checked)}
                />
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Archived Cards Section (Optional - could be a separate button or part of filters) */}
      <div className="flex items-center gap-2 ml-auto">
        <Label htmlFor="archiveButton">
          <Archive className="h-4 w-4" />
        </Label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" id="archiveButton">
              Archived Cards
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Archived Cards</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {cards.filter((card) => card.isArchived).length > 0 ? (
              cards
                .filter((card) => card.isArchived)
                .map((card) => (
                  <DropdownMenuItem key={card.id} onSelect={() => restoreCard(card.id)}>
                    {card.type} Card ({card.sessionNumber}) - Restore
                  </DropdownMenuItem>
                ))
            ) : (
              <DropdownMenuItem disabled>No archived cards</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
