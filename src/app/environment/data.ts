import { Project, Secret, Token } from "./types";

export const sampleProjects: Project[] = [
  {
    id: "p1",
    name: "E-commerce API",
    description: "Backend services for our e-commerce platform",
    secretCount: 12,
    environments: ["development", "staging", "production"],
  },
  {
    id: "p2",
    name: "CRM Dashboard",
    description: "Customer relationship management system",
    secretCount: 8,
    environments: ["development", "production"],
  },
  {
    id: "p3",
    name: "Mobile App Backend",
    description: "API services for iOS and Android apps",
    secretCount: 15,
    environments: ["development", "staging", "production", "testing"],
  },
];

export const sampleSecrets: Secret[] = [
  {
    id: "s1",
    name: "DATABASE_URL",
    value: "postgres://user:password@localhost:5432/mydb",
    projectId: "p1",
    environmentType: "development",
    createdAt: "2025-04-20T10:00:00Z",
    updatedAt: "2025-05-01T08:30:00Z",
    createdBy: "admin@example.com",
  },
  {
    id: "s2",
    name: "API_KEY",
    value: "sk_test_51AbC1234567890abcdefghijklmnopqrstuvwxyz",
    projectId: "p1",
    environmentType: "development",
    createdAt: "2025-04-21T11:20:00Z",
    updatedAt: "2025-04-21T11:20:00Z",
    createdBy: "admin@example.com",
  },
  {
    id: "s3",
    name: "JWT_SECRET",
    value: "very-secure-jwt-secret-key-for-production",
    projectId: "p1",
    environmentType: "production",
    createdAt: "2025-04-22T09:15:00Z",
    updatedAt: "2025-05-02T14:45:00Z",
    createdBy: "admin@example.com",
  },
];

export const sampleTokens: Token[] = [
  {
    id: "t1",
    projectId: "p1",
    value: "sk_live_xyz123456789abcdefghijklmnopqrstuvwxyz",
    status: "valid",
    expiresIn: "3h12m",
    createdAt: "2025-05-06T10:00:00Z",
  },
  {
    id: "t2", // New token for project p1
    projectId: "p1",
    value: "sk_live_abc987654321zyxwutsrqponmlkjihgfedcb",
    status: "valid",
    expiresIn: "7h45m",
    createdAt: "2025-05-07T14:30:00Z",
  },
];
