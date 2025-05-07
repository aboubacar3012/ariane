"use client";
import { GitPullRequest, Github, Database, Home, Server, Rocket, Users, Settings } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const [isGithubOpen, setIsGithubOpen] = useState(false);
  const pathname = usePathname();

  return (
    <motion.aside
      className="w-64 bg-gray-800 p-4"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <motion.h1
        className="text-xl font-bold mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Ariane
      </motion.h1>
      <nav>
        <ul className="space-y-4">
          <Link href="/dashboard" passHref>
            <motion.li
              className={`flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-700 rounded transition-colors ${
                pathname === "/dashboard" ? "bg-blue-600/20 text-blue-400" : ""
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Home className="w-5 h-5" />
              <span>Dashboard</span>
            </motion.li>
          </Link>
          <motion.li layout>
            <motion.div
              className={`flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-700 rounded ${
                pathname.includes("/github")
                  ? "bg-blue-600/20 text-blue-400"
                  : ""
              }`}
              onClick={() => setIsGithubOpen(!isGithubOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Github className="w-5 h-5" />
              <span>GitHub</span>
            </motion.div>
            <AnimatePresence>
              {isGithubOpen && (
                <motion.ul
                  className="pl-7 mt-2 space-y-2"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link href="/dashboard" passHref>
                    <motion.li
                      className={`flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-700 rounded ${
                        pathname === "/dashboard"
                          ? "bg-blue-600/20 text-blue-400"
                          : ""
                      }`}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -20, opacity: 0 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <GitPullRequest className="w-4 h-4" />
                      <span>Pull Requests</span>
                    </motion.li>
                  </Link>
                </motion.ul>
              )}
            </AnimatePresence>
          </motion.li>

          {/* Servers VPS Link */}
          <Link href="/servers" passHref>
            <motion.li
              className={`flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-700 rounded transition-colors ${
                pathname === "/servers" || pathname.includes("/servers") 
                  ? "bg-blue-600/20 text-blue-400" 
                  : ""
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Server className="w-5 h-5" />
              <span>Serveurs VPS</span>
            </motion.li>
          </Link>

          {/* Deployments Link */}
          <Link href="/deployments" passHref>
            <motion.li
              className={`flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-700 rounded transition-colors ${
                pathname === "/deployments" || pathname.includes("/deployments")
                  ? "bg-blue-600/20 text-blue-400"
                  : ""
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Rocket className="w-5 h-5" />
              <span>Déploiements</span>
            </motion.li>
          </Link>

          {/* Users Link */}
          <Link href="/users" passHref>
            <motion.li
              className={`flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-700 rounded transition-colors ${
                pathname === "/users" || pathname.includes("/users")
                  ? "bg-blue-600/20 text-blue-400"
                  : ""
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Users className="w-5 h-5" />
              <span>Utilisateurs</span>
            </motion.li>
          </Link>

          {/* Database Backup Link */}
          <Link href="/backup" passHref>
            <motion.li
              className={`flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-700 rounded transition-colors ${
                pathname === "/backup" ? "bg-blue-600/20 text-blue-400" : ""
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Database className="w-5 h-5" />
              <span>Backups BDD</span>
            </motion.li>
          </Link>

          {/* Environment Variables Link */}
          <Link href="/environment" passHref>
            <motion.li
              className={`flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-700 rounded transition-colors ${
                pathname === "/environment" || pathname.includes("/environment")
                  ? "bg-blue-600/20 text-blue-400"
                  : ""
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Settings className="w-5 h-5" />
              <span>Environnement</span>
            </motion.li>
          </Link>
        </ul>
      </nav>
    </motion.aside>
  );
};

export default Sidebar;
