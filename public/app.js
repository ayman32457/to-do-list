/*
 * Client-side JS for the minimal notes app.
 * - Henter notater fra /api/notes
 * - Rendreer notater i DOM
 * - Lar bruker opprette tekstnotater og todo-lister
 *
 * Kommentarer er skrevet på norsk for å forklare hver del.
 */

// Base-URL for API
const base = '/api/notes';

// Henter alle notater fra serveren og returnerer som JSON
async function fetchNotes() {
  const res = await fetch(base);
  return res.json();
}

// Enkel hjelpefunksjon for å lage et element med valgfri tekst
function el(sel, text) {
  const e = document.createElement(sel);
  if (text) e.textContent = text;
  return e;
}

// Render-funksjon: tar en liste med notater og bygger DOM
function renderNotes(notes) {
  const container = document.getElementById('notes');
  container.innerHTML = ''; // tøm før rendering

  notes.forEach(n => {
    const d = document.createElement('div');
    d.className = 'note';

    // Topp: tittel + timestamp
    const h = document.createElement('div');
    h.innerHTML = `<strong>${n.title || '(no title)'}</strong>
      <small style="color:#666; margin-left:8px">
      ${n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}
      </small>`;
    d.appendChild(h);

    // Hvis tekstnotat: vis innhold
    if (n.type === 'text') {
      const p = el('p', n.content || '');
      d.appendChild(p);
    }

    // Hvis todo-liste: bygg opp liste med sjekkbokser (disabled)
    if (n.type === 'todo') {
      const wrap = document.createElement('div');

      (n.items || []).forEach(it => {
        const row = document.createElement('div');
        row.className = 'todo-item';

        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.checked = !!it.done;
        cb.disabled = true; // kun visning i denne versjonen

        const span = el('span', it.text || '');

        row.appendChild(cb);
        row.appendChild(span);
        wrap.appendChild(row);
      });

      d.appendChild(wrap);
    }

    container.appendChild(d);
  });
}

// Hent og render notes
async function loadAndRender() {
  const notes = await fetchNotes();
  renderNotes(notes);
}

// Når vinduet er lastet: sett opp event handlers for UI
window.onload = () => {
  const typeSel = document.getElementById('note-type');
  const textForm = document.getElementById('text-form');
  const todoForm = document.getElementById('todo-form');
  const createBtn = document.getElementById('create');
  const addItemBtn = document.getElementById('add-item');
  const todoItems = document.getElementById('todo-items');

  // Vis/skjul skjema basert på valgt type
  function showForm(type) {
    textForm.style.display = type === 'text' ? '' : 'none';
    todoForm.style.display = type === 'todo' ? '' : 'none';
  }

  typeSel.addEventListener('change', e => showForm(e.target.value));

  // Legg til et nytt todo-item i UI (lokalt, før lagring)
  addItemBtn.addEventListener('click', () => {
    const input = document.getElementById('new-todo-item');
    const val = input.value.trim();
    if (!val) return;

    const row = document.createElement('div');
    row.className = 'todo-item';

    const span = document.createElement('span');
    span.textContent = val;

    const remove = document.createElement('button');
    remove.textContent = 'Remove';
    remove.onclick = () => row.remove();

    row.appendChild(span);
    row.appendChild(remove);
    todoItems.appendChild(row);

    input.value = '';
  });

  // Når bruker klikker 'create': bygg payload og POST til API
  createBtn.addEventListener('click', async () => {
    const type = typeSel.value;

    if (type === 'text') {
      const title = document.getElementById('text-title').value.trim();
      const content = document.getElementById('text-content').value.trim();

      await fetch(base, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'text', title, content })
      });
    }

    if (type === 'todo') {
      const title = document.getElementById('todo-title').value.trim();

      // Les oppgaver fra midlertidig UI-listen
      const items = Array.from(todoItems.children).map(c => ({
        text: c.querySelector('span').textContent,
        done: false
      }));

      await fetch(base, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'todo', title, items })
      });

      // Tøm midlertidig liste etter lagring
      todoItems.innerHTML = '';
      document.getElementById('todo-title').value = '';
    }

    // Tøm tekstskjema
    document.getElementById('text-title').value = '';
    document.getElementById('text-content').value = '';

    // Oppdater visning
    loadAndRender();
  });

  // Sett initial state og last notes
  showForm('text');
  loadAndRender();
};