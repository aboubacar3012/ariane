"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/src/components/Sidebar";
import { motion } from "framer-motion";
import { Key, Plus, Search, FileText } from "lucide-react";
import { Project, EnvironmentType, Token } from "./types";

import ProjectCard from "./_components/ProjectCard";
import TokenManager from "./_components/TokenManager";
import ProjectCreationModal from "./_components/ProjectCreationModal";
import EnvironmentApiDocs from "./_components/EnvironmentApiDocs";
import { sampleProjects, sampleTokens } from "./data";
import VariablesSection from "./VariablesSection";

const EnvironmentPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] =
    useState(false);
  const [isCreateSecretModalOpen, setIsCreateSecretModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<
    "projects" | "secrets" | "tokens" | "documentation"
  >("projects");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentProject, setCurrentProject] = useState<string | null>(null);
  const [selectedTokenProject, setSelectedTokenProject] = useState<
    string | null
  >(null);

  // Sample data for demonstration
  useEffect(() => {
    // Simuler un délai de chargement
    setTimeout(() => {
      setProjects(sampleProjects);
      setTokens(sampleTokens);
      setIsLoading(false);
    }, 800);
  }, []);

  // Filtrer les projets en fonction de la recherche
  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handlers pour les actions utilisateur
  const handleSelectProject = (projectId: string) => {
    setCurrentProject(projectId);
    setActiveTab("secrets");
  };

  const handleCreateProject = (project: {
    name: string;
    description: string;
    environments: EnvironmentType[];
  }) => {
    const newProject: Project = {
      id: `p${projects.length + 1}`,
      name: project.name,
      description: project.description,
      environments: project.environments,
      secretCount: 0,
    };

    setProjects((prev) => [...prev, newProject]);
  };

  const handleSelectTokenProject = (projectId: string | null) => {
    setSelectedTokenProject(projectId);
  };

  const handleGenerateToken = (projectId: string) => {
    // Créer un nouveau token unique
    const newToken: Token = {
      id: `tok_${new Date().getTime()}_${Math.random().toString(36).substring(2, 9)}`, // Génère un ID plus unique
      projectId,
      value:
        "sk_live_" +
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15),
      status: "valid",
      expiresIn: "8h00m", // Durée de validité fixe pour cet exemple
      createdAt: new Date().toISOString(),
    };

    // Ajouter le nouveau token à la liste existante pour ce projet
    setTokens(prevTokens => [...prevTokens, newToken]);

    setTimeout(() => {
      const project = projects.find((p) => p.id === projectId);
      alert(
        `Nouveau token généré avec succès pour le projet "${project?.name}"! Valide pour 8 heures.`
      );
    }, 300);
  };

  const handleRevokeToken = (tokenId: string) => {
    // Trouver le token pour le message d'alerte
    const tokenToRevoke = tokens.find((t) => t.id === tokenId);
    const project = tokenToRevoke
      ? projects.find((p) => p.id === tokenToRevoke.projectId)
      : null;

    // Supprimer le token
    setTokens(tokens.filter((t) => t.id !== tokenId));

    setTimeout(() => {
      alert(
        `Le token d'accès pour le projet "${project?.name}" a été révoqué avec succès.`
      );
    }, 300);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-xl shadow-lg mb-6 border border-gray-700"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold flex items-center">
                  <Key className="h-6 w-6 mr-2 text-blue-400" />
                  Gestion des Variables d&apos;Environnement
                </h1>
                <p className="text-gray-400 mt-1">
                  Gérez et sécurisez les variables d&apos;environnement de vos
                  projets
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={
                      activeTab === "projects"
                        ? "Rechercher un projet..."
                        : "Rechercher une variable..."
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-lg py-2 px-10 text-white w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <button
                  onClick={() =>
                    activeTab === "projects"
                      ? setIsCreateProjectModalOpen(true)
                      : setIsCreateSecretModalOpen(true)
                  }
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-1.5" />
                  {activeTab === "projects"
                    ? "Nouveau Projet"
                    : "Nouvelle Variable"}
                </button>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1 mt-6 border-b border-gray-700">
              <button
                onClick={() => setActiveTab("projects")}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === "projects"
                    ? "bg-gray-800 text-white border-t border-l border-r border-gray-700"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Projets
              </button>
              <button
                onClick={() => setActiveTab("secrets")}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === "secrets"
                    ? "bg-gray-800 text-white border-t border-l border-r border-gray-700"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Variables
              </button>
              <button
                onClick={() => setActiveTab("tokens")}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === "tokens"
                    ? "bg-gray-800 text-white border-t border-l border-r border-gray-700"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Tokens d&apos;accès
              </button>
              <button
                onClick={() => setActiveTab("documentation")}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === "documentation"
                    ? "bg-gray-800 text-white border-t border-l border-r border-gray-700"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <FileText className="h-4 w-4 inline mr-1" />
                Documentation
              </button>
            </div>
          </motion.div>

          {/* Token Manager (uniquement visible dans l'onglet tokens) */}
          {activeTab === "tokens" && (
            <TokenManager
              tokens={tokens}
              projects={projects}
              selectedProjectId={selectedTokenProject}
              onSelectProject={handleSelectTokenProject}
              onGenerateToken={handleGenerateToken}
              onRevokeToken={handleRevokeToken}
            />
          )}

          {/* Filtres pour les variables d'environnement */}
          {activeTab === "secrets" && (
            <VariablesSection
              currentProject={currentProject}
              setCurrentProject={setCurrentProject}
              searchQuery={searchQuery}
              setProjects={setProjects}
              projects={projects}
              isCreateSecretModalOpen={isCreateSecretModalOpen}
              setIsCreateSecretModalOpen={setIsCreateSecretModalOpen}
            />
          )}

          {/* Projects Grid */}
          {activeTab === "projects" && (
            <>
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden animate-pulse"
                    >
                      <div className="p-6 h-48"></div>
                    </div>
                  ))}
                </div>
              ) : filteredProjects.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onSelectProject={handleSelectProject}
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
                    Aucun projet trouvé
                  </h3>
                  <p className="text-gray-500 max-w-md mb-6">
                    {searchQuery
                      ? `Aucun projet ne correspond à votre recherche "${searchQuery}"`
                      : "Vous n'avez pas encore créé de projet. Commencez maintenant !"}
                  </p>
                  <button
                    onClick={() => setIsCreateProjectModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-1.5" />
                    Créer un nouveau projet
                  </button>
                </motion.div>
              )}
            </>
          )}

          {/* Documentation Tab */}
          {activeTab === "documentation" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <EnvironmentApiDocs />
            </motion.div>
          )}
        </div>
      </main>

      {/* Project Creation Modal */}
      <ProjectCreationModal
        isOpen={isCreateProjectModalOpen}
        onClose={() => setIsCreateProjectModalOpen(false)}
        onCreateProject={handleCreateProject}
      />
    </div>
  );
};

export default EnvironmentPage;
