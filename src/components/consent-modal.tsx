"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { db } from '@/services/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

interface ConsentModalProps {
  uid: string;
}

export default function ConsentModal({ uid }: ConsentModalProps) {
  const [open, setOpen] = useState(true);
  const [checked, setChecked] = useState(false);

  const handleConfirm = async () => {
    if (!checked) return;
    await setDoc(doc(db, 'users', uid), { consentAt: serverTimestamp() }, { merge: true });
    setOpen(false);
  };

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Consentimento</DialogTitle>
        </DialogHeader>
        <div className="space-x-2 flex items-center py-4">
          <Checkbox id="consent" checked={checked} onCheckedChange={(v) => setChecked(!!v)} />
          <label htmlFor="consent" className="text-sm">Aceito política de privacidade</label>
        </div>
        <DialogFooter>
          <Button onClick={handleConfirm} disabled={!checked} className="bg-accent text-accent-foreground">
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
