import React, { useEffect, useState } from 'react';
import { getAllItems } from '../services/itemService';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllItems()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6 text-center">All Auctions</h2>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <svg
            className="animate-spin h-10 w-10 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            ></path>
          </svg>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow p-6 border border-gray-200"
            >
              <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
              <p className="text-gray-600 mb-2">{item.description}</p>
              <p className="text-sm text-gray-800">
                Starting:{' '}
                <span className="font-semibold">${item.startingPrice}</span>
              </p>
              <p className="text-sm text-gray-800">
                Highest:{' '}
                <span className="font-semibold">${item.currentHighestBid}</span>
              </p>
              <p className="text-sm text-gray-800 mb-4">
                Time Remaining:{' '}
                <span className="font-mono">
                  {formatTime(item.timeRemaining)}
                </span>
              </p>
              <Link
                to={`/items/${item.id}`}
                className="inline-block mt-auto text-blue-600 hover:text-blue-800 underline transition"
              >
                View Details →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
