window.onload = async () => {
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
    remove.addEventListener('click', () => row.remove());

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

      const payload = { type: 'text', title, content };

      await fetch(base, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

    } else {
      const title = document.getElementById('todo-title').value.trim();

      const items = Array.from(todoItems.children).map(c => ({
        text: c.querySelector('span').textContent,
        done: false
      }));

      const payload = { type: 'todo', title, items };

      await fetch(base, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      todoItems.innerHTML = '';
      document.getElementById('todo-title').value = '';
    }

    document.getElementById('text-title').value = '';
    document.getElementById('text-content').value = '';

    await loadAndRender();
  });

  await loadAndRender();
};