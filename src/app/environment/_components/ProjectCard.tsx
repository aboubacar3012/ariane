import { motion } from "framer-motion";
import { Key, Shield } from "lucide-react";
import { Project } from "../types";

interface ProjectCardProps {
  project: Project;
  onSelectProject: (projectId: string) => void;
}

const ProjectCard = ({ project, onSelectProject }: ProjectCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2 }}
    className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden hover:border-blue-500 transition-all duration-200"
  >
    <div className="p-6 relative">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-white truncate">{project.name}</h3>
        <div className="px-2 py-1 bg-blue-900/40 text-blue-400 text-xs rounded-md">
          {project.secretCount} secrets
        </div>
      </div>
      
      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {project.environments.map((env) => (
          <span 
            key={env}
            className={`px-2 py-1 text-xs rounded-md ${
              env === "production" 
                ? "bg-red-900/30 text-red-400" 
                : env === "staging" 
                ? "bg-yellow-900/30 text-yellow-400"
                : env === "testing"
                ? "bg-purple-900/30 text-purple-400"
                : "bg-green-900/30 text-green-400"
            }`}
          >
            {env}
          </span>
        ))}
      </div>
      
      <div className="flex justify-between mt-4">
        <button 
          onClick={() => onSelectProject(project.id)}
          className="text-sm text-blue-400 hover:text-blue-300 flex items-center"
        >
          <Key size={14} className="mr-1" /> Gérer les secrets
        </button>
        <button className="text-sm text-gray-400 hover:text-gray-300 flex items-center">
          <Shield size={14} className="mr-1" /> Gérer l&apos;accès
        </button>
      </div>
    </div>
  </motion.div>
);

export default ProjectCard;