"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/src/components/Sidebar";
import { motion } from "framer-motion";
import { Key, Plus, Search, Globe, FileText } from "lucide-react";
import { Project, Secret, EnvironmentType, Token } from "./types";

// Import des composants
import ProjectCard from "./_components/ProjectCard";
import SecretItem from "./_components/SecretItem";
import TokenManager from "./_components/TokenManager";
import ProjectCreationModal from "./_components/ProjectCreationModal";
import SecretCreationModal from "./_components/SecretCreationModal";
import EnvironmentApiDocs from "./_components/EnvironmentApiDocs";

const EnvironmentPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateSecretModalOpen, setIsCreateSecretModalOpen] = useState(false);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"projects" | "secrets" | "tokens" | "documentation">("projects");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeEnvironment, setActiveEnvironment] = useState<EnvironmentType | "all">("all");
  const [currentProject, setCurrentProject] = useState<string | null>(null);
  const [selectedTokenProject, setSelectedTokenProject] = useState<string | null>(null);

  // Sample data for demonstration
  useEffect(() => {
    const sampleProjects: Project[] = [
      {
        id: "p1",
        name: "E-commerce API",
        description: "Backend services for our e-commerce platform",
        secretCount: 12,
        environments: ["development", "staging", "production"],
      },
      {
        id: "p2",
        name: "CRM Dashboard",
        description: "Customer relationship management system",
        secretCount: 8,
        environments: ["development", "production"],
      },
      {
        id: "p3",
        name: "Mobile App Backend",
        description: "API services for iOS and Android apps",
        secretCount: 15,
        environments: ["development", "staging", "production", "testing"],
      },
    ];

    const sampleSecrets: Secret[] = [
      {
        id: "s1",
        name: "DATABASE_URL",
        value: "postgres://user:password@localhost:5432/mydb",
        projectId: "p1",
        environmentType: "development",
        createdAt: "2025-04-20T10:00:00Z",
        updatedAt: "2025-05-01T08:30:00Z",
        createdBy: "admin@example.com",
      },
      {
        id: "s2",
        name: "API_KEY",
        value: "sk_test_51AbC1234567890abcdefghijklmnopqrstuvwxyz",
        projectId: "p1",
        environmentType: "development",
        createdAt: "2025-04-21T11:20:00Z",
        updatedAt: "2025-04-21T11:20:00Z",
        createdBy: "admin@example.com",
      },
      {
        id: "s3",
        name: "JWT_SECRET",
        value: "very-secure-jwt-secret-key-for-production",
        projectId: "p1",
        environmentType: "production",
        createdAt: "2025-04-22T09:15:00Z",
        updatedAt: "2025-05-02T14:45:00Z",
        createdBy: "admin@example.com",
      },
    ];

    const sampleTokens: Token[] = [
      {
        id: "t1",
        projectId: "p1",
        value: "sk_live_xyz123456789abcdefghijklmnopqrstuvwxyz",
        status: "valid",
        expiresIn: "3h12m",
        createdAt: "2025-05-06T10:00:00Z",
      }
    ];

    // Simuler un délai de chargement
    setTimeout(() => {
      setProjects(sampleProjects);
      setSecrets(sampleSecrets);
      setTokens(sampleTokens);
      setIsLoading(false);
    }, 800);
  }, []);

  // Filtrer les projets en fonction de la recherche
  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filtrer les secrets en fonction du projet et de l'environnement sélectionnés
  const filteredSecrets = secrets.filter(
    (secret) =>
      (currentProject ? secret.projectId === currentProject : true) &&
      (activeEnvironment !== "all" ? secret.environmentType === activeEnvironment : true) &&
      secret.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handlers pour les actions utilisateur
  const handleSelectProject = (projectId: string) => {
    setCurrentProject(projectId);
    setActiveTab("secrets");
  };

  const handleCreateProject = (project: { name: string; description: string; environments: EnvironmentType[] }) => {
    const newProject: Project = {
      id: `p${projects.length + 1}`,
      name: project.name,
      description: project.description,
      environments: project.environments,
      secretCount: 0,
    };
    
    setProjects((prev) => [...prev, newProject]);
  };

  const handleCreateSecret = (secret: { name: string; value: string; projectId: string; environmentType: EnvironmentType }) => {
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
      prev.map((s) => (s.id === updatedSecret.id ? { ...updatedSecret, updatedAt: new Date().toISOString() } : s))
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
          p.id === secretToDelete.projectId ? { ...p, secretCount: p.secretCount - 1 } : p
        )
      );
    }
  };

  const handleSelectTokenProject = (projectId: string | null) => {
    setSelectedTokenProject(projectId);
  };

  const handleGenerateToken = (projectId: string) => {
    // Vérifier si un token existe déjà pour ce projet
    const existingTokenIndex = tokens.findIndex(t => t.projectId === projectId);
    
    // Créer un nouveau token
    const newToken: Token = {
      id: existingTokenIndex >= 0 ? tokens[existingTokenIndex].id : `t${tokens.length + 1}`,
      projectId,
      value: "sk_live_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      status: "valid",
      expiresIn: "8h00m",
      createdAt: new Date().toISOString(),
    };
    
    // Mettre à jour les tokens
    if (existingTokenIndex >= 0) {
      setTokens(tokens.map((t, i) => i === existingTokenIndex ? newToken : t));
    } else {
      setTokens([...tokens, newToken]);
    }
    
    setTimeout(() => {
      const project = projects.find(p => p.id === projectId);
      alert(`Nouveau token généré avec succès pour le projet "${project?.name}"! Valide pour 8 heures.`);
    }, 300);
  };
  
  const handleRevokeToken = (tokenId: string) => {
    // Trouver le token pour le message d'alerte
    const tokenToRevoke = tokens.find(t => t.id === tokenId);
    const project = tokenToRevoke ? projects.find(p => p.id === tokenToRevoke.projectId) : null;
    
    // Supprimer le token
    setTokens(tokens.filter(t => t.id !== tokenId));
    
    setTimeout(() => {
      alert(`Le token d'accès pour le projet "${project?.name}" a été révoqué avec succès.`);
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
                  Gérez et sécurisez les variables d&apos;environnement de vos projets
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={activeTab === "projects" ? "Rechercher un projet..." : "Rechercher une variable..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-lg py-2 px-10 text-white w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <button
                  onClick={() => activeTab === "projects" ? setIsCreateProjectModalOpen(true) : setIsCreateSecretModalOpen(true)}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-1.5" />
                  {activeTab === "projects" ? "Nouveau Projet" : "Nouvelle Variable"}
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-800 p-4 rounded-lg mb-6 border border-gray-700"
            >
              <div className="flex flex-wrap gap-3 items-center">
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

                {currentProject && (
                  <button
                    onClick={() => setCurrentProject(null)}
                    className="ml-auto px-3 py-1.5 bg-gray-700 text-gray-300 hover:bg-gray-600 text-xs font-medium rounded-md transition-colors flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Effacer le filtre de projet
                  </button>
                )}
              </div>
            </motion.div>
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
                    <ProjectCard key={project.id} project={project} onSelectProject={handleSelectProject} />
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

          {/* Secrets List */}
          {activeTab === "secrets" && (
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
      
      {/* Secret Creation Modal */}
      <SecretCreationModal
        isOpen={isCreateSecretModalOpen}
        onClose={() => setIsCreateSecretModalOpen(false)}
        projects={projects}
        onCreateSecret={handleCreateSecret}
        currentProjectId={currentProject || undefined}
      />
    </div>
  );
};

export default EnvironmentPage;