"use client";;
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Server,
  Rocket,
  Database,
  ArrowRight,
  Globe,
  Shield,
  Cloud,
} from "lucide-react";

export default function Home() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 70 } },
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Hero section with animated background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_50%_10%,#1e40af20,transparent)]"></div>
      </div>

      {/* Main content */}
      <main className="relative z-10 flex flex-col items-center justify-center w-full max-w-5xl px-8 py-4 gap-8 text-center">
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", damping: 12 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="relative mb-2">
            <motion.div
              className="absolute -inset-1 rounded-full blur-md bg-blue-500/20"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.5, 0.7, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </div>

          <h1 className="text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
            Ariane
          </h1>

          <p className="text-xl text-gray-300 max-w-2xl">
            Votre plateforme centralisée pour la gestion de serveurs,
            déploiements et environnements
          </p>

          <motion.div
            className="flex flex-wrap justify-center gap-3 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {["Déploiement", "Monitoring", "Backups", "Sécurité"].map(
              (tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-sm bg-blue-900/40 rounded-full border border-blue-700/30"
                >
                  {tag}
                </span>
              )
            )}
          </motion.div>
        </motion.div>

        {/* Features grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 my-2 w-full"
        >
          <motion.div
            variants={item}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 p-6 border border-gray-700 hover:border-blue-500 transition-colors duration-300"
            whileHover={{ y: -5 }}
          >
            <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 to-blue-700 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            <Server className="w-14 h-14 text-blue-400 mb-4 group-hover:text-blue-300 transition-colors m-auto" />
            <h2 className="text-xl font-semibold mb-3">Gestion des Serveurs</h2>
            <p className="text-gray-400">
              Surveillez et gérez vos serveurs VPS avec un contrôle total et en
              temps réel
            </p>
          </motion.div>

          <motion.div
            variants={item}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 p-6 border border-gray-700 hover:border-blue-500 transition-colors duration-300"
            whileHover={{ y: -5 }}
          >
            <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 to-blue-700 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            <Rocket className="w-14 h-14 text-blue-400 mb-4 group-hover:text-blue-300 transition-colors m-auto" />
            <h2 className="text-xl font-semibold mb-3">Déploiements</h2>
            <p className="text-gray-400">
              Automatisez et simplifiez le déploiement de vos applications en
              quelques clics
            </p>
          </motion.div>

          <motion.div
            variants={item}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 p-6 border border-gray-700 hover:border-blue-500 transition-colors duration-300"
            whileHover={{ y: -5 }}
          >
            <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 to-blue-700 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            <Database className="w-14 h-14 text-blue-400 mb-4 group-hover:text-blue-300 transition-colors m-auto" />
            <h2 className="text-xl font-semibold mb-3">
              Backups & Environnement
            </h2>
            <p className="text-gray-400">
              Protection de vos données et gestion intuitive des variables
              d&apos;environnement
            </p>
          </motion.div>
        </motion.div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, type: "spring" }}
          className="relative mt-4 w-full max-w-md"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>

          <div className="relative flex flex-col items-center p-8 bg-gray-900 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Prêt à commencer?</h3>
            <p className="text-gray-400 mb-6 text-center">
              Accédez à votre espace de gestion pour contrôler tous vos services
            </p>

            <Link href="/signin" passHref>
              <motion.button
                className="flex items-center justify-center gap-2 w-full py-3 px-6 font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span>Se connecter</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-8 mt-auto text-center text-gray-400 text-sm border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center gap-8 mb-4">
            {[Shield, Cloud, Globe].map((Icon, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.2, rotate: 5, color: "#3b82f6" }}
                className="text-gray-500 transition-colors"
              >
                <Icon className="w-5 h-5" />
              </motion.div>
            ))}
          </div>
          <p>© {new Date().getFullYear()} Ariane - Tous droits réservés</p>
        </div>
      </footer>
    </div>
  );
}
