import { useEffect, useState } from 'react';

export default function EventStats({ eventId }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/events/${eventId}/stats`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => setStats(null));
  }, [eventId]);

  if (!stats) return null;

  return (
    <div className="mt-3 text-sm text-gray-600">
      <p>📊 <strong>Registrations:</strong> {stats.total_registrations}</p>
      <p>🧍 <strong>Remaining:</strong> {stats.remaining_capacity}</p>
      <p>📈 <strong>Filled:</strong> {stats.percent_full}</p>
    </div>
  );
}
