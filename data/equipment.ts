// ============================================================
// EQUIPMENT LOG
// ============================================================

export interface EquipmentEntry {
  id: string;
  projectId: string;
  equipmentId: string;
  name: string;
  make: string;
  operator: string;
  date: string;
  checkIn: string;
  checkOut: string | null;
  hoursWorked: number;
  hoursIdle: number;
  utilizationPct: number;
  idleDaysThisMonth: number;
  status: 'active' | 'idle' | 'breakdown' | 'standby';
  activity: string;
  fuelConsumed: number; // liters
  remarks: string;
}

export const equipmentLog: EquipmentEntry[] = [
  // p1 — Shantinagar
  {
    id: 'eq-001',
    projectId: 'p1',
    equipmentId: 'EQ-JCB-01',
    name: 'JCB 3DX Backhoe Loader',
    make: 'JCB India',
    operator: 'Kiran Lama',
    date: '2024-10-01',
    checkIn: '08:00',
    checkOut: '17:30',
    hoursWorked: 8.5,
    hoursIdle: 1.0,
    utilizationPct: 89,
    idleDaysThisMonth: 2,
    status: 'active',
    activity: 'Debris clearing & soil transfer',
    fuelConsumed: 42,
    remarks: 'Routine check done. Oil levels normal.',
  },
  {
    id: 'eq-002',
    projectId: 'p1',
    equipmentId: 'EQ-MIX-01',
    name: 'AJAX Concrete Mixer 400L',
    make: 'AJAX Engineering',
    operator: 'Dilip Shrestha',
    date: '2024-10-01',
    checkIn: '07:30',
    checkOut: '17:00',
    hoursWorked: 7.5,
    hoursIdle: 1.5,
    utilizationPct: 83,
    idleDaysThisMonth: 1,
    status: 'active',
    activity: 'Concrete mixing for column pour',
    fuelConsumed: 18,
    remarks: 'Drum rotation speed checked. Normal.',
  },
  {
    id: 'eq-003',
    projectId: 'p1',
    equipmentId: 'EQ-VIB-01',
    name: 'Needle Vibrator 40mm (Petrol)',
    make: 'Honda GX35',
    operator: 'Unassigned',
    date: '2024-10-01',
    checkIn: '—',
    checkOut: null,
    hoursWorked: 0,
    hoursIdle: 9,
    utilizationPct: 0,
    idleDaysThisMonth: 11,
    status: 'idle',
    activity: 'No activity — awaiting slab pour schedule',
    fuelConsumed: 0,
    remarks: 'Idle for 11 days. Last used 20 Sept for basement wall pour.',
  },
  {
    id: 'eq-004',
    projectId: 'p1',
    equipmentId: 'EQ-SCF-01',
    name: 'Mobile Scaffolding Set (12m)',
    make: 'ACROW India',
    operator: 'Gang Assigned',
    date: '2024-10-01',
    checkIn: '08:00',
    checkOut: null,
    hoursWorked: 9,
    hoursIdle: 0,
    utilizationPct: 100,
    idleDaysThisMonth: 0,
    status: 'active',
    activity: 'External plastering — 3rd & 4th floor',
    fuelConsumed: 0,
    remarks: 'Two sets deployed on east and north façade.',
  },
  {
    id: 'eq-005',
    projectId: 'p1',
    equipmentId: 'EQ-RBM-01',
    name: 'Rebar Bending Machine (Electric)',
    make: 'Sona Machines',
    operator: 'Unassigned',
    date: '2024-10-01',
    checkIn: '—',
    checkOut: null,
    hoursWorked: 0,
    hoursIdle: 9,
    utilizationPct: 0,
    idleDaysThisMonth: 7,
    status: 'idle',
    activity: 'No activity — bar-bending done manually',
    fuelConsumed: 0,
    remarks: 'Machine idle 7 days. Naike prefers manual bending for small dia bars.',
  },
  // p2 — Bagmati Bridge
  {
    id: 'eq-006',
    projectId: 'p2',
    equipmentId: 'EQ-BOR-01',
    name: 'Hydraulic Piling Rig — Bauer BG 18H',
    make: 'Bauer Equipment',
    operator: 'Rajendra KC',
    date: '2024-10-01',
    checkIn: '07:00',
    checkOut: '18:00',
    hoursWorked: 10,
    hoursIdle: 1,
    utilizationPct: 91,
    idleDaysThisMonth: 3,
    status: 'active',
    activity: 'Pile boring D600 — South Abutment',
    fuelConsumed: 110,
    remarks: 'Good progress today. 3 piles completed.',
  },
  {
    id: 'eq-007',
    projectId: 'p2',
    equipmentId: 'EQ-TM-01',
    name: 'Transit Mixer 6 cum — SCHWING',
    make: 'SCHWING Stetter',
    operator: 'Raju Bista',
    date: '2024-10-01',
    checkIn: '08:30',
    checkOut: '15:00',
    hoursWorked: 5.5,
    hoursIdle: 2,
    utilizationPct: 73,
    idleDaysThisMonth: 4,
    status: 'active',
    activity: 'Concrete delivery — North Abutment PCC',
    fuelConsumed: 28,
    remarks: 'Half-day use. Will be on standby tomorrow.',
  },
];

export const getEquipmentByProject = (projectId: string) => equipmentLog.filter((e) => e.projectId === projectId);
