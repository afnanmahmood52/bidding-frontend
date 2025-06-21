import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_BACKEND_WS_URL, {
  transports: ['websocket'],
  reconnectionAttempts: 5,
});

export default function ItemDetails() {
  const { id } = useParams();
  const [bids, setBids] = useState([]);
  const [amount, setAmount] = useState('');
  const [userId, setUserId] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const numericId = Number(id);
    const eventName = `bids/${numericId}`;

    socket.emit('subscribeToItem', numericId);

    const handleBidUpdate = (data) => {
      if (!Array.isArray(data)) {
        setError('Failed to fetch bids.');
        setLoading(false);
        return;
      }

      setError('');
      setBids(data);
      setLoading(false);
    };

    socket.on(eventName, handleBidUpdate);
    socket.emit('requestItemBids', numericId); // Trigger initial fetch

    const interval = setInterval(() => {
      socket.emit('requestItemBids', numericId);
    }, 5000);

    return () => {
      socket.emit('unsubscribeFromItem', numericId);
      socket.off(eventName, handleBidUpdate);
      clearInterval(interval);
    };
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit('placeBid', {
      itemId: Number(id),
      userId: Number(userId),
      amount: Number(amount),
    });
    setAmount('');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Item #{id}</h2>

      <form onSubmit={handleSubmit} className="mb-8 flex flex-col gap-4">
        <input
          type="number"
          placeholder="Bid Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="border border-gray-300 rounded px-4 py-2"
        />
        <select
          value={userId}
          onChange={(e) => setUserId(Number(e.target.value))}
          className="border border-gray-300 rounded px-4 py-2"
        >
          {Array.from({ length: 100 }, (_, i) => i + 1).map((id) => (
            <option key={id} value={id}>
              User {id}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Place Bid
        </button>
      </form>

      <h3 className="text-xl font-semibold mb-3">Live Bids</h3>

      {loading ? (
        <div className="flex justify-center items-center h-24">
          <svg
            className="animate-spin h-8 w-8 text-blue-600"
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
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : bids.length === 0 ? (
        <p className="text-gray-500 text-center">No bids yet for this item.</p>
      ) : (
        <ul className="space-y-2">
          {bids.map((b) => (
            <li
              key={b.id}
              className="border border-gray-200 rounded px-4 py-2 bg-white"
            >
              <span className="font-semibold">${b.amount}</span> by User {b.user.id}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
