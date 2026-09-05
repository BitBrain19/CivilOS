// ============================================================
// DPR — DAILY PROGRESS REPORT ENTRIES
// ============================================================

export interface DPREntry {
  id: string;
  projectId: string;
  date: string;
  boqItemId: string;
  boqItemDesc: string;
  unit: string;
  quantityToday: number;
  cumulativeQty: number;
  gang: string;
  remarks: string;
  photoRef: string;
  geotag: string;
  timestamp: string;
  certified: boolean;
  certifiedBy?: string;
  certifiedAt?: string;
  mbRef?: string;
  flag?: 'no-assignment' | 'unplanned-work';
  flagReason?: string;
  certificationReason?: string;
}

export const dprEntries: DPREntry[] = [
  // Sept 30 — p1
  {
    id: 'dpr-001',
    projectId: 'p1',
    date: '2024-09-30',
    boqItemId: 'b1-5',
    boqItemDesc: 'RCC M25 Beams & Slabs',
    unit: 'cum',
    quantityToday: 18.5,
    cumulativeQty: 552,
    gang: "Ram Bahadur Naike's Mason Gang",
    remarks: 'Slab pour 5th floor east wing completed. Vibration done adequately.',
    photoRef: '/photos/dpr-slab-pour.jpg',
    geotag: 'Shantinagar, 27.7041° N, 85.3381° E',
    timestamp: '2024-09-30T16:42:00+05:45',
    certified: true,
    certifiedBy: 'Er. Dipendra Shrestha',
    certifiedAt: '2024-10-01T09:15:00+05:45',
    mbRef: 'MB-SRC-2024-048',
  },
  {
    id: 'dpr-002',
    projectId: 'p1',
    date: '2024-09-30',
    boqItemId: 'b1-6',
    boqItemDesc: 'TMT Steel Bar Fe500 Reinforcement',
    unit: 'kg',
    quantityToday: 2200,
    cumulativeQty: 111000,
    gang: "Hari Tamang's Bar Benders",
    remarks: '6th floor column cages placed and tied. 12mm and 16mm bars used.',
    photoRef: '/photos/dpr-rebar.jpg',
    geotag: 'Shantinagar, 27.7041° N, 85.3381° E',
    timestamp: '2024-09-30T17:10:00+05:45',
    certified: true,
    certifiedBy: 'Er. Dipendra Shrestha',
    certifiedAt: '2024-10-01T09:15:00+05:45',
    mbRef: 'MB-SRC-2024-048',
  },
  {
    id: 'dpr-003',
    projectId: 'p1',
    date: '2024-09-30',
    boqItemId: 'b1-7',
    boqItemDesc: 'Brickwork in Cement Mortar (1:4)',
    unit: 'cum',
    quantityToday: 4.2,
    cumulativeQty: 660,
    gang: "Ram Bahadur Naike's Mason Gang",
    remarks: 'Block B ground floor partition walls. CM ratio maintained 1:4.',
    photoRef: '/photos/dpr-brickwork.jpg',
    geotag: 'Shantinagar, 27.7041° N, 85.3381° E',
    timestamp: '2024-09-30T16:58:00+05:45',
    certified: false,
    certifiedBy: undefined,
    certifiedAt: undefined,
  },
  // Oct 1 — p1 (today — awaiting certification)
  {
    id: 'dpr-004',
    projectId: 'p1',
    date: '2024-10-01',
    boqItemId: 'b1-4',
    boqItemDesc: 'RCC M25 Columns & Shear Walls',
    unit: 'cum',
    quantityToday: 6.8,
    cumulativeQty: 366.8,
    gang: "Ram Bahadur Naike's Mason Gang",
    remarks: 'C6 to C12 column pour completed. Curing started.',
    photoRef: '/photos/dpr-column.jpg',
    geotag: 'Shantinagar, 27.7041° N, 85.3381° E',
    timestamp: '2024-10-01T15:30:00+05:45',
    certified: false,
    // Planned & matches assignment -> no flag
  },
  {
    id: 'dpr-005',
    projectId: 'p1',
    date: '2024-10-01',
    boqItemId: 'b1-8',
    boqItemDesc: 'Cement Plastering 12mm (1:4)',
    unit: 'sqm',
    quantityToday: 120,
    cumulativeQty: 7520,
    gang: "Ram Bahadur Naike's Mason Gang",
    remarks: '3rd floor east wing internal plastering taken up early due to idle masonry hands.',
    photoRef: '/photos/dpr-plaster.jpg',
    geotag: 'Shantinagar, 27.7041° N, 85.3381° E',
    timestamp: '2024-10-01T16:00:00+05:45',
    certified: false,
    flag: 'unplanned-work',
    flagReason: 'Activity 1.08 Plastering was not on published assignment for Oct 1',
  },
  {
    id: 'dpr-006',
    projectId: 'p1',
    date: '2024-10-01',
    boqItemId: 'b1-10',
    boqItemDesc: 'Shuttering / Formwork',
    unit: 'sqm',
    quantityToday: 180,
    cumulativeQty: 6180,
    gang: 'Mohan Carpenter Gang',
    remarks: '6th floor beam bottom shuttering fixed.',
    photoRef: '/photos/dpr-shuttering.jpg',
    geotag: 'Shantinagar, 27.7041° N, 85.3381° E',
    timestamp: '2024-10-01T16:45:00+05:45',
    certified: false,
    // Planned & matches assignment -> no flag
  },
  // Entry with no supervisor assignment published for date
  {
    id: 'dpr-008',
    projectId: 'p1',
    date: '2024-09-28',
    boqItemId: 'b1-6',
    boqItemDesc: 'TMT Steel Bar Fe500 Reinforcement',
    unit: 'kg',
    quantityToday: 950,
    cumulativeQty: 108800,
    gang: "Hari Tamang's Bar Benders",
    remarks: 'Weekend urgent beam stirrup fabrication at ground yard.',
    photoRef: '/photos/dpr-rebar.jpg',
    geotag: 'Shantinagar, 27.7041° N, 85.3381° E',
    timestamp: '2024-09-28T17:00:00+05:45',
    certified: false,
    flag: 'no-assignment',
    flagReason: 'No supervisor assignment on file for 2024-09-28',
  },
  // p2 entries
  {
    id: 'dpr-007',
    projectId: 'p2',
    date: '2024-10-01',
    boqItemId: 'b2-2',
    boqItemDesc: 'Bored Pile Foundation D600',
    unit: 'rm',
    quantityToday: 12,
    cumulativeQty: 156,
    gang: 'Excavation Gang — Sita Rai',
    remarks: 'Pile P-14 to P-16 boring completed at south abutment.',
    photoRef: '/photos/dpr-pile.jpg',
    geotag: 'Thapagaun, 27.6870° N, 85.3430° E',
    timestamp: '2024-10-01T16:00:00+05:45',
    certified: false,
  },
];

export const getDPRByProject = (projectId: string) => dprEntries.filter((d) => d.projectId === projectId);
export const getPendingCertification = (projectId: string) => dprEntries.filter((d) => d.projectId === projectId && !d.certified);
export const getCertifiedEntries = (projectId: string) => dprEntries.filter((d) => d.projectId === projectId && d.certified);
