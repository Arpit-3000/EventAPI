import { useState } from 'react';

export default function RegisterForm({ eventId }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/events/${eventId}/register`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ name, email })
    })
      .then(r => r.ok ? alert('Registered!') : r.json().then(j => alert(j.error)))
      .catch(e => alert('Error'));
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 space-x-2">
      <input placeholder="Name" value={name} required onChange={e => setName(e.target.value)} />
      <input placeholder="Email" value={email} required onChange={e => setEmail(e.target.value)} />
      <button type="submit">Register</button>
    </form>
  );
}
