import { useState } from 'react';
import EventStats from './EventStats';

export default function EventCard({ event }) {
  const [form, setForm] = useState({ name: '', email: '' });
  const [message, setMessage] = useState(null);
  const [registered, setRegistered] = useState(false);

  const isPast = new Date(event.datetime) < new Date();
  const isFull = event.capacity <= 0 || event.registered >= event.capacity;
const handleRegister = async () => {
  // Validation
  if (!form.name.trim() || form.name.trim().length < 2) {
    return setMessage("❌ Name must be at least 2 characters.");
  }
  if (!/\S+@\S+\.\S+/.test(form.email)) {
    return setMessage("❌ Please enter a valid email address.");
  }

  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/events/${event.id}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setMessage(data.message || data.error);
    if (res.ok) {
      setRegistered(true);
      setForm({ name: '', email: '' });
    }
  } catch (err) {
    setMessage('❌ Network error while registering.');
  }
};

  const handleCancel = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/events/${event.id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setMessage(data.message || data.error);
      if (res.ok) setRegistered(false);
    } catch (err) {
      setMessage('Something went wrong!');
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-indigo-700 mb-1">{event.title}</h2>
      <p className="text-gray-700">{new Date(event.datetime).toLocaleString()}</p>
      <p className="text-sm text-gray-500 mb-2">📍 {event.location}</p>
      <p className="text-sm text-gray-500">👥 Capacity: {event.capacity}</p>

      <EventStats eventId={event.id} />

      {isPast ? (
        <p className="text-red-500 mt-4 font-semibold">❌ This event has already occurred.</p>
      ) : registered ? (
        <div className="mt-4">
          <p className="text-green-600 font-medium">✅ You are registered for this event.</p>
          <button
            onClick={handleCancel}
            className="mt-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition"
          >
            Cancel Registration
          </button>
        </div>
      ) : isFull ? (
        <p className="text-yellow-600 mt-4 font-semibold">⚠️ Event is full. Registration closed.</p>
      ) : (
        <div className="mt-4 space-y-2">
          <input
            className="w-full border rounded p-2"
            placeholder="Your Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="w-full border rounded p-2"
            placeholder="Your Email"
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
          <button
            onClick={handleRegister}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded transition"
          >
            Register
          </button>
        </div>
      )}

      {message && (
        <p className="mt-2 text-sm text-center text-blue-600">{message}</p>
      )}
    </div>
  );
}
