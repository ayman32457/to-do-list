from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Any
import json
import os
from fastapi.middleware.cors import CORSMiddleware

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os


app.mount("/public", StaticFiles(directory="public"), name="public")

HERE = os.path.dirname(__file__)
DATA_PATH = os.path.join(HERE, 'data', 'data.json')

app = FastAPI(title="Minimal Notes API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return FileResponse("public/index.html")

class TodoItem(BaseModel):
    text: str
    done: Optional[bool] = False


class Note(BaseModel):
    type: str
    title: Optional[str] = None
    content: Optional[str] = None
    items: Optional[List[TodoItem]] = None


def read_data() -> List[Any]:
    try:
        with open(DATA_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return []


def write_data(data: List[Any]):
    os.makedirs(os.path.dirname(DATA_PATH), exist_ok=True)
    with open(DATA_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


@app.get('/api/notes')
def get_notes():
    return read_data()


@app.post('/api/notes', status_code=201)
def create_note(note: Note):
    if not note.type:
        raise HTTPException(status_code=400, detail='Missing note type')
    record = note.dict()
    record['id'] = str(int(os.times()[4]*1000))
    record['createdAt'] = __import__('datetime').datetime.utcnow().isoformat()
    data = read_data()
    data.insert(0, record)
    write_data(data)
    return record
