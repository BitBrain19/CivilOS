// ============================================================
// RA BILLS
// ============================================================

export interface RABillLineItem {
  boqItemId: string;
  itemNo: string;
  description: string;
  unit: string;
  prevCertifiedQty: number;
  thisBillQty: number;
  totalQty: number;
  rate: number;
  prevAmount: number;
  thisBillAmount: number;
  totalAmount: number;
}

export interface RABill {
  id: string;
  projectId: string;
  billNo: string;
  billDate: string;
  submittedDate: string;
  contractor: string;
  engineer: string;
  client: string;
  mbRefs: string[];
  lineItems: RABillLineItem[];
  grossAmount: number;
  retentionPct: number;
  retentionAmount: number;
  mobilizationAdvanceDeduction: number;
  netPayable: number;
  status: 'draft' | 'submitted' | 'approved' | 'paid';
  remarks: string;
}

export const raBills: RABill[] = [
  {
    id: 'ra-001',
    projectId: 'p1',
    billNo: 'RA-SRC-2024-08',
    billDate: '2024-10-01',
    submittedDate: '2024-10-03',
    contractor: 'Narayan Constructions Pvt. Ltd.',
    engineer: 'Er. Prashant Koirala',
    client: 'Bhattarai Properties Pvt. Ltd.',
    mbRefs: ['MB-SRC-2024-048', 'MB-SRC-2024-047'],
    lineItems: [
      {
        boqItemId: 'b1-4',
        itemNo: '1.04',
        description: 'RCC M25 Columns & Shear Walls',
        unit: 'cum',
        prevCertifiedQty: 347.82,
        thisBillQty: 12.18,
        totalQty: 360.00,
        rate: 22000,
        prevAmount: 7652040,
        thisBillAmount: 267960,
        totalAmount: 7920000,
      },
      {
        boqItemId: 'b1-5',
        itemNo: '1.05',
        description: 'RCC M25 Beams & Slabs',
        unit: 'cum',
        prevCertifiedQty: 495.80,
        thisBillQty: 56.20,
        totalQty: 552.00,
        rate: 20500,
        prevAmount: 10163900,
        thisBillAmount: 1152100,
        totalAmount: 11316000,
      },
      {
        boqItemId: 'b1-6',
        itemNo: '1.06',
        description: 'TMT Steel Bar Fe500 Reinforcement',
        unit: 'kg',
        prevCertifiedQty: 108800,
        thisBillQty: 2200,
        totalQty: 111000,
        rate: 115,
        prevAmount: 12512000,
        thisBillAmount: 253000,
        totalAmount: 12765000,
      },
    ],
    grossAmount: 1673060,
    retentionPct: 5,
    retentionAmount: 83653,
    mobilizationAdvanceDeduction: 167306,
    netPayable: 1422101,
    status: 'submitted',
    remarks: 'RA Bill 8 — September 2024 work. MB measurements duly checked.',
  },
  {
    id: 'ra-002',
    projectId: 'p1',
    billNo: 'RA-SRC-2024-07',
    billDate: '2024-09-01',
    submittedDate: '2024-09-04',
    contractor: 'Narayan Constructions Pvt. Ltd.',
    engineer: 'Er. Prashant Koirala',
    client: 'Bhattarai Properties Pvt. Ltd.',
    mbRefs: ['MB-SRC-2024-044', 'MB-SRC-2024-045'],
    lineItems: [
      {
        boqItemId: 'b1-4',
        itemNo: '1.04',
        description: 'RCC M25 Columns & Shear Walls',
        unit: 'cum',
        prevCertifiedQty: 310.00,
        thisBillQty: 37.82,
        totalQty: 347.82,
        rate: 22000,
        prevAmount: 6820000,
        thisBillAmount: 832040,
        totalAmount: 7652040,
      },
    ],
    grossAmount: 832040,
    retentionPct: 5,
    retentionAmount: 41602,
    mobilizationAdvanceDeduction: 83204,
    netPayable: 707234,
    status: 'approved',
    remarks: 'RA Bill 7 — August 2024. Approved by client on 15 Sept 2024.',
  },
  {
    id: 'ra-003',
    projectId: 'p2',
    billNo: 'RA-BCB-2024-03',
    billDate: '2024-09-01',
    submittedDate: '2024-09-06',
    contractor: 'Narayan Constructions Pvt. Ltd.',
    engineer: 'Er. Sanjaya Adhikari',
    client: 'Department of Roads, GoN',
    mbRefs: ['MB-BCB-2024-009'],
    lineItems: [
      {
        boqItemId: 'b2-2',
        itemNo: '2.02',
        description: 'Bored Pile Foundation D600',
        unit: 'rm',
        prevCertifiedQty: 84,
        thisBillQty: 60,
        totalQty: 144,
        rate: 28000,
        prevAmount: 2352000,
        thisBillAmount: 1680000,
        totalAmount: 4032000,
      },
      {
        boqItemId: 'b2-1',
        itemNo: '2.01',
        description: 'Earthwork & Site Clearing',
        unit: 'cum',
        prevCertifiedQty: 1800,
        thisBillQty: 300,
        totalQty: 2100,
        rate: 380,
        prevAmount: 684000,
        thisBillAmount: 114000,
        totalAmount: 798000,
      },
    ],
    grossAmount: 1794000,
    retentionPct: 5,
    retentionAmount: 89700,
    mobilizationAdvanceDeduction: 179400,
    netPayable: 1524900,
    status: 'submitted',
    remarks: 'Bill pending DOR certification. Submitted 6 Sept 2024.',
  },
];

export const getRABillsByProject = (projectId: string) => raBills.filter((b) => b.projectId === projectId);
