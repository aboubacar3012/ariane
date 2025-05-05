import React from "react";
import { motion } from "framer-motion";
import { Clock, Database, ArrowDownToLine, RotateCcw } from "lucide-react";

export interface Backup {
  id: string;
  project: string;
  date: string;
  size: string;
  status: string;
}

interface BackupItemProps {
  backup: Backup;
  onDownload?: (backupId: string) => void;
  onRestore?: (backupId: string) => void;
}

// Animation variants
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};

/**
 * Composant pour afficher un élément de sauvegarde individuel
 */
const BackupItem = ({ backup, onDownload, onRestore }: BackupItemProps) => {
  return (
    <motion.div 
      variants={itemVariants}
      className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-all border border-gray-700"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600/20 rounded-md">
            <Database className="text-blue-400" size={20} />
          </div>
          <div>
            <h3 className="font-medium">{backup.project}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock size={14} />
              {new Date(backup.date).toLocaleString()}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-2 py-1 text-xs text-gray-400 bg-gray-700 rounded-full">{backup.size}</span>
          <div className="flex gap-2">
            {onDownload && (
              <button 
                className="p-1.5 text-blue-400 rounded-md hover:bg-gray-700"
                onClick={() => onDownload(backup.id)}
                title="Télécharger"
              >
                <ArrowDownToLine size={16} />
              </button>
            )}
            {onRestore && (
              <button 
                className="p-1.5 text-green-400 rounded-md hover:bg-gray-700"
                onClick={() => onRestore(backup.id)}
                title="Restaurer"
              >
                <RotateCcw size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BackupItem;