
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

interface ConsentModalProps {
  uid: string;
}

export default function ConsentModal({ uid }: ConsentModalProps) {
  const [open, setOpen] = useState(true);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (open) {
      const modal = document.getElementById('consent-modal');
      modal?.focus();
    }
  }, [open]);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && closeModal();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [closeModal]);

  const closeModal = useCallback(() => setOpen(false), []);

  const handleConfirm = async () => {
    if (!checked) return;
    await setDoc(doc(db, 'users', uid), { consentAt: serverTimestamp() }, { merge: true });
    closeModal();
  };

  return (
    <Dialog open={open}>
      <DialogContent
        id="consent-modal"
        role="dialog"
        aria-labelledby="consent-title"
        aria-describedby="consent-text"
        tabIndex={-1}
        className="max-w-md"
      >
        <DialogHeader>
          <DialogTitle id="consent-title" className="font-headline">
            Consentimento
          </DialogTitle>
        </DialogHeader>
        <div id="consent-text" className="space-x-2 flex items-center py-4">
          <Checkbox id="consent" checked={checked} onCheckedChange={(v) => setChecked(!!v)} />
          <label htmlFor="consent" className="text-sm">Aceito política de privacidade</label>
        </div>
        <DialogFooter>
          <Button onClick={handleConfirm} disabled={!checked} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
