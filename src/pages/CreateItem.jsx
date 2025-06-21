import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createItem } from '../services/itemService';
import toast from 'react-hot-toast';

export default function CreateItem() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    startingPrice: 0,
    durationMinutes: 5,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createItem({
        ...form,
        startingPrice: Number(form.startingPrice),
        durationMinutes: Number(form.durationMinutes),
      });

      console.log("response", res)

      if (res) {
        toast.success('Auction created successfully!');
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        toast.error('Failed to create auction.');
      }
    } catch (err) {
      toast.error('Error creating item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold mb-6">Create Auction</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          required
        />
        <input
          name="startingPrice"
          type="number"
          placeholder="Starting Price"
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          required
        />
        <input
          name="durationMinutes"
          type="number"
          placeholder="Duration (minutes)"
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
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
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
          ) : null}
          {loading ? 'Creating...' : 'Create'}
        </button>
      </form>
    </div>
  );
}
