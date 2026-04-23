export const PERMISSION_CATALOG = {
  company: ['company.read', 'company.update'],
  roles: ['roles.read', 'roles.create', 'roles.update', 'roles.delete'],
  branches: ['branches.read', 'branches.create', 'branches.update', 'branches.delete'],
  orgUnits: ['orgUnits.read', 'orgUnits.create', 'orgUnits.update', 'orgUnits.delete'],
  positions: ['positions.read', 'positions.create', 'positions.update', 'positions.delete'],
  employees: [
    'employees.read',
    'employees.create',
    'employees.update',
    'employees.delete',
    'employees.assignManager',
  ],
  crm: [
    'parties.read',
    'parties.create',
    'parties.update',
    'parties.delete',
    'contacts.read',
    'contacts.create',
    'contacts.update',
    'contacts.delete',
  ],
  audit: ['audit.read'],
} as const;

export const ALL_PERMISSIONS = Object.values(PERMISSION_CATALOG).flat();
