"use client";

import { DashboardContent, GithubAuth } from "./_components";
import Sidebar from "@/src/components/Sidebar";
import useGithubToken from "@/src/hooks/useGithubToken";

const DashboardPage = () => {
  const { isAuthenticated, setToken } = useGithubToken();

  // Gérer la soumission du token GitHub
  const handleTokenSubmit = (newToken: string) => {
    setToken(newToken);
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
