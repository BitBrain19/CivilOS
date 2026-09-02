// ============================================================
// PROJECTS MOCK DATA
// ============================================================

export interface Project {
  id: string;
  name: string;
  code: string;
  location: string;
  client: string;
  contractor: string;
  type: 'residential' | 'bridge' | 'commercial';
  startDate: string;
  plannedEndDate: string;
  contractValue: number; // NPR
  spentToDate: number;   // NPR
  plannedProgress: number; // %
  actualProgress: number;  // %
  status: 'on-track' | 'delayed' | 'critical';
  description: string;
}

export const projects: Project[] = [
  {
    id: 'p1',
    name: 'Shantinagar Residency Complex',
    code: 'SRC-2024',
    location: 'Shantinagar, Kathmandu',
    client: 'Bhattarai Properties Pvt. Ltd.',
    contractor: 'Narayan Constructions Pvt. Ltd.',
    type: 'residential',
    startDate: '2024-03-01',
    plannedEndDate: '2026-02-28',
    contractValue: 185000000,
    spentToDate: 116250000,
    plannedProgress: 70,
    actualProgress: 62,
    status: 'delayed',
    description: '8-storey residential complex with 48 units, 2 basement car parks, rooftop garden.',
  },
  {
    id: 'p2',
    name: 'Bagmati Corridor Bridge Rehabilitation',
    code: 'BCB-2024',
    location: 'Thapagaun–Tinkune, Lalitpur',
    client: 'Department of Roads, GoN',
    contractor: 'Narayan Constructions Pvt. Ltd.',
    type: 'bridge',
    startDate: '2024-07-15',
    plannedEndDate: '2026-06-30',
    contractValue: 94500000,
    spentToDate: 28350000,
    plannedProgress: 52,
    actualProgress: 38,
    status: 'critical',
    description: 'Rehabilitation of 120m prestressed concrete bridge with approach roads and slope protection.',
  },
  {
    id: 'p3',
    name: 'Nabil Trade Tower',
    code: 'NTT-2023',
    location: 'Durbar Marg, Patan',
    client: 'Nabil Holdings Ltd.',
    contractor: 'Narayan Constructions Pvt. Ltd.',
    type: 'commercial',
    startDate: '2023-09-01',
    plannedEndDate: '2025-12-31',
    contractValue: 320000000,
    spentToDate: 265600000,
    plannedProgress: 85,
    actualProgress: 81,
    status: 'on-track',
    description: '14-storey commercial office tower with 2 basement levels, modern façade, central atrium.',
  },
];

export const getProject = (id: string) => projects.find((p) => p.id === id);
