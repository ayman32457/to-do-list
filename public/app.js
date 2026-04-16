const base = '/api/notes';

async function fetchNotes() {
  const res = await fetch(base);
  return res.json();
}

function el(sel, text) {
  const e = document.createElement(sel);
  if (text) e.textContent = text;
  return e;
}

function renderNotes(notes) {
  const container = document.getElementById('notes');
  container.innerHTML = '';

  notes.forEach(n => {
    const d = document.createElement('div');
    d.className = 'note';

    const h = document.createElement('div');
    h.innerHTML = `<strong>${n.title || '(no title)'}</strong>
      <small style="color:#666; margin-left:8px">
      ${n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}
      </small>`;

    d.appendChild(h);

    if (n.type === 'text') {
      const p = el('p', n.content || '');
      d.appendChild(p);
    }

    if (n.type === 'todo') {
      const wrap = document.createElement('div');

      (n.items || []).forEach(it => {
        const row = document.createElement('div');
        row.className = 'todo-item';

        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.checked = !!it.done;
        cb.disabled = true;

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

async function loadAndRender() {
  const notes = await fetchNotes();
  renderNotes(notes);
}

window.onload = () => {
  const typeSel = document.getElementById('note-type');
  const textForm = document.getElementById('text-form');
  const todoForm = document.getElementById('todo-form');
  const createBtn = document.getElementById('create');
  const addItemBtn = document.getElementById('add-item');
  const todoItems = document.getElementById('todo-items');

  function showForm(type) {
    textForm.style.display = type === 'text' ? '' : 'none';
    todoForm.style.display = type === 'todo' ? '' : 'none';
  }

  typeSel.addEventListener('change', e => showForm(e.target.value));

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

      const items = Array.from(todoItems.children).map(c => ({
        text: c.querySelector('span').textContent,
        done: false
      }));

      await fetch(base, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'todo', title, items })
      });

      todoItems.innerHTML = '';
      document.getElementById('todo-title').value = '';
    }

    document.getElementById('text-title').value = '';
    document.getElementById('text-content').value = '';

    loadAndRender();
  });

  showForm('text');
  loadAndRender();
};