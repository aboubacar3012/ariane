// Types pour le système de gestion des variables d'environnement
export type EnvironmentType = "development" | "staging" | "production" | "testing";
export type AccessLevel = "read" | "write" | "admin";

export interface Secret {
  id: string;
  name: string;
  value: string;
  projectId: string;
  environmentType: EnvironmentType;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  secretCount: number;
  environments: EnvironmentType[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: AccessLevel;
  projects: string[]; // IDs des projets auxquels l'utilisateur a accès
}

export interface Token {
  id: string;
  projectId: string;
  value: string;
  status: "valid" | "expired" | "none";
  expiresIn: string;
  createdAt: string;
}