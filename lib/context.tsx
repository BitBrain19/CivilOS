'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Project, projects } from '@/data/projects';

interface ProjectContextType {
  activeProject: Project;
  setActiveProject: (project: Project) => void;
  allProjects: Project[];
}

const ProjectContext = createContext<ProjectContextType>({
  activeProject: projects[0],
  setActiveProject: () => {},
  allProjects: projects,
});

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [activeProject, setActiveProject] = useState<Project>(projects[0]);

  return (
    <ProjectContext.Provider value={{ activeProject, setActiveProject, allProjects: projects }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  return useContext(ProjectContext);
}
