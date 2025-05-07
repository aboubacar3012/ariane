import { useState } from "react";
import { X, Plus, Tag } from "lucide-react";
import { motion } from "framer-motion";
import { EnvironmentType } from "../types";

interface ProjectCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (project: {
    name: string;
    description: string;
    environments: EnvironmentType[];
  }) => void;
}

const ProjectCreationModal = ({
  isOpen,
  onClose,
  onCreateProject,
}: ProjectCreationModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [environments, setEnvironments] = useState<EnvironmentType[]>(["development"]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;
    
    onCreateProject({
      name,
      description,
      environments,
    });
    
    // Reset form
    setName("");
    setDescription("");
    setEnvironments(["development"]);
    
    onClose();
  };

  const toggleEnvironment = (env: EnvironmentType) => {
    setEnvironments((current) =>
      current.includes(env)
        ? current.filter((e) => e !== env)
        : [...current, env]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-700 w-full max-w-lg"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <Tag className="h-5 w-5 mr-2 text-blue-400" />
            Créer un nouveau projet
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="project-name"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Nom du projet<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="project-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Mon API"
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label
                htmlFor="project-description"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Description
              </label>
              <textarea
                id="project-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description du projet et de son utilisation..."
                rows={3}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Environnements<span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => toggleEnvironment("development")}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    environments.includes("development")
                      ? "bg-green-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  Development
                </button>
                <button
                  type="button"
                  onClick={() => toggleEnvironment("staging")}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    environments.includes("staging")
                      ? "bg-yellow-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  Staging
                </button>
                <button
                  type="button"
                  onClick={() => toggleEnvironment("production")}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    environments.includes("production")
                      ? "bg-red-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  Production
                </button>
                <button
                  type="button"
                  onClick={() => toggleEnvironment("testing")}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    environments.includes("testing")
                      ? "bg-purple-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  Testing
                </button>
              </div>
              {environments.length === 0 && (
                <p className="text-red-500 text-xs mt-1">
                  Veuillez sélectionner au moins un environnement
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md text-sm font-medium bg-gray-700 text-white hover:bg-gray-600 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!name.trim() || environments.length === 0}
              className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Créer le projet
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ProjectCreationModal;