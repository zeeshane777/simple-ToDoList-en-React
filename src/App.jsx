import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

const STORAGE_KEY = "tp_todo_done_v1";

const loadTodos = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveTodos = (todos) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
};

const makeId = () => {
  return crypto?.randomUUID?.() ?? String(Date.now()) + "_" + String(Math.random());
};

export default function App() {
  const [todos, setTodos] = useState(() => loadTodos());
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  const handleAdd = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    const newTodo = { id: makeId(), text, done: false };
    setTodos((prev) => [...prev, newTodo]);
    setInput("");
  };

  const handleDelete = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleDone = (id) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const clearDone = () => {
    setTodos((prev) => prev.filter((t) => !t.done));
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditingText(todo.text);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  const saveEdit = () => {
    const text = editingText.trim();
    if (!text) {
      cancelEdit();
      return;
    }

    setTodos((prev) =>
      prev.map((t) => (t.id === editingId ? { ...t, text } : t))
    );
    cancelEdit();
  };

  const handleEditKey = (e) => {
    if (e.key === "Enter") {
      saveEdit();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  const hasDone = todos.some((t) => t.done);

  return (
    <div className="page">
      <div className="top-lines" aria-hidden="true">
        <span />
        <span />
      </div>

      <main className="content">
        {todos.length > 0 && (
          <ul className="list">
            {todos.map((t) => (
              <li key={t.id} className="item">
                <div className="left">
                  {editingId === t.id ? (
                    <input
                      className="edit-input"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onBlur={saveEdit}
                      onKeyDown={handleEditKey}
                      autoFocus
                    />
                  ) : (
                    <span className={t.done ? "text done" : "text"}>{t.text}</span>
                  )}
                </div>

                <div className="actions">
                  <button
                    className="icon-button"
                    type="button"
                    onClick={() => toggleDone(t.id)}
                    aria-label={t.done ? "Marquer comme non terminee" : "Marquer comme terminee"}
                    title={t.done ? "Marquer comme non terminee" : "Marquer comme terminee"}
                  >
                    {"✅"}
                  </button>
                  <button
                    className="icon-button"
                    type="button"
                    onClick={() => handleDelete(t.id)}
                    aria-label="Supprimer"
                  >
                    🗑️
                  </button>
                
                </div>
              </li>
            ))}
          </ul>
        )}

        <form className="form-row" onSubmit={handleAdd}>
          <input
            className="input-field"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="primary" type="submit">
            Valider
          </button>
        </form>

        {hasDone && (
          <button
            type="button"
            className="ghost clear"
            onClick={clearDone}
            title="Supprimer toutes les taches terminees"
          >
            Supprimer les finies
          </button>
        )}
      </main>

      <div className="brand">
        <img src={reactLogo} alt="React logo" />
        <span>React JS</span>
      </div>
    </div>
  );
}

