// Plugin Vite pour gérer les routes API en développement local
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function vitePluginApi() {
  return {
    name: 'vite-plugin-api',
    configureServer(server) {
      server.middlewares.use('/api', async (req, res, next) => {
        try {
          // Gérer les requêtes OPTIONS (preflight CORS)
          if (req.method === 'OPTIONS') {
            res.writeHead(200, {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'POST, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type',
              'Content-Type': 'application/json'
            });
            res.end();
            return;
          }

          // Extraire le chemin de l'API (ex: /api/contact -> contact, ou /contact si déjà monté sur /api)
          let apiPath = req.url.replace(/^\/api\//, '').split('?')[0];
          if (!apiPath || apiPath === '/') {
            apiPath = 'contact'; // Par défaut
          }
          const apiFile = join(__dirname, 'api', `${apiPath}.js`);

          // Vérifier que le fichier existe
          if (!fs.existsSync(apiFile)) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              success: false,
              error: 'Not found',
              message: `API route /api/${apiPath} not found`
            }));
            return;
          }

          // Lire le body de la requête
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });

          req.on('end', async () => {
            try {
              // Parser le body
              let parsedBody = {};
              if (body) {
                try {
                  parsedBody = JSON.parse(body);
                } catch (e) {
                  // Si ce n'est pas du JSON, essayer de parser comme form data
                  parsedBody = body;
                }
              }

              // Créer un objet req compatible avec Vercel
              const vercelReq = {
                method: req.method,
                body: parsedBody,
                headers: req.headers,
                query: Object.fromEntries(new URL(req.url, `http://${req.headers.host}`).searchParams)
              };

              // Créer un objet res compatible avec Vercel
              const vercelRes = {
                statusCode: 200,
                headers: {},
                setHeader: (key, value) => {
                  res.setHeader(key, value);
                },
                status: (code) => {
                  vercelRes.statusCode = code;
                  return vercelRes;
                },
                json: (data) => {
                  res.writeHead(vercelRes.statusCode, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify(data));
                },
                end: () => {
                  res.writeHead(vercelRes.statusCode);
                  res.end();
                }
              };

              // Charger et exécuter le handler (CommonJS)
              delete require.cache[require.resolve(apiFile)];
              const handlerModule = require(apiFile);
              
              // Le handler peut être exporté de différentes façons
              const handler = handlerModule.default || handlerModule.handler || handlerModule;
              
              // Exécuter le handler
              if (typeof handler === 'function') {
                await handler(vercelReq, vercelRes);
              } else {
                throw new Error('Handler non valide');
              }
            } catch (error) {
              console.error('Erreur dans le handler API:', error);
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({
                success: false,
                error: 'Erreur serveur',
                message: error.message || 'Une erreur est survenue lors du traitement de la requête'
              }));
            }
          });
        } catch (error) {
          console.error('Erreur API middleware:', error);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            error: 'Erreur serveur',
            message: error.message || 'Une erreur est survenue'
          }));
        }
      });
    }
  };
}

