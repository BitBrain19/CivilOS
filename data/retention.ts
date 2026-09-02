// ============================================================
// RETENTION & PAYMENT AGING
// ============================================================

export interface RetentionRecord {
  id: string;
  projectId: string;
  billNo: string;
  billDate: string;
  grossBillAmount: number;
  retentionPct: number;
  retentionHeld: number;
  dlpDate: string; // Defects Liability Period end date
  dlpMonths: number;
  released: number;
  balance: number;
  status: 'held' | 'partially-released' | 'released';
}

export const retentionRecords: RetentionRecord[] = [
  { id: 'ret-001', projectId: 'p1', billNo: 'RA-SRC-2024-01', billDate: '2024-03-15', grossBillAmount: 4200000, retentionPct: 5, retentionHeld: 210000, dlpDate: '2027-02-28', dlpMonths: 12, released: 0, balance: 210000, status: 'held' },
  { id: 'ret-002', projectId: 'p1', billNo: 'RA-SRC-2024-02', billDate: '2024-04-18', grossBillAmount: 5800000, retentionPct: 5, retentionHeld: 290000, dlpDate: '2027-02-28', dlpMonths: 12, released: 0, balance: 290000, status: 'held' },
  { id: 'ret-003', projectId: 'p1', billNo: 'RA-SRC-2024-03', billDate: '2024-05-20', grossBillAmount: 8100000, retentionPct: 5, retentionHeld: 405000, dlpDate: '2027-02-28', dlpMonths: 12, released: 0, balance: 405000, status: 'held' },
  { id: 'ret-004', projectId: 'p1', billNo: 'RA-SRC-2024-04', billDate: '2024-06-22', grossBillAmount: 7400000, retentionPct: 5, retentionHeld: 370000, dlpDate: '2027-02-28', dlpMonths: 12, released: 0, balance: 370000, status: 'held' },
  { id: 'ret-005', projectId: 'p1', billNo: 'RA-SRC-2024-05', billDate: '2024-07-19', grossBillAmount: 6900000, retentionPct: 5, retentionHeld: 345000, dlpDate: '2027-02-28', dlpMonths: 12, released: 0, balance: 345000, status: 'held' },
  { id: 'ret-006', projectId: 'p1', billNo: 'RA-SRC-2024-06', billDate: '2024-08-12', grossBillAmount: 7200000, retentionPct: 5, retentionHeld: 360000, dlpDate: '2027-02-28', dlpMonths: 12, released: 0, balance: 360000, status: 'held' },
  { id: 'ret-007', projectId: 'p1', billNo: 'RA-SRC-2024-07', billDate: '2024-09-01', grossBillAmount: 832040, retentionPct: 5, retentionHeld: 41602, dlpDate: '2027-02-28', dlpMonths: 12, released: 0, balance: 41602, status: 'held' },
  { id: 'ret-008', projectId: 'p1', billNo: 'RA-SRC-2024-08', billDate: '2024-10-01', grossBillAmount: 1673060, retentionPct: 5, retentionHeld: 83653, dlpDate: '2027-02-28', dlpMonths: 12, released: 0, balance: 83653, status: 'held' },
  { id: 'ret-009', projectId: 'p2', billNo: 'RA-BCB-2024-01', billDate: '2024-08-01', grossBillAmount: 3200000, retentionPct: 5, retentionHeld: 160000, dlpDate: '2027-06-30', dlpMonths: 12, released: 0, balance: 160000, status: 'held' },
  { id: 'ret-010', projectId: 'p2', billNo: 'RA-BCB-2024-02', billDate: '2024-08-20', grossBillAmount: 2800000, retentionPct: 5, retentionHeld: 140000, dlpDate: '2027-06-30', dlpMonths: 12, released: 0, balance: 140000, status: 'held' },
  { id: 'ret-011', projectId: 'p2', billNo: 'RA-BCB-2024-03', billDate: '2024-09-06', grossBillAmount: 1794000, retentionPct: 5, retentionHeld: 89700, dlpDate: '2027-06-30', dlpMonths: 12, released: 0, balance: 89700, status: 'held' },
  { id: 'ret-012', projectId: 'p3', billNo: 'RA-NTT-2023-12', billDate: '2024-08-15', grossBillAmount: 18200000, retentionPct: 5, retentionHeld: 910000, dlpDate: '2026-12-31', dlpMonths: 12, released: 455000, balance: 455000, status: 'partially-released' },
];

