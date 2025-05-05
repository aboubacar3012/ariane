"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Sidebar from "@/src/components/Sidebar";
import { Clock, Database, Calendar, Play, Settings, RotateCcw } from "lucide-react";
import SettingsModal from "./_components/SettingsModal";

// Import des composants réutilisables
import Card from "./_components/ui/Card";
import ProjectSelector from "./_components/ui/ProjectSelector";
import TabNavigation from "./_components/ui/TabNavigation";
import BackupItem, { Backup } from "./_components/ui/BackupItem";
import BackupOptions from "./_components/ui/BackupOptions";
import TimePicker from "./_components/ui/TimePicker";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1,
      duration: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};

// Mock data for backup list
const mockBackups = [
  { id: "bkp-001", project: "E-commerce API", date: "2025-05-04T15:30:00", size: "1.2GB", status: "completed" },
  { id: "bkp-002", project: "Portfolio CMS", date: "2025-05-03T12:45:00", size: "850MB", status: "completed" },
  { id: "bkp-003", project: "Atlas Dashboard", date: "2025-05-02T22:10:00", size: "2.1GB", status: "completed" },
  { id: "bkp-004", project: "Client Database", date: "2025-04-28T09:15:00", size: "3.5GB", status: "completed" },
  { id: "bkp-005", project: "E-commerce API", date: "2025-04-25T18:20:00", size: "1.1GB", status: "completed" },
];

// Mock data for projects
const projects = [
  { id: "proj-001", name: "E-commerce API", dbType: "MongoDB" },
  { id: "proj-002", name: "Portfolio CMS", dbType: "PostgreSQL" },
  { id: "proj-003", name: "Atlas Dashboard", dbType: "MySQL" },
  { id: "proj-004", name: "Client Database", dbType: "PostgreSQL" },
];

