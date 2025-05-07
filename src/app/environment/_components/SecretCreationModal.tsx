import { useState, useRef } from "react";
import { X, Plus, Key, AlertCircle, Upload, FileText, List } from "lucide-react";
import { motion } from "framer-motion";
import { EnvironmentType, Project } from "../types";

interface SecretCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onCreateSecret: (secret: {
    name: string;
    value: string;
    projectId: string;
    environmentType: EnvironmentType;
  }) => void;
  currentProjectId?: string;
}

const SecretCreationModal = ({
  isOpen,
  onClose,
  projects,
  onCreateSecret,
  currentProjectId
}: SecretCreationModalProps) => {
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [projectId, setProjectId] = useState(currentProjectId || "");
  const [environmentType, setEnvironmentType] = useState<EnvironmentType>("development");
  const [isValueVisible, setIsValueVisible] = useState(false);
  const [importMode, setImportMode] = useState<"single" | "multiple">("single");
  const [bulkVariables, setBulkVariables] = useState("");
  const [parsedVariables, setParsedVariables] = useState<Array<{name: string, value: string}>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Réinitialiser le formulaire lorsque la modal s'ouvre
  useState(() => {
    if (isOpen) {
      setName("");
      setValue("");
      setProjectId(currentProjectId || "");
      setEnvironmentType("development");
      setIsValueVisible(false);
      setImportMode("single");
      setBulkVariables("");
      setParsedVariables([]);
    }
  });

  // Traiter les variables d'un fichier .env ou d'un texte multi-lignes
  const parseEnvVariables = (content: string) => {
    const lines = content.split("\n");
    const variables: Array<{name: string, value: string}> = [];
    
    lines.forEach(line => {
      line = line.trim();
      // Ignorer les commentaires et les lignes vides
      if (line.startsWith("#") || line === "") {
        return;
      }
      
      // Extraire la paire clé-valeur
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const name = match[1].trim();
        const value = match[2].trim();
        // Gérer les valeurs entre guillemets
        const unquotedValue = value.replace(/^["'](.*)["']$/, "$1");
        variables.push({ 
          name: name.toUpperCase(), 
          value: unquotedValue 
        });
      }
    });
    
    return variables;
  };

  // Gérer l'upload de fichier .env
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const parsedVars = parseEnvVariables(content);
      setParsedVariables(parsedVars);
      setBulkVariables(content);
    };
    reader.readAsText(file);
  };

  // Gérer les variables copiées-collées
  const handleBulkTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    setBulkVariables(content);
    const parsedVars = parseEnvVariables(content);
    setParsedVariables(parsedVars);
  };

  // Gérer la soumission des variables importées
  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectId || !environmentType || parsedVariables.length === 0) return;
    
    // Traiter chaque variable une par une
    parsedVariables.forEach(variable => {
      onCreateSecret({
        name: variable.name,
        value: variable.value,
        projectId,
        environmentType,
      });
    });
    
    // Reset form
    setBulkVariables("");
    setParsedVariables([]);
    setProjectId(currentProjectId || "");
    setEnvironmentType("development");
    
    onClose();
  };

  const selectedProject = projects.find(p => p.id === projectId);
  const availableEnvironments = selectedProject?.environments || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !value.trim() || !projectId || !environmentType) return;
    
    onCreateSecret({
      name,
      value,
      projectId,
      environmentType,
    });
    
    // Reset form
    setName("");
    setValue("");
    setProjectId(currentProjectId || "");
    setEnvironmentType("development");
    
    onClose();
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <Key className="h-5 w-5 mr-2 text-blue-400" />
            Créer une nouvelle variable
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation entre modes d'ajout */}
        <div className="flex mb-6 border-b border-gray-700">
          <button
            type="button"
            onClick={() => setImportMode("single")}
            className={`flex items-center px-4 py-2 text-sm font-medium ${
              importMode === "single"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            <Key className="h-4 w-4 mr-2" />
            Variable unique
          </button>
          <button
            type="button"
            onClick={() => setImportMode("multiple")}
            className={`flex items-center px-4 py-2 text-sm font-medium ${
              importMode === "multiple"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            <List className="h-4 w-4 mr-2" />
            Import multiple
          </button>
        </div>

        {importMode === "single" ? (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="secret-name"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Nom de la variable<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="secret-name"
                  value={name}
                  onChange={(e) => setName(e.target.value.toUpperCase())}
                  placeholder="DATABASE_URL"
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white font-mono placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <p className="text-gray-400 text-xs mt-1">
                  Les noms de variables sont automatiquement convertis en majuscules.
                </p>
              </div>

              <div>
                <label
                  htmlFor="secret-value"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Valeur<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={isValueVisible ? "text" : "password"}
                    id="secret-value"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="ma-valeur-secrète"
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white font-mono placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setIsValueVisible(!isValueVisible)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-white"
                  >
                    {isValueVisible ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Sélection du projet et environnement */}
              <div>
                <label
                  htmlFor="project-select"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Projet<span className="text-red-500">*</span>
                </label>
                <select
                  id="project-select"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={!!currentProjectId}
                >
                  <option value="" disabled>
                    Sélectionner un projet
                  </option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              {projectId && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Environnement<span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableEnvironments.includes("development") && (
                      <button
                        type="button"
                        onClick={() => setEnvironmentType("development")}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                          environmentType === "development"
                            ? "bg-green-600 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        Development
                      </button>
                    )}
                    {availableEnvironments.includes("staging") && (
                      <button
                        type="button"
                        onClick={() => setEnvironmentType("staging")}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                          environmentType === "staging"
                            ? "bg-yellow-600 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        Staging
                      </button>
                    )}
                    {availableEnvironments.includes("production") && (
                      <button
                        type="button"
                        onClick={() => setEnvironmentType("production")}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                          environmentType === "production"
                            ? "bg-red-600 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        Production
                      </button>
                    )}
                    {availableEnvironments.includes("testing") && (
                      <button
                        type="button"
                        onClick={() => setEnvironmentType("testing")}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                          environmentType === "testing"
                            ? "bg-purple-600 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        Testing
                      </button>
                    )}
                  </div>

                  {environmentType === "production" && (
                    <div className="mt-3 p-3 bg-red-900/30 border border-red-800/50 rounded-md flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-300">
                        Attention: Les variables de production doivent être manipulées avec précaution. 
                        Elles peuvent affecter directement vos applications en production.
                      </p>
                    </div>
                  )}
                </div>
              )}

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
                  disabled={!name.trim() || !value.trim() || !projectId || !environmentType}
                  className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1.5" />
                  Créer la variable
                </button>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleBulkSubmit}>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label
                    htmlFor="bulk-variables"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Variables d&apos;environnement<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    accept=".env,.txt"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-sm text-blue-400 hover:text-blue-300 flex items-center"
                  >
                    <Upload className="h-3.5 w-3.5 mr-1" />
                    Importer un fichier .env
                  </button>
                </div>
                <textarea
                  id="bulk-variables"
                  value={bulkVariables}
                  onChange={handleBulkTextChange}
                  placeholder="DATABASE_URL=postgresql://user:password@localhost:5432/db&#10;API_KEY=your_api_key&#10;DEBUG=true"
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white font-mono placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={6}
                  required
                />
                <p className="text-gray-400 text-xs mt-1">
                  Format: une variable par ligne, au format CLÉ=VALEUR. Les commentaires (lignes commençant par #) seront ignorés.
                </p>
              </div>

              {parsedVariables.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                    <FileText className="h-4 w-4 mr-1.5 text-blue-400" />
                    Variables détectées ({parsedVariables.length})
                  </h3>
                  <div className="max-h-40 overflow-y-auto bg-gray-900 rounded-md p-2 border border-gray-700">
                    {parsedVariables.map((variable, index) => (
                      <div key={index} className="text-sm font-mono py-1 flex">
                        <span className="text-blue-400 truncate">{variable.name}</span>
                        <span className="text-gray-500 mx-1">=</span>
                        <span className="text-gray-300 truncate">
                          {variable.value.length > 25 ? variable.value.slice(0, 25) + "..." : variable.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sélection du projet et environnement */}
              <div>
                <label
                  htmlFor="project-select-bulk"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Projet<span className="text-red-500">*</span>
                </label>
                <select
                  id="project-select-bulk"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={!!currentProjectId}
                >
                  <option value="" disabled>
                    Sélectionner un projet
                  </option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              {projectId && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Environnement<span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableEnvironments.includes("development") && (
                      <button
                        type="button"
                        onClick={() => setEnvironmentType("development")}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                          environmentType === "development"
                            ? "bg-green-600 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        Development
                      </button>
                    )}
                    {availableEnvironments.includes("staging") && (
                      <button
                        type="button"
                        onClick={() => setEnvironmentType("staging")}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                          environmentType === "staging"
                            ? "bg-yellow-600 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        Staging
                      </button>
                    )}
                    {availableEnvironments.includes("production") && (
                      <button
                        type="button"
                        onClick={() => setEnvironmentType("production")}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                          environmentType === "production"
                            ? "bg-red-600 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        Production
                      </button>
                    )}
                    {availableEnvironments.includes("testing") && (
                      <button
                        type="button"
                        onClick={() => setEnvironmentType("testing")}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                          environmentType === "testing"
                            ? "bg-purple-600 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        Testing
                      </button>
                    )}
                  </div>

                  {environmentType === "production" && (
                    <div className="mt-3 p-3 bg-red-900/30 border border-red-800/50 rounded-md flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-300">
                        Attention: Les variables de production doivent être manipulées avec précaution. 
                        Elles peuvent affecter directement vos applications en production.
                      </p>
                    </div>
                  )}
                </div>
              )}

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
                  disabled={parsedVariables.length === 0 || !projectId || !environmentType}
                  className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1.5" />
                  Importer {parsedVariables.length} variable{parsedVariables.length > 1 ? 's' : ''}
                </button>
              </div>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default SecretCreationModal;