import React, { useEffect, useState } from 'react';
import { getAllItems } from '../services/itemService';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    getAllItems(page).then((data) => {
      setItems(data.items);
      setTotalPages(data.totalPages);
      setLoading(false);
    });
  }, [page]);

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
        <div className="flex justify-center items-center h-48">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                <p className="text-gray-600 mb-2">{item.description}</p>
                <p className="text-sm text-gray-800">
                  Starting: <span className="font-semibold">${item.startingPrice}</span>
                </p>
                <p className="text-sm text-gray-800">
                  Highest: <span className="font-semibold">${item.currentHighestBid}</span>
                </p>
                <p className="text-sm text-gray-800 mb-4">
                  Time Remaining: <span className="font-mono">{formatTime(item.timeRemaining)}</span>
                </p>
                <Link to={`/items/${item.id}`} className="text-blue-600 hover:underline">
                  View Details →
                </Link>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>

            <span className="px-4 py-2">{`Page ${page} of ${totalPages}`}</span>

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
