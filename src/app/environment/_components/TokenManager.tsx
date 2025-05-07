import { motion } from "framer-motion";
import { useState } from "react";
import { Key, RefreshCw, X, Clipboard, CheckCircle, Tag } from "lucide-react";
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
  const [isValueVisible, setIsValueVisible] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Le token pour le projet sélectionné
  const currentToken = selectedProjectId 
    ? tokens.find(token => token.projectId === selectedProjectId)
    : null;

  const copyTokenToClipboard = () => {
    if (currentToken?.value) {
      navigator.clipboard.writeText(currentToken.value);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
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
      
      {/* Détails du token pour le projet sélectionné */}
      {selectedProjectId && (
        <div className="bg-gray-900 rounded-lg p-4 mb-4 border border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Statut du token:</span>
            {currentToken?.status === "valid" ? (
              <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded-md">
                Valide (expire dans {currentToken.expiresIn})
              </span>
            ) : currentToken?.status === "expired" ? (
              <span className="px-2 py-1 bg-red-900/30 text-red-400 text-xs rounded-md">
                Expiré
              </span>
            ) : (
              <span className="px-2 py-1 bg-gray-700/50 text-gray-400 text-xs rounded-md">
                Aucun token
              </span>
            )}
          </div>
          
          {currentToken?.status === "valid" && currentToken.value && (
            <div className="flex items-center bg-gray-800 rounded px-3 py-2 mb-2">
              <input 
                type={isValueVisible ? "text" : "password"}
                value={isValueVisible ? currentToken.value : "•".repeat(Math.min(40, currentToken.value.length))}
                readOnly
                className="bg-transparent border-none w-full text-gray-400 font-mono text-sm focus:outline-none"
              />
              <div className="flex space-x-1">
                <button 
                  onClick={() => setIsValueVisible(!isValueVisible)}
                  className="text-gray-400 hover:text-white p-1 rounded"
                  title={isValueVisible ? "Masquer le token" : "Afficher le token"}
                >
                  {isValueVisible ? 
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg> 
                    : 
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  }
                </button>
                <button 
                  onClick={copyTokenToClipboard}
                  className="text-gray-400 hover:text-white p-1 rounded relative"
                  title="Copier le token"
                >
                  {isCopied ? <CheckCircle className="h-5 w-5 text-green-500" /> : <Clipboard className="h-5 w-5" />}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="flex gap-2">
        {selectedProjectId && (
          <>
            <button
              onClick={() => onGenerateToken(selectedProjectId)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white text-sm font-medium transition-colors flex items-center"
              disabled={!selectedProjectId}
            >
              {currentToken?.status === "valid" ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-1.5" />
                  Régénérer le token
                </>
              ) : (
                <>
                  <Key className="h-4 w-4 mr-1.5" />
                  Générer un nouveau token
                </>
              )}
            </button>
            
            {currentToken?.status === "valid" && (
              <button 
                onClick={() => onRevokeToken(currentToken.id)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white text-sm font-medium transition-colors flex items-center"
              >
                <X className="h-4 w-4 mr-1.5" />
                Révoquer
              </button>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default TokenManager;