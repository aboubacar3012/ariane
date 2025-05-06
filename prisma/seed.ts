// prisma/seed.ts

import { ServerStatus } from '@prisma/client';
import prisma from '../prisma';


async function main() {
  // Création de données de serveur VPS
  const serverSpecs1 = await prisma.serverSpecs.upsert({
    where: { id: 'spec-1' },
    update: {},
    create: {
      id: 'spec-1',
      cpu: 4,
      ram: 8,
      storage: 250,
      os: 'Ubuntu 22.04 LTS',
    },
  });

  const serverSpecs2 = await prisma.serverSpecs.upsert({
    where: { id: 'spec-2' },
    update: {},
    create: {
      id: 'spec-2',
      cpu: 8,
      ram: 16,
      storage: 500,
      os: 'Debian 11',
    },
  });

  // Additional specs for new servers
  const serverSpecs3 = await prisma.serverSpecs.upsert({
    where: { id: 'spec-3' },
    update: {},
    create: {
      id: 'spec-3',
      cpu: 4,
      ram: 8,
      storage: 100,
      os: 'Ubuntu 22.04',
    },
  });

  const serverSpecs4 = await prisma.serverSpecs.upsert({
    where: { id: 'spec-4' },
    update: {},
    create: {
      id: 'spec-4',
      cpu: 8,
      ram: 16,
      storage: 500,
      os: 'Debian 11',
    },
  });

  const serverSpecs5 = await prisma.serverSpecs.upsert({
    where: { id: 'spec-5' },
    update: {},
    create: {
      id: 'spec-5',
      cpu: 2,
      ram: 4,
      storage: 50,
      os: 'CentOS 8',
    },
  });

  const serverSpecs6 = await prisma.serverSpecs.upsert({
    where: { id: 'spec-6' },
    update: {},
    create: {
      id: 'spec-6',
      cpu: 2,
      ram: 4,
      storage: 80,
      os: 'AlmaLinux 9',
    },
  });

  const serverSpecs7 = await prisma.serverSpecs.upsert({
    where: { id: 'spec-7' },
    update: {},
    create: {
      id: 'spec-7',
      cpu: 4,
      ram: 8,
      storage: 120,
      os: 'Ubuntu 20.04',
    },
  });

  const vps1 = await prisma.vPS.upsert({
    where: { id: 'vps-1' },
    update: {},
    create: {
      id: 'vps-1',
      name: 'Production Server',
      status: ServerStatus.running,
      ip: '192.168.1.101',
      specsId: serverSpecs1.id,
      uptime: 99.98,
      healthScore: 98.5,
    },
  });

  const vps2 = await prisma.vPS.upsert({
    where: { id: 'vps-2' },
    update: {},
    create: {
      id: 'vps-2',
      name: 'Staging Server',
      status: ServerStatus.running,
      ip: '192.168.1.102',
      specsId: serverSpecs2.id,
      uptime: 99.45,
      healthScore: 95.8,
    },
  });

  // New server data
  const vps3 = await prisma.vPS.upsert({
    where: { id: 'vps-001' },
    update: {},
    create: {
      id: 'vps-001',
      name: 'Web Server Prod',
      status: ServerStatus.running,
      ip: '192.168.1.101',
      specsId: serverSpecs3.id,
      uptime: 720,
      healthScore: 98,
      createdAt: new Date('2025-01-10T14:30:00'),
    },
  });

  const vps4 = await prisma.vPS.upsert({
    where: { id: 'vps-002' },
    update: {},
    create: {
      id: 'vps-002',
      name: 'Database Master',
      status: ServerStatus.running,
      ip: '192.168.1.102',
      specsId: serverSpecs4.id,
      uptime: 1200,
      healthScore: 96,
      createdAt: new Date('2024-12-05T09:15:00'),
    },
  });

  const vps5 = await prisma.vPS.upsert({
    where: { id: 'vps-003' },
    update: {},
    create: {
      id: 'vps-003',
      name: 'Dev Environment',
      status: ServerStatus.stopped,
      ip: '192.168.1.103',
      specsId: serverSpecs5.id,
      uptime: 0,
      healthScore: 100,
      createdAt: new Date('2025-02-20T11:45:00'),
    },
  });

  const vps6 = await prisma.vPS.upsert({
    where: { id: 'vps-004' },
    update: {},
    create: {
      id: 'vps-004',
      name: 'Test Server',
      status: ServerStatus.error,
      ip: '192.168.1.104',
      specsId: serverSpecs6.id,
      uptime: 48,
      healthScore: 45,
      createdAt: new Date('2025-03-15T16:20:00'),
    },
  });

  const vps7 = await prisma.vPS.upsert({
    where: { id: 'vps-005' },
    update: {},
    create: {
      id: 'vps-005',
      name: 'Staging Server',
      status: ServerStatus.restarting,
      ip: '192.168.1.105',
      specsId: serverSpecs7.id,
      uptime: 360,
      healthScore: 87,
      createdAt: new Date('2025-01-30T08:50:00'),
    },
  });

  console.log({ 
    serverSpecs1, serverSpecs2, serverSpecs3, serverSpecs4, serverSpecs5, serverSpecs6, serverSpecs7, 
    vps1, vps2, vps3, vps4, vps5, vps6, vps7 
  });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    // close Prisma Client at the end
    prisma.$disconnect().catch((e: unknown) => {
      console.error('Failed to disconnect Prisma Client:', e);
    });
  });