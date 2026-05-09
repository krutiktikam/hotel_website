'use client';

import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/lib/api';
import { MapPin, Plus, Trash2, Edit3, ExternalLink, X, Save } from 'lucide-react';

export default function AdminLocalSpots() {
  const [spots, setSpots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSpot, setCurrentSpot] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    distance: '',
    google_maps_url: '',
    x_pos: 600,
    y_pos: 250
  });

  const fetchSpots = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_BASE_URL}/admin/local-spots`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setSpots(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpots();
  }, []);

  const handleOpenModal = (spot: any = null) => {
    if (spot) {
      setCurrentSpot(spot);
      setFormData({
        name: spot.name,
        distance: spot.distance,
        google_maps_url: spot.google_maps_url || '',
        x_pos: spot.x_pos,
        y_pos: spot.y_pos
      });
    } else {
      setCurrentSpot(null);
      setFormData({
        name: '',
        distance: '',
        google_maps_url: '',
        x_pos: 600,
        y_pos: 250
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token');
    const url = currentSpot 
      ? `${API_BASE_URL}/admin/local-spots/${currentSpot.id}`
      : `${API_BASE_URL}/admin/local-spots`;
    
    const method = currentSpot ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsModalOpen(false);
        fetchSpots();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to remove this spot?')) return;
    const token = localStorage.getItem('admin_token');
    try {
      const response = await fetch(`${API_BASE_URL}/admin/local-spots/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) fetchSpots();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-playfair text-4xl text-slate-900 mb-2">Map Geography</h1>
          <p className="text-slate-500 font-light">Manage local points of interest and their distances from the sanctuary.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-slate-800 transition-all shadow-lg"
        >
          <Plus className="w-4 h-4" /> Add New Spot
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full py-20 text-center text-slate-400 font-light tracking-widest">Consulting the tides...</div>
        ) : spots.length === 0 ? (
          <div className="col-span-full py-20 text-center text-slate-400 font-light tracking-widest">No local spots mapped yet.</div>
        ) : spots.map((spot) => (
          <div key={spot.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-coastal-seafoam/10 rounded-2xl flex items-center justify-center text-coastal-seafoam">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleOpenModal(spot)} className="p-2 text-slate-300 hover:text-slate-900 transition-colors">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(spot.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <h3 className="font-playfair text-2xl text-slate-900 mb-2">{spot.name}</h3>
            <p className="text-xs uppercase tracking-[0.2em] text-coastal-seafoam font-bold mb-6">{spot.distance} from Shore</p>
            
            <div className="space-y-4 pt-6 border-t border-slate-50">
              <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-slate-400">
                <span>Map Coordinates</span>
                <span className="text-slate-900 font-bold">X: {spot.x_pos} | Y: {spot.y_pos}</span>
              </div>
              {spot.google_maps_url && (
                <a 
                  href={spot.google_maps_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-500 hover:text-coastal-seafoam font-bold transition-colors"
                >
                  <ExternalLink className="w-3 h-3" /> View on Google Maps
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden border border-coastal-beige/50 animate-in zoom-in duration-300">
            <div className="p-8 border-b border-coastal-beige flex justify-between items-center bg-coastal-beige/10">
              <h3 className="font-playfair text-2xl text-slate-900">{currentSpot ? 'Edit Spot' : 'New Local Spot'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-900"><X className="w-6 h-6" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Spot Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-50 border-0 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-coastal-seafoam transition-all"
                  placeholder="e.g. Crystal Cove"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Distance</label>
                  <input 
                    required
                    type="text" 
                    value={formData.distance}
                    onChange={(e) => setFormData({...formData, distance: e.target.value})}
                    className="w-full bg-slate-50 border-0 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-coastal-seafoam transition-all"
                    placeholder="e.g. 0.8km"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Google Maps Link</label>
                  <input 
                    type="url" 
                    value={formData.google_maps_url}
                    onChange={(e) => setFormData({...formData, google_maps_url: e.target.value})}
                    className="w-full bg-slate-50 border-0 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-coastal-seafoam transition-all"
                    placeholder="https://goo.gl/maps/..."
                  />
                </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-[2rem] space-y-4">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold text-center">SVG Placement Coordinates</p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[8px] uppercase tracking-widest text-slate-400 font-bold">X Position (0-1200)</label>
                    <input 
                      type="number" 
                      value={formData.x_pos}
                      onChange={(e) => setFormData({...formData, x_pos: parseInt(e.target.value)})}
                      className="w-full bg-white border-0 rounded-xl py-3 px-4 focus:ring-2 focus:ring-coastal-seafoam transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[8px] uppercase tracking-widest text-slate-400 font-bold">Y Position (0-500)</label>
                    <input 
                      type="number" 
                      value={formData.y_pos}
                      onChange={(e) => setFormData({...formData, y_pos: parseInt(e.target.value)})}
                      className="w-full bg-white border-0 rounded-xl py-3 px-4 focus:ring-2 focus:ring-coastal-seafoam transition-all text-sm"
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-slate-800 transition-all">
                <Save className="w-4 h-4" /> {currentSpot ? 'Update Sanctuary Map' : 'Add to Map'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
