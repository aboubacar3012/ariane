"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/src/components/Sidebar";
import { motion } from "framer-motion";
import { Server, Plus } from "lucide-react";
import { VPSServer } from "./types";

import ServerCard from "./_components/ServerCard";
import ServerHealthDashboard from "./_components/ServerHealthDashboard";
import ServerCreationModal from "./_components/ServerCreationModal";
import { sampleServers } from "./data";

const ServersPage = () => {
  const [servers, setServers] = useState<VPSServer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"servers" | "health">("servers");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setServers(sampleServers);
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // Filter servers based on search query
  const filteredServers = servers.filter((server) =>
    server.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                  <Server className="h-6 w-6 mr-2 text-blue-400" />
                  Gestion des Serveurs VPS
                </h1>
                <p className="text-gray-400 mt-1">
                  Créez, configurez et surveillez vos serveurs virtuels
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher un serveur..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-lg py-2 px-10 text-white w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-1.5" />
                  Nouveau VPS
                </button>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1 mt-6 border-b border-gray-700">
              <button
                onClick={() => setActiveTab("servers")}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === "servers"
                    ? "bg-gray-800 text-white border-t border-l border-r border-gray-700"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Mes serveurs
              </button>
              <button
                onClick={() => setActiveTab("health")}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === "health"
                    ? "bg-gray-800 text-white border-t border-l border-r border-gray-700"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Monitoring & Santé
              </button>
            </div>
          </motion.div>

          {/* Health Dashboard */}
          <ServerHealthDashboard
            servers={servers}
            isVisible={activeTab === "health"} 
          />

          {/* Servers Grid */}
          {activeTab === "servers" && (
            <>
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden animate-pulse"
                    >
                      <div className="p-6 h-64"></div>
                    </div>
                  ))}
                </div>
              ) : filteredServers.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredServers.map((server) => (
                    <ServerCard key={server.id} server={server} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <Server className="h-16 w-16 text-gray-700 mb-4" />
                  <h3 className="text-xl font-medium text-gray-400 mb-2">
                    Aucun serveur trouvé
                  </h3>
                  <p className="text-gray-500 max-w-md mb-6">
                    {searchQuery
                      ? `Aucun serveur ne correspond à votre recherche "${searchQuery}"`
                      : "Vous n'avez pas encore créé de serveur VPS. Commencez maintenant !"}
                  </p>
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-1.5" />
                    Créer un nouveau serveur
                  </button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Server Creation Modal */}
      <ServerCreationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default ServersPage;