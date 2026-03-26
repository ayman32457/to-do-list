
# Todo API

## Hva er dette?

Dette er en enkel todo-applikasjon som består av:

* en server (API)
* en klient (terminalprogram)

Serveren lagrer todo-lister i en JSON-fil, og klienten henter og sender data til serveren.



 Hvordan starte prosjektet

 1. Installer avhengigheter

Kjør i terminal:


npm install express


### 2. Start serveren


node server.js


 3. Start klienten (i en ny terminal)


node client.js




 Hvordan bruke klienten

Når du starter klienten får du en meny:


1: Hent alle
2: Hent en
3: Ny todo
4: Exit


 1. Hent alle

Viser alle todo-lister (id og title)

 2. Hent en

Skriv inn id for å hente en spesifikk todo

3. Ny todo

Oppretter en ny todo med:

 tittel
 én oppgave



 API

 GET /todos

Henter alle todo-lister (id og title)

 GET /todos/:id

Henter én todo basert på id

 POST /todos

Oppretter en ny todo



 Lagring

Alle todo-lister lagres i filen:


todos.json


Når du lager en ny todo, blir filen oppdatert automatisk.



 Kort oppsummert

 Server håndterer data
 Klient sender forespørsler
 Data lagres i JSON-fil