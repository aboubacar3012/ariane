"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Sidebar from "@/src/components/Sidebar";
import {
  Power,
  RefreshCw,
  Server,
  Activity,
  HardDrive,
  Cpu,
  MemoryStick,
  Terminal,
  Shield,
  PlayCircle,
  PauseCircle,
  Settings,
  AlertTriangle,
  Loader2,
  ChevronRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { VPSServer } from "../types";
import StatusBadge from "@/src/components/ui/StatusBadge";

// Interface pour les projets déployés
interface DeployedProject {
  id: string;
  name: string;
  status: "running" | "stopped" | "error" | "restarting";
  type: string;
  port: number;
  url: string;
  lastDeployed: string;
  healthStatus: {
    cpu: number;
    memory: number;
    disk: number;
    responseTime: number;
    uptime: number;
  }
}

// Page détaillée du VPS
export default function VPSDetailPage() {
  const { vpsId } = useParams();
  const [server, setServer] = useState<VPSServer | null>(null);
  const [projects, setProjects] = useState<DeployedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<{[key: string]: boolean}>({});
  const [activeTab, setActiveTab] = useState("overview");

  // Simuler le chargement des données
  useEffect(() => {
    // Simuler les données du serveur
    setTimeout(() => {
      setServer({
        id: vpsId as string,
        name: "Serveur Production",
        status: "running",
        ip: "192.168.1.100",
        specs: {
          cpu: 4,
          ram: 8,
          storage: 100,
          os: "Ubuntu 22.04 LTS",
        },
        uptime: 72.5,
        healthScore: 98,
        createdAt: "2025-01-15T12:30:00Z",
      });

      // Simuler les projets déployés
      setProjects([
        {
          id: "proj-1",
          name: "Site E-commerce",
          status: "running",
          type: "Next.js",
          port: 3000,
          url: "ecommerce.example.com",
          lastDeployed: "2025-05-01T10:15:00Z",
          healthStatus: {
            cpu: 12,
            memory: 25,
            disk: 15,
            responseTime: 240,
            uptime: 99.9,
          }
        },
        {
          id: "proj-2",
          name: "API Backend",
          status: "running",
          type: "Express.js",
          port: 5000,
          url: "api.example.com",
          lastDeployed: "2025-04-28T14:30:00Z",
          healthStatus: {
            cpu: 35,
            memory: 42,
            disk: 30,
            responseTime: 180,
            uptime: 99.7,
          }
        },
        {
          id: "proj-3",
          name: "Dashboard Analytique",
          status: "error",
          type: "React",
          port: 3001,
          url: "dashboard.example.com",
          lastDeployed: "2025-05-04T09:45:00Z",
          healthStatus: {
            cpu: 0,
            memory: 0,
            disk: 22,
            responseTime: 0,
            uptime: 0,
          }
        },
      ]);
      
      setLoading(false);
    }, 1000);
  }, [vpsId]);

  // Fonctions pour gérer le VPS
  const handleVPSAction = (action: 'start' | 'stop' | 'restart') => {
    setActionLoading({...actionLoading, vps: true});
    
    // Simuler une action sur le VPS
    setTimeout(() => {
      if (server) {
        let newStatus: "running" | "stopped" | "restarting" | "pending" | "error" = server.status;
        
        switch (action) {
          case 'start':
            newStatus = "running";
            break;
          case 'stop':
            newStatus = "stopped";
            break;
          case 'restart':
            newStatus = "restarting";
            setTimeout(() => {
              setServer(prev => prev ? {...prev, status: "running"} : null);
            }, 3000);
            break;
        }
        
        setServer(prev => prev ? {...prev, status: newStatus} : null);
      }
      setActionLoading({...actionLoading, vps: false});
    }, 2000);
  };

  // Fonctions pour gérer les projets
  const handleProjectAction = (projectId: string, action: 'start' | 'stop' | 'restart') => {
    setActionLoading({...actionLoading, [projectId]: true});
    
    // Simuler une action sur un projet
    setTimeout(() => {
      setProjects(prevProjects => 
        prevProjects.map(project => {
          if (project.id === projectId) {
            let newStatus: "running" | "stopped" | "error" | "restarting" = project.status;
            
            switch (action) {
              case 'start':
                newStatus = "running";
                break;
              case 'stop':
                newStatus = "stopped";
                break;
              case 'restart':
                newStatus = "restarting";
                setTimeout(() => {
                  setProjects(prev => 
                    prev.map(p => 
                      p.id === projectId 
                        ? {...p, status: "running"} 
                        : p
                    )
                  );
                }, 3000);
                break;
            }
            
            return {...project, status: newStatus};
          }
          return project;
        })
      );
      setActionLoading({...actionLoading, [projectId]: false});
    }, 2000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <span className="ml-2 text-lg">Chargement des informations du serveur...</span>
      </div>
    );
  }

  if (!server) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <AlertTriangle className="w-8 h-8 mr-2" />
        <span className="text-lg">Erreur: Impossible de charger les informations du serveur</span>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 max-w-7xl mx-auto">
          {/* En-tête du serveur */}
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div className="flex items-center mb-4 md:mb-0">
                <Server className="h-8 w-8 text-blue-400 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold">{server.name}</h1>
                  <p className="text-gray-400">{server.ip}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <StatusBadge status={server.status} />
                
                <div className="flex space-x-2">
                  {server.status === "stopped" ? (
                    <button 
                      onClick={() => handleVPSAction('start')}
                      disabled={actionLoading.vps}
                      className="flex items-center px-3 py-2 bg-green-900/40 text-green-400 rounded-lg hover:bg-green-900/60 transition-colors"
                    >
                      {actionLoading.vps ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Power className="h-4 w-4 mr-2" />
                      )}
                      Démarrer
                    </button>
                  ) : (
                    <>
                      <button 
                        onClick={() => handleVPSAction('restart')}
                        disabled={actionLoading.vps}
                        className="flex items-center px-3 py-2 bg-amber-900/40 text-amber-400 rounded-lg hover:bg-amber-900/60 transition-colors"
                      >
                        {actionLoading.vps ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4 mr-2" />
                        )}
                        Redémarrer
                      </button>
                      
                      <button 
                        onClick={() => handleVPSAction('stop')}
                        disabled={actionLoading.vps}
                        className="flex items-center px-3 py-2 bg-red-900/40 text-red-400 rounded-lg hover:bg-red-900/60 transition-colors"
                      >
                        {actionLoading.vps ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Power className="h-4 w-4 mr-2" />
                        )}
                        Arrêter
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {/* Spécifications du serveur */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="bg-gray-800 p-3 rounded-lg">
                <div className="text-sm text-gray-400 mb-1 flex items-center">
                  <Cpu className="h-4 w-4 mr-1" />
                  CPU
                </div>
                <div className="text-lg font-medium">{server.specs.cpu} vCPU</div>
              </div>
              <div className="bg-gray-800 p-3 rounded-lg">
                <div className="text-sm text-gray-400 mb-1 flex items-center">
                  <MemoryStick className="h-4 w-4 mr-1" />
                  Mémoire
                </div>
                <div className="text-lg font-medium">{server.specs.ram} GB</div>
              </div>
              <div className="bg-gray-800 p-3 rounded-lg">
                <div className="text-sm text-gray-400 mb-1 flex items-center">
                  <HardDrive className="h-4 w-4 mr-1" />
                  Stockage
                </div>
                <div className="text-lg font-medium">{server.specs.storage} GB</div>
              </div>
              <div className="bg-gray-800 p-3 rounded-lg">
                <div className="text-sm text-gray-400 mb-1 flex items-center">
                  <Shield className="h-4 w-4 mr-1" />
                  Santé
                </div>
                <div className="text-lg font-medium">{server.healthScore}%</div>
              </div>
              <div className="bg-gray-800 p-3 rounded-lg">
                <div className="text-sm text-gray-400 mb-1 flex items-center">
                  <Activity className="h-4 w-4 mr-1" />
                  Uptime
                </div>
                <div className="text-lg font-medium">
                  {server.uptime > 0
                    ? `${Math.floor(server.uptime / 24)} j ${Math.floor(server.uptime % 24)} h`
                    : "Hors ligne"}
                </div>
              </div>
            </div>
            
            {/* Onglets de navigation */}
            <div className="border-b border-gray-700">
              <nav className="flex space-x-8">
                <button 
                  onClick={() => setActiveTab("overview")} 
                  className={`pb-3 px-1 ${activeTab === "overview" 
                    ? "text-blue-400 border-b-2 border-blue-400" 
                    : "text-gray-400 hover:text-gray-200"}`}
                >
                  Aperçu
                </button>
                <button 
                  onClick={() => setActiveTab("projects")}
                  className={`pb-3 px-1 ${activeTab === "projects" 
                    ? "text-blue-400 border-b-2 border-blue-400" 
                    : "text-gray-400 hover:text-gray-200"}`}
                >
                  Projets déployés
                </button>
                <button 
                  onClick={() => setActiveTab("terminal")}
                  className={`pb-3 px-1 ${activeTab === "terminal" 
                    ? "text-blue-400 border-b-2 border-blue-400" 
                    : "text-gray-400 hover:text-gray-200"}`}
                >
                  Terminal
                </button>
                <button 
                  onClick={() => setActiveTab("settings")}
                  className={`pb-3 px-1 ${activeTab === "settings" 
                    ? "text-blue-400 border-b-2 border-blue-400" 
                    : "text-gray-400 hover:text-gray-200"}`}
                >
                  Paramètres
                </button>
              </nav>
            </div>
          </div>
          
          {/* Contenu selon l'onglet sélectionné */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Graphique d'utilisation du CPU */}
              <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Cpu className="h-5 w-5 text-blue-400 mr-2" />
                  Utilisation CPU
                </h3>
                <div className="h-64 w-full bg-gray-800 rounded-lg flex items-center justify-center">
                  <p className="text-gray-400">Graphique d&apos;utilisation CPU</p>
                </div>
              </div>
              
              {/* Graphique d&apos;utilisation de la mémoire */}
              <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <MemoryStick className="h-5 w-5 text-blue-400 mr-2" />
                  Utilisation Mémoire
                </h3>
                <div className="h-64 w-full bg-gray-800 rounded-lg flex items-center justify-center">
                  <p className="text-gray-400">Graphique d&apos;utilisation mémoire</p>
                </div>
              </div>
              
              {/* Détails du système */}
              <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Server className="h-5 w-5 text-blue-400 mr-2" />
                  Détails système
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-gray-700 pb-2">
                    <span className="text-gray-400">Système d&apos;exploitation</span>
                    <span>{server.specs.os}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-700 pb-2">
                    <span className="text-gray-400">Adresse IP</span>
                    <span>{server.ip}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-700 pb-2">
                    <span className="text-gray-400">Date de création</span>
                    <span>{new Date(server.createdAt).toLocaleDateString("fr-FR")}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-700 pb-2">
                    <span className="text-gray-400">Kernel</span>
                    <span>5.15.0-25-generic</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-700 pb-2">
                    <span className="text-gray-400">Charge système</span>
                    <span>0.35, 0.42, 0.38</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Processus actifs</span>
                    <span>248</span>
                  </div>
                </div>
              </div>
              
              {/* Activité récente */}
              <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Activity className="h-5 w-5 text-blue-400 mr-2" />
                  Activité récente
                </h3>
                <div className="space-y-3">
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <div className="flex items-center text-gray-300">
                      <RefreshCw className="h-4 w-4 text-amber-400 mr-2" />
                      <span>Redémarrage du serveur</span>
                      <span className="ml-auto text-sm text-gray-400">Il y a 3 jours</span>
                    </div>
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <div className="flex items-center text-gray-300">
                      <CheckCircle2 className="h-4 w-4 text-green-400 mr-2" />
                      <span>Déploiement réussi: API Backend</span>
                      <span className="ml-auto text-sm text-gray-400">Il y a 6 jours</span>
                    </div>
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <div className="flex items-center text-gray-300">
                      <XCircle className="h-4 w-4 text-red-400 mr-2" />
                      <span>Échec du déploiement: Dashboard</span>
                      <span className="ml-auto text-sm text-gray-400">Il y a 6 jours</span>
                    </div>
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <div className="flex items-center text-gray-300">
                      <Settings className="h-4 w-4 text-blue-400 mr-2" />
                      <span>Mise à jour système</span>
                      <span className="ml-auto text-sm text-gray-400">Il y a 2 semaines</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "projects" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Projets déployés ({projects.length})</h2>
                <button className="flex items-center px-3 py-2 bg-blue-900/40 text-blue-400 rounded-lg hover:bg-blue-900/60 transition-colors">
                  <span className="mr-2">+</span>
                  Déployer un nouveau projet
                </button>
              </div>
              
              {/* Liste des projets */}
              <div className="space-y-4">
                {projects.map(project => (
                  <div key={project.id} className="bg-gray-800 rounded-xl shadow-lg p-5 border border-gray-700">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                      <div className="flex items-center mb-3 md:mb-0">
                        <div className={`w-3 h-3 rounded-full mr-3 ${
                          project.status === "running" ? "bg-green-500" : 
                          project.status === "stopped" ? "bg-gray-500" : 
                          project.status === "restarting" ? "bg-amber-500" : 
                          "bg-red-500"
                        }`} />
                        <div>
                          <h3 className="text-lg font-semibold">{project.name}</h3>
                          <p className="text-gray-400 text-sm">{project.type} • Port {project.port}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {project.status === "stopped" ? (
                          <button 
                            onClick={() => handleProjectAction(project.id, 'start')}
                            disabled={actionLoading[project.id]}
                            className="flex items-center px-2.5 py-1.5 bg-green-900/40 text-green-400 rounded-lg hover:bg-green-900/60 transition-colors text-sm"
                          >
                            {actionLoading[project.id] ? (
                              <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                            ) : (
                              <PlayCircle className="h-4 w-4 mr-1.5" />
                            )}
                            Démarrer
                          </button>
                        ) : (
                          <>
                            <button 
                              onClick={() => handleProjectAction(project.id, 'restart')}
                              disabled={actionLoading[project.id]}
                              className="flex items-center px-2.5 py-1.5 bg-amber-900/40 text-amber-400 rounded-lg hover:bg-amber-900/60 transition-colors text-sm"
                            >
                        </button>
                        
                        <button 
                          onClick={() => handleProjectAction(project.id, 'stop')}
                          disabled={actionLoading[project.id]}
                          className="flex items-center px-2.5 py-1.5 bg-red-900/40 text-red-400 rounded-lg hover:bg-red-900/60 transition-colors text-sm"
                        >
                          {actionLoading[project.id] ? (
                            <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                          ) : (
                            <PauseCircle className="h-4 w-4 mr-1.5" />
                          )}
                          Arrêter
                        </button>
                      </>
                    )}
                    
                    <button className="p-1.5 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors">
                      <Settings className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
                  <div className="bg-gray-750 p-3 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1">URL</div>
                    <div className="text-sm font-medium truncate">{project.url}</div>
                  </div>
                  <div className="bg-gray-750 p-3 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1">Dernier déploiement</div>
                    <div className="text-sm font-medium">
                      {new Date(project.lastDeployed).toLocaleDateString("fr-FR")}
                    </div>
                  </div>
                  <div className="bg-gray-750 p-3 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1">CPU</div>
                    <div className="text-sm font-medium flex items-center">
                      <div className="h-2 w-24 bg-gray-600 rounded-full mr-2 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            project.healthStatus.cpu < 50 ? "bg-green-500" : 
                            project.healthStatus.cpu < 80 ? "bg-amber-500" : 
                            "bg-red-500"
                          }`}
                          style={{ width: `${project.healthStatus.cpu}%` }}
                        />
                      </div>
                      {project.healthStatus.cpu}%
                    </div>
                  </div>
                  <div className="bg-gray-750 p-3 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1">Mémoire</div>
                    <div className="text-sm font-medium flex items-center">
                      <div className="h-2 w-24 bg-gray-600 rounded-full mr-2 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            project.healthStatus.memory < 50 ? "bg-green-500" : 
                            project.healthStatus.memory < 80 ? "bg-amber-500" : 
                            "bg-red-500"
                          }`}
                          style={{ width: `${project.healthStatus.memory}%` }}
                        />
                      </div>
                      {project.healthStatus.memory}%
                    </div>
                  </div>
                  <div className="bg-gray-750 p-3 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1">Temps de réponse</div>
                    <div className="text-sm font-medium">
                      {project.healthStatus.responseTime > 0 
                        ? `${project.healthStatus.responseTime} ms`
                        : "N/A"}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center">
                  <div className="text-gray-400 text-sm">
                    Uptime: {project.healthStatus.uptime > 0 
                      ? `${project.healthStatus.uptime}%` 
                      : "Hors ligne"}
                  </div>
                  <button className="flex items-center text-sm text-gray-300 hover:text-blue-400">
                    Voir les détails <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {activeTab === "terminal" && (
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
          <div className="flex items-center mb-4">
            <Terminal className="h-5 w-5 text-blue-400 mr-2" />
            <h3 className="text-lg font-semibold">Terminal SSH</h3>
          </div>
          <div className="bg-black rounded-lg p-4 h-96 font-mono text-green-400 overflow-auto">
            <p>Connexion à {server.ip}...</p>
            <p>Authentifié avec succès.</p>
            <p className="text-gray-500">Utilisez ce terminal pour exécuter des commandes directement sur votre serveur.</p>
            <p>root@{server.name}:~# <span className="animate-pulse">_</span></p>
          </div>
        </div>
      )}
      
      {activeTab === "settings" && (
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
          <div className="flex items-center mb-6">
            <Settings className="h-5 w-5 text-blue-400 mr-2" />
            <h3 className="text-lg font-semibold">Paramètres du serveur</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-md font-medium mb-3 text-gray-300">Informations générales</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Nom du serveur</label>
                  <input 
                    type="text" 
                    value={server.name}
                    className="w-full bg-gray-750 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Adresse IP</label>
                  <input 
                    type="text" 
                    value={server.ip} 
                    disabled
                    className="w-full bg-gray-750 text-gray-400 px-3 py-2 rounded-lg border border-gray-700 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-md font-medium mb-3 text-gray-300">Sécurité</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Méthode d&apos;authentification</label>
                  <select className="w-full bg-gray-750 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none">
                    <option>Clé SSH</option>
                    <option>Mot de passe</option>
                    <option>Les deux</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Accès SSH</label>
                  <div className="flex items-center mt-2">
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-500" checked />
                      <span className="ml-2 text-gray-300">Autoriser l&apos;accès SSH</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-md font-medium mb-3 text-gray-300">Maintenance</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Mises à jour automatiques</label>
                  <div className="flex items-center mt-2">
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-500" checked />
                      <span className="ml-2 text-gray-300">Activer les mises à jour automatiques du système</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Sauvegardes</label>
                  <select className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Quotidienne</option>
                    <option>Hebdomadaire</option>
                    <option>Mensuelle</option>
                    <option>Jamais</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
              <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                Annuler
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Enregistrer les modifications
              </button>
            </div>
          </div>
        </div>
      )}
        </div>
    </main>
    </div>
    
  );
}