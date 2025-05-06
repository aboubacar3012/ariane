"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/src/components/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import {
  Server,
  Plus,
  Activity,
  Settings,
  RefreshCw,
  HardDrive,
  Cpu,
  MemoryStick,
  Globe,
  Shield,
  Trash2,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

// Types for server management
interface VPSServer {
  id: string;
  name: string;
  status: "running" | "stopped" | "restarting" | "pending" | "error";
  ip: string;
  location: string;
  specs: {
    cpu: number;
    ram: number;
    storage: number;
    os: string;
  };
  uptime: number; // in hours
  healthScore: number; // 0-100
  createdAt: string;
}

// Sample data for demonstration
const sampleServers: VPSServer[] = [
  {
    id: "vps-001",
    name: "Web Server Prod",
    status: "running",
    ip: "192.168.1.101",
    location: "Paris",
    specs: {
      cpu: 4,
      ram: 8,
      storage: 100,
      os: "Ubuntu 22.04",
    },
    uptime: 720,
    healthScore: 98,
    createdAt: "2025-01-10T14:30:00",
  },
  {
    id: "vps-002",
    name: "Database Master",
    status: "running",
    ip: "192.168.1.102",
    location: "Frankfurt",
    specs: {
      cpu: 8,
      ram: 16,
      storage: 500,
      os: "Debian 11",
    },
    uptime: 1200,
    healthScore: 96,
    createdAt: "2024-12-05T09:15:00",
  },
  {
    id: "vps-003",
    name: "Dev Environment",
    status: "stopped",
    ip: "192.168.1.103",
    location: "Amsterdam",
    specs: {
      cpu: 2,
      ram: 4,
      storage: 50,
      os: "CentOS 8",
    },
    uptime: 0,
    healthScore: 100,
    createdAt: "2025-02-20T11:45:00",
  },
  {
    id: "vps-004",
    name: "Test Server",
    status: "error",
    ip: "192.168.1.104",
    location: "London",
    specs: {
      cpu: 2,
      ram: 4,
      storage: 80,
      os: "AlmaLinux 9",
    },
    uptime: 48,
    healthScore: 45,
    createdAt: "2025-03-15T16:20:00",
  },
  {
    id: "vps-005",
    name: "Staging Server",
    status: "restarting",
    ip: "192.168.1.105",
    location: "Madrid",
    specs: {
      cpu: 4,
      ram: 8,
      storage: 120,
      os: "Ubuntu 20.04",
    },
    uptime: 360,
    healthScore: 87,
    createdAt: "2025-01-30T08:50:00",
  },
];

