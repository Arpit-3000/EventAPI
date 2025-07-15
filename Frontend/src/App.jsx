import { useEffect, useState } from 'react';
import EventCard from './components/EventCard';

function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/events`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setEvents(data);
        else setEvents([]);
      })
      .catch((err) => {
        console.error("Error fetching events:", err);
        setEvents([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-indigo-600">
        🎉 Upcoming Events
      </h1>

      {loading ? (
        <div className="text-center text-gray-500 text-lg">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="text-center text-gray-600 mt-16">
          <p className="text-xl">😔 No upcoming events available</p>
          <p className="text-sm mt-2 text-gray-500">Please check back later or contact the admin.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
