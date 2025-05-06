"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Server, HardDrive, Cpu, MemoryStick, Globe, Shield, Trash2 } from "lucide-react";
import { VPSServer } from "../types";
import StatusBadge from "@/src/components/ui/StatusBadge";

// Server Card component
const ServerCard = ({ server }: { server: VPSServer }) => {
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

        <div className="grid grid-cols-1 gap-2 text-sm mb-4">
          <div className="flex items-center text-gray-400">
            <Globe className="h-4 w-4 mr-1.5 text-gray-500" />
            <span>{server.ip}</span>
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

        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 pt-4 border-t border-gray-700"
          >
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400 mb-1">
                  Système d&apos;exploitation
                </p>
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
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ServerCard;
