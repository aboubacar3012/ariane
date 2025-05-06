"use client";

import { useState, useEffect, JSX } from "react";
import Sidebar from "@/src/components/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Plus,
  UserPlus,
  UserCheck,
  UserX,
  Settings,
  Shield,
  Key,
  RefreshCw,
  User,
  Lock,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";

// Types pour la gestion des utilisateurs
interface UserRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  color: string;
}

interface UserStatus {
  value: "active" | "inactive" | "pending" | "locked";
  label: string;
  color: string;
  icon: JSX.Element;
}

interface UserActivity {
  id: string;
  action: string;
  timestamp: string;
  ipAddress: string;
  details: string;
}

interface SystemUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  status: "active" | "inactive" | "pending" | "locked";
  lastActive: string;
  createdAt: string;
  twoFactorEnabled: boolean;
  recentActivity: UserActivity[];
}

// Configurations statiques
const STATUS_CONFIG: Record<string, UserStatus> = {
  active: {
    value: "active",
    label: "Actif",
    color: "bg-green-900 text-green-300 border-green-700",
    icon: <CheckCircle className="h-3.5 w-3.5 mr-1" />,
  },
  inactive: {
    value: "inactive",
    label: "Inactif",
    color: "bg-gray-900 text-gray-300 border-gray-700",
    icon: <UserX className="h-3.5 w-3.5 mr-1" />,
  },
  pending: {
    value: "pending",
    label: "En attente",
    color: "bg-yellow-900 text-yellow-300 border-yellow-700",
    icon: <Clock className="h-3.5 w-3.5 mr-1" />,
  },
  locked: {
    value: "locked",
    label: "Verrouillé",
    color: "bg-red-900 text-red-300 border-red-700",
    icon: <Lock className="h-3.5 w-3.5 mr-1" />,
  },
};

const USER_ROLES: UserRole[] = [
  {
    id: "admin",
    name: "Administrateur",
    description: "Accès complet à toutes les fonctionnalités",
    permissions: ["all"],
    color: "bg-red-900 text-red-300 border-red-700",
  },
  {
    id: "manager",
    name: "Gestionnaire",
    description: "Gestion des serveurs et déploiements",
    permissions: ["servers:read", "servers:write", "deployments:read", "deployments:write"],
    color: "bg-blue-900 text-blue-300 border-blue-700",
  },
  {
    id: "developer",
    name: "Développeur",
    description: "Accès en lecture aux serveurs, contrôle des déploiements",
    permissions: ["servers:read", "deployments:read", "deployments:write"],
    color: "bg-green-900 text-green-300 border-green-700",
  },
  {
    id: "viewer",
    name: "Observateur",
    description: "Accès en lecture seule",
    permissions: ["servers:read", "deployments:read"],
    color: "bg-gray-900 text-gray-300 border-gray-700",
  },
];

