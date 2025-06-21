import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import CreateItem from './pages/CreateItem'
import ItemDetails from './pages/ItemDetails'
import "./App.css"

export default function App() {
  return (
    <Router>
      <nav style={{ padding: 10, background: '#eee' }}>
        <Link to="/">Dashboard</Link> | <Link to="/create">Create Auction</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/create" element={<CreateItem />} />
        <Route path="/items/:id" element={<ItemDetails />} />
      </Routes>
    </Router>
  )
}