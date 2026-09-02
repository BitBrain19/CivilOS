// ============================================================
// LABOR GANG LOG
// ============================================================

export interface GangMember {
  trade: string;
  count: number;
  present: number;
}

export interface LaborGang {
  id: string;
  projectId: string;
  naikeName: string;
  gangName: string;
  trades: GangMember[];
  totalStrength: number;
  presentToday: number;
  assignedActivity: string;
  boqItemId: string;
  workLocation: string;
  date: string;
  remarks: string;
}

export const laborGangs: LaborGang[] = [
  // p1 — Shantinagar
  {
    id: 'lg-001',
    projectId: 'p1',
    naikeName: 'Ram Bahadur Thapa',
    gangName: 'Ram Bahadur Naike\'s Mason Gang',
    trades: [
      { trade: 'Mason', count: 8, present: 8 },
      { trade: 'Helper / Bharat', count: 14, present: 12 },
      { trade: 'Bar-bender', count: 2, present: 2 },
    ],
    totalStrength: 24,
    presentToday: 22,
    assignedActivity: 'RCC Slab Pour — 5th Floor East Wing',
    boqItemId: 'b1-5',
    workLocation: '5th Floor, East Wing, Grid D–H',
    date: '2024-10-01',
    remarks: 'Two helpers absent. Work proceeding normally.',
  },
  {
    id: 'lg-002',
    projectId: 'p1',
    naikeName: 'Hari Bahadur Tamang',
    gangName: 'Hari Tamang\'s Bar Benders',
    trades: [
      { trade: 'Bar-bender', count: 6, present: 6 },
      { trade: 'Helper / Bharat', count: 6, present: 5 },
    ],
    totalStrength: 12,
    presentToday: 11,
    assignedActivity: 'Column Reinforcement — 6th Floor (C6–C18)',
    boqItemId: 'b1-6',
    workLocation: '6th Floor, All Grids',
    date: '2024-10-01',
    remarks: 'Cage fabrication on schedule.',
  },
  {
    id: 'lg-003',
    projectId: 'p1',
    naikeName: 'Mohan Bahadur Karki',
    gangName: 'Mohan Carpenter Gang',
    trades: [
      { trade: 'Carpenter', count: 4, present: 3 },
      { trade: 'Helper / Bharat', count: 4, present: 3 },
    ],
    totalStrength: 8,
    presentToday: 6,
    assignedActivity: 'Shuttering Fix — 6th Floor Beams',
    boqItemId: 'b1-10',
    workLocation: '6th Floor, Beam Lines',
    date: '2024-10-01',
    remarks: 'Two carpenters reassigned to 5th floor strike work. Progressing slowly.',
  },
  // p2 — Bagmati Bridge
  {
    id: 'lg-004',
    projectId: 'p2',
    naikeName: 'Sita Rai',
    gangName: 'Excavation Gang — Sita Rai',
    trades: [
      { trade: 'Excavator Operator', count: 1, present: 1 },
      { trade: 'Helper / Bharat', count: 8, present: 7 },
    ],
    totalStrength: 9,
    presentToday: 8,
    assignedActivity: 'Pile Boring — South Abutment (P-14 to P-16)',
    boqItemId: 'b2-2',
    workLocation: 'South Abutment, Bank Station',
    date: '2024-10-01',
    remarks: 'One helper absent. Boring progressing as per programme.',
  },
  {
    id: 'lg-005',
    projectId: 'p2',
    naikeName: 'Bikash Shrestha',
    gangName: 'Concrete Gang — Bikash',
    trades: [
      { trade: 'Mason', count: 4, present: 4 },
      { trade: 'Helper / Bharat', count: 8, present: 8 },
    ],
    totalStrength: 12,
    presentToday: 12,
    assignedActivity: 'PCC Bed — North Abutment Footing',
    boqItemId: 'b2-3',
    workLocation: 'North Abutment',
    date: '2024-10-01',
    remarks: 'Full gang present. Mix 1:3:6 being done by transit mixer.',
  },
];

export const getLaborByProject = (projectId: string) => laborGangs.filter((g) => g.projectId === projectId);