// Données fictives pour la démo
const sampleUsers: SystemUser[] = [
  {
    id: "user-001",
    name: "Alexandre Dubois",
    email: "alex.dubois@example.com",
    avatar: "AD",
    role: USER_ROLES[0], // Admin
    status: "active",
    lastActive: "2025-05-05T10:15:30",
    createdAt: "2024-02-10T08:30:00",
    twoFactorEnabled: true,
    recentActivity: [
      {
        id: "act-001",
        action: "Connexion",
        timestamp: "2025-05-05T10:15:30",
        ipAddress: "192.168.1.1",
        details: "Connexion réussie depuis Paris, France",
      },
      {
        id: "act-002",
        action: "Serveur redémarré",
        timestamp: "2025-05-04T14:25:10",
        ipAddress: "192.168.1.1",
        details: "Serveur Web Prod redémarré",
      },
    ],
  },
  {
    id: "user-002",
    name: "Sophie Leclerc",
    email: "sophie.l@example.com",
    avatar: "SL",
    role: USER_ROLES[1], // Manager
    status: "active",
    lastActive: "2025-05-04T16:45:22",
    createdAt: "2024-03-15T09:20:00",
    twoFactorEnabled: true,
    recentActivity: [
      {
        id: "act-003",
        action: "Déploiement créé",
        timestamp: "2025-05-04T16:40:12",
        ipAddress: "192.168.1.45",
        details: "Déploiement v2.5.1 créé pour App Mobile",
      },
    ],
  },
  {
    id: "user-003",
    name: "Thomas Martin",
    email: "thomas.m@example.com",
    avatar: "TM",
    role: USER_ROLES[2], // Developer
    status: "inactive",
    lastActive: "2025-04-28T11:32:40",
    createdAt: "2024-05-02T10:15:00",
    twoFactorEnabled: false,
    recentActivity: [
      {
        id: "act-004",
        action: "Déconnexion",
        timestamp: "2025-04-28T11:32:40",
        ipAddress: "192.168.1.78",
        details: "Déconnexion manuelle",
      },
    ],
  },
  {
    id: "user-004",
    name: "Emma Petit",
    email: "emma.p@example.com",
    avatar: "EP",
    role: USER_ROLES[2], // Developer
    status: "pending",
    lastActive: "2025-05-01T09:15:20",
    createdAt: "2025-05-01T09:10:00",
    twoFactorEnabled: false,
    recentActivity: [
      {
        id: "act-005",
        action: "Compte créé",
        timestamp: "2025-05-01T09:10:00",
        ipAddress: "192.168.1.90",
        details: "Invitation envoyée par Alexandre Dubois",
      },
    ],
  },
  {
    id: "user-005",
    name: "Lucas Bernard",
    email: "lucas.b@example.com",
    avatar: "LB",
    role: USER_ROLES[3], // Viewer
    status: "locked",
    lastActive: "2025-04-15T08:22:15",
    createdAt: "2024-06-10T14:30:00",
    twoFactorEnabled: true,
    recentActivity: [
      {
        id: "act-006",
        action: "Compte verrouillé",
        timestamp: "2025-04-25T16:30:00",
        ipAddress: "192.168.1.120",
        details: "Verrouillage automatique après 5 tentatives de connexion échouées",
      },
    ],
  },
  {
    id: "user-006",
    name: "Julie Moreau",
    email: "julie.m@example.com",
    avatar: "JM",
    role: USER_ROLES[1], // Manager
    status: "active",
    lastActive: "2025-05-05T08:30:45",
    createdAt: "2024-04-20T11:25:00",
    twoFactorEnabled: true,
    recentActivity: [
      {
        id: "act-007",
        action: "Serveur créé",
        timestamp: "2025-05-05T08:35:12",
        ipAddress: "192.168.1.55",
        details: "Nouveau serveur 'Test Staging' créé",
      },
    ],
  },
];

// Composant Badge de statut pour l'utilisateur
const StatusBadge = ({ status }: { status: SystemUser["status"] }) => {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${config.color}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
};

