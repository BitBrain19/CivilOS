// ============================================================
// MATERIAL LEDGER
// ============================================================

export interface MaterialRow {
  id: string;
  projectId: string;
  materialCode: string;
  material: string;
  unit: string;
  openingStock: number;
  received: number;
  consumed: number;
  closingStock: number;
  estimatedConsumption: number;
  variance: number; // actual - estimated (positive = over-consumed)
  variancePct: number;
  status: 'normal' | 'low-stock' | 'over-consumed' | 'ok';
  lastUpdated: string;
}

export const materialLedger: MaterialRow[] = [
  // p1 — Shantinagar
  {
    id: 'm1-1',
    projectId: 'p1',
    materialCode: 'CEM-43',
    material: 'OPC Cement 43 Grade',
    unit: 'bags (50kg)',
    openingStock: 820,
    received: 2400,
    consumed: 2980,
    closingStock: 240,
    estimatedConsumption: 2450,
    variance: 530,
    variancePct: 21.6,
    status: 'over-consumed',
    lastUpdated: '2024-10-01',
  },
  {
    id: 'm1-2',
    projectId: 'p1',
    materialCode: 'TMT-12',
    material: 'TMT Steel Bar 12mm Fe500',
    unit: 'kg',
    openingStock: 8200,
    received: 22000,
    consumed: 18400,
    closingStock: 11800,
    estimatedConsumption: 19000,
    variance: -600,
    variancePct: -3.2,
    status: 'ok',
    lastUpdated: '2024-10-01',
  },
  {
    id: 'm1-3',
    projectId: 'p1',
    materialCode: 'AGG-20',
    material: 'Coarse Aggregate 20mm',
    unit: 'cum',
    openingStock: 42,
    received: 180,
    consumed: 198,
    closingStock: 24,
    estimatedConsumption: 190,
    variance: 8,
    variancePct: 4.2,
    status: 'low-stock',
    lastUpdated: '2024-10-01',
  },
  {
    id: 'm1-4',
    projectId: 'p1',
    materialCode: 'SAND-F',
    material: 'Fine River Sand',
    unit: 'cum',
    openingStock: 28,
    received: 120,
    consumed: 118,
    closingStock: 30,
    estimatedConsumption: 125,
    variance: -7,
    variancePct: -5.6,
    status: 'ok',
    lastUpdated: '2024-10-01',
  },
  {
    id: 'm1-5',
    projectId: 'p1',
    materialCode: 'BRK-1',
    material: 'Pressed Clay Bricks',
    unit: 'nos',
    openingStock: 18000,
    received: 45000,
    consumed: 52000,
    closingStock: 11000,
    estimatedConsumption: 50000,
    variance: 2000,
    variancePct: 4.0,
    status: 'normal',
    lastUpdated: '2024-10-01',
  },
  {
    id: 'm1-6',
    projectId: 'p1',
    materialCode: 'PLY-19',
    material: 'Shuttering Plywood 19mm',
    unit: 'sqft',
    openingStock: 1200,
    received: 4800,
    consumed: 5600,
    closingStock: 400,
    estimatedConsumption: 5200,
    variance: 400,
    variancePct: 7.7,
    status: 'low-stock',
    lastUpdated: '2024-10-01',
  },
  {
    id: 'm1-7',
    projectId: 'p1',
    materialCode: 'BW-1',
    material: 'Binding Wire (Tying)',
    unit: 'kg',
    openingStock: 180,
    received: 600,
    consumed: 620,
    closingStock: 160,
    estimatedConsumption: 640,
    variance: -20,
    variancePct: -3.1,
    status: 'ok',
    lastUpdated: '2024-10-01',
  },
  // p2 materials
  {
    id: 'm2-1',
    projectId: 'p2',
    materialCode: 'CEM-43',
    material: 'OPC Cement 43 Grade',
    unit: 'bags (50kg)',
    openingStock: 240,
    received: 1800,
    consumed: 1620,
    closingStock: 420,
    estimatedConsumption: 1700,
    variance: -80,
    variancePct: -4.7,
    status: 'ok',
    lastUpdated: '2024-10-01',
  },
  {
    id: 'm2-2',
    projectId: 'p2',
    materialCode: 'TMT-16',
    material: 'TMT Steel Bar 16mm Fe500',
    unit: 'kg',
    openingStock: 4200,
    received: 18000,
    consumed: 15200,
    closingStock: 7000,
    estimatedConsumption: 16000,
    variance: -800,
    variancePct: -5.0,
    status: 'ok',
    lastUpdated: '2024-10-01',
  },
];

export const getMaterialsByProject = (projectId: string) => materialLedger.filter((m) => m.projectId === projectId);

// ============================================================
// GRN — GOODS RECEIVED NOTES
// ============================================================

export interface GRNEntry {
  id: string;
  projectId: string;
  grnNo: string;
  date: string;
  supplier: string;
  vehicleNo: string;
  materialCode: string;
  material: string;
  unit: string;
  orderedQty: number;
  receivedQty: number;
  rate: number;
  amount: number;
  receivedBy: string;
  remarks: string;
}

export const grnEntries: GRNEntry[] = [
  {
    id: 'grn-001',
    projectId: 'p1',
    grnNo: 'GRN-SRC-2024-089',
    date: '2024-09-28',
    supplier: 'Shiva Cement Traders, Kalanki',
    vehicleNo: 'Ba 2 Kha 4521',
    materialCode: 'CEM-43',
    material: 'OPC Cement 43 Grade',
    unit: 'bags (50kg)',
    orderedQty: 500,
    receivedQty: 480,
    rate: 820,
    amount: 393600,
    receivedBy: 'Deepak Tamang (Store Keeper)',
    remarks: '20 bags torn on delivery, rejected on site.',
  },
  {
    id: 'grn-002',
    projectId: 'p1',
    grnNo: 'GRN-SRC-2024-090',
    date: '2024-09-30',
    supplier: 'Himalayan Steel, Balaju',
    vehicleNo: 'Ba 4 Cha 8812',
    materialCode: 'TMT-12',
    material: 'TMT Steel Bar 12mm Fe500',
    unit: 'kg',
    orderedQty: 5000,
    receivedQty: 5000,
    rate: 105,
    amount: 525000,
    receivedBy: 'Deepak Tamang (Store Keeper)',
    remarks: 'Mill test certificate received. All coils within tolerance.',
  },
];
