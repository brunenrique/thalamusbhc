
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Share2 } from 'lucide-react';
import useClinicalStore from '@/stores/clinicalStore';

const MapToolbar: React.FC = () => {
  const { openABCForm, openSchemaForm } = useClinicalStore();

  return (
    <div className="flex gap-2 p-1.5 rounded-lg bg-background/90 backdrop-blur-sm shadow-md border border-border">
      <Button variant="outline" size="sm" className="h-8 px-2.5" onClick={() => openABCForm()}>
        <PlusCircle className="h-4 w-4 mr-1.5" /> Card ABC
      </Button>
      <Button variant="outline" size="sm" className="h-8 px-2.5" onClick={() => openSchemaForm()}>
        <Share2 className="h-4 w-4 mr-1.5" /> Esquema
      </Button>
    </div>
  );
};

export default MapToolbar;

    