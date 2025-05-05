import React from "react";

interface BackupOptionsProps {
  includeMedia: boolean;
  setIncludeMedia: (value: boolean) => void;
  compress: boolean;
  setCompress: (value: boolean) => void;
  encrypt: boolean;
  setEncrypt: (value: boolean) => void;
}

/**
 * Composant pour les options de sauvegarde
 */
const BackupOptions = ({
  includeMedia,
  setIncludeMedia,
  compress,
  setCompress,
  encrypt,
  setEncrypt
}: BackupOptionsProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-400">Options de Backup</label>
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <input 
            type="checkbox" 
            id="include-media" 
            className="rounded border-gray-600 bg-gray-700" 
            checked={includeMedia}
            onChange={(e) => setIncludeMedia(e.target.checked)}
          />
          <label htmlFor="include-media" className="text-gray-300">Inclure les fichiers média</label>
        </div>
        <div className="flex items-center space-x-2">
          <input 
            type="checkbox" 
            id="compress" 
            className="rounded border-gray-600 bg-gray-700" 
            checked={compress}
            onChange={(e) => setCompress(e.target.checked)}
          />
          <label htmlFor="compress" className="text-gray-300">Compresser le backup</label>
        </div>
        <div className="flex items-center space-x-2">
          <input 
            type="checkbox" 
            id="encrypt" 
            className="rounded border-gray-600 bg-gray-700" 
            checked={encrypt}
            onChange={(e) => setEncrypt(e.target.checked)}
          />
          <label htmlFor="encrypt" className="text-gray-300">Chiffrer le backup</label>
        </div>
      </div>
    </div>
  );
};

export default BackupOptions;