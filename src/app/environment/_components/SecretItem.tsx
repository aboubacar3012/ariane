import { motion } from "framer-motion";
import { useState } from "react";
import { Copy, Eye, EyeOff, Edit, Trash2 } from "lucide-react";
import { Secret } from "../types";

interface SecretItemProps {
  secret: Secret;
  onEdit?: (secret: Secret) => void;
  onDelete?: (secretId: string) => void;
}

const SecretItem = ({ secret, onEdit, onDelete }: SecretItemProps) => {
  const [isValueVisible, setIsValueVisible] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyValue = () => {
    navigator.clipboard.writeText(secret.value);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-blue-500 transition-all duration-200"
    >
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-mono text-md font-semibold text-white">{secret.name}</h4>
        <div className={`px-2 py-1 text-xs rounded-md ${
          secret.environmentType === "production" 
            ? "bg-red-900/30 text-red-400" 
            : secret.environmentType === "staging" 
            ? "bg-yellow-900/30 text-yellow-400"
            : secret.environmentType === "testing"
            ? "bg-purple-900/30 text-purple-400"
            : "bg-green-900/30 text-green-400"
        }`}>
          {secret.environmentType}
        </div>
      </div>
      
      <div className="flex items-center bg-gray-900 rounded px-3 py-2 mb-3">
        <input 
          type={isValueVisible ? "text" : "password"} 
          value={isValueVisible ? secret.value : "•".repeat(12)}
          readOnly
          className="bg-transparent border-none w-full text-gray-400 font-mono focus:outline-none"
        />
        <div className="flex space-x-1">
          <button 
            onClick={() => setIsValueVisible(!isValueVisible)}
            className="text-gray-400 hover:text-white p-1 rounded"
            title={isValueVisible ? "Masquer la valeur" : "Afficher la valeur"}
          >
            {isValueVisible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          <button 
            onClick={handleCopyValue}
            className="text-gray-400 hover:text-white p-1 rounded"
            title="Copier la valeur"
          >
            <Copy size={16} />
            {isCopied && (
              <span className="absolute -mt-8 -ml-10 bg-gray-800 text-xs px-2 py-1 rounded">
                Copié!
              </span>
            )}
          </button>
        </div>
      </div>
      
      <div className="flex justify-between text-xs text-gray-500">
        <span>Mis à jour: {new Date(secret.updatedAt).toLocaleDateString()}</span>
        <div className="flex gap-2">
          {onEdit && (
            <button 
              onClick={() => onEdit(secret)}
              className="text-blue-400 hover:text-blue-300 flex items-center"
            >
              <Edit size={12} className="mr-1" /> Éditer
            </button>
          )}
          {onDelete && (
            <button 
              onClick={() => onDelete(secret.id)}
              className="text-red-400 hover:text-red-300 flex items-center"
            >
              <Trash2 size={12} className="mr-1" /> Supprimer
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SecretItem;