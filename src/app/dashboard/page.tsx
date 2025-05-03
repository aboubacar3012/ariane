"use client";

import { useState, useEffect } from "react";

import { DashboardContent, GithubAuth } from "./_components";
import Sidebar from "@/src/components/Sidebar";

const DashboardPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [, setGithubToken] = useState<string | null>(null);

  // Vérifier si un token existe déjà dans localStorage lors du chargement de la page
  useEffect(() => {
    const storedToken = localStorage.getItem("github_token");
    if (storedToken) {
      setGithubToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  // Gérer la soumission du token GitHub
  const handleTokenSubmit = (token: string) => {
    // Stocker le token dans localStorage
    localStorage.setItem("github_token", token);
    setGithubToken(token);
    setIsAuthenticated(true);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {!isAuthenticated ? (
            <GithubAuth onTokenSubmit={handleTokenSubmit} />
          ) : (
            <DashboardContent />
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