// Composant Badge pour le rôle
const RoleBadge = ({ role }: { role: UserRole }) => {
  return (
    <span
      className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${role.color}`}
    >
      <Shield className="h-3.5 w-3.5 mr-1" />
      {role.name}
    </span>
  );
};

// Composant d'avatarr pour utilisateur
const UserAvatar = ({ name, avatar }: { name: string; avatar: string }) => {
  // Générer une couleur de fond pseudo-aléatoire basée sur le nom
  const getColorClass = (name: string) => {
    const colors = [
      "bg-blue-700",
      "bg-green-700",
      "bg-purple-700",
      "bg-pink-700",
      "bg-yellow-700",
      "bg-red-700",
      "bg-indigo-700",
      "bg-teal-700",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div
      className={`${getColorClass(
        name
      )} h-10 w-10 rounded-full flex items-center justify-center text-white font-medium`}
      title={name}
    >
      {avatar}
    </div>
  );
};

// Composant Carte Utilisateur
const UserCard = ({ user }: { user: SystemUser }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden hover:border-gray-600 transition-all duration-300"
    >
      <div className="p-4 flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <UserAvatar name={user.name} avatar={user.avatar} />
            <div className="ml-3">
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-gray-400 text-sm">{user.email}</p>
            </div>
          </div>
          <StatusBadge status={user.status} />
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
          <div className="flex items-center text-gray-400">
            <Shield className="h-4 w-4 mr-1.5 text-gray-500" />
            <RoleBadge role={user.role} />
          </div>
          <div className="flex items-center text-gray-400">
            <Calendar className="h-4 w-4 mr-1.5 text-gray-500" />
            <span>{new Date(user.createdAt).toLocaleDateString("fr-FR")}</span>
          </div>
        </div>

        <div className="flex items-center mb-4 text-sm">
          <Clock className="h-4 w-4 mr-1.5 text-gray-500" />
          <span className="text-gray-400">
            Dernière activité:{" "}
            {new Date(user.lastActive).toLocaleDateString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        <div className="flex justify-between mt-auto">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            {showDetails ? "Voir moins" : "Voir plus"}
          </button>
          <div className="flex space-x-2">
            <button className="p-1.5 rounded-md bg-blue-900/30 text-blue-400 hover:bg-blue-900/50 transition-colors">
              <Edit className="h-4 w-4" />
            </button>
            {user.status === "locked" ? (
              <button className="p-1.5 rounded-md bg-green-900/30 text-green-400 hover:bg-green-900/50 transition-colors">
                <Key className="h-4 w-4" />
              </button>
            ) : (
              <button className="p-1.5 rounded-md bg-yellow-900/30 text-yellow-400 hover:bg-yellow-900/50 transition-colors">
                <Lock className="h-4 w-4" />
              </button>
            )}
            <button className="p-1.5 rounded-md bg-gray-700 text-gray-400 hover:bg-gray-650 transition-colors">
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 pt-4 border-t border-gray-700"
            >
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                    <Shield className="h-4 w-4 mr-1.5 text-blue-400" />
                    Permissions
                  </h4>
                  <p className="text-sm text-gray-400 mb-2">{user.role.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {user.role.permissions.map((permission, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-md"
                      >
                        {permission === "all" ? "Toutes les permissions" : permission}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                    <Clock className="h-4 w-4 mr-1.5 text-blue-400" />
                    Activité récente
                  </h4>
                  <div className="space-y-2">
                    {user.recentActivity.length > 0 ? (
                      user.recentActivity.map((activity) => (
                        <div
                          key={activity.id}
                          className="text-sm bg-gray-750 rounded-md p-2"
                        >
                          <div className="flex justify-between mb-1">
                            <span className="text-white font-medium">
                              {activity.action}
                            </span>
                            <span className="text-gray-500 text-xs">
                              {new Date(activity.timestamp).toLocaleDateString(
                                "fr-FR",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                          </div>
                          <p className="text-gray-400 text-xs">{activity.details}</p>
                          <p className="text-gray-500 text-xs mt-1">
                            IP: {activity.ipAddress}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">Aucune activité récente</p>
                    )}
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <div className="flex items-center text-sm">
                    <Key className="h-4 w-4 mr-1.5 text-gray-500" />
                    <span className="text-gray-400">
                      {user.twoFactorEnabled
                        ? "2FA activée"
                        : "2FA désactivée"}
                    </span>
                  </div>
                  <button className="p-1.5 rounded-md bg-red-900/30 text-red-400 hover:bg-red-900/50 transition-colors flex items-center text-sm">
                    <Trash2 className="h-4 w-4 mr-1.5" />
                    Supprimer
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// Composant Modal de création d'utilisateur
const UserCreationModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(USER_ROLES[2].id); // Developer par défaut
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [requirePasswordChange, setRequirePasswordChange] = useState(true);
  const [sendInvite, setSendInvite] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simule la création d'un utilisateur
    setTimeout(() => {
      setIsLoading(false);
      // Reset form and close modal
      setName("");
      setEmail("");
      setRole(USER_ROLES[2].id);
      setPassword("");
      setRequirePasswordChange(true);
      setSendInvite(true);
      onClose();
    }, 1500);
  };

  // Génère un mot de passe aléatoire
  const generateRandomPassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+";
    let result = "";
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(result);
    setShowPassword(true);
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
                  <UserPlus className="h-5 w-5 mr-2 text-blue-400" />
                  Ajouter un utilisateur
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
                      htmlFor="user-name"
                      className="block text-sm font-medium text-gray-400 mb-1"
                    >
                      Nom complet
                    </label>
                    <input
                      id="user-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Jean Dupont"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="user-email"
                      className="block text-sm font-medium text-gray-400 mb-1"
                    >
                      Adresse e-mail
                    </label>
                    <input
                      id="user-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="jean.dupont@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="user-role"
                      className="block text-sm font-medium text-gray-400 mb-1"
                    >
                      Rôle
                    </label>
                    <select
                      id="user-role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      {USER_ROLES.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      {USER_ROLES.find((r) => r.id === role)?.description}
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label
                        htmlFor="user-password"
                        className="block text-sm font-medium text-gray-400"
                      >
                        Mot de passe
                      </label>
                      <button
                        type="button"
                        onClick={generateRandomPassword}
                        className="text-xs text-blue-400 hover:text-blue-300"
                      >
                        Générer
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        id="user-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                        placeholder="Mot de passe"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        id="require-password-change"
                        type="checkbox"
                        checked={requirePasswordChange}
                        onChange={(e) => setRequirePasswordChange(e.target.checked)}
                        className="h-4 w-4 bg-gray-700 border-gray-600 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor="require-password-change"
                        className="ml-2 block text-sm text-gray-400"
                      >
                        Exiger un changement de mot de passe à la première connexion
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="send-invite"
                        type="checkbox"
                        checked={sendInvite}
                        onChange={(e) => setSendInvite(e.target.checked)}
                        className="h-4 w-4 bg-gray-700 border-gray-600 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor="send-invite"
                        className="ml-2 block text-sm text-gray-400"
                      >
                        Envoyer une invitation par e-mail
                      </label>
                    </div>
                  </div>

                  <div className="rounded-lg bg-blue-900/20 p-3 border border-blue-800/30">
                    <p className="text-sm text-blue-300">
                      <span className="font-medium">Note :</span> Chaque utilisateur doit absolument avoir une adresse email unique.
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
                        Création...
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-1.5" />
                        Créer l&apos;utilisateur
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

// Composant d'analyse des utilisateurs
const UserAnalyticsDashboard = ({
  users,
  isVisible,
}: {
  users: SystemUser[];
  isVisible: boolean;
}) => {
  if (!isVisible) return null;

  // Calcul de statistiques
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "active").length;
  const pendingUsers = users.filter((u) => u.status === "pending").length;
  const lockedUsers = users.filter((u) => u.status === "locked").length;
  const twoFaEnabled = users.filter((u) => u.twoFactorEnabled).length;
  
  // Répartition par rôle
  const roleDistribution = USER_ROLES.map(role => {
    const count = users.filter(user => user.role.id === role.id).length;
    return {
      role,
      count,
      percentage: totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Vue d'ensemble */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        <div className="lg:col-span-8">
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
            <div className="p-4 bg-gray-750 border-b border-gray-700">
              <h2 className="text-lg font-semibold flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-400" />
                Vue d&apos;ensemble des utilisateurs
              </h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-4 gap-3 mb-6">
                <div className="bg-blue-900/30 p-3 rounded-lg border border-blue-800">
                  <div className="text-xs text-blue-400 mb-1">Total Utilisateurs</div>
                  <div className="text-2xl font-bold text-blue-400">
                    {totalUsers}
                  </div>
                </div>
                <div className="bg-green-900/30 p-3 rounded-lg border border-green-800">
                  <div className="text-xs text-green-400 mb-1">Actifs</div>
                  <div className="text-2xl font-bold text-green-400">
                    {activeUsers}
                  </div>
                </div>
                <div className="bg-yellow-900/30 p-3 rounded-lg border border-yellow-800">
                  <div className="text-xs text-yellow-400 mb-1">En attente</div>
                  <div className="text-2xl font-bold text-yellow-400">
                    {pendingUsers}
                  </div>
                </div>
                <div className="bg-red-900/30 p-3 rounded-lg border border-red-800">
                  <div className="text-xs text-red-400 mb-1">Verrouillés</div>
                  <div className="text-2xl font-bold text-red-400">
                    {lockedUsers}
                  </div>
                </div>
              </div>
              
              {/* Graphiques et statistiques */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Répartition par rôle */}
                <div className="bg-gray-750 rounded-lg p-4">
                  <h3 className="text-sm font-medium mb-4 flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-blue-400" />
                    Répartition par rôle
                  </h3>
                  
                  <div className="space-y-3">
                    {roleDistribution.map((item) => (
                      <div key={item.role.id}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="flex items-center">
                            <span className={`h-3 w-3 rounded-full mr-2 ${item.role.color.replace('text-', 'bg-').split(' ')[0]}`}></span>
                            {item.role.name}
                          </span>
                          <span>{item.count} ({item.percentage}%)</span>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${item.role.color.replace('text-', 'bg-').replace('border-', '').split(' ')[0]}`}
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Sécurité */}
                <div className="bg-gray-750 rounded-lg p-4">
                  <h3 className="text-sm font-medium mb-4 flex items-center">
                    <Key className="h-4 w-4 mr-2 text-purple-400" />
                    Statistiques de sécurité
                  </h3>
                  
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-300 bg-purple-900">
                          Utilisateurs avec 2FA
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-purple-300">
                          {twoFaEnabled}/{totalUsers} ({totalUsers > 0 ? Math.round((twoFaEnabled / totalUsers) * 100) : 0}%)
                        </span>
                      </div>
                    </div>
                    <div className="flex h-4 mb-4 overflow-hidden text-xs bg-gray-700 rounded-full">
                      <div
                        style={{ width: `${totalUsers > 0 ? (twoFaEnabled / totalUsers) * 100 : 0}%` }}
                        className="flex flex-col justify-center text-center text-white bg-purple-600 shadow-none whitespace-nowrap"
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mt-6">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Dernière tentative de connexion échouée</span>
                      <span className="text-sm text-gray-300">Il y a 2 heures</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Comptes inactifs 30j</span>
                      <span className="text-sm text-gray-300">3</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Mots de passe expirés</span>
                      <span className="text-sm text-gray-300">2</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activité récente */}
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-4 flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-blue-400" />
                  Activité récente des utilisateurs
                </h3>
                
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {users
                    .flatMap(user => 
                      user.recentActivity.map(activity => ({
                        ...activity,
                        userName: user.name,
                        userAvatar: user.avatar,
                        userRole: user.role
                      }))
                    )
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .slice(0, 10)
                    .map((activity, index) => (
                      <div key={index} className="bg-gray-750 p-3 rounded-lg flex items-start">
                        <UserAvatar name={activity.userName} avatar={activity.userAvatar} />
                        <div className="ml-3 flex-1">
                          <div className="flex justify-between">
                            <div className="font-medium text-sm flex items-center">
                              {activity.userName}
                              <span className="ml-2 text-xs">
                                <RoleBadge role={activity.userRole} />
                              </span>
                            </div>
                            <span className="text-gray-500 text-xs">
                              {new Date(activity.timestamp).toLocaleDateString(
                                "fr-FR",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                          </div>
                          <p className="text-gray-300 text-sm mt-1">
                            {activity.action}
                          </p>
                          <p className="text-gray-400 text-xs mt-1">
                            {activity.details}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-4">
          {/* Gestion des rôles */}
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden mb-6">
            <div className="p-4 bg-gray-750 border-b border-gray-700">
              <h2 className="text-lg font-semibold flex items-center">
                <Shield className="h-5 w-5 mr-2 text-blue-400" />
                Gestion des rôles
              </h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {USER_ROLES.map((role) => (
                  <div key={role.id} className={`p-3 rounded-lg ${role.color.replace('text-', 'bg-').replace('text-', 'bg-')}bg-opacity-20 border ${role.color.replace('text-', 'border-')}`}>
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium flex items-center">
                        <Shield className="h-4 w-4 mr-1.5" />
                        {role.name}
                      </h3>
                      <button className="p-1 rounded-md bg-gray-800/40 hover:bg-gray-700 transition-colors">
                        <Edit className="h-3.5 w-3.5 text-gray-400" />
                      </button>
                    </div>
                    <p className="text-sm mt-1 text-gray-300">{role.description}</p>
                    
                    <div className="mt-2 flex flex-wrap gap-1">
                      {role.permissions.map((permission, index) => (
                        <span
                          key={index}
                          className="px-1.5 py-0.5 bg-gray-800/50 text-gray-300 text-xs rounded"
                        >
                          {permission === "all" ? "Toutes les permissions" : permission}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
                
                <button className="w-full mt-2 p-2 border border-dashed border-gray-600 rounded-lg text-sm text-gray-400 hover:text-white hover:border-gray-500 transition-colors flex items-center justify-center">
                  <Plus className="h-4 w-4 mr-1.5" />
                  Créer un nouveau rôle
                </button>
              </div>
            </div>
          </div>
          
          {/* Actions recommandées */}
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
            <div className="p-4 bg-gray-750 border-b border-gray-700">
              <h2 className="text-lg font-semibold flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-yellow-400" />
                Actions recommandées
              </h2>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {lockedUsers > 0 && (
                  <div className="bg-yellow-900/20 border border-yellow-800/50 rounded-lg p-3">
                    <div className="font-medium flex items-center">
                      <Lock className="h-4 w-4 mr-1.5 text-yellow-400" />
                      Comptes verrouillés
                    </div>
                    <p className="text-sm text-gray-300 mt-1">
                      {lockedUsers} compte(s) utilisateur(s) actuellement verrouillé(s).
                    </p>
                    <button className="mt-2 text-xs bg-yellow-900/50 hover:bg-yellow-800 text-yellow-300 px-2 py-1 rounded transition-colors">
                      Examiner
                    </button>
                  </div>
                )}
                
                {users.filter(u => !u.twoFactorEnabled).length > 0 && (
                  <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-3">
                    <div className="font-medium flex items-center">
                      <Key className="h-4 w-4 mr-1.5 text-blue-400" />
                      2FA non activée
                    </div>
                    <p className="text-sm text-gray-300 mt-1">
                      {users.filter(u => !u.twoFactorEnabled).length} utilisateur(s) n&apos;ont pas activé l&apos;authentification à deux facteurs.
                    </p>
                    <button className="mt-2 text-xs bg-blue-900/50 hover:bg-blue-800 text-blue-300 px-2 py-1 rounded transition-colors">
                      Envoyer un rappel
                    </button>
                  </div>
                )}
                
                <div className="bg-green-900/20 border border-green-800/50 rounded-lg p-3">
                  <div className="font-medium flex items-center">
                    <UserCheck className="h-4 w-4 mr-1.5 text-green-400" />
                    Invitations en attente
                  </div>
                  <p className="text-sm text-gray-300 mt-1">
                    {pendingUsers} invitation(s) en attente de confirmation.
                  </p>
                  <button className="mt-2 text-xs bg-green-900/50 hover:bg-green-800 text-green-300 px-2 py-1 rounded transition-colors">
                    Renvoyer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Composant principal de la page des utilisateurs
const UsersPage = () => {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"users" | "analytics">("users");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Charge les données des utilisateurs
  useEffect(() => {
    // Simuler un chargement de données
    const timer = setTimeout(() => {
      setUsers(sampleUsers);
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // Filtre les utilisateurs
  const filteredUsers = users.filter((user) => {
    // Filtre par recherche
    const matchesSearch = 
      searchQuery === "" ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filtre par rôle
    const matchesRole = 
      roleFilter === null || user.role.id === roleFilter;
    
    // Filtre par statut
    const matchesStatus = 
      statusFilter === null || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Contenu principal */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 max-w-7xl mx-auto">
          {/* En-tête */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-xl shadow-lg mb-6 border border-gray-700"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold flex items-center">
                  <Users className="h-6 w-6 mr-2 text-blue-400" />
                  Gestion des Utilisateurs
                </h1>
                <p className="text-gray-400 mt-1">
                  Créez, modifiez et gérez les utilisateurs et leurs permissions
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher un utilisateur..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-lg py-2 px-10 text-white w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <UserPlus className="h-4 w-4 mr-1.5" />
                  Nouvel utilisateur
                </button>
              </div>
            </div>

            {/* Onglets de navigation */}
            <div className="flex space-x-1 mt-6 border-b border-gray-700">
              <button
                onClick={() => setActiveTab("users")}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === "users"
                    ? "bg-gray-800 text-white border-t border-l border-r border-gray-700"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Utilisateurs
              </button>
              <button
                onClick={() => setActiveTab("analytics")}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === "analytics"
                    ? "bg-gray-800 text-white border-t border-l border-r border-gray-700"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Statistiques & Activité
              </button>
            </div>
          </motion.div>

          {/* Dashboard d'analyse des utilisateurs */}
          <UserAnalyticsDashboard 
            users={users}
            isVisible={activeTab === "analytics"} 
          />

          {/* Liste des utilisateurs */}
          {activeTab === "users" && (
            <>
              {/* Filtres */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="mb-4 flex flex-wrap items-center gap-2"
              >
                <span className="text-sm text-gray-400 flex items-center mr-2">
                  <Filter className="h-4 w-4 mr-1.5" />
                  Filtrer par:
                </span>
                
                <select
                  value={roleFilter || ""}
                  onChange={(e) => setRoleFilter(e.target.value || null)}
                  className="bg-gray-800 border border-gray-700 rounded-lg py-1 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Tous les rôles</option>
                  {USER_ROLES.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
                
                <select
                  value={statusFilter || ""}
                  onChange={(e) => setStatusFilter(e.target.value || null)}
                  className="bg-gray-800 border border-gray-700 rounded-lg py-1 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Tous les statuts</option>
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                  <option value="pending">En attente</option>
                  <option value="locked">Verrouillé</option>
                </select>
                
                <div className="ml-auto text-sm text-gray-400">
                  {filteredUsers.length} utilisateur(s) trouvé(s)
                </div>
              </motion.div>

              {/* Grille d'utilisateurs */}
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
              ) : filteredUsers.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredUsers.map((user) => (
                    <UserCard key={user.id} user={user} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <User className="h-16 w-16 text-gray-700 mb-4" />
                  <h3 className="text-xl font-medium text-gray-400 mb-2">
                    Aucun utilisateur trouvé
                  </h3>
                  <p className="text-gray-500 max-w-md mb-6">
                    {searchQuery || roleFilter || statusFilter
                      ? "Aucun utilisateur ne correspond à vos critères de recherche"
                      : "Vous n'avez pas encore créé d'utilisateurs. Commencez maintenant !"}
                  </p>
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <UserPlus className="h-4 w-4 mr-1.5" />
                    Créer un nouvel utilisateur
                  </button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Modal de création d'utilisateur */}
      <UserCreationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default UsersPage;