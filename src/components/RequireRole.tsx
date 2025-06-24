'use client';
import { ReactNode, useEffect, useState } from 'react';
import { checkUserRole } from '@/services/authRole';
import type { UserRole } from '@/constants/roles';

interface RequireRoleProps {
  role: UserRole | UserRole[];
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
