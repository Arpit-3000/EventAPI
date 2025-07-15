import { useState } from 'react';

export default function CreateEventForm() {
  const [form, setForm] = useState({
    title: '',
    datetime: '',
    location: '',
    capacity: ''
  });

  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage(`✅ Event created with ID: ${data.id}`);
      setForm({ title: '', datetime: '', location: '', capacity: '' });
    } else {
      setMessage(`❌ ${data.error}`);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-indigo-700">➕ Create New Event</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          placeholder="Event Title"
          className="w-full p-2 border rounded"
        />
        <input
          type="datetime-local"
          name="datetime"
          value={form.datetime}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          required
          placeholder="Location"
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="capacity"
          value={form.capacity}
          onChange={handleChange}
          required
          min={1}
          max={1000}
          placeholder="Capacity (max 1000)"
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Create Event
        </button>
        {message && (
          <p className="text-sm text-center mt-2 text-blue-600">{message}</p>
        )}
      </form>
    </div>
  );
}
