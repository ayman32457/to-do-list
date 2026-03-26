# Notes & Todo App

Simple notes application with a REST API and a small client.

Features
- Create text notes and todo-lists (POST)
- List saved notes and todo-lists (GET)
- Data persisted to a JSON file at `data/data.json`

Start (minimal)

Kjør alt med én kommando (ingen installasjon nødvendig):

```
node server-no-deps.js
```

Serveren vil serve klienten på `http://localhost:3000` og API-et på `/api/notes`.

API examples

- Get all notes:

  ```sh
  curl http://localhost:3000/api/notes
  ```

- Create a text note:

  ```sh
  curl -X POST http://localhost:3000/api/notes \
    -H "Content-Type: application/json" \
    -d '{"type":"text","title":"Hello","content":"This is a note"}'
  ```

- Create a todo list:

  ```sh
  curl -X POST http://localhost:3000/api/notes \
    -H "Content-Type: application/json" \
    -d '{"type":"todo","title":"Groceries","items":[{"text":"Milk","done":false},{"text":"Eggs","done":false}]}'
  ```

Notes on development
- The server is a minimal Express app that persists notes to `data/data.json`.
- The client (in `public/`) is a tiny single-page UI that uses `fetch()` to talk to the API.

Next steps / improvements
- Add validation and better error handling
- Add update/delete endpoints (PUT/DELETE)
- Add user separation and authentication

Run without installing dependencies

If you cannot (or don't want to) install Node packages you can run the included fallback server which uses only Node built-ins:

```
node server-no-deps.js
```

This serves the same client and API on port 3000.