// ============================================================
// PAYMENT AGING REPORT
// ============================================================

export interface AgingRecord {
  id: string;
  projectId: string;
  contractor: string;
  billNo: string;
  billDate: string;
  submittedDate: string;
  billAmount: number;
  netPayable: number;
  paidAmount: number;
  outstandingAmount: number;
  daysSinceSubmission: number;
  agingBucket: '0-30' | '31-60' | '61-90' | '90+';
  status: 'paid' | 'partially-paid' | 'overdue' | 'pending';
  remarks: string;
}

export const agingRecords: AgingRecord[] = [
  {
    id: 'age-001',
    projectId: 'p1',
    contractor: 'Narayan Constructions Pvt. Ltd.',
    billNo: 'RA-SRC-2024-08',
    billDate: '2024-10-01',
    submittedDate: '2024-10-03',
    billAmount: 1673060,
    netPayable: 1422101,
    paidAmount: 0,
    outstandingAmount: 1422101,
    daysSinceSubmission: 28,
    agingBucket: '0-30',
    status: 'pending',
    remarks: 'Submitted 3 Oct. Under client review.',
  },
  {
    id: 'age-002',
    projectId: 'p1',
    contractor: 'Narayan Constructions Pvt. Ltd.',
    billNo: 'RA-SRC-2024-07',
    billDate: '2024-09-01',
    submittedDate: '2024-09-04',
    billAmount: 832040,
    netPayable: 707234,
    paidAmount: 707234,
    outstandingAmount: 0,
    daysSinceSubmission: 27,
    agingBucket: '0-30',
    status: 'paid',
    remarks: 'Paid in full on 30 Sept 2024.',
  },
  {
    id: 'age-003',
    projectId: 'p2',
    contractor: 'Narayan Constructions Pvt. Ltd.',
    billNo: 'RA-BCB-2024-03',
    billDate: '2024-09-01',
    submittedDate: '2024-09-06',
    billAmount: 1794000,
    netPayable: 1524900,
    paidAmount: 0,
    outstandingAmount: 1524900,
    daysSinceSubmission: 55,
    agingBucket: '31-60',
    status: 'overdue',
    remarks: 'DOR approval pending. Reminder issued 20 Oct.',
  },
  {
    id: 'age-004',
    projectId: 'p2',
    contractor: 'Narayan Constructions Pvt. Ltd.',
    billNo: 'RA-BCB-2024-02',
    billDate: '2024-08-20',
    submittedDate: '2024-08-22',
    billAmount: 2800000,
    netPayable: 2380000,
    paidAmount: 0,
    outstandingAmount: 2380000,
    daysSinceSubmission: 70,
    agingBucket: '61-90',
    status: 'overdue',
    remarks: 'CRITICAL — 70 days overdue. Escalated to MD on 25 Oct.',
  },
  {
    id: 'age-005',
    projectId: 'p2',
    contractor: 'Narayan Constructions Pvt. Ltd.',
    billNo: 'RA-BCB-2024-01',
    billDate: '2024-08-01',
    submittedDate: '2024-08-05',
    billAmount: 3200000,
    netPayable: 2720000,
    paidAmount: 1360000,
    outstandingAmount: 1360000,
    daysSinceSubmission: 87,
    agingBucket: '61-90',
    status: 'partially-paid',
    remarks: '50% paid 1 Sept. Balance outstanding.',
  },
  {
    id: 'age-006',
    projectId: 'p3',
    contractor: 'Narayan Constructions Pvt. Ltd.',
    billNo: 'RA-NTT-2023-12',
    billDate: '2024-08-15',
    submittedDate: '2024-08-16',
    billAmount: 18200000,
    netPayable: 15470000,
    paidAmount: 15470000,
    outstandingAmount: 0,
    daysSinceSubmission: 45,
    agingBucket: '31-60',
    status: 'paid',
    remarks: 'Full payment received 30 Sept 2024.',
  },
];

export const getRetentionByProject = (projectId: string) => retentionRecords.filter((r) => r.projectId === projectId);
export const getAgingByProject = (projectId: string) => agingRecords.filter((a) => a.projectId === projectId);
export const getAllAging = () => agingRecords;
