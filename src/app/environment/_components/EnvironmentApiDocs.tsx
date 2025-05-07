import React from "react";

/**
 * Composant qui fournit la documentation sur l'utilisation des variables d'environnement via l'API
 */
const EnvironmentApiDocs = () => {
  return (
    <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg p-6 shadow-md">
      <h2 className="text-xl font-bold mb-4 text-blue-400">
        Documentation API - Variables d&apos;environnement
      </h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2 text-white">
            Présentation
          </h3>
          <p className="text-gray-300">
            Notre API vous permet d&apos;accéder à vos variables d&apos;environnement de
            manière sécurisée à partir de vos applications. Utilisez le token
            généré pour authentifier vos requêtes.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2 text-white">Prérequis</h3>
          <ul className="list-disc pl-6 text-gray-300 space-y-1">
            <li>Un projet configuré sur Atlas</li>
            <li>
              Un token d&apos;API valide (généré dans l&apos;onglet &quot;Tokens d&apos;accès&quot;)
            </li>
            <li>Les variables d&apos;environnement configurées pour votre projet</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2 text-white">
            Exemples d&apos;utilisation
          </h3>

          <div className="space-y-4">
            <div>
              <h4 className="text-md font-medium mb-1 text-blue-300">
                Récupérer toutes les variables d&apos;un projet
              </h4>
              <div className="bg-gray-900 p-4 rounded-md overflow-auto">
                <pre className="text-gray-300 text-sm">
                  <code>{`// En utilisant fetch
fetch('https://api.atlascloud.io/env/secrets', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer VOTRE_TOKEN'
  }
})
.then(response => response.json())
.then(data => console.log(data));

// En utilisant axios
import axios from 'axios';

axios.get('https://api.atlascloud.io/env/secrets', {
  headers: {
    'Authorization': 'Bearer VOTRE_TOKEN'
  }
})
.then(response => console.log(response.data));`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h4 className="text-md font-medium mb-1 text-blue-300">
                Récupérer les variables d&apos;un environnement spécifique
              </h4>
              <div className="bg-gray-900 p-4 rounded-md overflow-auto">
                <pre className="text-gray-300 text-sm">
                  <code>{`// Environnement de production
fetch('https://api.atlascloud.io/env/secrets?environment=production', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer VOTRE_TOKEN'
  }
});

// Environnement de développement
fetch('https://api.atlascloud.io/env/secrets?environment=development', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer VOTRE_TOKEN'
  }
});`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h4 className="text-md font-medium mb-1 text-blue-300">
                Utilisation dans un script de déploiement
              </h4>
              <div className="bg-gray-900 p-4 rounded-md overflow-auto">
                <pre className="text-gray-300 text-sm">
                  <code>{`#!/bin/bash

# Récupération des variables d'environnement
ENV_VARS=$(curl -s -H "Authorization: Bearer VOTRE_TOKEN" https://api.atlascloud.io/env/secrets?environment=production)

# Création du fichier .env
echo "# Fichier généré automatiquement le $(date)" > .env

# Traitement des variables et écriture dans le fichier
echo $ENV_VARS | jq -r '.secrets[] | .name + "=" + .value' >> .env

echo "Variables d'environnement chargées avec succès"`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h4 className="text-md font-medium mb-1 text-blue-300">
                Intégration avec Node.js
              </h4>
              <div className="bg-gray-900 p-4 rounded-md overflow-auto">
                <pre className="text-gray-300 text-sm">
                  <code>{`// env-loader.js
const axios = require('axios');
const fs = require('fs');

async function loadEnvironmentVariables() {
  try {
    const response = await axios.get('https://api.atlascloud.io/env/secrets', {
      headers: {
        'Authorization': 'Bearer VOTRE_TOKEN'
      }
    });
    
    // Charger les variables dans process.env
    const secrets = response.data.secrets;
    secrets.forEach(secret => {
      process.env[secret.name] = secret.value;
    });
    
    console.log('Variables d\'environnement chargées avec succès');
  } catch (error) {
    console.error('Erreur lors du chargement des variables d\'environnement:', error.message);
  }
}

module.exports = { loadEnvironmentVariables };`}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2 text-white">
            Considérations de sécurité
          </h3>
          <ul className="list-disc pl-6 text-gray-300 space-y-1">
            <li>
              Ne stockez jamais le token d&apos;API dans votre code source ou
              fichiers publics
            </li>
            <li>
              Utilisez des variables d&apos;environnement pour stocker le token
            </li>
            <li>Limitez les permissions du token au minimum nécessaire</li>
            <li>Renouvelez régulièrement vos tokens</li>
            <li>
              Pour les applications frontend, utilisez une API proxy pour éviter
              d&apos;exposer vos tokens
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2 text-white">Support</h3>
          <p className="text-gray-300">
            Si vous rencontrez des problèmes avec l&apos;API, consultez notre
            documentation complète ou contactez notre équipe de support à
            support@atlascloud.io.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentApiDocs;
