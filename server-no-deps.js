/**
 * Enkel Node.js HTTP-server uten avhengigheter (fallback)
 * - Serverer statiske filer fra /public
 * - Gir et lite JSON-API på /api/notes for å lese/lagre notater
 *
 * Dette er laget for enkel lokal kjøring når du ikke ønsker å
 * installere ekstra pakker (Express etc.). Koden er synkron for
 * enkelhetens skyld og passer kun til små demoer.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

// Filbaner
const DATA_PATH = path.join(__dirname, 'data', 'data.json');
const PUBLIC_DIR = path.join(__dirname, 'public');

// Leser data fra JSON-filen. Returnerer tom liste ved feil.
function readData() {
  try { return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8') || '[]'); }
  catch (e) { return []; }
}

// Skriv data til fil. Oppretter mappe ved behov.
function writeData(d) {
  fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
  fs.writeFileSync(DATA_PATH, JSON.stringify(d, null, 2));
}

// Hjelpefunksjon for å sende JSON-respons
function sendJSON(res, obj, status = 200) {
  const s = JSON.stringify(obj);
  res.writeHead(status, { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(s) });
  res.end(s);
}

// Serverer statiske filer fra public-mappen.
// Finner riktig Content-Type basert på filendelse.
function serveStatic(req, res) {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  const filePath = path.join(PUBLIC_DIR, p);
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    const ext = path.extname(filePath).toLowerCase();
    const map = { '.html':'text/html', '.js':'application/javascript', '.css':'text/css', '.json':'application/json' };
    res.writeHead(200, { 'Content-Type': map[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

// Hovedserver: håndterer både API- og statiske ruter.
const server = http.createServer((req, res) => {
  // Enkelt routingsjekk: API-path starter med /api/notes
  if (req.url.startsWith('/api/notes')) {
    if (req.method === 'GET') {
      // Returner alle notater
      const data = readData();
      sendJSON(res, data);
      return;
    }
    if (req.method === 'POST') {
      // Les body (enkelt, uten stream-backpressure-håndtering)
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const note = JSON.parse(body);
          if (!note || !note.type) return sendJSON(res, { error: 'Missing note or type' }, 400);
          // Lag et record med id og timestamp
          const record = Object.assign({}, note, { id: Date.now().toString(), createdAt: new Date().toISOString() });
          const data = readData(); data.unshift(record); writeData(data);
          sendJSON(res, record, 201);
        } catch (e) {
          // Ved ugyldig JSON svar med 400
          sendJSON(res, { error: 'Invalid JSON' }, 400);
        }
      });
      return;
    }
    // Metode ikke tillatt på dette endepunktet
    res.writeHead(405); res.end('Method not allowed'); return;
  }

  // Ellers: server statisk fil
  serveStatic(req, res);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Fallback server running at http://localhost:${PORT}`));
