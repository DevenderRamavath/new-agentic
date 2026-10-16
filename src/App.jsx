import { useEffect, useMemo, useState } from 'react';

const DEMO_EMAIL = 'student@example.com';
const DEMO_PASSWORD = 'password123';
const STORAGE_KEY = 'simple-todo-items';

function readTodos() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    if (!email.trim() || !password) {
      setError('Enter your email and password.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Enter a valid email address.');
      return;
    }
    if (email.trim().toLowerCase() !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
      setError('Email or password is incorrect.');
      return;
    }
    onLogin();
  }

  return <main className="login-page"><section className="login-card">
    <div className="brand-mark" aria-hidden="true">?</div>
    <p className="eyebrow">YOUR DAY, IN ORDER</p>
    <h1>Welcome back</h1>
    <p className="muted">Sign in to see what’s on your list.</p>
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor="email">Email</label>
      <input id="email" type="email" autoComplete="username" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
      <label htmlFor="password">Password</label>
      <input id="password" type="password" autoComplete="current-password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} />
      {error && <p className="error" role="alert">{error}</p>}
      <button className="primary-button login-button" type="submit">Sign in <span aria-hidden="true">?</span></button>
    </form>
    <p className="demo-hint">Demo: <strong>student@example.com</strong><br />Password: <strong>password123</strong></p>
  </section></main>;
}

function TodoApp({ onLogout }) {
  const [todos, setTodos] = useState(readTodos);
  const [draft, setDraft] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(todos)), [todos]);
  const remaining = todos.filter(todo => !todo.completed).length;
  const visibleTodos = useMemo(() => todos.filter(todo => filter === 'All' || (filter === 'Active' ? !todo.completed : todo.completed)), [todos, filter]);

  function addTodo(event) {
    event.preventDefault();
    const title = draft.trim();
    if (!title) return;
    setTodos(current => [{ id: crypto.randomUUID(), title, completed: false }, ...current]);
    setDraft('');
  }

  function toggleTodo(id) {
    setTodos(current => current.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  }

  function deleteTodo(id) {
    setTodos(current => current.filter(todo => todo.id !== id));
  }

  return <main className="todo-page"><header className="topbar"><a className="wordmark" href="#todo" aria-label="Daylist home"><span className="brand-mark small">?</span> daylist</a><button className="logout-button" onClick={onLogout}>Log out <span aria-hidden="true">?</span></button></header>
    <section className="todo-content">
      <p className="eyebrow">A LITTLE PROGRESS ADDS UP</p>
      <h1>Your tasks</h1>
      <p className="muted date-copy">One thing at a time. You’ve got this.</p>
      <form className="add-form" onSubmit={addTodo}><label className="sr-only" htmlFor="new-todo">Add a task</label><input id="new-todo" value={draft} onChange={e => setDraft(e.target.value)} placeholder="What needs doing?" /><button className="primary-button" type="submit">Add task <span aria-hidden="true">+</span></button></form>
      <section className="list-card" aria-label="Todo list">
        <div className="list-toolbar"><span className="remaining"><strong>{remaining}</strong> {remaining === 1 ? 'task' : 'tasks'} left</span><div className="filters" aria-label="Filter tasks">{['All', 'Active', 'Completed'].map(option => <button key={option} className={filter === option ? 'filter active-filter' : 'filter'} onClick={() => setFilter(option)} aria-pressed={filter === option}>{option}</button>)}</div></div>
        {visibleTodos.length ? <ul className="todo-list">{visibleTodos.map(todo => <li className={todo.completed ? 'todo-item completed' : 'todo-item'} key={todo.id}><button className="check-button" onClick={() => toggleTodo(todo.id)} aria-label={todo.completed ? `Mark ${todo.title} active` : `Complete ${todo.title}`} aria-pressed={todo.completed}>{todo.completed && <span aria-hidden="true">?</span>}</button><span className="todo-title">{todo.title}</span><button className="delete-button" onClick={() => deleteTodo(todo.id)} aria-label={`Delete ${todo.title}`}>×</button></li>)}</ul> : <div className="empty-state"><span className="empty-icon" aria-hidden="true">{filter === 'Completed' ? '?' : '+'}</span><p>{filter === 'All' ? 'Your list is clear.' : `No ${filter.toLowerCase()} tasks right now.`}</p><span>{filter === 'All' ? 'Add a task above to get started.' : 'Try another filter or add a new task.'}</span></div>}
        <div className="list-footer"><span>Small steps count.</span><span aria-hidden="true">?</span></div>
      </section>
    </section><footer className="page-footer">MADE FOR THE THINGS THAT MATTER</footer>
  </main>;
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return isLoggedIn ? <TodoApp onLogout={() => setIsLoggedIn(false)} /> : <Login onLogin={() => setIsLoggedIn(true)} />;
}
