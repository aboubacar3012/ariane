import { motion } from "framer-motion";
import { useState } from "react";
import { Key, X, Clipboard, CheckCircle, Tag, Eye, EyeOff } from "lucide-react"; // Updated imports
import { Project, Token } from "../types";

interface TokenManagerProps {
  tokens: Token[];
  projects: Project[];
  selectedProjectId: string | null;
  onSelectProject: (projectId: string | null) => void;
  onGenerateToken: (projectId: string) => void;
  onRevokeToken: (tokenId: string) => void;
}

const TokenManager = ({ 
  tokens,
  projects,
  selectedProjectId,
  onSelectProject,
  onGenerateToken,
  onRevokeToken
}: TokenManagerProps) => {
  const [isValueVisible, setIsValueVisible] = useState<Record<string, boolean>>({}); // Changed for multiple tokens
  const [isCopied, setIsCopied] = useState<Record<string, boolean>>({}); // Changed for multiple tokens

  // Tokens for the selected project
  const selectedProjectTokens = selectedProjectId 
    ? tokens.filter(token => token.projectId === selectedProjectId)
    : [];

  const toggleValueVisibility = (tokenId: string) => {
    setIsValueVisible(prev => ({ ...prev, [tokenId]: !prev[tokenId] }));
  };

  const copyTokenToClipboard = (tokenId: string, tokenValue: string) => {
    if (tokenValue) {
      navigator.clipboard.writeText(tokenValue);
      setIsCopied(prev => ({ ...prev, [tokenId]: true }));
      setTimeout(() => setIsCopied(prev => ({ ...prev, [tokenId]: false })), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6"
    >
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        <Key className="h-5 w-5 mr-2 text-blue-400" />
        Tokens d&apos;accès aux projets
      </h3>
      
      <p className="text-gray-400 text-sm mb-4">
        Les tokens d&apos;accès permettent à vos applications et services d&apos;accéder aux variables d&apos;environnement
        d&apos;un projet spécifique de manière sécurisée. Chaque token est valide pour 8 heures seulement.
      </p>
      
      {/* Sélection du projet */}
      <div className="mb-4">
        <label htmlFor="project-select" className="block text-sm font-medium text-gray-300 mb-2">
          <Tag className="h-4 w-4 mr-1 inline-block" /> Sélectionner un projet
        </label>
        <select
          id="project-select"
          value={selectedProjectId || ""}
          onChange={(e) => onSelectProject(e.target.value || null)}
          className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Sélectionner un projet</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>
      
      {/* Liste des tokens existants */}
      {tokens.length > 0 && !selectedProjectId && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Tokens actifs</h4>
          <div className="space-y-2">
            {tokens.map(token => {
              const project = projects.find(p => p.id === token.projectId);
              return (
                <div 
                  key={token.id} 
                  className="bg-gray-900 rounded-md p-3 border border-gray-700 flex justify-between items-center"
                >
                  <div>
                    <span className="text-white font-medium">{project?.name || 'Projet inconnu'}</span>
                    <div className="text-xs text-gray-400">
                      Expire dans {token.expiresIn}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onSelectProject(token.projectId)}
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      Voir
                    </button>
                    <button
                      onClick={() => onRevokeToken(token.id)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Révoquer
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Détails des tokens pour le projet sélectionné */}
      {selectedProjectId && (
        <div className="bg-gray-900 rounded-lg p-4 mb-4 border border-gray-700">
          <h4 className="text-md font-semibold mb-3 text-white">
            Tokens pour {projects.find(p => p.id === selectedProjectId)?.name || 'Projet sélectionné'}
          </h4>
          {selectedProjectTokens.length > 0 ? (
            <div className="space-y-3">
              {selectedProjectTokens.map(token => (
                <div key={token.id} className="bg-gray-800 rounded-md p-3 border border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Statut:</span>
                    {token.status === "valid" ? (
                      <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded-md">
                        Valide (expire dans {token.expiresIn})
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-red-900/30 text-red-400 text-xs rounded-md">
                        Expiré
                      </span>
                    )}
                  </div>
                  
                  {token.status === "valid" && token.value && (
                    <div className="flex items-center bg-gray-700 rounded px-3 py-2 mb-2">
                      <input 
                        type={isValueVisible[token.id] ? "text" : "password"}
                        value={isValueVisible[token.id] ? token.value : "•".repeat(Math.min(40, token.value.length))}
                        readOnly
                        className="bg-transparent border-none w-full text-gray-400 font-mono text-sm focus:outline-none"
                      />
                      <div className="flex space-x-1">
                        <button 
                          onClick={() => toggleValueVisibility(token.id)}
                          className="text-gray-400 hover:text-white p-1 rounded"
                          title={isValueVisible[token.id] ? "Masquer le token" : "Afficher le token"}
                        >
                          {isValueVisible[token.id] ? 
                            <EyeOff className="h-5 w-5" /> 
                            : 
                            <Eye className="h-5 w-5" />
                          }
                        </button>
                        <button 
                          onClick={() => copyTokenToClipboard(token.id, token.value)}
                          className="text-gray-400 hover:text-white p-1 rounded relative"
                          title="Copier le token"
                        >
                          {isCopied[token.id] ? <CheckCircle className="h-5 w-5 text-green-500" /> : <Clipboard className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                  )}
                   <button
                      onClick={() => onRevokeToken(token.id)}
                      className="px-3 py-1 bg-red-700 hover:bg-red-800 rounded-md text-white text-xs font-medium transition-colors flex items-center"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Révoquer ce token
                    </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Aucun token actif pour ce projet.</p>
          )}
        </div>
      )}
      
      <div className="flex gap-2">
        {selectedProjectId && (
          <button
            onClick={() => onGenerateToken(selectedProjectId)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white text-sm font-medium transition-colors flex items-center"
          >
            <Key className="h-4 w-4 mr-1.5" />
            Générer un nouveau token
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default TokenManager;