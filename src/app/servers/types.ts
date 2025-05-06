export interface VPSServer {
  id: string;
  name: string;
  status: "running" | "stopped" | "restarting" | "pending" | "error";
  ip: string;
  location: string;
  specs: {
    cpu: number;
    ram: number;
    storage: number;
    os: string;
  };
  uptime: number;
  healthScore: number; 
  createdAt: string;
}

// Données d'exemple pour les démonstrations
export const sampleServers: VPSServer[] = [
  {
    id: "vps-001",
    name: "Web Server Prod",
    status: "running",
    ip: "192.168.1.101",
    location: "Paris",
    specs: {
      cpu: 4,
      ram: 8,
      storage: 100,
      os: "Ubuntu 22.04",
    },
    uptime: 720,
    healthScore: 98,
    createdAt: "2025-01-10T14:30:00",
  },
  {
    id: "vps-002",
    name: "Database Master",
    status: "running",
    ip: "192.168.1.102",
    location: "Frankfurt",
    specs: {
      cpu: 8,
      ram: 16,
      storage: 500,
      os: "Debian 11",
    },
    uptime: 1200,
    healthScore: 96,
    createdAt: "2024-12-05T09:15:00",
  },
  {
    id: "vps-003",
    name: "Dev Environment",
    status: "stopped",
    ip: "192.168.1.103",
    location: "Amsterdam",
    specs: {
      cpu: 2,
      ram: 4,
      storage: 50,
      os: "CentOS 8",
    },
    uptime: 0,
    healthScore: 100,
    createdAt: "2025-02-20T11:45:00",
  },
  {
    id: "vps-004",
    name: "Test Server",
    status: "error",
    ip: "192.168.1.104",
    location: "London",
    specs: {
      cpu: 2,
      ram: 4,
      storage: 80,
      os: "AlmaLinux 9",
    },
    uptime: 48,
    healthScore: 45,
    createdAt: "2025-03-15T16:20:00",
  },
  {
    id: "vps-005",
    name: "Staging Server",
    status: "restarting",
    ip: "192.168.1.105",
    location: "Madrid",
    specs: {
      cpu: 4,
      ram: 8,
      storage: 120,
      os: "Ubuntu 20.04",
    },
    uptime: 360,
    healthScore: 87,
    createdAt: "2025-01-30T08:50:00",
  },
];