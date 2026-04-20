# Minimal notat-app
# Minimal notat-app

Kjør serveren (ingen installasjon nødvendig for Node-fallback):

```bash
node server-no-deps.js
```

Åpne i nettleser:

http://localhost:3000

API:

- GET /api/notes
- POST /api/notes

Data lagres i `data/data.json`.

Alternativ: kjør med Python + Uvicorn (FastAPI)

1. Installer krav (anbefalt i venv):

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. Start serveren med uvicorn:

```bash
uvicorn app:app --host 0.0.0.0 --port 3000 --reload
```

Appen vil da være tilgjengelig på samme URL som over.

## Variabler (oversikt)

Her er en kort forklaring av de viktigste variablene og lokale navnene som brukes i prosjektets tre hovedfiler. Dette hjelper deg å lese koden raskere og forstå hva hver variabel representerer.

1) `public/app.js` (klient)
- `base` — API-basestien som klienten bruker ('/api/notes').
- `res` — lokal variabel i `fetchNotes()` som holder HTTP-responsen fra `fetch`.
- `sel`, `text`, `e` — parametere/variabler i hjelpefunksjonen `el(sel, text)`; `e` er det opprettede DOM-elementet.
- `notes` — parameter til `renderNotes(notes)`; listen av notat-objekter fra serveren.
- `container` — DOM-elementet (`#notes`) hvor notatene legges inn.
- `n` — variabelnavn brukt i løkken for hvert notat (enkelt notat-objekt).
- `d`, `h`, `p`, `wrap`, `row`, `cb`, `span` — lokale DOM-variabler brukt for å bygge opp hver notatvisning (div, header, paragraph, wrapper, rad, checkbox, tekstspan).
- `it` — element i en todo-liste (i `n.items`).
- `typeSel`, `textForm`, `todoForm`, `createBtn`, `addItemBtn`, `todoItems` — referanser til UI-elementene som styres ved `window.onload`.
- `input`, `val` — lokalt i add-item-håndterer, tekstfelt og det trimmede innholdet som legges til en TODO-rad.
- `title`, `content`, `items` — felter som bygges når et nytt notat opprettes og sendes i en POST-forespørsel.

2) `server-no-deps.js` (Node, null-avhengighet)
- `http`, `fs`, `path` — innebygde moduler som brukes av serveren.
- `DATA_PATH` — absolutt bane til lagringsfila `data/data.json`.
- `PUBLIC_DIR` — absolutt bane til `public`-mappen.
- `readData()` — funksjon som returnerer innholdet i `DATA_PATH` (eller tom liste ved feil).
- `writeData(d)` — funksjon som skriver JSON-innholdet `d` til `DATA_PATH`.
- `sendJSON(res, obj, status)` — hjelpefunksjon som serialiserer `obj` og sender det med HTTP-status `status`.
- `serveStatic(req, res)` — funksjon som leser og sender statiske filer; lokale variabler her inkluderer `p` (request path), `filePath`, `ext` og `map` (content-type map).
- I request-handleren: `req`, `res`, `data` (listen med notater), `body` (akkumulert request-body), `chunk` (data-chunks fra stream), `note` (JSON-parset payload), `record` (notatet som får id og createdAt).
- `PORT` — porten serveren lytter på (standard 3000 eller `process.env.PORT`).

3) `app.py` (FastAPI)
- `app` — `FastAPI`-app-instans.
- `HERE` — katalogen hvor `app.py` ligger (`os.path.dirname(__file__)`).
- `DATA_PATH` — filbane til `data/data.json` (brukes av les/skriv-hjelpere).
- Pydantic-modellene `TodoItem` og `Note` — beskriver formen på POST-body for todo-elementer og notater.
- `read_data()` — funksjon som returnerer innholdet i JSON-fila (eller tom liste ved feil).
- `write_data(data)` — skriver `data`-listen til `DATA_PATH`.
- I endpointene: `note` (parameter i `create_note`, et `Note`-objekt), `record` (det ferdige notatet som får `id` og `createdAt`), `data` (listen med notater).

