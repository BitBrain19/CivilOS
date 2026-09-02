// ============================================================
// BOQ — BILL OF QUANTITIES
// ============================================================

export interface BOQItem {
  id: string;
  projectId: string;
  itemNo: string;
  description: string;
  unit: string;
  quantity: number;
  rate: number; // NPR per unit
  amount: number; // NPR
  completedQty: number;
  completedPct: number;
}

export const boqItems: BOQItem[] = [
  // ---- Shantinagar Residency Complex (p1) ----
  { id: 'b1-1', projectId: 'p1', itemNo: '1.01', description: 'Earthwork Excavation in Foundation', unit: 'cum', quantity: 1850, rate: 420, amount: 777000, completedQty: 1850, completedPct: 100 },
  { id: 'b1-2', projectId: 'p1', itemNo: '1.02', description: 'PCC M10 Bed Concrete (1:3:6)', unit: 'cum', quantity: 180, rate: 9800, amount: 1764000, completedQty: 180, completedPct: 100 },
  { id: 'b1-3', projectId: 'p1', itemNo: '1.03', description: 'RCC M25 Foundation & Raft (1:1:2)', unit: 'cum', quantity: 620, rate: 18500, amount: 11470000, completedQty: 620, completedPct: 100 },
  { id: 'b1-4', projectId: 'p1', itemNo: '1.04', description: 'RCC M25 Columns & Shear Walls', unit: 'cum', quantity: 480, rate: 22000, amount: 10560000, completedQty: 360, completedPct: 75 },
  { id: 'b1-5', projectId: 'p1', itemNo: '1.05', description: 'RCC M25 Beams & Slabs', unit: 'cum', quantity: 920, rate: 20500, amount: 18860000, completedQty: 552, completedPct: 60 },
  { id: 'b1-6', projectId: 'p1', itemNo: '1.06', description: 'TMT Steel Bar Fe500 Reinforcement', unit: 'kg', quantity: 185000, rate: 115, amount: 21275000, completedQty: 111000, completedPct: 60 },
  { id: 'b1-7', projectId: 'p1', itemNo: '1.07', description: 'Brickwork in Cement Mortar (1:4)', unit: 'cum', quantity: 1200, rate: 8200, amount: 9840000, completedQty: 660, completedPct: 55 },
  { id: 'b1-8', projectId: 'p1', itemNo: '1.08', description: 'Cement Plastering 12mm (1:4)', unit: 'sqm', quantity: 18500, rate: 480, amount: 8880000, completedQty: 7400, completedPct: 40 },
  { id: 'b1-9', projectId: 'p1', itemNo: '1.09', description: 'Waterproofing — Basement Walls & Raft', unit: 'sqm', quantity: 2400, rate: 1200, amount: 2880000, completedQty: 2400, completedPct: 100 },
  { id: 'b1-10', projectId: 'p1', itemNo: '1.10', description: 'Shuttering / Formwork', unit: 'sqm', quantity: 12000, rate: 650, amount: 7800000, completedQty: 6000, completedPct: 50 },

  // ---- Bagmati Corridor Bridge Rehabilitation (p2) ----
  { id: 'b2-1', projectId: 'p2', itemNo: '2.01', description: 'Earthwork & Site Clearing', unit: 'cum', quantity: 4200, rate: 380, amount: 1596000, completedQty: 2100, completedPct: 50 },
  { id: 'b2-2', projectId: 'p2', itemNo: '2.02', description: 'Bored Pile Foundation D600', unit: 'rm', quantity: 480, rate: 28000, amount: 13440000, completedQty: 144, completedPct: 30 },
  { id: 'b2-3', projectId: 'p2', itemNo: '2.03', description: 'RCC M30 Abutment & Pier', unit: 'cum', quantity: 680, rate: 26000, amount: 17680000, completedQty: 204, completedPct: 30 },
  { id: 'b2-4', projectId: 'p2', itemNo: '2.04', description: 'Prestressed Concrete Deck Girder', unit: 'cum', quantity: 420, rate: 48000, amount: 20160000, completedQty: 0, completedPct: 0 },
  { id: 'b2-5', projectId: 'p2', itemNo: '2.05', description: 'Reinforcement Fe500', unit: 'kg', quantity: 95000, rate: 115, amount: 10925000, completedQty: 28500, completedPct: 30 },
  { id: 'b2-6', projectId: 'p2', itemNo: '2.06', description: 'Approach Road Sub-base (Gravel)', unit: 'cum', quantity: 3600, rate: 1800, amount: 6480000, completedQty: 1800, completedPct: 50 },
  { id: 'b2-7', projectId: 'p2', itemNo: '2.07', description: 'Slope Protection Pitching', unit: 'sqm', quantity: 2800, rate: 2200, amount: 6160000, completedQty: 560, completedPct: 20 },

  // ---- Nabil Trade Tower (p3) ----
  { id: 'b3-1', projectId: 'p3', itemNo: '3.01', description: 'Excavation & Shoring (2 Basement)', unit: 'cum', quantity: 8200, rate: 520, amount: 4264000, completedQty: 8200, completedPct: 100 },
  { id: 'b3-2', projectId: 'p3', itemNo: '3.02', description: 'RCC M30 Foundation Mat', unit: 'cum', quantity: 1200, rate: 24000, amount: 28800000, completedQty: 1200, completedPct: 100 },
  { id: 'b3-3', projectId: 'p3', itemNo: '3.03', description: 'RCC M30 Core Walls & Columns', unit: 'cum', quantity: 2800, rate: 26000, amount: 72800000, completedQty: 2520, completedPct: 90 },
  { id: 'b3-4', projectId: 'p3', itemNo: '3.04', description: 'RCC M30 Flat Slab System', unit: 'cum', quantity: 3200, rate: 23000, amount: 73600000, completedQty: 2560, completedPct: 80 },
  { id: 'b3-5', projectId: 'p3', itemNo: '3.05', description: 'TMT Steel Fe500 Reinforcement', unit: 'kg', quantity: 680000, rate: 115, amount: 78200000, completedQty: 544000, completedPct: 80 },
  { id: 'b3-6', projectId: 'p3', itemNo: '3.06', description: 'Structural Glazing Façade System', unit: 'sqm', quantity: 8400, rate: 18500, amount: 155400000, completedQty: 5040, completedPct: 60 },
  { id: 'b3-7', projectId: 'p3', itemNo: '3.07', description: 'Internal Block Partitions', unit: 'cum', quantity: 1800, rate: 8400, amount: 15120000, completedQty: 1440, completedPct: 80 },
  { id: 'b3-8', projectId: 'p3', itemNo: '3.08', description: 'Marble Flooring — Office Levels', unit: 'sqm', quantity: 12000, rate: 3200, amount: 38400000, completedQty: 7200, completedPct: 60 },
];

export const getBOQByProject = (projectId: string) => boqItems.filter((b) => b.projectId === projectId);
