Base de données
# Création des migrations Prisma
npx prisma migrate dev --name "initial-migration"

# Génération du client Prisma
npx prisma generate

# Chargement des données de test (si nécessaire)
npx prisma db seed

# Interface d'administration Prisma
npx prisma studio
