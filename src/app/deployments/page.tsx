"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/src/components/Sidebar";
import { motion } from "framer-motion";
import { Code, Plus, GitPullRequest, RefreshCw, CheckCircle, AlertTriangle } from "lucide-react";

// Définition du type Deployment
interface Deployment {
  id: string;
  name: string;
  status: "success" | "failed" | "in_progress";
  version: string;
  date: string;
  duration: number; // en secondes
}

// Données factices pour démo
const sampleDeployments: Deployment[] = [
  {
    id: "dep-001",
    name: "API Backend",
    status: "success",
    version: "v1.2.0",
    date: "2025-05-04T15:30:00",
    duration: 180,
  },
  {
    id: "dep-002",
    name: "Service Auth",
    status: "in_progress",
    version: "v1.3.5",
    date: "2025-05-05T10:00:00",
    duration: 45,
  },
  {
    id: "dep-003",
    name: "Frontend App",
    status: "failed",
    version: "v2.0.1",
    date: "2025-05-03T20:15:00",
    duration: 120,
  },
];

// Badge de statut de déploiement
const StatusBadge = ({ status }: { status: Deployment["status"] }) => {
  const config = {
    success: { color: "bg-green-900 text-green-300 border-green-700", icon: <CheckCircle className="h-4 w-4 mr-1" />, label: "Succès" },
    failed: { color: "bg-red-900 text-red-300 border-red-700", icon: <AlertTriangle className="h-4 w-4 mr-1" />, label: "Échoué" },
    in_progress: { color: "bg-blue-900 text-blue-300 border-blue-700", icon: <RefreshCw className="h-4 w-4 mr-1 animate-spin" />, label: "En cours" },
  }[status];
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full border inline-flex items-center ${config.color}`}>
      {config.icon}
      {config.label}
    </span>
  );
};

// Carte de déploiement
const DeploymentCard = ({ deployment }: { deployment: Deployment }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="bg-gray-800 rounded-xl shadow border border-gray-700 p-4 flex flex-col justify-between"
  >
    <div>
      <h3 className="text-lg font-semibold mb-2 flex items-center">
        <Code className="h-5 w-5 text-blue-400 mr-2" />
        {deployment.name}
      </h3>
      <div className="text-sm text-gray-400 mb-1">Version: {deployment.version}</div>
      <div className="text-sm text-gray-400">Le: {new Date(deployment.date).toLocaleString("fr-FR", { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}</div>
    </div>
    <div className="mt-4 flex items-center justify-between">
      <StatusBadge status={deployment.status} />
      <span className="text-sm text-gray-400">
        Durée: {Math.floor(deployment.duration/60)}m {deployment.duration%60}s
      </span>
    </div>
  </motion.div>
);

// Modal de création de déploiement (UI uniquement)
const DeploymentCreationModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-850 rounded-xl p-6 border border-gray-700 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <Plus className="h-5 w-5 text-blue-400 mr-2" />
            Nouveau déploiement
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>
        {/* Formulaire factice */}
        <form>
          <div className="space-y-4">
            <input type="text" placeholder="Nom du déploiement" className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white" disabled />
            <select className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white" disabled>
              <option>Branche / Version</option>
            </select>
          </div>
          <div className="mt-6 flex justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-700 rounded mr-2">Annuler</button>
            <button type="button" className="px-4 py-2 bg-blue-600 rounded">Déployer</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Page principale Déploiements
const DeploymentsPage = () => {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setDeployments(sampleDeployments);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filtered = deployments.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6 max-w-7xl mx-auto">
        {/* En-tête */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-xl shadow mb-6 border border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold flex items-center"><GitPullRequest className="h-6 w-6 mr-2 text-blue-400" />Gestion des Déploiements</h1>
            <div className="flex items-center gap-2">
              <input type="text" placeholder="Rechercher..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white flex-1" />
              <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center px-4 py-2 bg-blue-600 rounded text-sm"><Plus className="h-4 w-4 mr-1" />Nouveau</button>
            </div>
          </div>
        </motion.div>

        {/* Liste des déploiements */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => <div key={i} className="h-48 bg-gray-800 rounded-xl animate-pulse"></div>)}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(d => <DeploymentCard key={d.id} deployment={d} />)}
          </motion.div>
        )}
      </main>
      <DeploymentCreationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default DeploymentsPage;
