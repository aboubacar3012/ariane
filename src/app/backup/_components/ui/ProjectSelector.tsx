import React from "react";

interface Project {
  id: string;
  name: string;
  dbType?: string;
}

interface ProjectSelectorProps {
  projects: Project[];
  selectedProject: string;
  onProjectChange: (projectId: string) => void;
  label?: string;
}

/**
 * Composant pour sélectionner un projet dans une liste déroulante
 */
const ProjectSelector = ({ 
  projects, 
  selectedProject, 
  onProjectChange, 
  label = "Sélectionner un projet" 
}: ProjectSelectorProps) => {
  return (
    <div className="flex-grow max-w-md w-full md:w-auto">
      <label htmlFor="project-select" className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
      <div className="relative">
        <select 
          id="project-select"
          value={selectedProject} 
          onChange={(e) => onProjectChange(e.target.value)}
          className="bg-gray-700 p-2 pl-4 pr-10 rounded-lg text-white w-full border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none appearance-none"
        >
          <option value="">Tous les projets</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}{project.dbType ? ` (${project.dbType})` : ''}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ProjectSelector;