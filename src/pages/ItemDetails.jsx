import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { placeBid as apiPlaceBid } from '../services/bidService';

const socket = io(import.meta.env.VITE_BACKEND_URL, {
  transports: ['websocket'],
  reconnectionAttempts: 5,
});

export default function ItemDetails() {
  const { id } = useParams();
  const numericId = Number(id);

  const [bids, setBids] = useState([]);
  const [amount, setAmount] = useState('');
  const [userId, setUserId] = useState(1);
  const [loadingBids, setLoadingBids] = useState(true);
  const [placingBid, setPlacingBid] = useState(false);

  // Subscribe to socket event
  useEffect(() => {
    if (isNaN(numericId)) return;

    socket.emit('subscribeToItem', numericId);

    const handleItemBids = ({ itemId, bids }) => {
      if (itemId === numericId && Array.isArray(bids)) {
        setBids(bids);
        setLoadingBids(false);
      }
    };

    socket.on('itemBids', handleItemBids);
    socket.emit('requestItemBids', numericId);

    const interval = setInterval(() => {
      socket.emit('requestItemBids', numericId);
    }, 5000);

    return () => {
      clearInterval(interval);
      socket.emit('unsubscribeFromItem', numericId);
      socket.off('itemBids', handleItemBids);
    };
  }, [numericId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPlacingBid(true);
    try {
      // call REST endpoint
      await apiPlaceBid({ itemId: numericId, userId, amount: Number(amount) });
      toast.success('Bid placed!');
      setAmount('');
    } catch (err) {
      toast.error(
        err?.response?.data?.message || 'Failed to place bid. Try again.'
      );
    } finally {
      setPlacingBid(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Item #{numericId}</h2>

      <form onSubmit={handleSubmit} className="mb-8 flex flex-col gap-4">
        <input
          type="number"
          placeholder="Bid Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="border border-gray-300 rounded px-4 py-2"
          disabled={placingBid}
        />
        <select
          value={userId}
          onChange={(e) => setUserId(Number(e.target.value))}
          className="border border-gray-300 rounded px-4 py-2"
          disabled={placingBid}
        >
          {Array.from({ length: 100 }, (_, i) => i + 1).map((uid) => (
            <option key={uid} value={uid}>
              User {uid}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={placingBid}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 flex items-center justify-center disabled:opacity-50"
        >
          {placingBid && (
            <svg
              className="animate-spin h-5 w-5 mr-2 text-white"
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
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          )}
          {placingBid ? 'Placing Bid...' : 'Place Bid'}
        </button>
      </form>

      <h3 className="text-xl font-semibold mb-3">Live Bids</h3>

      {loadingBids ? (
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
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        </div>
      ) : bids.length === 0 ? (
        <p className="text-gray-500 text-center">No bids yet for this item.</p>
      ) : (
        <ul className="space-y-2">
          {bids.map((b) => (
            <li
              key={b.id}
              className="border border-gray-200 rounded px-4 py-2 bg-white"
            >
              <span className="font-semibold">${b.amount}</span> by User{' '}
              {b.user.id}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
