import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Settings,
  RefreshCw,
  HardDrive,
  Cpu,
  MemoryStick,
  Globe,
  Shield,
  Server,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { VPSServer } from "../types";
import StatusBadge from "@/src/components/ui/StatusBadge";

interface ServerHealthDashboardProps {
  servers: VPSServer[];
  isVisible: boolean;
}

const ServerHealthDashboard = ({ servers, isVisible }: ServerHealthDashboardProps) => {
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

export default ServerHealthDashboard;