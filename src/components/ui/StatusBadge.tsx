import React from "react";
import { CheckCircle, HardDrive, RefreshCw, AlertTriangle } from "lucide-react";

export type ServerStatus = "running" | "stopped" | "restarting" | "pending" | "error";

interface StatusBadgeProps {
  status: ServerStatus;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
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

export default StatusBadge;