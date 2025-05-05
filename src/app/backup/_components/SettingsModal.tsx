"use client";

import { useState, useEffect, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, AlertTriangle, Database, Clock, Shield, HardDrive } from "lucide-react";
import {
  ToggleSwitch,
  SelectInput,
  TextInput,
  TextAreaInput,
  Checkbox,
  TabButton,
  SectionContainer,
  AlertBox
} from "./ui/BackupSettingsComponents";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  // State for modal settings
  const [retentionPolicy, setRetentionPolicy] = useState("30");
  const [compressionLevel, setCompressionLevel] = useState("medium");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [encryptBackups, setEncryptBackups] = useState(false);
  
  // Nouvelles options ajoutées
  const [activeTab, setActiveTab] = useState("general");
  const [backupLocation, setBackupLocation] = useState("cloud");
  const [maxBackupSize, setMaxBackupSize] = useState("unlimited");
  const [scheduleTime, setScheduleTime] = useState("03:00");
  const [backupConcurrency, setBackupConcurrency] = useState("1");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [excludedFolders, setExcludedFolders] = useState("");
  const [autoDeleteOld, setAutoDeleteOld] = useState(true);
  const [databasesToBackup, setDatabasesToBackup] = useState(["primary"]);
  const [encryptionKey, setEncryptionKey] = useState("");
  
  // Close modal with escape key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  // Handle database selection
  const toggleDatabase = (db: string) => {
    if (databasesToBackup.includes(db)) {
      setDatabasesToBackup(databasesToBackup.filter(item => item !== db));
    } else {
      setDatabasesToBackup([...databasesToBackup, db]);
    }
  };

  // Handle save settings
  const handleSaveSettings = () => {
    // Here you would implement saving the settings to your backend
    console.log("Saving settings:", {
      retentionPolicy,
      compressionLevel,
      notificationsEnabled,
      encryptBackups,
      backupLocation,
      maxBackupSize,
      scheduleTime,
      backupConcurrency,
      emailNotifications,
      excludedFolders,
      autoDeleteOld,
      databasesToBackup,
      encryptionKey: encryptionKey ? "******" : "" // Masquer la clé pour la sécurité
    });
    
    // Show success message or toast notification
    alert("Paramètres enregistrés avec succès!");
    
    // Close the modal
    onClose();
  };

  // Modal animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };
  
  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3 } }
  };

  // Tabs content renderer
  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return (
          <SectionContainer>
            <SelectInput
              label="Politique de Rétention"
              value={retentionPolicy}
              onChange={setRetentionPolicy}
              description="Durée pendant laquelle les backups seront conservés"
              options={[
                { value: "7", label: "7 jours" },
                { value: "14", label: "14 jours" },
                { value: "30", label: "30 jours" },
                { value: "90", label: "90 jours" },
                { value: "180", label: "180 jours" },
                { value: "365", label: "1 an" }
              ]}
            />
            
            <SelectInput
              label="Niveau de Compression"
              value={compressionLevel}
              onChange={setCompressionLevel}
              description="Un niveau plus élevé économise de l'espace mais ralentit le processus"
              options={[
                { value: "none", label: "Aucune" },
                { value: "low", label: "Faible" },
                { value: "medium", label: "Moyenne" },
                { value: "high", label: "Élevée" }
              ]}
            />
            
            <SelectInput
              label="Emplacement des Backups"
              value={backupLocation}
              onChange={setBackupLocation}
              description="Lieu de stockage des fichiers de backup"
              options={[
                { value: "local", label: "Stockage Local" },
                { value: "cloud", label: "Cloud (AWS S3)" },
                { value: "hybrid", label: "Hybride (Local + Cloud)" },
                { value: "ftp", label: "Serveur FTP" }
              ]}
            />
            
            <div className="space-y-4 pt-2">
              <ToggleSwitch
                label="Notifications"
                enabled={notificationsEnabled}
                onChange={() => setNotificationsEnabled(!notificationsEnabled)}
              />
              
              <ToggleSwitch
                label="Chiffrement des Backups"
                enabled={encryptBackups}
                onChange={() => setEncryptBackups(!encryptBackups)}
              />

              <ToggleSwitch
                label="Suppression Auto des Anciens Backups"
                enabled={autoDeleteOld}
                onChange={() => setAutoDeleteOld(!autoDeleteOld)}
              />
            </div>
          </SectionContainer>
        );
      
      case "advanced":
        return (
          <SectionContainer>
            <SelectInput
              label="Taille Maximale de Backup"
              value={maxBackupSize}
              onChange={setMaxBackupSize}
              description="Limite de taille pour chaque backup"
              options={[
                { value: "1", label: "1 GB" },
                { value: "5", label: "5 GB" },
                { value: "10", label: "10 GB" },
                { value: "50", label: "50 GB" },
                { value: "100", label: "100 GB" },
                { value: "unlimited", label: "Illimité" }
              ]}
            />

            <SelectInput
              label="Concurrence des Backups"
              value={backupConcurrency}
              onChange={setBackupConcurrency}
              description="Nombre de backups pouvant s'exécuter simultanément"
              options={[
                { value: "1", label: "1 (Séquentiel)" },
                { value: "2", label: "2 en parallèle" },
                { value: "3", label: "3 en parallèle" },
                { value: "5", label: "5 en parallèle" }
              ]}
            />

            <TextAreaInput
              label="Dossiers Exclus"
              value={excludedFolders}
              onChange={setExcludedFolders}
              placeholder="Un dossier par ligne, ex: tmp/, logs/, cache/"
              description="Ces dossiers seront ignorés lors des backups"
            />

            {encryptBackups && (
              <TextInput
                type="password"
                label="Clé de Chiffrement"
                value={encryptionKey}
                onChange={setEncryptionKey}
                placeholder="Clé secrète de chiffrement"
                description="Clé utilisée pour chiffrer les backups (laissez vide pour générer automatiquement)"
              />
            )}

            <AlertBox
              title="Zone Avancée"
              message="Ces paramètres avancés sont destinés aux utilisateurs expérimentés. Des modifications incorrectes peuvent affecter la stabilité et la sécurité du système."
              icon={<AlertTriangle className="text-red-500 flex-shrink-0" size={20} />}
              variant="warning"
            />
          </SectionContainer>
        );
        
      case "scheduling":
        return (
          <SectionContainer>
            <TextInput
              type="time"
              label="Heure de Backup Planifié"
              value={scheduleTime}
              onChange={setScheduleTime}
              description="Heure quotidienne pour exécuter les backups automatiques"
            />

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Jours de Backup</label>
              <div className="flex flex-wrap gap-2">
                {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, index) => (
                  <button 
                    key={day}
                    type="button"
                    className={`px-3 py-1 rounded-md text-sm ${index < 5 ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                  >
                    {day}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400">Jours où les backups seront exécutés</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Fréquence</label>
              <div className="bg-gray-700 p-3 rounded-lg border border-gray-600">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="freq-daily" name="frequency" defaultChecked className="text-blue-600 focus:ring-blue-500" />
                    <label htmlFor="freq-daily" className="text-sm text-white">Quotidien</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="freq-weekly" name="frequency" className="text-blue-600 focus:ring-blue-500" />
                    <label htmlFor="freq-weekly" className="text-sm text-white">Hebdomadaire</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="freq-monthly" name="frequency" className="text-blue-600 focus:ring-blue-500" />
                    <label htmlFor="freq-monthly" className="text-sm text-white">Mensuel</label>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <ToggleSwitch
                label="Notifications par Email"
                enabled={emailNotifications}
                onChange={() => setEmailNotifications(!emailNotifications)}
              />
              {emailNotifications && (
                <TextInput
                  type="email"
                  placeholder="email@example.com"
                  label=""
                  value=""
                  onChange={() => {}}
                />
              )}
              <p className="text-xs text-gray-400">Recevoir des notifications sur l&apos;état des backups</p>
            </div>
          </SectionContainer>
        );

      case "databases":
        return (
          <SectionContainer>
            <p className="text-sm text-gray-400">Sélectionnez les bases de données à inclure dans les backups</p>
            
            <div className="space-y-3 bg-gray-700 p-3 rounded-lg border border-gray-600">
              {[
                { id: 'primary', name: 'Base de données principale (MongoDB)', size: '1.2 GB' },
                { id: 'users', name: 'Base utilisateurs (PostgreSQL)', size: '450 MB' },
                { id: 'analytics', name: 'Analytiques (MySQL)', size: '2.3 GB' },
                { id: 'logs', name: 'Logs système (SQLite)', size: '780 MB' },
                { id: 'cache', name: 'Cache (Redis)', size: '120 MB' }
              ].map(db => (
                <Checkbox
                  key={db.id}
                  id={`db-${db.id}`}
                  checked={databasesToBackup.includes(db.id)}
                  onChange={() => toggleDatabase(db.id)}
                  label={db.name}
                  subtitle={db.size}
                  icon={<Database className="text-gray-400" size={16} />}
                />
              ))}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Options de Backup</label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="with-schema" defaultChecked className="rounded text-blue-600 focus:ring-blue-500 bg-gray-600 border-gray-500" />
                  <label htmlFor="with-schema" className="text-sm text-white">Inclure les schémas</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="with-indexes" defaultChecked className="rounded text-blue-600 focus:ring-blue-500 bg-gray-600 border-gray-500" />
                  <label htmlFor="with-indexes" className="text-sm text-white">Inclure les index</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="with-procs" defaultChecked className="rounded text-blue-600 focus:ring-blue-500 bg-gray-600 border-gray-500" />
                  <label htmlFor="with-procs" className="text-sm text-white">Inclure les procédures stockées</label>
                </div>
              </div>
            </div>
          </SectionContainer>
        );
        
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Fragment>
          {/* Backdrop overlay */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={overlayVariants}
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* Modal content */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={modalVariants}
            className="fixed inset-0 z-50 flex items-center justify-center mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-auto">
              {/* Modal header */}
              <div className="flex justify-between items-center p-4 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <svg 
                    className="h-5 w-5 text-blue-400" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
                    />
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                    />
                  </svg>
                  Paramètres de Backup
                </h2>
                <button 
                  onClick={onClose} 
                  className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* Tabs navigation */}
              <div className="flex border-b border-gray-700">
                <TabButton
                  isActive={activeTab === 'general'}
                  onClick={() => setActiveTab('general')}
                  icon={<HardDrive size={16} />}
                  label="Général"
                />
                <TabButton
                  isActive={activeTab === 'advanced'}
                  onClick={() => setActiveTab('advanced')}
                  icon={<Shield size={16} />}
                  label="Avancé"
                />
                <TabButton
                  isActive={activeTab === 'scheduling'}
                  onClick={() => setActiveTab('scheduling')}
                  icon={<Clock size={16} />}
                  label="Planification"
                />
                <TabButton
                  isActive={activeTab === 'databases'}
                  onClick={() => setActiveTab('databases')}
                  icon={<Database size={16} />}
                  label="Bases de Données"
                />
              </div>
              
              {/* Modal body with tab content */}
              <div className="p-5">
                {renderTabContent()}
              </div>
              
              {/* Modal footer */}
              <div className="flex justify-end gap-3 p-4 border-t border-gray-700">
                <button 
                  onClick={onClose}
                  className="px-4 py-2 rounded-md border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  Annuler
                </button>
                <button 
                  onClick={handleSaveSettings}
                  className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Save size={16} />
                  Enregistrer
                </button>
              </div>
            </div>
          </motion.div>
        </Fragment>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;