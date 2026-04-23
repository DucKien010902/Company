import {
  Building2,
  ContactRound,
  LayoutDashboard,
  Network,
  Shield,
  ShoppingBag,
  UserCircle2,
  Users,
  Waypoints,
  ClipboardList,
} from 'lucide-react';
import { PermissionKey } from '@/types';

export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: PermissionKey;
  note?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    title: 'T\u1ed5ng quan',
    items: [{ label: 'B\u1ea3ng \u0111i\u1ec1u khi\u1ec3n', href: '/dashboard', icon: LayoutDashboard }],
  },
  {
    title: 'C\u1ed1t l\u00f5i',
    items: [{ label: 'H\u1ed3 s\u01a1 c\u00f4ng ty', href: '/dashboard/company', icon: Building2, permission: 'company.read' }],
  },
  {
    title: '\u0110\u1ecbnh danh & Ph\u00e2n quy\u1ec1n',
    items: [{ label: 'Vai tr\u00f2', href: '/dashboard/iam/roles', icon: Shield, permission: 'roles.read' }],
  },
  {
    title: 'T\u1ed5 ch\u1ee9c',
    items: [
      { label: 'Chi nh\u00e1nh', href: '/dashboard/org/branches', icon: Network, permission: 'branches.read' },
      { label: '\u0110\u01a1n v\u1ecb t\u1ed5 ch\u1ee9c', href: '/dashboard/org/units', icon: Waypoints, permission: 'orgUnits.read' },
      { label: 'Ch\u1ee9c danh', href: '/dashboard/org/positions', icon: ClipboardList, permission: 'positions.read' },
    ],
  },
  {
    title: 'Nghi\u1ec7p v\u1ee5',
    items: [
      { label: 'Nh\u00e2n vi\u00ean', href: '/dashboard/hr/employees', icon: UserCircle2, permission: 'employees.read' },
      { label: '\u0110\u1ed1i t\u00e1c', href: '/dashboard/crm/parties', icon: Users, permission: 'parties.read' },
      { label: 'Li\u00ean h\u1ec7', href: '/dashboard/crm/contacts', icon: ContactRound, permission: 'contacts.read' },
      { label: 'S\u1ea3n ph\u1ea9m', href: '/dashboard/catalog/products', icon: ShoppingBag, note: '' },
    ],
  },
  {
    title: 'H\u1ec7 th\u1ed1ng',
    items: [{ label: 'Nh\u1eadt k\u00fd h\u1ec7 th\u1ed1ng', href: '/dashboard/system/audit', icon: ClipboardList, permission: 'audit.read' }],
  },
];
