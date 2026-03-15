export const authPermissions = [
  // TENANT MANAGEMENT
  {
    module: 'TENANT',
    name: 'TENANT:CREATE',
    resource: 'TENANT',
    action: 'CREATE',
    description: 'Create new tenant (hospital/clinic)',
  },
  {
    module: 'TENANT',
    name: 'TENANT:VIEW',
    resource: 'TENANT',
    action: 'VIEW',
    description: 'View tenants',
  },
  {
    module: 'TENANT',
    name: 'TENANT:UPDATE',
    resource: 'TENANT',
    action: 'UPDATE',
    description: 'Update tenant information',
  },
  {
    module: 'TENANT',
    name: 'TENANT:SUSPEND',
    resource: 'TENANT',
    action: 'SUSPEND',
    description: 'Suspend tenant',
  },
  {
    module: 'TENANT',
    name: 'TENANT:ARCHIVE',
    resource: 'TENANT',
    action: 'ARCHIVE',
    description: 'Archive tenant',
  },

  // USER MANAGEMENT
  {
    module: 'USER',
    name: 'USER:CREATE',
    resource: 'USER',
    action: 'CREATE',
    description: 'Create user',
  },
  {
    module: 'USER',
    name: 'USER:VIEW',
    resource: 'USER',
    action: 'VIEW',
    description: 'View users',
  },
  {
    module: 'USER',
    name: 'USER:UPDATE',
    resource: 'USER',
    action: 'UPDATE',
    description: 'Update user',
  },
  {
    module: 'USER',
    name: 'USER:DELETE',
    resource: 'USER',
    action: 'DELETE',
    description: 'Delete user',
  },

  // ROLE MANAGEMENT
  {
    module: 'ROLE',
    name: 'ROLE:CREATE',
    resource: 'ROLE',
    action: 'CREATE',
    description: 'Create role',
  },
  {
    module: 'ROLE',
    name: 'ROLE:VIEW',
    resource: 'ROLE',
    action: 'VIEW',
    description: 'View roles',
  },
  {
    module: 'ROLE',
    name: 'ROLE:UPDATE',
    resource: 'ROLE',
    action: 'UPDATE',
    description: 'Update role',
  },
  {
    module: 'ROLE',
    name: 'ROLE:DELETE',
    resource: 'ROLE',
    action: 'DELETE',
    description: 'Delete role',
  },

  // PERMISSION MANAGEMENT
  {
    module: 'PERMISSION',
    name: 'PERMISSION:ASSIGN',
    resource: 'PERMISSION',
    action: 'ASSIGN',
    description: 'Assign permission to role',
  },
  {
    module: 'PERMISSION',
    name: 'PERMISSION:REMOVE',
    resource: 'PERMISSION',
    action: 'REMOVE',
    description: 'Remove permission from role',
  },
  {
    module: 'PERMISSION',
    name: 'PERMISSION:VIEW',
    resource: 'PERMISSION',
    action: 'VIEW',
    description: 'View permissions',
  },

  // REPORT
  {
    module: 'REPORT',
    name: 'REPORT:VIEW',
    resource: 'REPORT',
    action: 'VIEW',
    description: 'View system reports',
  },
  {
    module: 'REPORT',
    name: 'REPORT:EXPORT',
    resource: 'REPORT',
    action: 'EXPORT',
    description: 'Export reports',
  },
] as const;

export type TAuthPermission = (typeof authPermissions)[number]['name'];
