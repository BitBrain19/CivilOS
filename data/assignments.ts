// ============================================================
// DAILY WORK ASSIGNMENT DATA
// ============================================================

export interface AssignedActivity {
  boqItemId: string;
  assignedGang?: string;
  locationChainage?: string;
  targetQty?: number;
  notes?: string;
}

export interface DailyAssignment {
  id: string;
  projectId: string;
  date: string; // YYYY-MM-DD
  status: 'published' | 'draft';
  publishedBy: string;
  publishedAt: string;
  activities: AssignedActivity[];
}

export const initialAssignments: DailyAssignment[] = [
  // ---- Shantinagar Residency Complex (p1) ----
  {
    id: 'asgn-p1-20241001',
    projectId: 'p1',
    date: '2024-10-01',
    status: 'published',
    publishedBy: 'Pushkar Jha (Project Manager)',
    publishedAt: '2024-10-01T07:15:00+05:45',
    activities: [
      {
        boqItemId: 'b1-4', // RCC M25 Columns & Shear Walls
        assignedGang: "Ram Bahadur Naike's Mason Gang",
        locationChainage: '6th Floor, Columns C6–C18 (Grids D–F)',
        targetQty: 8.5,
        notes: 'Target 8.5 cum pour before 16:00. Ensure slump test at 120mm.',
      },
      {
        boqItemId: 'b1-10', // Shuttering / Formwork
        assignedGang: 'Mohan Carpenter Gang',
        locationChainage: '6th Floor, Beam Lines B3–B7',
        targetQty: 180,
        notes: 'Complete beam bottom and side props inspection before next pour.',
      },
    ],
  },
  {
    id: 'asgn-p1-20240930',
    projectId: 'p1',
    date: '2024-09-30',
    status: 'published',
    publishedBy: 'Pushkar Jha (Project Manager)',
    publishedAt: '2024-09-30T07:20:00+05:45',
    activities: [
      {
        boqItemId: 'b1-5', // RCC M25 Beams & Slabs
        assignedGang: "Ram Bahadur Naike's Mason Gang",
        locationChainage: '5th Floor, East Wing, Grid D–H',
        targetQty: 20,
        notes: 'East wing slab casting full coverage.',
      },
      {
        boqItemId: 'b1-6', // TMT Steel Bar Fe500 Reinforcement
        assignedGang: "Hari Tamang's Bar Benders",
        locationChainage: '6th Floor, All Grids',
        targetQty: 2400,
        notes: 'Tie column cages ahead of formwork gang.',
      },
    ],
  },
  {
    id: 'asgn-p1-20240929',
    projectId: 'p1',
    date: '2024-09-29',
    status: 'published',
    publishedBy: 'Pushkar Jha (Project Manager)',
    publishedAt: '2024-09-29T07:05:00+05:45',
    activities: [
      {
        boqItemId: 'b1-7', // Brickwork
        assignedGang: "Ram Bahadur Naike's Mason Gang",
        locationChainage: 'Ground Floor, Block B Internal Partitions',
        targetQty: 5.0,
      },
    ],
  },

  // ---- Bagmati Corridor Bridge Rehabilitation (p2) ----
  {
    id: 'asgn-p2-20241001',
    projectId: 'p2',
    date: '2024-10-01',
    status: 'published',
    publishedBy: 'Birendra Chaudhary (Resident Eng.)',
    publishedAt: '2024-10-01T07:00:00+05:45',
    activities: [
      {
        boqItemId: 'b2-2', // Bored Pile Foundation D600
        assignedGang: 'Excavation Gang — Sita Rai',
        locationChainage: 'South Abutment, Bank Station (P-14 to P-16)',
        targetQty: 12,
        notes: 'Rig #2 scheduled for P-15 boring to 18m refusal depth.',
      },
      {
        boqItemId: 'b2-3', // RCC M30 Abutment & Pier
        assignedGang: 'Concrete Gang — Bikash',
        locationChainage: 'North Abutment, Footing Level',
        targetQty: 25,
        notes: 'PCC bed curing and shuttering alignment check.',
      },
    ],
  },
  {
    id: 'asgn-p2-20240930',
    projectId: 'p2',
    date: '2024-09-30',
    status: 'published',
    publishedBy: 'Birendra Chaudhary (Resident Eng.)',
    publishedAt: '2024-09-30T07:30:00+05:45',
    activities: [
      {
        boqItemId: 'b2-1',
        assignedGang: 'Excavation Gang — Sita Rai',
        locationChainage: 'Approach Road Subgrade Ch 0+080–0+160',
        targetQty: 180,
      },
    ],
  },

  // ---- Nabil Trade Tower (p3) ----
  {
    id: 'asgn-p3-20241001',
    projectId: 'p3',
    date: '2024-10-01',
    status: 'published',
    publishedBy: 'Sunil Shakya (Sr. PM)',
    publishedAt: '2024-10-01T07:45:00+05:45',
    activities: [
      {
        boqItemId: 'b3-3', // Core Walls & Columns
        assignedGang: 'Core Wall Specialist Gang',
        locationChainage: '12th Floor, Core Shear Wall CW-1',
        targetQty: 14,
      },
      {
        boqItemId: 'b3-6', // Structural Glazing Façade System
        assignedGang: 'Façade Specialist Gang',
        locationChainage: 'Level 8 & 9, West Elevation',
        targetQty: 45,
      },
    ],
  },
];

export const getAssignmentByProjectAndDate = (
  assignments: DailyAssignment[],
  projectId: string,
  date: string
): DailyAssignment | undefined => {
  return assignments.find((a) => a.projectId === projectId && a.date === date && a.status === 'published');
};

export const getAssignmentsHistoryByProject = (
  assignments: DailyAssignment[],
  projectId: string
): DailyAssignment[] => {
  return assignments
    .filter((a) => a.projectId === projectId)
    .sort((a, b) => b.date.localeCompare(a.date));
};
