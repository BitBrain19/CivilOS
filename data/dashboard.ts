// ============================================================
// S-CURVE DATA (weekly cumulative progress)
// ============================================================

export interface SCurvePoint {
  week: string;
  planned: number;
  actual: number;
}

export const sCurveData: Record<string, SCurvePoint[]> = {
  p1: [
    { week: 'Mar W1', planned: 1, actual: 0.5 },
    { week: 'Mar W3', planned: 3, actual: 2 },
    { week: 'Apr W1', planned: 6, actual: 5 },
    { week: 'Apr W3', planned: 10, actual: 8 },
    { week: 'May W1', planned: 15, actual: 13 },
    { week: 'May W3', planned: 20, actual: 17 },
    { week: 'Jun W1', planned: 26, actual: 22 },
    { week: 'Jun W3', planned: 32, actual: 27 },
    { week: 'Jul W1', planned: 38, actual: 32 },
    { week: 'Jul W3', planned: 44, actual: 38 },
    { week: 'Aug W1', planned: 50, actual: 44 },
    { week: 'Aug W3', planned: 56, actual: 49 },
    { week: 'Sep W1', planned: 61, actual: 54 },
    { week: 'Sep W3', planned: 65, actual: 58 },
    { week: 'Oct W1', planned: 70, actual: 62 },
  ],
  p2: [
    { week: 'Jul W3', planned: 1, actual: 0 },
    { week: 'Aug W1', planned: 3, actual: 1 },
    { week: 'Aug W3', planned: 6, actual: 3 },
    { week: 'Sep W1', planned: 10, actual: 5 },
    { week: 'Sep W3', planned: 15, actual: 8 },
    { week: 'Oct W1', planned: 20, actual: 11 },
    { week: 'Oct W3', planned: 26, actual: 15 },
    { week: 'Nov W1', planned: 32, actual: 19 },
    { week: 'Nov W3', planned: 38, actual: 24 },
    { week: 'Dec W1', planned: 44, actual: 28 },
    { week: 'Dec W3', planned: 48, actual: 33 },
    { week: 'Jan W1', planned: 52, actual: 38 },
  ],
  p3: [
    { week: 'Sep W1', planned: 2, actual: 2 },
    { week: 'Oct W1', planned: 8, actual: 8 },
    { week: 'Nov W1', planned: 16, actual: 15 },
    { week: 'Dec W1', planned: 24, actual: 23 },
    { week: 'Jan W1', planned: 32, actual: 32 },
    { week: 'Feb W1', planned: 40, actual: 39 },
    { week: 'Mar W1', planned: 48, actual: 47 },
    { week: 'Apr W1', planned: 56, actual: 55 },
    { week: 'May W1', planned: 64, actual: 63 },
    { week: 'Jun W1', planned: 72, actual: 71 },
    { week: 'Jul W1', planned: 79, actual: 77 },
    { week: 'Aug W1', planned: 83, actual: 80 },
    { week: 'Sep W1', planned: 85, actual: 81 },
  ],
};

// ============================================================
// MATERIAL BURN RATE DATA
// ============================================================

export interface BurnRatePoint {
  month: string;
  estimated: number;
  actual: number;
}

export const burnRateData: Record<string, BurnRatePoint[]> = {
  p1: [
    { month: 'Mar', estimated: 420, actual: 380 },
    { month: 'Apr', estimated: 680, actual: 650 },
    { month: 'May', estimated: 820, actual: 790 },
    { month: 'Jun', estimated: 1050, actual: 1080 },
    { month: 'Jul', estimated: 1100, actual: 1210 }, // over-consuming
    { month: 'Aug', estimated: 1050, actual: 1190 },
    { month: 'Sep', estimated: 980, actual: 1150 },
    { month: 'Oct', estimated: 900, actual: 1020 },
  ],
  p2: [
    { month: 'Jul', estimated: 180, actual: 120 },
    { month: 'Aug', estimated: 420, actual: 290 },
    { month: 'Sep', estimated: 680, actual: 490 },
    { month: 'Oct', estimated: 850, actual: 680 },
    { month: 'Nov', estimated: 920, actual: 810 },
    { month: 'Dec', estimated: 980, actual: 920 },
    { month: 'Jan', estimated: 1020, actual: 980 },
  ],
  p3: [
    { month: 'Sep', estimated: 620, actual: 610 },
    { month: 'Oct', estimated: 880, actual: 870 },
    { month: 'Nov', estimated: 1100, actual: 1090 },
    { month: 'Dec', estimated: 1300, actual: 1280 },
    { month: 'Jan', estimated: 1450, actual: 1440 },
    { month: 'Feb', estimated: 1600, actual: 1580 },
    { month: 'Mar', estimated: 1680, actual: 1650 },
    { month: 'Apr', estimated: 1720, actual: 1700 },
    { month: 'May', estimated: 1700, actual: 1680 },
    { month: 'Jun', estimated: 1600, actual: 1590 },
    { month: 'Jul', estimated: 1400, actual: 1380 },
    { month: 'Aug', estimated: 1100, actual: 1090 },
    { month: 'Sep', estimated: 800, actual: 780 },
  ],
};

