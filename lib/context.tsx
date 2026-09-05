'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Project, projects } from '@/data/projects';
import { DailyAssignment, initialAssignments } from '@/data/assignments';
import { DPREntry, dprEntries as initialDPREntries } from '@/data/dpr';

interface ProjectContextType {
  activeProject: Project;
  setActiveProject: (project: Project) => void;
  allProjects: Project[];
  assignments: DailyAssignment[];
  publishAssignment: (assignment: DailyAssignment) => void;
  dprEntries: DPREntry[];
  addDPREntry: (entry: DPREntry) => void;
  certifyEntry: (id: string, reason?: string) => void;
  certifyAllEntries: () => void;
}

const ProjectContext = createContext<ProjectContextType>({
  activeProject: projects[0],
  setActiveProject: () => {},
  allProjects: projects,
  assignments: initialAssignments,
  publishAssignment: () => {},
  dprEntries: initialDPREntries,
  addDPREntry: () => {},
  certifyEntry: () => {},
  certifyAllEntries: () => {},
});

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [activeProject, setActiveProject] = useState<Project>(projects[0]);
  const [assignments, setAssignments] = useState<DailyAssignment[]>(initialAssignments);
  const [dprEntries, setDprEntries] = useState<DPREntry[]>(initialDPREntries);

  const publishAssignment = (assignment: DailyAssignment) => {
    setAssignments((prev) => {
      const existingIdx = prev.findIndex(
        (a) => a.projectId === assignment.projectId && a.date === assignment.date
      );
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = assignment;
        return updated;
      }
      return [assignment, ...prev];
    });
  };

  const addDPREntry = (entry: DPREntry) => {
    setDprEntries((prev) => [entry, ...prev]);
  };

  const certifyEntry = (id: string, reason?: string) => {
    setDprEntries((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          return {
            ...e,
            certified: true,
            certifiedBy: 'Er. Dipendra Shrestha (Site Engineer)',
            certifiedAt: new Date().toISOString(),
            mbRef: `MB-${activeProject.code}-${Date.now().toString().slice(-3)}`,
            certificationReason: reason || e.certificationReason,
          };
        }
        return e;
      })
    );
  };

  // Explicit hard rule: Bulk-certify must skip flagged entries!
  // Entries tagged 'no-assignment' or 'unplanned-work' can ONLY be certified individually with a reason.
  const certifyAllEntries = () => {
    setDprEntries((prev) =>
      prev.map((e) => {
        if (!e.certified && !e.flag && e.projectId === activeProject.id) {
          return {
            ...e,
            certified: true,
            certifiedBy: 'Er. Dipendra Shrestha (Site Engineer)',
            certifiedAt: new Date().toISOString(),
            mbRef: `MB-${activeProject.code}-${Date.now().toString().slice(-3)}`,
          };
        }
        return e;
      })
    );
  };

  return (
    <ProjectContext.Provider
      value={{
        activeProject,
        setActiveProject,
        allProjects: projects,
        assignments,
        publishAssignment,
        dprEntries,
        addDPREntry,
        certifyEntry,
        certifyAllEntries,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  return useContext(ProjectContext);
}