const BackupPage = () => {
  const [activeTab, setActiveTab] = useState("backups");
  const [selectedProject, setSelectedProject] = useState("");
  const [isBackupInProgress, setIsBackupInProgress] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  
  // Options de backup
  const [includeMedia, setIncludeMedia] = useState(false);
  const [compress, setCompress] = useState(true);
  const [encrypt, setEncrypt] = useState(false);
  
  // Heure planifiée
  const [scheduledHour, setScheduledHour] = useState(3);
  const [scheduledMinute, setScheduledMinute] = useState(0);
  
  // Start backup simulation
  const startBackup = () => {
    setIsBackupInProgress(true);
    
    // Simulating backup process
    setTimeout(() => {
      setIsBackupInProgress(false);
    }, 3000);
  };

  // Fonction de téléchargement d'un backup
  const handleDownload = (backupId: string) => {
    console.log(`Téléchargement du backup ${backupId}`);
    // Logique de téléchargement ici
  };

  // Fonction de restauration d'un backup
  const handleRestore = (backupId: string) => {
    console.log(`Restauration à partir du backup ${backupId}`);
    // Logique de restauration ici
  };

  // Filter backups by selected project
  const filteredBackups = selectedProject 
    ? mockBackups.filter(backup => backup.project === projects.find(p => p.id === selectedProject)?.name)
    : mockBackups;

  // Tabs pour la navigation
  const tabs = [
    { id: "backups", label: "Backups Disponibles" },
    { id: "create", label: "Créer Backup" },
    { id: "restore", label: "Restaurer" },
    { id: "schedule", label: "Planification" }
  ];

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold text-white">Centre de Backup</h1>
              <p className="text-gray-400 mt-1">Gérer les backups et les points de restauration de vos bases de données</p>
            </div>
            <div className="flex space-x-2">
              <button 
                className="flex items-center gap-2 px-3 py-2 rounded-md border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors"
                onClick={() => setIsSettingsModalOpen(true)}
              >
                <Settings size={16} />
                Paramètres
              </button>
              <button 
                className="flex items-center gap-2 px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                onClick={startBackup}
                disabled={isBackupInProgress}
              >
                {isBackupInProgress ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-opacity-50 border-t-transparent rounded-full"></div>
                    Backup en cours...
                  </>
                ) : (
                  <>
                    <Play size={16} />
                    Backup Rapide
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* Tab Navigation avec le composant réutilisable */}
          <TabNavigation 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
            tabs={tabs}
          />
          
          {/* Available Backups Tab */}
          {activeTab === "backups" && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Backups Récents</h2>
                <ProjectSelector 
                  projects={projects} 
                  selectedProject={selectedProject} 
                  onProjectChange={setSelectedProject} 
                />
              </div>

              {filteredBackups.length > 0 ? (
                filteredBackups.map((backup) => (
                  <BackupItem 
                    key={backup.id} 
                    backup={backup as Backup} 
                    onDownload={handleDownload}
                    onRestore={handleRestore}
                  />
                ))
              ) : (
                <div className="flex justify-center items-center py-20 text-gray-500">
                  <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="text-lg mb-1">Aucun backup trouvé</p>
                    <p className="text-sm text-gray-500">Essayez de changer de filtre ou de sélectionner un autre projet</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
          
          {/* Create Backup Tab */}
          {activeTab === "create" && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <motion.div variants={itemVariants}>
                <Card 
                  title="Créer un Nouveau Backup" 
                  icon={<Database className="text-blue-400 mr-2" size={18} />}
                >
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">Sélectionner un Projet</label>
                      <div className="relative">
                        <select 
                          className="bg-gray-700 p-2 pl-4 pr-10 rounded-lg text-white w-full border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none appearance-none"
                        >
                          <option value="">Choisir un projet</option>
                          {projects.map(project => (
                            <option key={project.id} value={project.id}>
                              {project.name} ({project.dbType})
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    {/* Utilisation du composant BackupOptions */}
                    <BackupOptions 
                      includeMedia={includeMedia}
                      setIncludeMedia={setIncludeMedia}
                      compress={compress}
                      setCompress={setCompress}
                      encrypt={encrypt}
                      setEncrypt={setEncrypt}
                    />
                    
                    <button 
                      className="w-full px-4 py-2 mt-4 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                      disabled={isBackupInProgress}
                      onClick={startBackup}
                    >
                      {isBackupInProgress ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin h-4 w-4 border-2 border-white border-opacity-50 border-t-transparent rounded-full"></div>
                          Backup en cours...
                        </div>
                      ) : "Démarrer le Backup"}
                    </button>
                  </div>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card 
                  title="Statistiques de Backup" 
                  icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>}
                >
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
                        <p className="text-gray-400 text-sm">Total Backups</p>
                        <p className="text-2xl font-bold">32</p>
                      </div>
                      <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
                        <p className="text-gray-400 text-sm">Espace Utilisé</p>
                        <p className="text-2xl font-bold">28.5 GB</p>
                      </div>
                      <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
                        <p className="text-gray-400 text-sm">Dernier Backup</p>
                        <p className="text-2xl font-bold">Aujourd&apos;hui</p>
                      </div>
                      <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
                        <p className="text-gray-400 text-sm">Taux de Réussite</p>
                        <p className="text-2xl font-bold">98%</p>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <h3 className="text-sm font-medium mb-2">Activité Récente</h3>
                      <div className="space-y-2">
                        {mockBackups.slice(0, 3).map((backup) => (
                          <div key={backup.id} className="flex justify-between items-center text-sm py-2 border-b border-gray-700">
                            <span>{backup.project}</span>
                            <span className="text-gray-400">{new Date(backup.date).toLocaleDateString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          )}
          
          {/* Restore Database Tab */}
          {activeTab === "restore" && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <Card 
                  title="Restaurer une Base de Données" 
                  icon={<RotateCcw className="text-blue-400 mr-2" size={18} />}
                >
                  <p className="text-gray-400 mb-6">Sélectionnez un backup pour restaurer votre base de données à un état précédent</p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Sélectionner un Projet</label>
                        <div className="relative">
                          <select 
                            className="bg-gray-700 p-2 pl-4 pr-10 rounded-lg text-white w-full border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none appearance-none"
                          >
                            <option value="">Choisir un projet</option>
                            {projects.map(project => (
                              <option key={project.id} value={project.id}>
                                {project.name} ({project.dbType})
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Sélectionner un Point de Restauration</label>
                        <div className="relative">
                          <select 
                            className="bg-gray-700 p-2 pl-4 pr-10 rounded-lg text-white w-full border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none appearance-none"
                          >
                            <option value="">Choisir un backup</option>
                            {mockBackups.map(backup => (
                              <option key={backup.id} value={backup.id}>
                                {backup.project} - {new Date(backup.date).toLocaleString()}
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 pt-4">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="test-restore" className="rounded border-gray-600 bg-gray-700" />
                          <label htmlFor="test-restore" className="text-gray-300">Tester la restauration avant d&apos;appliquer</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="backup-current" className="rounded border-gray-600 bg-gray-700" defaultChecked />
                          <label htmlFor="backup-current" className="text-gray-300">Sauvegarder l&apos;état actuel avant restauration</label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
                      <h3 className="font-medium mb-3 text-red-400">Avertissement de Restauration</h3>
                      <p className="text-yellow-400 text-sm mb-4">
                        La restauration d&apos;une base de données remplacera toutes les données actuelles par celles du backup. 
                        Cette action ne peut pas être annulée, sauf si vous créez une sauvegarde de l&apos;état actuel.
                      </p>
                      <button className="w-full px-4 py-2 mt-4 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors">
                        Restaurer la Base de Données
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          )}
          
          {/* Schedule Tab */}
          {activeTab === "schedule" && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <motion.div variants={itemVariants}>
                <Card 
                  title="Planification des Backups" 
                  icon={<Calendar className="text-blue-400 mr-2" size={18} />}
                >
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">Sélectionner un Projet</label>
                      <div className="relative">
                        <select 
                          className="bg-gray-700 p-2 pl-4 pr-10 rounded-lg text-white w-full border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none appearance-none"
                        >
                          <option value="">Choisir un projet</option>
                          {projects.map(project => (
                            <option key={project.id} value={project.id}>
                              {project.name}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">Fréquence</label>
                      <div className="relative">
                        <select 
                          className="bg-gray-700 p-2 pl-4 pr-10 rounded-lg text-white w-full border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none appearance-none"
                          defaultValue="daily"
                        >
                          <option value="hourly">Toutes les heures</option>
                          <option value="daily">Tous les jours</option>
                          <option value="weekly">Toutes les semaines</option>
                          <option value="monthly">Tous les mois</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">Heure</label>
                      {/* Utilisation du composant TimePicker */}
                      <TimePicker 
                        hour={scheduledHour}
                        minute={scheduledMinute}
                        onHourChange={setScheduledHour}
                        onMinuteChange={setScheduledMinute}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">Politique de Rétention</label>
                      <div className="relative">
                        <select 
                          className="bg-gray-700 p-2 pl-4 pr-10 rounded-lg text-white w-full border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none appearance-none"
                          defaultValue="7"
                        >
                          <option value="3">Conserver les 3 derniers backups</option>
                          <option value="7">Conserver les 7 derniers backups</option>
                          <option value="14">Conserver les 14 derniers backups</option>
                          <option value="30">Conserver les 30 derniers backups</option>
                          <option value="90">Conserver les 90 derniers backups</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <button className="w-full px-4 py-2 mt-4 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                      Enregistrer la Planification
                    </button>
                  </div>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card 
                  title="Tâches Planifiées" 
                  icon={<Clock className="text-blue-400 mr-2" size={18} />}
                >
                  <div className="space-y-4">
                    <table className="min-w-full bg-gray-900 text-white rounded-lg overflow-hidden">
                      <thead className="bg-gray-750">
                        <tr>
                          <th className="py-2 px-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Projet</th>
                          <th className="py-2 px-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Fréquence</th>
                          <th className="py-2 px-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Heure</th>
                          <th className="py-2 px-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Statut</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {projects.map((project, idx) => (
                          <tr key={project.id} className={idx % 2 === 0 ? "bg-gray-800" : "bg-gray-850"}>
                            <td className="py-3 px-3 whitespace-nowrap">{project.name}</td>
                            <td className="py-3 px-3 text-center">
                              {["Quotidien", "Hebdomadaire", "Quotidien", "Mensuel"][idx % 4]}
                            </td>
                            <td className="py-3 px-3 text-center">
                              {["03:00", "12:00", "23:30", "04:45"][idx % 4]}
                            </td>
                            <td className="py-3 px-3 text-center">
                              <div className="flex items-center justify-center">
                                <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                                <span>Actif</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    <div className="mt-4">
                      <h3 className="text-sm font-medium mb-2">Prochain Backup</h3>
                      <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">E-commerce API</p>
                            <p className="text-sm text-gray-400">MongoDB</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">Demain, 03:00</p>
                            <p className="text-sm text-gray-400">6 mai 2025</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </div>
      </main>
      <SettingsModal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} />
    </div>
  );
};

export default BackupPage;