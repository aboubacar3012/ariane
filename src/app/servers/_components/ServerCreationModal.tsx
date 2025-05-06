"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Server, Plus, RefreshCw } from "lucide-react";

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
  const [serverPassword, setServerPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      setServerPassword("");
      onClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, type: "spring" }}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-auto p-4"
          >
            <div className="bg-gray-850 rounded-xl border border-gray-700 shadow-2xl w-full max-w-md max-h-[90vh] overflow-auto">
              <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                <h2 className="text-xl font-semibold flex items-center">
                  <Server className="h-5 w-5 mr-2 text-blue-400" />
                  Ajouter un nouveau VPS
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-4">
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
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="22"
                      pattern="^([1-9][0-9]{0,4})$"
                      title="Veuillez entrer un numéro de port valide (1-65535)"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="server-password"
                      className="block text-sm font-medium text-gray-400 mb-1"
                    >
                      Mot de passe SSH
                    </label>
                    <div className="relative">
                      <input
                        id="server-password"
                        type={showPassword ? "text" : "password"}
                        value={serverPassword}
                        onChange={(e) => setServerPassword(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                        placeholder="Mot de passe"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path
                              fillRule="evenodd"
                              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                              clipRule="evenodd"
                            />
                            <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Votre mot de passe est nécessaire pour la connexion SSH
                      initiale
                    </p>
                  </div>

                  <div className="rounded-lg bg-blue-900/20 p-3 border border-blue-800/30">
                    <p className="text-sm text-blue-300">
                      <span className="font-medium">Note :</span> Les
                      informations du serveur seront récupérées automatiquement
                      via SSH après l&apos;ajout.
                    </p>
                  </div>
                </div>

                <div className="p-6 border-t border-gray-700 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                    disabled={isLoading}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors flex items-center"
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
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ServerCreationModal;