// Server Status Badge component
const StatusBadge = ({ status }: { status: VPSServer["status"] }) => {
  const statusConfig = {
    running: {
      color: "bg-green-900 text-green-300 border-green-700",
      icon: <CheckCircle className="h-3.5 w-3.5 mr-1" />,
      label: "En ligne",
    },
    stopped: {
      color: "bg-gray-900 text-gray-300 border-gray-700",
      icon: <HardDrive className="h-3.5 w-3.5 mr-1" />,
      label: "Arrêté",
    },
    restarting: {
      color: "bg-blue-900 text-blue-300 border-blue-700",
      icon: <RefreshCw className="h-3.5 w-3.5 mr-1 animate-spin" />,
      label: "Redémarrage",
    },
    pending: {
      color: "bg-yellow-900 text-yellow-300 border-yellow-700",
      icon: <RefreshCw className="h-3.5 w-3.5 mr-1 animate-spin" />,
      label: "En attente",
    },
    error: {
      color: "bg-red-900 text-red-300 border-red-700",
      icon: <AlertTriangle className="h-3.5 w-3.5 mr-1" />,
      label: "Erreur",
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${config.color}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
};

// Server Card component
const ServerCard = ({ server }: { server: VPSServer }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden hover:border-gray-600 transition-all duration-300"
    >
      <div className="p-4 flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            <Server className="h-5 w-5 text-blue-400 mr-2" />
            <h3 className="text-lg font-semibold">{server.name}</h3>
          </div>
          <StatusBadge status={server.status} />
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
          <div className="flex items-center text-gray-400">
            <Globe className="h-4 w-4 mr-1.5 text-gray-500" />
            <span>{server.ip}</span>
          </div>
          <div className="flex items-center text-gray-400">
            <HardDrive className="h-4 w-4 mr-1.5 text-gray-500" />
            <span>{server.location}</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="bg-gray-750 p-2 rounded-lg">
            <div className="text-xs text-gray-400 mb-1 flex items-center">
              <Cpu className="h-3.5 w-3.5 mr-1" />
              CPU
            </div>
            <div className="text-sm font-medium">{server.specs.cpu} vCPU</div>
          </div>
          <div className="bg-gray-750 p-2 rounded-lg">
            <div className="text-xs text-gray-400 mb-1 flex items-center">
              <MemoryStick className="h-3.5 w-3.5 mr-1" />
              RAM
            </div>
            <div className="text-sm font-medium">{server.specs.ram} GB</div>
          </div>
          <div className="bg-gray-750 p-2 rounded-lg">
            <div className="text-xs text-gray-400 mb-1 flex items-center">
              <HardDrive className="h-3.5 w-3.5 mr-1" />
              SSD
            </div>
            <div className="text-sm font-medium">{server.specs.storage} GB</div>
          </div>
          <div className="bg-gray-750 p-2 rounded-lg">
            <div className="text-xs text-gray-400 mb-1 flex items-center">
              <Shield className="h-3.5 w-3.5 mr-1" />
              Santé
            </div>
            <div className="text-sm font-medium">{server.healthScore}%</div>
          </div>
        </div>

        <div className="flex justify-between mt-auto">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            {isExpanded ? "Voir moins" : "Voir plus"}
          </button>
          <div className="flex space-x-2">
            {server.status === "running" ? (
              <button className="p-1.5 rounded-md bg-red-900/30 text-red-400 hover:bg-red-900/50 transition-colors">
                <HardDrive className="h-4 w-4" />
              </button>
            ) : (
              <button className="p-1.5 rounded-md bg-green-900/30 text-green-400 hover:bg-green-900/50 transition-colors">
                <Activity className="h-4 w-4" />
              </button>
            )}
            <button className="p-1.5 rounded-md bg-blue-900/30 text-blue-400 hover:bg-blue-900/50 transition-colors">
              <RefreshCw className="h-4 w-4" />
            </button>
            <button className="p-1.5 rounded-md bg-gray-700 text-gray-400 hover:bg-gray-650 transition-colors">
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 pt-4 border-t border-gray-700"
            >
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400 mb-1">Système d&apos;exploitation</p>
                  <p className="font-medium">{server.specs.os}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Uptime</p>
                  <p className="font-medium">
                    {server.uptime > 0
                      ? `${Math.floor(server.uptime / 24)} jours, ${
                          server.uptime % 24
                        } heures`
                      : "Hors ligne"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Créé le</p>
                  <p className="font-medium">
                    {new Date(server.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">ID</p>
                  <p className="font-medium">{server.id}</p>
                </div>
              </div>

              <div className="flex justify-end mt-4 pt-4 border-t border-gray-700">
                <button className="p-1.5 rounded-md bg-red-900/30 text-red-400 hover:bg-red-900/50 transition-colors flex items-center text-sm">
                  <Trash2 className="h-4 w-4 mr-1.5" />
                  Supprimer
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// Server Creation Modal component
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
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                            <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Votre mot de passe est nécessaire pour la connexion SSH initiale
                    </p>
                  </div>

                  <div className="rounded-lg bg-blue-900/20 p-3 border border-blue-800/30">
                    <p className="text-sm text-blue-300">
                      <span className="font-medium">Note :</span> Les informations du serveur seront récupérées automatiquement via SSH après l&apos;ajout.
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

// Health Monitoring component
const ServerHealthDashboard = ({
  servers,
  isVisible,
}: {
  servers: VPSServer[];
  isVisible: boolean;
}) => {
  const [selectedServerId, setSelectedServerId] = useState<string | null>(null);
  const [detailTimeframe, setDetailTimeframe] = useState<"1h" | "24h" | "7d" | "30d">("24h");
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  
  // Calculate overall health stats
  const totalServers = servers.length;
  const runningServers = servers.filter((s) => s.status === "running").length;
  const errorServers = servers.filter((s) => s.status === "error").length;
  const averageHealth =
    servers.reduce((acc, server) => acc + server.healthScore, 0) / totalServers || 0;
    
  // Get selected server details
  const selectedServer = selectedServerId 
    ? servers.find(s => s.id === selectedServerId) 
    : null;
    
  // Set first running server as default when component mounts
  useEffect(() => {
    if (!selectedServerId && servers.length > 0) {
      const runningServer = servers.find(s => s.status === "running");
      if (runningServer) {
        setSelectedServerId(runningServer.id);
      } else if (servers[0]) {
        setSelectedServerId(servers[0].id);
      }
    }
  }, [servers, selectedServerId]);
  
  // Simulate loading detailed data
  useEffect(() => {
    if (selectedServerId && detailTimeframe) {
      setIsLoadingDetails(true);
      const timer = setTimeout(() => {
        setIsLoadingDetails(false);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [selectedServerId, detailTimeframe]);
  
  if (!isVisible) return null;

  // Generate mock time series data for charts
  const generateTimeSeriesData = (
    min: number, 
    max: number, 
    length: number, 
    hasSpikes = false
  ): number[] => {
    const data = [];
    let lastValue = min + Math.random() * (max - min) / 2;
    
    for (let i = 0; i < length; i++) {
      // Random walk with bounds
      let change = (Math.random() - 0.5) * (max - min) * 0.1;
      
      // Add occasional spikes for more realistic server metrics
      if (hasSpikes && Math.random() > 0.95) {
        change = Math.random() * (max - min) * 0.3;
      }
      
      lastValue = Math.max(min, Math.min(max, lastValue + change));
      data.push(Number(lastValue.toFixed(1)));
    }
    
    return data;
  };
  
  // Determine how many data points based on timeframe
  const getDataPointsCount = (timeframe: string): number => {
    switch (timeframe) {
      case "1h": return 60;
      case "24h": return 24;
      case "7d": return 7;
      case "30d": return 30;
      default: return 24;
    }
  };
  
  const dataPointsCount = getDataPointsCount(detailTimeframe);
  
  // Mock performance metrics for the selected server
  const serverMetrics = selectedServer ? {
    cpu: generateTimeSeriesData(5, 95, dataPointsCount, true),
    memory: generateTimeSeriesData(20, 85, dataPointsCount, true),
    disk: generateTimeSeriesData(10, 75, dataPointsCount, false),
    network: generateTimeSeriesData(2, 45, dataPointsCount, true),
    latency: generateTimeSeriesData(5, 200, dataPointsCount, true),
    connections: generateTimeSeriesData(5, 250, dataPointsCount, true),
  } : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Overview Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        <div className="lg:col-span-8">
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
            <div className="p-4 bg-gray-750 border-b border-gray-700">
              <h2 className="text-lg font-semibold flex items-center">
                <Activity className="h-5 w-5 mr-2 text-blue-400" />
                Vue d&apos;ensemble
              </h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-4 gap-3 mb-4">
                <div className="bg-blue-900/30 p-3 rounded-lg border border-blue-800">
                  <div className="text-xs text-blue-400 mb-1">Total Serveurs</div>
                  <div className="text-2xl font-bold text-blue-400">
                    {totalServers}
                  </div>
                </div>
                <div className="bg-green-900/30 p-3 rounded-lg border border-green-800">
                  <div className="text-xs text-green-400 mb-1">En ligne</div>
                  <div className="text-2xl font-bold text-green-400">
                    {runningServers}
                  </div>
                </div>
                <div className="bg-red-900/30 p-3 rounded-lg border border-red-800">
                  <div className="text-xs text-red-400 mb-1">En erreur</div>
                  <div className="text-2xl font-bold text-red-400">
                    {errorServers}
                  </div>
                </div>
                <div
                  className={`p-3 rounded-lg border ${
                    averageHealth > 90
                      ? "bg-green-900/30 border-green-800 text-green-400"
                      : averageHealth > 70
                      ? "bg-yellow-900/30 border-yellow-800 text-yellow-400"
                      : "bg-red-900/30 border-red-800 text-red-400"
                  }`}
                >
                  <div className="text-xs mb-1">Santé Moyenne</div>
                  <div className="text-2xl font-bold">{averageHealth.toFixed(1)}%</div>
                </div>
              </div>

              {/* Server Selector */}
              <div className="mt-6 mb-4">
                <label
                  htmlFor="server-select"
                  className="block text-sm font-medium text-gray-400 mb-2"
                >
                  Sélectionner un serveur pour voir les détails
                </label>
                <div className="relative">
                  <select
                    id="server-select"
                    value={selectedServerId || ""}
                    onChange={(e) => setSelectedServerId(e.target.value)}
                    className="bg-gray-700 p-2 pl-4 pr-10 rounded-lg text-white w-full border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none appearance-none"
                  >
                    {servers.map((server) => (
                      <option key={server.id} value={server.id}>
                        {server.name} ({server.ip}) - {
                          server.status === "running" ? "En ligne" : 
                          server.status === "stopped" ? "Arrêté" : 
                          server.status === "error" ? "En erreur" : 
                          server.status === "restarting" ? "Redémarrage" : 
                          "En attente"
                        }
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                    <Server className="h-4 w-4" />
                  </div>
                </div>
              </div>

              {/* Timeframe Selector */}
              <div className="flex justify-end mb-4">
                <div className="flex space-x-1 rounded-lg bg-gray-700 p-1">
                  <button
                    onClick={() => setDetailTimeframe("1h")}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                      detailTimeframe === "1h"
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:text-white hover:bg-gray-600"
                    }`}
                  >
                    1h
                  </button>
                  <button
                    onClick={() => setDetailTimeframe("24h")}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                      detailTimeframe === "24h"
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:text-white hover:bg-gray-600"
                    }`}
                  >
                    24h
                  </button>
                  <button
                    onClick={() => setDetailTimeframe("7d")}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                      detailTimeframe === "7d"
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:text-white hover:bg-gray-600"
                    }`}
                  >
                    7j
                  </button>
                  <button
                    onClick={() => setDetailTimeframe("30d")}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                      detailTimeframe === "30d"
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:text-white hover:bg-gray-600"
                    }`}
                  >
                    30j
                  </button>
                </div>
              </div>

              {/* Selected Server Detailed Metrics */}
              {selectedServer && serverMetrics && !isLoadingDetails ? (
                <div className="space-y-6">
                  {/* Server Info */}
                  <div className="bg-gray-750 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-medium flex items-center">
                          <Server className="h-5 w-5 mr-2 text-blue-400" />
                          {selectedServer.name}
                        </h3>
                        <div className="text-sm text-gray-400 mt-1">
                          {selectedServer.ip} • {selectedServer.location} • {selectedServer.specs.os}
                        </div>
                      </div>
                      <StatusBadge status={selectedServer.status} />
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 mt-4">
                      <div className="bg-gray-800/50 p-2 rounded-lg">
                        <div className="text-xs text-gray-400">CPU</div>
                        <div className="text-lg font-medium">{selectedServer.specs.cpu} vCPU</div>
                      </div>
                      <div className="bg-gray-800/50 p-2 rounded-lg">
                        <div className="text-xs text-gray-400">RAM</div>
                        <div className="text-lg font-medium">{selectedServer.specs.ram} GB</div>
                      </div>
                      <div className="bg-gray-800/50 p-2 rounded-lg">
                        <div className="text-xs text-gray-400">Stockage</div>
                        <div className="text-lg font-medium">{selectedServer.specs.storage} GB</div>
                      </div>
                      <div className="bg-gray-800/50 p-2 rounded-lg">
                        <div className="text-xs text-gray-400">Uptime</div>
                        <div className="text-lg font-medium">
                          {selectedServer.status === "running" 
                            ? `${Math.floor(selectedServer.uptime / 24)}j ${selectedServer.uptime % 24}h`
                            : "Hors ligne"}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* CPU Usage Chart */}
                  <div className="bg-gray-750 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium flex items-center">
                        <Cpu className="h-4 w-4 mr-2 text-blue-400" />
                        Utilisation CPU
                      </h4>
                      <div className="text-sm text-blue-400 font-medium">
                        {Math.max(...serverMetrics.cpu).toFixed(1)}% max
                      </div>
                    </div>
                    
                    <div className="h-32 w-full">
                      <div className="h-full relative">
                        {/* CPU Usage Visualization */}
                        <div className="absolute inset-0 flex items-end space-x-1">
                          {serverMetrics.cpu.map((value, index) => (
                            <div 
                              key={index} 
                              className="flex-1 rounded-t-sm transition-all duration-500 ease-out"
                              style={{ 
                                height: `${value}%`, 
                                backgroundColor: value > 80 
                                  ? '#ef4444' 
                                  : value > 60 
                                    ? '#f59e0b' 
                                    : '#3b82f6' 
                              }}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 mt-4">
                      <div>
                        <div className="text-xs text-gray-400">Moyenne</div>
                        <div className="text-sm font-medium">
                          {(serverMetrics.cpu.reduce((a, b) => a + b, 0) / serverMetrics.cpu.length).toFixed(1)}%
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400">Actuel</div>
                        <div className="text-sm font-medium">
                          {serverMetrics.cpu[serverMetrics.cpu.length - 1]}%
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Memory Usage Chart */}
                  <div className="bg-gray-750 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium flex items-center">
                        <MemoryStick className="h-4 w-4 mr-2 text-purple-400" />
                        Utilisation Mémoire
                      </h4>
                      <div className="text-sm text-purple-400 font-medium">
                        {Math.max(...serverMetrics.memory).toFixed(1)}% max
                      </div>
                    </div>
                    
                    <div className="h-32 w-full">
                      <div className="h-full relative">
                        {/* Memory Usage Visualization */}
                        <div className="absolute inset-0 flex items-end space-x-1">
                          {serverMetrics.memory.map((value, index) => (
                            <div 
                              key={index} 
                              className="flex-1 rounded-t-sm transition-all duration-500 ease-out"
                              style={{ 
                                height: `${value}%`, 
                                backgroundColor: value > 80 
                                  ? '#ef4444' 
                                  : value > 60 
                                    ? '#f59e0b' 
                                    : '#a855f7' 
                              }}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 mt-4">
                      <div>
                        <div className="text-xs text-gray-400">Moyenne</div>
                        <div className="text-sm font-medium">
                          {(serverMetrics.memory.reduce((a, b) => a + b, 0) / serverMetrics.memory.length).toFixed(1)}%
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400">Actuel</div>
                        <div className="text-sm font-medium">
                          {serverMetrics.memory[serverMetrics.memory.length - 1]}%
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Disk & Network Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Disk Usage */}
                    <div className="bg-gray-750 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium flex items-center">
                          <HardDrive className="h-4 w-4 mr-2 text-green-400" />
                          Disque
                        </h4>
                      </div>
                      
                      <div className="flex items-center justify-center mt-2 mb-4">
                        {/* Circular progress */}
                        <div className="relative h-24 w-24">
                          <svg className="w-full h-full" viewBox="0 0 100 100">
                            <circle 
                              className="text-gray-700" 
                              strokeWidth="10" 
                              stroke="currentColor" 
                              fill="transparent" 
                              r="40" 
                              cx="50" 
                              cy="50" 
                            />
                            <circle 
                              className="text-green-500" 
                              strokeWidth="10" 
                              strokeDasharray={2 * Math.PI * 40}
                              strokeDashoffset={2 * Math.PI * 40 * (1 - serverMetrics.disk[serverMetrics.disk.length - 1] / 100)} 
                              strokeLinecap="round" 
                              stroke="currentColor" 
                              fill="transparent" 
                              r="40" 
                              cx="50" 
                              cy="50" 
                            />
                          </svg>
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                            <div className="text-lg font-semibold">
                              {serverMetrics.disk[serverMetrics.disk.length - 1]}%
                            </div>
                            <div className="text-xs text-gray-400">Utilisé</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-sm text-center mt-2">
                        <span className="text-gray-400">
                          {Math.round(selectedServer.specs.storage * serverMetrics.disk[serverMetrics.disk.length - 1] / 100)} GB
                        </span> sur {selectedServer.specs.storage} GB utilisés
                      </div>
                    </div>
                    
                    {/* Network Traffic */}
                    <div className="bg-gray-750 rounded-lg p-4">
                      <h4 className="font-medium flex items-center mb-2">
                        <Globe className="h-4 w-4 mr-2 text-blue-400" />
                        Réseau
                      </h4>
                      
                      <div className="mt-3 space-y-4">
                        <div>
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Trafic entrant</span>
                            <span>{serverMetrics.network[serverMetrics.network.length - 1]} Mbps</span>
                          </div>
                          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${serverMetrics.network[serverMetrics.network.length - 1] * 2}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Trafic sortant</span>
                            <span>{(serverMetrics.network[serverMetrics.network.length - 1] * 0.7).toFixed(1)} Mbps</span>
                          </div>
                          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-cyan-500 rounded-full"
                              style={{ width: `${serverMetrics.network[serverMetrics.network.length - 1] * 1.4}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Latence moyenne</span>
                            <span>{(serverMetrics.latency[serverMetrics.latency.length - 1]).toFixed(1)} ms</span>
                          </div>
                          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full"
                              style={{ 
                                width: `${Math.min(100, serverMetrics.latency[serverMetrics.latency.length - 1] / 2)}%`,
                                backgroundColor: serverMetrics.latency[serverMetrics.latency.length - 1] > 150 
                                  ? '#ef4444' 
                                  : serverMetrics.latency[serverMetrics.latency.length - 1] > 80 
                                    ? '#f59e0b' 
                                    : '#10b981'
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Autres métriques avancées */}
                  <div className="bg-gray-750 rounded-lg p-4">
                    <h4 className="font-medium flex items-center mb-4">
                      <Settings className="h-4 w-4 mr-2 text-gray-400" />
                      Métriques avancées
                    </h4>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-gray-800/50 p-2 rounded-lg">
                        <div className="text-xs text-gray-400">Processus</div>
                        <div className="text-lg font-medium">{Math.floor(Math.random() * 150) + 50}</div>
                      </div>
                      <div className="bg-gray-800/50 p-2 rounded-lg">
                        <div className="text-xs text-gray-400">Connexions</div>
                        <div className="text-lg font-medium">{serverMetrics.connections[serverMetrics.connections.length - 1]}</div>
                      </div>
                      <div className="bg-gray-800/50 p-2 rounded-lg">
                        <div className="text-xs text-gray-400">Load Avg</div>
                        <div className="text-lg font-medium">{(serverMetrics.cpu[serverMetrics.cpu.length - 1] / 25).toFixed(2)}</div>
                      </div>
                      <div className="bg-gray-800/50 p-2 rounded-lg">
                        <div className="text-xs text-gray-400">Score santé</div>
                        <div className={`text-lg font-medium ${
                          selectedServer.healthScore > 90 
                            ? "text-green-400" 
                            : selectedServer.healthScore > 70 
                              ? "text-yellow-400" 
                              : "text-red-400"
                        }`}>
                          {selectedServer.healthScore}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <h5 className="text-sm font-medium mb-2">Derniers événements système</h5>
                      <div className="space-y-2 max-h-48 overflow-y-auto text-sm">
                        <div className="bg-gray-800/50 p-2 rounded-lg">
                          <div className="flex justify-between">
                            <span className="text-green-400">Service redémarré</span>
                            <span className="text-gray-500 text-xs">Il y a 15 min</span>
                          </div>
                          <p className="text-gray-400 text-xs mt-1">Service nginx redémarré avec succès</p>
                        </div>
                        <div className="bg-gray-800/50 p-2 rounded-lg">
                          <div className="flex justify-between">
                            <span className="text-yellow-400">Utilisation CPU élevée</span>
                            <span className="text-gray-500 text-xs">Il y a 45 min</span>
                          </div>
                          <p className="text-gray-400 text-xs mt-1">Pic d&apos;utilisation CPU à 87% pendant 5 minutes</p>
                        </div>
                        <div className="bg-gray-800/50 p-2 rounded-lg">
                          <div className="flex justify-between">
                            <span className="text-blue-400">Mise à jour sécurité</span>
                            <span className="text-gray-500 text-xs">Il y a 3 heures</span>
                          </div>
                          <p className="text-gray-400 text-xs mt-1">5 packages de sécurité mis à jour automatiquement</p>
                        </div>
                        <div className="bg-gray-800/50 p-2 rounded-lg">
                          <div className="flex justify-between">
                            <span className="text-red-400">Tentative d&apos;accès non autorisée</span>
                            <span className="text-gray-500 text-xs">Il y a 6 heures</span>
                          </div>
                          <p className="text-gray-400 text-xs mt-1">Tentative de connexion SSH depuis IP 198.51.100.77 bloquée</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-96 flex items-center justify-center">
                  {isLoadingDetails ? (
                    <div className="text-center">
                      <RefreshCw className="h-10 w-10 mx-auto mb-4 text-blue-500 animate-spin" />
                      <p className="text-gray-400">Chargement des métriques détaillées...</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Server className="h-10 w-10 mx-auto mb-4 text-gray-600" />
                      <p className="text-gray-400">Sélectionnez un serveur pour voir les métriques détaillées</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
            <div className="p-4 bg-gray-750 border-b border-gray-700">
              <h2 className="text-lg font-semibold flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-yellow-400" />
                Alertes
              </h2>
            </div>
            <div className="p-4">
              {servers.some((s) => s.status === "error" || s.healthScore < 60) ? (
                <div className="space-y-3">
                  {servers
                    .filter((s) => s.status === "error" || s.healthScore < 60)
                    .map((server) => (
                      <div
                        key={server.id}
                        className="bg-red-900/20 border border-red-800/50 rounded-lg p-3"
                      >
                        <div className="flex items-start">
                          <AlertTriangle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="font-medium">{server.name}</div>
                            <div className="text-sm text-red-400 mt-1">
                              {server.status === "error" 
                                ? "Erreur système détectée. Serveur inaccessible."
                                : `Score de santé critique: ${server.healthScore}%`}
                            </div>
                            <div className="flex justify-end mt-2">
                              <button 
                                onClick={() => setSelectedServerId(server.id)}
                                className="text-xs bg-red-900/50 hover:bg-red-800 text-red-300 px-2 py-1 rounded transition-colors"
                              >
                                Voir les détails
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CheckCircle className="h-12 w-12 text-green-400 mb-3" />
                  <p className="text-green-400 font-medium">Tous les systèmes fonctionnent normalement</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Aucune alerte active en ce moment
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Informations système */}
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden mt-6">
            <div className="p-4 bg-gray-750 border-b border-gray-700">
              <h2 className="text-lg font-semibold flex items-center">
                <Shield className="h-5 w-5 mr-2 text-blue-400" />
                Sécurité et maintenance
              </h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-3">
                  <h4 className="text-sm font-medium flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                    </svg>
                    Mises à jour disponibles
                  </h4>
                  <div className="mt-2 pl-5 text-sm text-gray-400">
                    <p>3 mises à jour système disponibles</p>
                    <p>7 mises à jour de logiciels</p>
                    <button className="text-xs bg-blue-900/50 hover:bg-blue-800 text-blue-300 px-2 py-1 rounded transition-colors mt-2">
                      Voir les détails
                    </button>
                  </div>
                </div>
                
                <div className="bg-green-900/20 border border-green-800/50 rounded-lg p-3">
                  <h4 className="text-sm font-medium flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Firewall actif
                  </h4>
                  <div className="mt-2 pl-5 text-sm text-gray-400">
                    <p>Dernière attaque bloquée: il y a 2 heures</p>
                    <p>42 tentatives d&apos;intrusion bloquées aujourd&apos;hui</p>
                  </div>
                </div>
                
                <div className="bg-yellow-900/20 border border-yellow-800/50 rounded-lg p-3">
                  <h4 className="text-sm font-medium flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
                    </svg>
                    Maintenance planifiée
                  </h4>
                  <div className="mt-2 pl-5 text-sm text-gray-400">
                    <p>Prochaine maintenance: 8 mai 2025, 02:00 - 04:00</p>
                    <p>Impact prévu: redémarrage du serveur (15 min)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Main Servers Page component
const ServersPage = () => {
  const [servers, setServers] = useState<VPSServer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"servers" | "health">("servers");
  const [searchQuery, setSearchQuery] = useState("");

  // Load server data on mount
  useEffect(() => {
    // Simuler un chargement de données
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