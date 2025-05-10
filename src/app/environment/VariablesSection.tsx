"use client";
import { motion } from "framer-motion";
import { Globe, Key, Plus, Tag } from "lucide-react"; // Added Tag
import { useEffect, useState } from "react";
import { EnvironmentType, Project, Secret } from "./types";
import { sampleSecrets } from "./data";
import SecretCreationModal from "./_components/SecretCreationModal";
import SecretItem from "./_components/SecretItem";

type VariablesSectionType = {
  currentProject: string | null;
  setCurrentProject: React.Dispatch<React.SetStateAction<string | null>>;
  searchQuery: string;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  isCreateSecretModalOpen: boolean;
  setIsCreateSecretModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const VariablesSection = ({
  currentProject,
  setCurrentProject,
  searchQuery,
  projects,
  setProjects,
  isCreateSecretModalOpen,
  setIsCreateSecretModalOpen,
}: VariablesSectionType) => {
  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeEnvironment, setActiveEnvironment] = useState<
    EnvironmentType | "all"
  >("all");

  // Sample data for demonstration
  useEffect(() => {
    // Simuler un délai de chargement
    setTimeout(() => {
      setSecrets(sampleSecrets);
      setIsLoading(false);
    }, 800);
  }, []);

  // Filtrer les secrets en fonction du projet et de l'environnement sélectionnés
  const filteredSecrets = secrets.filter(
    (secret) =>
      (currentProject ? secret.projectId === currentProject : true) &&
      (activeEnvironment !== "all"
        ? secret.environmentType === activeEnvironment
        : true) &&
      secret.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateSecret = (secret: {
    name: string;
    value: string;
    projectId: string;
    environmentType: EnvironmentType;
  }) => {
    const newSecret: Secret = {
      id: `s${secrets.length + 1}`,
      name: secret.name,
      value: secret.value,
      projectId: secret.projectId,
      environmentType: secret.environmentType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "current@user.com",
    };

    setSecrets((prev) => [...prev, newSecret]);

    // Update secret count for the project
    setProjects((prev) =>
      prev.map((p) =>
        p.id === secret.projectId ? { ...p, secretCount: p.secretCount + 1 } : p
      )
    );
  };

  const handleEditSecret = (updatedSecret: Secret) => {
    setSecrets((prev) =>
      prev.map((s) =>
        s.id === updatedSecret.id
          ? { ...updatedSecret, updatedAt: new Date().toISOString() }
          : s
      )
    );
  };

  const handleDeleteSecret = (secretId: string) => {
    const secretToDelete = secrets.find((s) => s.id === secretId);

    if (secretToDelete) {
      // Remove the secret
      setSecrets((prev) => prev.filter((s) => s.id !== secretId));

      // Update the secret count for the project
      setProjects((prev) =>
        prev.map((p) =>
          p.id === secretToDelete.projectId
            ? { ...p, secretCount: p.secretCount - 1 }
            : p
        )
      );
    }
  };
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-800 p-4 rounded-lg mb-6 border border-gray-700"
      >
        {/* Project Selector */}
        <div className="mb-4">
          <label
            htmlFor="project-select-variables"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            <Tag className="h-4 w-4 mr-1 inline-block" /> Sélectionner un projet
          </label>
          <select
            id="project-select-variables"
            value={currentProject || ""}
            onChange={(e) => setCurrentProject(e.target.value || null)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tous les projets</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap gap-3 items-center mb-4">
          <div className="mr-2 text-gray-400 text-sm">Environnement:</div>
          <button
            onClick={() => setActiveEnvironment("all")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeEnvironment === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            <Globe className="h-3 w-3 inline mr-1" />
            Tous
          </button>
          <button
            onClick={() => setActiveEnvironment("development")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeEnvironment === "development"
                ? "bg-green-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Development
          </button>
          <button
            onClick={() => setActiveEnvironment("staging")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeEnvironment === "staging"
                ? "bg-yellow-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Staging
          </button>
          <button
            onClick={() => setActiveEnvironment("production")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeEnvironment === "production"
                ? "bg-red-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Production
          </button>
          <button
            onClick={() => setActiveEnvironment("testing")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeEnvironment === "testing"
                ? "bg-purple-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Testing
          </button>
        </div>
      </motion.div>
      <>
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-gray-800 rounded-lg border border-gray-700 p-4 animate-pulse h-24"
              ></div>
            ))}
          </div>
        ) : filteredSecrets.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="grid grid-cols-1 gap-4"
          >
            {filteredSecrets.map((secret) => (
              <SecretItem
                key={secret.id}
                secret={secret}
                onEdit={handleEditSecret}
                onDelete={handleDeleteSecret}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <Key className="h-16 w-16 text-gray-700 mb-4" />
            <h3 className="text-xl font-medium text-gray-400 mb-2">
              Aucune variable trouvée
            </h3>
            <p className="text-gray-500 max-w-md mb-6">
              {searchQuery
                ? `Aucune variable ne correspond à votre recherche "${searchQuery}"`
                : currentProject
                ? "Ce projet n'a pas encore de variables d'environnement."
                : "Aucune variable d'environnement n'a été créée."}
            </p>
            <button
              onClick={() => setIsCreateSecretModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Ajouter une variable
            </button>
          </motion.div>
        )}
      </>
      {/* Secret Creation Modal */}
      <SecretCreationModal
        isOpen={isCreateSecretModalOpen}
        onClose={() => setIsCreateSecretModalOpen(false)}
        projects={projects}
        onCreateSecret={handleCreateSecret}
        currentProjectId={currentProject || undefined}
      />
    </>
  );
};

export default VariablesSection;
