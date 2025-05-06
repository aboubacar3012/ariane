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

