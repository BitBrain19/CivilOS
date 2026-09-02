// ============================================================
// MEASUREMENT BOOK (MB)
// ============================================================

export interface MBSubItem {
  slNo: number;
  description: string;
  noNos: number;
  length: number;
  breadth: number;
  height: number;
  quantity: number;
}

export interface MBEntry {
  id: string;
  projectId: string;
  mbNo: string;
  date: string;
  checkedBy: string;
  approvedBy: string;
  boqItemId: string;
  boqItemDesc: string;
  unit: string;
  dprRef: string[];
  subItems: MBSubItem[];
  totalCertifiedQty: number;
  cumulativePrevQty: number;
  cumulativeThisMB: number;
  remarks: string;
  status: 'draft' | 'certified' | 'approved';
}

export const measurementBookEntries: MBEntry[] = [
  {
    id: 'mb-001',
    projectId: 'p1',
    mbNo: 'MB-SRC-2024-048',
    date: '2024-10-01',
    checkedBy: 'Er. Dipendra Shrestha (Site Engineer)',
    approvedBy: 'Er. Prashant Koirala (Project Manager)',
    boqItemId: 'b1-5',
    boqItemDesc: 'RCC M25 Beams & Slabs — 5th Floor East Wing',
    unit: 'cum',
    dprRef: ['dpr-001'],
    subItems: [
      { slNo: 1, description: 'Slab — Grid D–F, E5–E8 (L×B×H)', noNos: 1, length: 18.0, breadth: 12.5, height: 0.15, quantity: 33.75 },
      { slNo: 2, description: 'Slab — Grid F–H, E5–E8', noNos: 1, length: 16.2, breadth: 12.5, height: 0.15, quantity: 30.38 },
      { slNo: 3, description: 'Secondary Beam B-12 (deduction)', noNos: -4, length: 4.5, breadth: 0.30, height: 0.45, quantity: -2.43 },
      { slNo: 4, description: 'Primary Beam B-08', noNos: -2, length: 12.5, breadth: 0.40, height: 0.55, quantity: -5.50 },
    ],
    totalCertifiedQty: 56.20,
    cumulativePrevQty: 495.80,
    cumulativeThisMB: 552.00,
    remarks: 'Measured from approved drawing SRC-SD-005 Rev.2. Deductions for beams applied as per practice.',
    status: 'certified',
  },
  {
    id: 'mb-002',
    projectId: 'p1',
    mbNo: 'MB-SRC-2024-047',
    date: '2024-09-22',
    checkedBy: 'Er. Dipendra Shrestha (Site Engineer)',
    approvedBy: 'Er. Prashant Koirala (Project Manager)',
    boqItemId: 'b1-4',
    boqItemDesc: 'RCC M25 Columns & Shear Walls — 5th Floor',
    unit: 'cum',
    dprRef: ['dpr-004'],
    subItems: [
      { slNo: 1, description: 'Columns C1–C6 (0.45×0.45×3.1m)', noNos: 6, length: 3.10, breadth: 0.45, height: 0.45, quantity: 3.77 },
      { slNo: 2, description: 'Columns C7–C12 (0.40×0.40×3.1m)', noNos: 6, length: 3.10, breadth: 0.40, height: 0.40, quantity: 2.98 },
      { slNo: 3, description: 'Shear Wall SW-01 (3.5×0.25×3.1m)', noNos: 2, length: 3.50, breadth: 0.25, height: 3.10, quantity: 5.43 },
    ],
    totalCertifiedQty: 12.18,
    cumulativePrevQty: 347.82,
    cumulativeThisMB: 360.00,
    remarks: 'All column dimensions verified against approved structural drawing SRC-SD-003 Rev.3.',
    status: 'approved',
  },
  {
    id: 'mb-003',
    projectId: 'p1',
    mbNo: 'MB-SRC-2024-049',
    date: '2024-10-01',
    checkedBy: 'Er. Dipendra Shrestha (Site Engineer)',
    approvedBy: '',
    boqItemId: 'b1-6',
    boqItemDesc: 'TMT Steel Bar Fe500 Reinforcement',
    unit: 'kg',
    dprRef: ['dpr-002'],
    subItems: [
      { slNo: 1, description: '12mm dia bars — Column cages C6–C12', noNos: 1, length: 1, breadth: 1, height: 1, quantity: 880 },
      { slNo: 2, description: '16mm dia bars — Column cages C6–C12', noNos: 1, length: 1, breadth: 1, height: 1, quantity: 1240 },
      { slNo: 3, description: '8mm stirrups @ 150mm c/c', noNos: 1, length: 1, breadth: 1, height: 1, quantity: 80 },
    ],
    totalCertifiedQty: 2200,
    cumulativePrevQty: 108800,
    cumulativeThisMB: 111000,
    remarks: 'Weight verified from bar bending schedule BBS-SRC-2024-006. Mill cert attached.',
    status: 'draft',
  },
];

export const getMBByProject = (projectId: string) => measurementBookEntries.filter((m) => m.projectId === projectId);
