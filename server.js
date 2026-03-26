const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const DATA_PATH = path.join(__dirname, 'data', 'data.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function readData() {
	try {
		const raw = fs.readFileSync(DATA_PATH, 'utf8');
		return raw ? JSON.parse(raw) : [];
	} catch (err) {
		return [];
	}
}

function writeData(data) {
	fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
	fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

// GET all notes
app.get('/api/notes', (req, res) => {
	const data = readData();
	res.json(data);
});

// POST a new note
// Body should include at least { type: 'text'|'todo', title: string, content: string } for text
// For todo: { type: 'todo', title: string, items: [{ text, done }] }
app.post('/api/notes', (req, res) => {
	const note = req.body;
	if (!note || !note.type) {
		return res.status(400).json({ error: 'Missing note body or type' });
	}

	const now = new Date().toISOString();
	const record = Object.assign({}, note, {
		id: Date.now().toString(),
		createdAt: now,
	});

	const data = readData();
	data.unshift(record);
	writeData(data);

	res.status(201).json(record);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Notes server listening on http://localhost:${PORT}`);
});