// ============================================================
// DELAY / VARIANCE TABLE
// ============================================================

export interface DelayItem {
  id: string;
  activity: string;
  plannedStart: string;
  actualStart: string;
  daysSlipped: number;
  severity: 'low' | 'medium' | 'high';
  responsible: string;
  reason: string;
}

export const delayData: Record<string, DelayItem[]> = {
  p1: [
    {
      id: 'd1',
      activity: 'RCC Slab — 5th Floor',
      plannedStart: '2024-09-05',
      actualStart: '2024-09-19',
      daysSlipped: 14,
      severity: 'high',
      responsible: 'Ram Bahadur Naike',
      reason: 'Delayed shuttering delivery from supplier',
    },
    {
      id: 'd2',
      activity: 'Brickwork — Block B',
      plannedStart: '2024-08-12',
      actualStart: '2024-08-20',
      daysSlipped: 8,
      severity: 'medium',
      responsible: 'Mohan Carpenter Gang',
      reason: 'Labour shortage during Dashain',
    },
    {
      id: 'd3',
      activity: 'Waterproofing — Basement',
      plannedStart: '2024-07-20',
      actualStart: '2024-07-29',
      daysSlipped: 9,
      severity: 'medium',
      responsible: 'Hari Tamang',
      reason: 'Monsoon waterlogging — site inaccessible',
    },
    {
      id: 'd4',
      activity: 'Column Reinforcement — 6th Floor',
      plannedStart: '2024-09-22',
      actualStart: '2024-09-24',
      daysSlipped: 2,
      severity: 'low',
      responsible: 'Hari Tamang',
      reason: 'TMT bar delivery partial',
    },
  ],
  p2: [
    {
      id: 'd5',
      activity: 'Pile Boring — South Abutment',
      plannedStart: '2024-08-01',
      actualStart: '2024-08-22',
      daysSlipped: 21,
      severity: 'high',
      responsible: 'JCB Operator – Kiran Lama',
      reason: 'Equipment breakdown, waiting for spare parts',
    },
    {
      id: 'd6',
      activity: 'Approach Road Earthwork',
      plannedStart: '2024-09-10',
      actualStart: '2024-09-22',
      daysSlipped: 12,
      severity: 'high',
      responsible: 'Excavation Gang — Sita Rai',
      reason: 'Land acquisition dispute — GoN resolution pending',
    },
    {
      id: 'd7',
      activity: 'Form Shuttering — Main Deck',
      plannedStart: '2024-10-01',
      actualStart: '2024-10-08',
      daysSlipped: 7,
      severity: 'medium',
      responsible: 'Ram Bahadur Naike',
      reason: 'Formwork material backlog',
    },
  ],
  p3: [
    {
      id: 'd8',
      activity: 'Façade Cladding — North Face',
      plannedStart: '2024-08-15',
      actualStart: '2024-08-19',
      daysSlipped: 4,
      severity: 'low',
      responsible: 'External Specialist Vendor',
      reason: 'Material import delay',
    },
  ],
};

// ============================================================
// RESOURCE UTILIZATION
// ============================================================

export interface ResourceStat {
  label: string;
  value: number;
  unit: string;
  flag?: boolean;
}

export const resourceData: Record<string, ResourceStat[]> = {
  p1: [
    { label: 'Total Labor Days', value: 142, unit: 'man-days this month' },
    { label: 'Idle Labor Days', value: 18, unit: 'days', flag: true },
    { label: 'Equipment Utilization', value: 72, unit: '%' },
    { label: 'Idle Equipment Days', value: 9, unit: 'days', flag: true },
  ],
  p2: [
    { label: 'Total Labor Days', value: 89, unit: 'man-days this month' },
    { label: 'Idle Labor Days', value: 24, unit: 'days', flag: true },
    { label: 'Equipment Utilization', value: 48, unit: '%' },
    { label: 'Idle Equipment Days', value: 19, unit: 'days', flag: true },
  ],
  p3: [
    { label: 'Total Labor Days', value: 198, unit: 'man-days this month' },
    { label: 'Idle Labor Days', value: 7, unit: 'days' },
    { label: 'Equipment Utilization', value: 88, unit: '%' },
    { label: 'Idle Equipment Days', value: 3, unit: 'days' },
  ],
};
