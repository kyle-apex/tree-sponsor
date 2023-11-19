import { useSession } from 'next-auth/client';
import React, { ReactNode } from 'react';
import { Session } from 'interfaces';
import { AccessTypes, AccessType } from 'utils/auth/AccessType';

const RestrictSection = ({
  children,
  accessType,
  accessType2,
}: {
  children: ReactNode;
  accessType: AccessType;
  accessType2?: AccessType;
}) => {
  const [nextSession] = useSession();

  const session = nextSession as Session;

  if (!session?.user?.roles) return null;

  const roles = session.user.roles;

  const permissions = roles.reduce((merged, role) => {
    for (const item in AccessTypes) {
      if (typeof item === 'string') {
        const accessType = item as AccessType;
        merged[accessType] ||= role[accessType];
        if (accessType2) merged[accessType2] ||= role[accessType2];
      }
    }
    return merged;
  }, {});

  if (!permissions[accessType]) return null;

  return <>{children}</>;
};

export default RestrictSection;