Format på lagrede notater
- Hvert notat i `data/data.json` er et objekt med felter som typisk inneholder:
	- `id` — unik id (string)
	- `createdAt` — ISO-tidsstempel
	- `type` — `'text'` eller `'todo'`
	- `title` — valgfri tittel
	- `content` — (for `text`) tekstinnhold
	- `items` — (for `todo`) liste av objekter `{ text, done }`

Miljøvariabler og kjøring
- `PORT` kan settes for Node-serveren (`server-no-deps.js`) for å åpne en annen port enn 3000.
- For FastAPI styrer du port/host gjennom `uvicorn`-kommandoen (f.eks. `--host 0.0.0.0 --port 3000`).

Hvis du vil at jeg skal lage en separat `docs/variabler.md` eller legge inn kodesnutter, si fra.

## Viktigste funksjoner

Nedenfor er en kort forklaring av de viktigste funksjonene i hver fil — hva de gjør og hvor de brukes.

1) `public/app.js` (klient)
- `fetchNotes()` — henter alle notater fra serverens API (`GET /api/notes`) og returnerer et JSON-objekt.
- `el(sel, text)` — enkel hjelpefunksjon som oppretter et DOM-element (`document.createElement`) med valgfri tekstinnhold.
- `renderNotes(notes)` — tar en liste med notater (`notes`) og bygger DOM-strukturen under `#notes` for å vise hver notatpost (håndterer både tekst- og todo-typer).
- `loadAndRender()` — wrapper som kaller `fetchNotes()` og deretter `renderNotes()` for å oppdatere visningen.
- `showForm(type)` — skifter synlighet på skjemaene i UI avhengig av valgt notat-type (`text` eller `todo`).
- Event-handlere (i `window.onload`):
	- Oppsett av `addItemBtn` — legger til en rad i den midlertidige todo-listen i UI.
	- Oppsett av `createBtn` — bygger payload fra skjemaet (enten `text` eller `todo`) og POSTer til `POST /api/notes`. Oppdaterer så visningen ved å kalle `loadAndRender()`.

2) `server-no-deps.js` (Node, ingen eksterne avhengigheter)
- `readData()` — leser innholdet av `data/data.json` og returnerer det som et JavaScript-array; returnerer tom array ved feil/ikke-eksisterende fil.
- `writeData(d)` — skriver et JavaScript-array `d` til `data/data.json` (lager katalog ved behov).
- `sendJSON(res, obj, status)` — serialiserer `obj` til JSON og sender det til klienten med HTTP-status `status`.
- `serveStatic(req, res)` — serverer statiske filer fra `public/` (bestemmer `Content-Type` etter filendelse og leser filen med `fs.readFile`).
- Hovedserver-handler (`http.createServer`):
	- Ruter `GET /api/notes` til `readData()` og sender resultatet.
	- Ruter `POST /api/notes` til koden som akkumulerer body, parse'r JSON, oppretter en `record` (med `id` og `createdAt`), forfatter til fil via `writeData()` og returnerer 201 med den nye posten.
	- Alle andre pather leveres som statiske filer via `serveStatic()`.

3) `app.py` (FastAPI)
- `read_data()` — leser og returnerer innholdet i `data/data.json` (eller tom liste ved feil).
- `write_data(data)` — skriver listestrukturen `data` til JSON-fila på disken.
- `get_notes()` — FastAPI-endpoint (`GET /api/notes`) som returnerer data fra `read_data()`.
- `create_note(note: Note)` — FastAPI-endpoint (`POST /api/notes`) som validerer et `Note`-objekt (Pydantic), legger til `id` og `createdAt`, skriver det til fil via `write_data()` og returnerer den opprettede posten.
- `TodoItem` og `Note` — Pydantic-modeller som beskriver formen på et todo-item og et notat; disse brukes for automatisk validering av POST-body.

Kort eksempel (dataformat)
```json
{
	"id": "1651234567890",
	"createdAt": "2026-04-17T12:34:56.789Z",
	"type": "todo",
	"title": "Handleliste",
	"items": [{ "text": "Melk", "done": false }]
}
```

Vil du at jeg også legger til små referanser til linjenummer eller direkte kodesnutter ved siden av hver funksjonsbeskrivelse (for eksempel `public/app.js:15-25`), eller er denne oversikten nok for innleveringen din?


