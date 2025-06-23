'use client';
import { ReactNode, useEffect, useState } from 'react';
import { checkUserRole } from '@/services/authRole';

interface RequireRoleProps {
  role: string | string[];
  children: ReactNode;
}

export default function RequireRole({ role, children }: RequireRoleProps) {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    checkUserRole(role).then(setAllowed);
  }, [role]);

  if (!allowed) return null;
  return <>{children}</>;
}
