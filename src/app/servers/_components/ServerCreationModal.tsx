"use client";
import { useState } from "react";
import { Server, Plus, RefreshCw } from "lucide-react";
import Modal from "@/src/components/ui/Modal";


const ServerCreationModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [serverName, setServerName] = useState("");
  const [serverIP, setServerIP] = useState("");
  const [serverPort, setServerPort] = useState("22");
  const [serverUser, setServerUser] = useState("root");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simule l'ajout d'un VPS
    setTimeout(() => {
      setIsLoading(false);
      // Reset form and close modal
      setServerName("");
      setServerIP("");
      setServerPort("22");
      setServerUser("root");
      onClose();
    }, 1500);
  };

  const modalTitle = (
    <div className="flex items-center">
      <Server className="h-5 w-5 mr-2 text-blue-400" />
      Ajouter un nouveau VPS
    </div>
  );

  const modalFooter = (
    <div className="flex justify-end space-x-3">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors border border-gray-700"
        disabled={isLoading}
      >
        Annuler
      </button>
      <button
        type="submit"
        form="server-creation-form"
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <RefreshCw className="h-4 w-4 mr-1.5 animate-spin" />
            Connexion...
          </>
        ) : (
          <>
            <Plus className="h-4 w-4 mr-1.5" />
            Ajouter le VPS
          </>
        )}
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      footer={modalFooter}
      size="small"
      showClose={true}
    >
      <form id="server-creation-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="server-name"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            Nom du serveur
          </label>
          <input
            id="server-name"
            type="text"
            value={serverName}
            onChange={(e) => setServerName(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Mon VPS de production"
            required
          />
        </div>

        <div>
          <label
            htmlFor="server-ip"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            Adresse IP
          </label>
          <input
            id="server-ip"
            type="text"
            value={serverIP}
            onChange={(e) => setServerIP(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="xxx.xxx.xxx.xxx"
            pattern="^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
            title="Veuillez entrer une adresse IP valide (format: xxx.xxx.xxx.xxx)"
            required
          />
        </div>

        <div>
          <label
            htmlFor="server-port"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            Port SSH
          </label>
          <input
            id="server-port"
            type="text"
            value={serverPort}
            onChange={(e) => setServerPort(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="22"
            pattern="^([1-9][0-9]{0,4})$"
            title="Veuillez entrer un numéro de port valide (1-65535)"
            required
          />
        </div>

        <div>
          <label
            htmlFor="server-user"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            Utilisateur SSH
          </label>
          <input
            id="server-user"
            type="text"
            value={serverUser}
            onChange={(e) => setServerUser(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="root"
            required
          />
        </div>

        <div className="rounded-lg bg-blue-900/20 p-3 border border-blue-800/30">
          <p className="text-sm text-blue-300">
            <span className="font-medium">Note :</span> Les
            informations du serveur seront récupérées automatiquement
            via SSH après l&apos;ajout.
          </p>
        </div>
      </form>
    </Modal>
  );
};

export default ServerCreationModal;
